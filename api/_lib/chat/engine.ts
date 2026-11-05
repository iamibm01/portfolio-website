import Anthropic from '@anthropic-ai/sdk'
import type { ChatError, ChatEvent } from '../../../shared/chat-protocol.js'
import { addUsage, emptyUsage, MAX_TOKENS, MODEL, type TurnUsage } from '../anthropic.js'
import { OutputFilter, type FilterStats } from './outputFilter.js'
import { SYSTEM_PROMPT } from './systemPrompt.js'

// One visitor turn: call Claude, stream the filtered reply out, run any tools, and repeat until the
// model is done. It knows nothing about HTTP or the database; the caller passes the history in and
// persists what comes back, which is what lets tests and evals drive it directly.

export const MAX_ITERATIONS = 5
export const TURN_DEADLINE_MS = 45_000

export interface ToolContext {
  sessionId: string
  emit(event: ChatEvent): void
}

export interface ChatTool {
  definition: Anthropic.Tool
  run(input: unknown, context: ToolContext): Promise<{ content: string; isError?: boolean }>
}

// The slice of the SDK's MessageStream the engine uses, so tests can pass a scripted stand-in
export interface MessageStreamLike extends AsyncIterable<Anthropic.MessageStreamEvent> {
  finalMessage(): Promise<Anthropic.Message>
}

export interface EngineDeps {
  stream(
    params: Anthropic.MessageCreateParamsNonStreaming,
    options: { signal: AbortSignal }
  ): MessageStreamLike
  tools: ChatTool[]
  emit(event: ChatEvent): void
  sessionId: string
  deadlineMs?: number
}

export interface TurnResult {
  /** Assistant messages and tool-result messages produced this turn, in order, exactly as sent */
  appended: Anthropic.MessageParam[]
  /** Per appended message: the API usage for assistant messages, null for tool results */
  usages: (Anthropic.Usage | null)[]
  displayText: string
  usage: TurnUsage
  stopReason: Anthropic.StopReason
  iterations: number
  toolCalls: string[]
  filter: FilterStats
}

export class ChatTurnError extends Error {
  constructor(readonly chatError: ChatError) {
    super(chatError.code)
  }
}

export function buildRequest(
  messages: Anthropic.MessageParam[],
  tools: ChatTool[]
): Anthropic.MessageCreateParamsNonStreaming {
  // Cache breakpoints: the end of the tool list and the end of the system prompt (both static), plus
  // top-level automatic caching, which moves a breakpoint to the end of the conversation every turn
  const toolDefs = tools.map(tool => tool.definition)
  const last = toolDefs.at(-1)
  if (last) toolDefs[toolDefs.length - 1] = { ...last, cache_control: { type: 'ephemeral' } }
  return {
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    ...(toolDefs.length ? { tools: toolDefs } : {}),
    messages,
    cache_control: { type: 'ephemeral' },
    // Haiku 5.5 thinks by default; low effort keeps it quick for chat. No temperature: it 400s here.
    output_config: { effort: 'low' },
  }
}

