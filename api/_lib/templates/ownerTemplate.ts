import type { LeadEmailPayload } from '../email.js'

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function ownerTemplate({ name, email, conversationSummary }: LeadEmailPayload): string {
  const safeName = esc(name)
  const safeEmail = esc(email)
  const safeSummary = esc(conversationSummary ?? '')
  return `
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
                <!-- Header -->
                <tr>
                  <td style="background:#0f172a;padding:32px 40px;">
                    <p style="margin:0;font-size:13px;color:#94a3b8;letter-spacing:0.05em;text-transform:uppercase;">Portfolio</p>
                    <h1 style="margin:8px 0 0;font-size:22px;color:#ffffff;font-weight:600;">New Lead</h1>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:36px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;padding:24px;margin-bottom:28px;">
                      <tr>
                        <td>
                          <p style="margin:0 0 12px;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Contact Details</p>
                          <p style="margin:0 0 6px;font-size:15px;color:#0f172a;"><strong>Name:</strong> ${safeName}</p>
                          <p style="margin:0;font-size:15px;color:#0f172a;"><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color:#6366f1;text-decoration:none;">${safeEmail}</a></p>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:0 0 12px;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Conversation Summary</p>
                    <pre style="margin:0;padding:20px;background:#f8fafc;border-left:3px solid #6366f1;border-radius:0 8px 8px 0;font-size:13px;line-height:1.7;color:#334155;white-space:pre-wrap;font-family:inherit;">${safeSummary}</pre>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding:20px 40px;border-top:1px solid #f1f5f9;">
                    <p style="margin:0;font-size:12px;color:#94a3b8;">Sent from your portfolio chatbot</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}
