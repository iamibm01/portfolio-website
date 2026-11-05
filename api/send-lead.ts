import { z } from 'zod'
import { getDb } from './_lib/db.js'
import { sendLeadEmails } from './_lib/email.js'
import { getEnv } from './_lib/env.js'
import { clientIp, jsonResponse, originAllowed, readJson } from './_lib/http.js'
import { hitLimit } from './_lib/limits.js'
import { hashIp, logEvent } from './_lib/log.js'

// Legacy lead capture, kept working until Phase 2 replaces it with the save_lead and
// send_followup_email tools. Until then it is locked down: our origin only, a small body, and
// at most 3 sends per IP per day, so it can no longer be used to email arbitrary addresses at will.

const LeadRequest = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.email().max(254),
  conversationSummary: z.string().max(20_000).optional(),
})

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') return jsonResponse(405, { error: 'Method not allowed' })
    const env = getEnv()
    if (!originAllowed(request, env)) return jsonResponse(403, { error: 'Forbidden' })

    let lead: z.infer<typeof LeadRequest>
    try {
      const parsed = LeadRequest.safeParse(await readJson(request, 32 * 1024))
      if (!parsed.success)
        return jsonResponse(400, { error: 'name and a valid email are required' })
      lead = parsed.data
    } catch {
      return jsonResponse(400, { error: 'Invalid request body' })
    }

    const ipHash = hashIp(clientIp(request), env.IP_SALT)
    const limit = await hitLimit(getDb(), `lead:ip:${ipHash}`, 3, 24 * 60 * 60)
    if (!limit.allowed) {
      logEvent('rate_limited', { ipHash, window: 'lead:1d' })
      return jsonResponse(429, { error: 'Too many requests' })
    }

    if (!process.env.MY_EMAIL) {
      logEvent('lead_email_skipped', { ipHash, reason: 'MY_EMAIL not set' })
      return jsonResponse(500, { error: 'Email is not configured' })
    }

    try {
      await sendLeadEmails({ ...lead, conversationSummary: lead.conversationSummary ?? '' })
      logEvent('lead_emailed', { ipHash })
      return jsonResponse(200, { success: true })
    } catch (error) {
      logEvent('lead_email_failed', {
        ipHash,
        error: error instanceof Error ? error.message : String(error),
      })
      return jsonResponse(500, { error: 'Failed to send email notification' })
    }
  },
}
