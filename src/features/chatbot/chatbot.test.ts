import { describe, expect, it } from 'vitest'
import { chatReducer, initialChatState, type ChatAction, type ChatUiState } from './chatReducer'
import { parseFrame, takeFrames } from './sseClient'

describe('SSE parsing', () => {
  it('splits complete frames and keeps the partial tail for the next chunk', () => {
    const first = takeFrames('event: text\ndata: {"type":"text","delta":"Hi"}\n\nevent: te')
    expect(first.frames).toHaveLength(1)
    expect(parseFrame(first.frames[0])).toEqual({ type: 'text', delta: 'Hi' })

    const second = takeFrames(first.rest + 'xt\ndata: {"type":"text","delta":"!"}\n\n')
    expect(second.frames.map(parseFrame)).toEqual([{ type: 'text', delta: '!' }])
    expect(second.rest).toBe('')
  })

  it('ignores keep-alive comments, unknown events and broken JSON', () => {
    expect(parseFrame(': ping')).toBeNull()
    expect(parseFrame('data: {"type":"surprise"}')).toBeNull()
    expect(parseFrame('data: {not json')).toBeNull()
  })

  it('accepts CRLF line endings', () => {
    const { frames } = takeFrames('data: {"type":"status","label":"thinking"}\r\n\r\n')
    expect(parseFrame(frames[0])).toEqual({ type: 'status', label: 'thinking' })
  })
})

const reduce = (actions: ChatAction[], from: ChatUiState = initialChatState) =>
  actions.reduce(chatReducer, from)

const restored: ChatAction = { type: 'restored', messages: [], remaining: 30 }
const sent: ChatAction = { type: 'sent', clientMessageId: 'c1', text: 'hi', now: 1, retry: false }

describe('chatReducer', () => {
  it('streams a reply into a placeholder, then settles it with the stored id', () => {
    const state = reduce([
      restored,
      sent,
      { type: 'text', delta: 'Hey' },
      { type: 'text', delta: '!' },
      { type: 'done', messageId: 'm1', remaining: 29 },
    ])
    expect(state.phase).toBe('idle')
    expect(state.thinking).toBe(false)
    expect(state.failed).toBeNull()
    expect(state.messages.map(m => [m.role, m.text, m.state, m.id])).toEqual([
      ['user', 'hi', 'done', 'c1'],
      ['assistant', 'Hey!', 'done', 'm1'],
    ])
  })

  it('keeps the failed message for retry, then reuses the visitor bubble', () => {
    const failed = reduce([
      restored,
      sent,
      { type: 'failed', error: { code: 'timeout', message: 'slow', retryable: true } },
    ])
    expect(failed.messages).toHaveLength(1) // the empty placeholder is gone
    expect(failed.failed).toEqual({ clientMessageId: 'c1', text: 'hi' })

    const retried = reduce([{ ...sent, retry: true }], failed)
    expect(retried.messages.filter(m => m.role === 'user')).toHaveLength(1)
    expect(retried.error).toBeNull()
  })

  it('closes the chat when the session is full or the budget is spent', () => {
    const state = reduce([
      restored,
      sent,
      { type: 'failed', error: { code: 'budget_exhausted', message: 'resting', retryable: false } },
    ])
    expect(state.phase).toBe('closed')
    expect(state.failed).toBeNull()
  })

  it('marks a partial reply as stopped when the visitor cancels it', () => {
    const state = reduce([restored, sent, { type: 'text', delta: 'Half' }, { type: 'stopped' }])
    expect(state.messages.at(-1)).toMatchObject({ text: 'Half', state: 'stopped' })
    expect(state.phase).toBe('idle')
  })

  it('restores a saved conversation and closes it if no messages are left', () => {
    const state = reduce([
      {
        type: 'restored',
        remaining: 0,
        messages: [{ id: 'a', role: 'user', text: 'hi', createdAt: '2026-11-01T10:00:00Z' }],
      },
    ])
    expect(state.phase).toBe('closed')
    expect(state.messages[0]).toMatchObject({ id: 'a', state: 'done' })
  })
})
