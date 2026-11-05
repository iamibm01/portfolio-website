// Temporary: the pre-revamp way of capturing a lead, guessing the name and email from the chat text.
// Phase 2 replaces all of this with the save_lead and send_followup_email tools, where the model
// passes clean values and the server validates them. Moved here unchanged from src/hooks/useChat.ts.

interface LeadMessage {
  role: 'user' | 'assistant'
  text: string
}

export interface LegacyLead {
  name: string
  email: string
  conversationSummary: string
}

function toTitleCase(str: string): string {
  return str.replace(/\b[a-z]/g, c => c.toUpperCase())
}

/** Extract name from conversation: looks for the assistant asking and the visitor answering */
function extractName(messages: LeadMessage[]): string | null {
  // Strip leading filler words, possibly chained ("ok so yeah, ...")
  const fillerRe = /^(?:(?:well|so|sure|okay|ok|yeah|yes|hi|hey|uh|um|hm|hmm)[,!.]?\s+)+/i
  const introRe =
    /^(?:i(?:'m| am)|my name(?:'s| is)|it'?s|it is|this is|that'?s|that is|(?:(?:the|my)\s+)?name(?:'?s| is)|(?:just\s+)?call(?:ing)? me|you can call me|just)\s+([A-Za-z][a-z]+(?:\s+[A-Za-z][a-z]+)?)/i
  // Bare-name fallback: 1-3 words, only letters/hyphens/apostrophes
  const bareNameRe = /^[A-Za-z][A-Za-z'-]{1,19}(?:\s+[A-Za-z][A-Za-z'-]{1,19}){0,2}$/

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i]
    if (msg.role !== 'user') continue
    let text = msg.text.trim()
    if (!text || text.includes('@')) continue

    const prevIsNameAsk =
      i > 0 && messages[i - 1].role === 'assistant' && /name|call you/i.test(messages[i - 1].text)

    if (prevIsNameAsk) {
      text = text.replace(fillerRe, '').trim()
      const introMatch = text.match(introRe)
      if (introMatch) return toTitleCase(introMatch[1])
      if (bareNameRe.test(text)) return toTitleCase(text)
    }
  }
  return null
}

/** Scan the visitor's messages for an email address */
function extractEmail(messages: LeadMessage[]): string | null {
  const emailRe = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  for (const msg of messages) {
    if (msg.role !== 'user') continue
    const match = msg.text.match(emailRe)
    if (match) return match[0]
  }
  return null
}

export function findLegacyLead(messages: LeadMessage[]): LegacyLead | null {
  const name = extractName(messages)
  const email = extractEmail(messages)
  if (!name || !email) return null
  const conversationSummary = messages.map(m => `[${m.role.toUpperCase()}]: ${m.text}`).join('\n\n')
  return { name, email, conversationSummary }
}

export async function sendLegacyLead(lead: LegacyLead): Promise<boolean> {
  try {
    const response = await fetch('/api/send-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
      credentials: 'same-origin',
    })
    return response.ok
  } catch {
    return false
  }
}
