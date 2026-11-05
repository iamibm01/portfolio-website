import Anthropic from '@anthropic-ai/sdk'
import { getEnv } from './env.js'

export const MODEL = 'claude-haiku-5-5'

// Haiku 5.5 thinks by default and thinking counts toward max_tokens, so this leaves room for a short
// think plus a 2-4 sentence reply. Reply length is held by the prompt and the output guard, not this cap.
export const MAX_TOKENS = 1024

let client: Anthropic | null = null

export function getAnthropic(): Anthropic {
  if (client) return client
  // A short per-request timeout with one retry; the turn as a whole has its own deadline in the engine
  client = new Anthropic({ apiKey: getEnv().ANTHROPIC_API_KEY, timeout: 20_000, maxRetries: 1 })
  return client
}

// Haiku 5.5 list prices for prompts up to 100K tokens, in micro-dollars per token ($0.10 / $0.50 per
// MTok; cache reads 0.1x input, 5-minute cache writes 1.25x input). Sessions are capped well below 100K.
const MICRO_USD_PER_TOKEN = { input: 0.1, output: 0.5, cacheRead: 0.01, cacheWrite: 0.125 }

export interface TurnUsage {
  inputTokens: number
  outputTokens: number
  cacheRead: number
  cacheWrite: number
}

export function emptyUsage(): TurnUsage {
  return { inputTokens: 0, outputTokens: 0, cacheRead: 0, cacheWrite: 0 }
}

export function addUsage(total: TurnUsage, usage: Anthropic.Usage): void {
  total.inputTokens += usage.input_tokens
  total.outputTokens += usage.output_tokens
  total.cacheRead += usage.cache_read_input_tokens ?? 0
  total.cacheWrite += usage.cache_creation_input_tokens ?? 0
}

export function costMicroUsd(usage: TurnUsage): number {
  return (
    usage.inputTokens * MICRO_USD_PER_TOKEN.input +
    usage.outputTokens * MICRO_USD_PER_TOKEN.output +
    usage.cacheRead * MICRO_USD_PER_TOKEN.cacheRead +
    usage.cacheWrite * MICRO_USD_PER_TOKEN.cacheWrite
  )
}