export async function runTurn(
  history: Anthropic.MessageParam[],
  deps: EngineDeps
): Promise<TurnResult> {
  const messages = [...history]
  const appended: Anthropic.MessageParam[] = []
  const usages: (Anthropic.Usage | null)[] = []
  const usage = emptyUsage()
  const filter = new OutputFilter()
  const toolCalls: string[] = []
  const toolsByName = new Map(deps.tools.map(tool => [tool.definition.name, tool]))

  const abort = new AbortController()
  const deadline = setTimeout(() => abort.abort(), deps.deadlineMs ?? TURN_DEADLINE_MS)
  deps.emit({ type: 'status', label: 'thinking' })

  try {
    for (let iteration = 1; ; iteration++) {
      const stream = deps.stream(buildRequest(messages, deps.tools), { signal: abort.signal })
      let startedText = false
      for await (const event of stream) {
        if (event.type !== 'content_block_delta' || event.delta.type !== 'text_delta') continue
        // Text from a later iteration (after a tool call) continues the same reply
        const lead = !startedText && filter.text ? ' ' : ''
        startedText = true
        const shown = filter.push(lead + event.delta.text)
        if (shown) deps.emit({ type: 'text', delta: shown })
      }
      const message = await stream.finalMessage()
      addUsage(usage, message.usage)

      if (message.stop_reason === 'refusal') {
        throw new ChatTurnError({
          code: 'refused',
          message: "That's not something I can help with here.",
          retryable: false,
        })
      }
      if (message.stop_reason === 'model_context_window_exceeded') {
        throw new ChatTurnError({
          code: 'session_full',
          message: "This conversation has run long. Let's pick it up over email.",
          retryable: false,
        })
      }

      const assistant: Anthropic.MessageParam = { role: 'assistant', content: message.content }
      messages.push(assistant)
      appended.push(assistant)
      usages.push(message.usage)

      const toolUses = message.content.filter(
        (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
      )
      const wantsMore = message.stop_reason === 'tool_use' || message.stop_reason === 'pause_turn'
      if (!wantsMore || iteration >= MAX_ITERATIONS) {
        // A tool_use left without a result would make the next request in this session a 400
        if (toolUses.length) {
          const unrun: Anthropic.MessageParam = {
            role: 'user',
            content: toolUses.map(block => ({
              type: 'tool_result' as const,
              tool_use_id: block.id,
              content: 'Not run: this turn hit its tool limit.',
              is_error: true,
            })),
          }
          appended.push(unrun)
          usages.push(null)
        }
        const tail = filter.flush()
        if (tail) deps.emit({ type: 'text', delta: tail })
        if (!filter.text) {
          throw new ChatTurnError({
            code: 'internal',
            message: 'I lost my train of thought there. Could you say that again?',
            retryable: true,
          })
        }
        return {
          appended,
          usages,
          displayText: filter.text,
          usage,
          stopReason: message.stop_reason ?? 'end_turn',
          iterations: iteration,
          toolCalls,
          filter: filter.stats,
        }
      }

      if (toolUses.length) {
        // Every tool_use gets a result, all in one user message, or the next request is rejected
        const results = await Promise.all(
          toolUses.map(async (block): Promise<Anthropic.ToolResultBlockParam> => {
            toolCalls.push(block.name)
            const tool = toolsByName.get(block.name)
            if (!tool) {
              return {
                type: 'tool_result',
                tool_use_id: block.id,
                content: `Unknown tool: ${block.name}`,
                is_error: true,
              }
            }
            const outcome = await tool
              .run(block.input, { sessionId: deps.sessionId, emit: deps.emit })
              .catch(() => ({ content: 'The tool failed. Do not retry it.', isError: true }))
            return {
              type: 'tool_result',
              tool_use_id: block.id,
              content: outcome.content,
              ...(outcome.isError ? { is_error: true } : {}),
            }
          })
        )
        const toolMessage: Anthropic.MessageParam = { role: 'user', content: results }
        messages.push(toolMessage)
        appended.push(toolMessage)
        usages.push(null)
      }
    }
  } catch (error) {
    throw toTurnError(error, abort.signal.aborted)
  } finally {
    clearTimeout(deadline)
  }
}

// Maps SDK failures to what the visitor sees; every message points to email as the way out
export function toTurnError(error: unknown, deadlineHit = false): ChatTurnError {
  if (error instanceof ChatTurnError) return error
  if (deadlineHit || error instanceof Anthropic.APIConnectionTimeoutError) {
    return new ChatTurnError({
      code: 'timeout',
      message: 'That took too long on my side.',
      retryable: true,
    })
  }
  if (
    error instanceof Anthropic.RateLimitError ||
    (error instanceof Anthropic.APIError && typeof error.status === 'number' && error.status >= 500)
  ) {
    return new ChatTurnError({
      code: 'overloaded',
      message: "I'm a bit swamped right now.",
      retryable: true,
    })
  }
  return new ChatTurnError({
    code: 'internal',
    message: 'Something went wrong on my side.',
    retryable: true,
  })
}
