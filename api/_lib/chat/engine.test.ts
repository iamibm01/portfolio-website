import Anthropic from '@anthropic-ai/sdk'
import { describe, expect, it } from 'vitest'
import type { ChatEvent } from '../../../shared/chat-protocol.js'
import {
  ChatTurnError,
  MAX_ITERATIONS,
  runTurn,
  type ChatTool,
  type EngineDeps,
  type MessageStreamLike,
} from './engine.js'

const usage = (input = 10, output = 5): Anthropic.Usage =>
  ({
    input_tokens: input,
    output_tokens: output,
    cache_read_input_tokens: 0,
    cache_creation_input_tokens: 0,
  }) as Anthropic.Usage

// A scripted reply: the text arrives in the given chunks, then the final message
function reply(
  chunks: string[],
  stop: Anthropic.StopReason = 'end_turn',
  extra: Anthropic.ContentBlock[] = []
): MessageStreamLike {
  const content = [
    ...(chunks.length ? [{ type: 'text', text: chunks.join(''), citations: null }] : []),
    ...extra,
  ] as Anthropic.ContentBlock[]
  return {
    async *[Symbol.asyncIterator]() {
      for (const text of chunks) {
        yield {
          type: 'content_block_delta',
          index: 0,
          delta: { type: 'text_delta', text },
        } as Anthropic.MessageStreamEvent
      }
    },
    finalMessage: async () =>
      ({ role: 'assistant', content, stop_reason: stop, usage: usage() }) as Anthropic.Message,
  }
}

function deps(replies: MessageStreamLike[], tools: ChatTool[] = []) {
  const events: ChatEvent[] = []
  const requests: Anthropic.MessageCreateParamsNonStreaming[] = []
  const d: EngineDeps = {
    stream: params => {
      requests.push(structuredClone(params))
      const next = replies.shift()
      if (!next) throw new Error('no scripted reply left')
      return next
    },
    tools,
    emit: event => events.push(event),
    sessionId: 'test',
  }
  return { d, events, requests }
}

const toolUse = (id: string, name = 'lookup') =>
  ({ type: 'tool_use', id, name, input: {} }) as Anthropic.ContentBlock

const user = (text: string): Anthropic.MessageParam => ({ role: 'user', content: text })

describe('runTurn', () => {
  it('streams filtered text and returns the raw assistant message for storage', async () => {
    const { d, events } = deps([reply(['Hey ', '— good', ' to see you!'])])
    const result = await runTurn([user('hi')], d)

    const shown = events.flatMap(e => (e.type === 'text' ? [e.delta] : [])).join('')
    expect(shown).toBe('Hey, good to see you!')
    expect(result.displayText).toBe('Hey, good to see you!')
    expect(result.appended).toHaveLength(1)
    // Stored unfiltered: the dash stays in what gets replayed to the model
    expect(JSON.stringify(result.appended[0].content)).toContain('—')
    expect(events[0]).toEqual({ type: 'status', label: 'thinking' })
  })

  it('sends a cacheable, static system prompt with low effort and no sampling params', async () => {
    const { d, requests } = deps([reply(['Hi'])])
    await runTurn([user('hi')], d)
    const request = requests[0]
    expect(request.model).toBe('claude-haiku-5-5')
    expect(request.cache_control).toEqual({ type: 'ephemeral' })
    expect(request.output_config).toEqual({ effort: 'low' })
    expect(request).not.toHaveProperty('temperature')
    const system = request.system as Anthropic.TextBlockParam[]
    expect(system[0].cache_control).toEqual({ type: 'ephemeral' })
  })

  it('runs tools, returns their results in one message, and continues the reply', async () => {
    const lookup: ChatTool = {
      definition: { name: 'lookup', input_schema: { type: 'object' } },
      run: async () => ({ content: '{"ok":true}' }),
    }
    const { d, requests } = deps(
      [reply(['Checking.'], 'tool_use', [toolUse('t1'), toolUse('t2')]), reply(['Found it.'])],
      [lookup]
    )
    const result = await runTurn([user('find it')], d)

    expect(result.displayText).toBe('Checking. Found it.')
    expect(result.toolCalls).toEqual(['lookup', 'lookup'])
    expect(result.appended.map(m => m.role)).toEqual(['assistant', 'user', 'assistant'])
    const results = result.appended[1].content as Anthropic.ToolResultBlockParam[]
    expect(results.map(r => r.tool_use_id)).toEqual(['t1', 't2'])
    // The tool list carries the cache breakpoint on its last definition
    expect(requests[1].tools?.at(-1)).toMatchObject({ cache_control: { type: 'ephemeral' } })
  })

  it('answers every tool_use even when the iteration cap ends the turn', async () => {
    const replies = Array.from({ length: MAX_ITERATIONS }, (_, i) =>
      reply([`Step ${i}.`], 'tool_use', [toolUse(`t${i}`)])
    )
    const { d } = deps(replies, [
      {
        definition: { name: 'lookup', input_schema: { type: 'object' } },
        run: async () => ({ content: 'ok' }),
      },
    ])
    const result = await runTurn([user('loop')], d)
    const last = result.appended.at(-1)!
    expect(last.role).toBe('user')
    expect((last.content as Anthropic.ToolResultBlockParam[])[0]).toMatchObject({
      tool_use_id: `t${MAX_ITERATIONS - 1}`,
      is_error: true,
    })
  })

  it('turns an unknown tool into an error result instead of crashing', async () => {
    const { d } = deps([reply([], 'tool_use', [toolUse('t1', 'nope')]), reply(['Sorry.'])])
    const result = await runTurn([user('x')], d)
    const results = result.appended[1].content as Anthropic.ToolResultBlockParam[]
    expect(results[0]).toMatchObject({ is_error: true })
  })

  it('reports a refusal as a non-retryable error', async () => {
    const { d } = deps([reply([], 'refusal')])
    await expect(runTurn([user('x')], d)).rejects.toMatchObject({
      chatError: { code: 'refused', retryable: false },
    })
  })

  it('treats an empty reply (thinking used the whole budget) as retryable', async () => {
    const { d } = deps([reply([], 'max_tokens')])
    const error = await runTurn([user('x')], d).catch(e => e)
    expect(error).toBeInstanceOf(ChatTurnError)
    expect(error.chatError).toMatchObject({ code: 'internal', retryable: true })
  })

  it('maps an SDK overload to a retryable error', async () => {
    const { d } = deps([])
    d.stream = () => {
      throw new Anthropic.InternalServerError(529, undefined, 'overloaded', new Headers())
    }
    await expect(runTurn([user('x')], d)).rejects.toMatchObject({
      chatError: { code: 'overloaded', retryable: true },
    })
  })
})
