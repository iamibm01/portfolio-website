import {
  MAX_VISITOR_TURNS,
  type ChatError,
  type ChatErrorCode,
  type TranscriptMessage,
} from '../../../shared/chat-protocol'

export interface UiMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  createdAt: number
  /** streaming: reply arriving; stopped: the visitor cancelled it part way */
  state: 'done' | 'streaming' | 'stopped'
}

export interface ChatUiState {
  /** restoring: loading a saved conversation; closed: no more messages this session */
  phase: 'restoring' | 'idle' | 'streaming' | 'closed'
  messages: UiMessage[]
  /** Waiting for the first word of the reply */
  thinking: boolean
  error: ChatError | null
  /** The message to resend when the visitor presses retry */
  failed: { clientMessageId: string; text: string } | null
  remaining: number
  leadCaptured: boolean
}

export type ChatAction =
  | { type: 'restored'; messages: TranscriptMessage[]; remaining: number }
  | { type: 'sent'; clientMessageId: string; text: string; now: number; retry: boolean }
  | { type: 'thinking' }
  | { type: 'text'; delta: string }
  | { type: 'done'; messageId: string; remaining: number }
  | { type: 'failed'; error: ChatError }
  | { type: 'stopped' }
  | { type: 'lead_captured' }

// These end the conversation for this session: the composer gives way to an email link
const CLOSING: ChatErrorCode[] = ['session_full', 'budget_exhausted', 'forbidden']

export const initialChatState: ChatUiState = {
  phase: 'restoring',
  messages: [],
  thinking: false,
  error: null,
  failed: null,
  remaining: MAX_VISITOR_TURNS,
  leadCaptured: false,
}

const pendingId = (clientMessageId: string) => `pending-${clientMessageId}`

// The reply in progress is always the last message while streaming
function updateReply(state: ChatUiState, update: (reply: UiMessage) => UiMessage | null) {
  const last = state.messages.at(-1)
  if (!last || last.role !== 'assistant' || last.state !== 'streaming') return state.messages
  const next = update(last)
  return next ? [...state.messages.slice(0, -1), next] : state.messages.slice(0, -1)
}

export function chatReducer(state: ChatUiState, action: ChatAction): ChatUiState {
  switch (action.type) {
    case 'restored':
      return {
        ...state,
        phase: action.remaining > 0 ? 'idle' : 'closed',
        remaining: action.remaining,
        messages: action.messages.map(m => ({
          id: m.id,
          role: m.role,
          text: m.text,
          createdAt: Date.parse(m.createdAt),
          state: 'done',
        })),
      }

    case 'sent': {
      const reply: UiMessage = {
        id: pendingId(action.clientMessageId),
        role: 'assistant',
        text: '',
        createdAt: action.now,
        state: 'streaming',
      }
      // A retry reuses the visitor message already on screen
      const visitor: UiMessage[] = action.retry
        ? []
        : [
            {
              id: action.clientMessageId,
              role: 'user',
              text: action.text,
              createdAt: action.now,
              state: 'done',
            },
          ]
      return {
        ...state,
        phase: 'streaming',
        thinking: true,
        error: null,
        failed: { clientMessageId: action.clientMessageId, text: action.text },
        messages: [...state.messages, ...visitor, reply],
      }
    }

    case 'thinking':
      return { ...state, thinking: true }

    case 'text':
      return {
        ...state,
        thinking: false,
        messages: updateReply(state, reply => ({ ...reply, text: reply.text + action.delta })),
      }

    case 'done':
      return {
        ...state,
        phase: action.remaining > 0 ? 'idle' : 'closed',
        thinking: false,
        failed: null,
        remaining: action.remaining,
        messages: updateReply(state, reply => ({ ...reply, id: action.messageId, state: 'done' })),
      }

    case 'failed':
      return {
        ...state,
        phase: CLOSING.includes(action.error.code) ? 'closed' : 'idle',
        thinking: false,
        error: action.error,
        // Keep a partial reply visible as stopped; drop an empty placeholder
        messages: updateReply(state, reply => (reply.text ? { ...reply, state: 'stopped' } : null)),
        failed: action.error.retryable ? state.failed : null,
      }

    case 'stopped':
      return {
        ...state,
        phase: 'idle',
        thinking: false,
        messages: updateReply(state, reply => (reply.text ? { ...reply, state: 'stopped' } : null)),
      }

    case 'lead_captured':
      return { ...state, leadCaptured: true }
  }
}
