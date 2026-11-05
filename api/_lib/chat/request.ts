import { z } from 'zod'
import { MAX_MESSAGE_CHARS, type ChatRequest } from '../../../shared/chat-protocol.js'

// Server-side validation of POST /api/chat. `satisfies` keeps it in step with the shared type.
export const ChatRequestSchema = z.object({
  message: z.string().trim().min(1).max(MAX_MESSAGE_CHARS),
  clientMessageId: z.uuid(),
  website: z.string().max(0).optional(),
}) satisfies z.ZodType<ChatRequest>
