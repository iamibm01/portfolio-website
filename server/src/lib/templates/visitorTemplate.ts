export function visitorTemplate({ name }: { name: string }): string {
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
                    <p style="margin:0;font-size:13px;color:#94a3b8;letter-spacing:0.05em;text-transform:uppercase;">Muhammad Ibraheem</p>
                    <h1 style="margin:8px 0 0;font-size:22px;color:#ffffff;font-weight:600;">Good to meet you, ${name}.</h1>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:36px 40px;">
                    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#334155;">
                      Thanks for stopping by — it was good to connect. I'll follow up properly soon to continue the conversation.
                    </p>
                    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#334155;">
                      In the meantime, feel free to reply to this email directly if anything comes to mind.
                    </p>
                    <p style="margin:0;font-size:15px;line-height:1.7;color:#334155;">
                      — Ibraheem
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding:20px 40px;border-top:1px solid #f1f5f9;">
                    <p style="margin:0;font-size:12px;color:#94a3b8;">Product Engineer · Lahore, Pakistan</p>
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
