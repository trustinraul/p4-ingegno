import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'

const resend = new Resend(process.env.RESEND_API_KEY)

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ingegno.app'
const from = process.env.EMAIL_FROM ?? 'Raúl from Ingegno <onboarding@resend.dev>'
const replyTo = process.env.EMAIL_REPLY_TO ?? 'rcalvosanz@gmail.com'

export async function sendWelcomeEmail({
  to,
  username,
}: {
  to: string
  username: string
}) {
  const profileUrl = `${siteUrl}/${username}`

  const text = `Hey ${username} —

You just claimed your spot at ${profileUrl}.

Now make it worth visiting.

Your profile is live but empty right now. Here's what takes 5 minutes:

1. Add your bio and what you do
2. Add one project — just a title, a description, and a link
3. Hit "Publish" and share the URL with someone

That's it. You don't need it to be perfect. The point is to have something real at a URL that's yours.

If you hit any friction or anything feels broken, reply to this email. I read every reply.

— Raúl, founder of Ingegno

P.S. Free tier includes 2 projects. If you want unlimited, Pro is €9/month — but start with free. Upgrade when you actually need it.`

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your Ingegno profile is waiting</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:480px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 0 40px;">
              <p style="margin:0;font-size:18px;font-weight:700;letter-spacing:-0.3px;color:#111111;">Ingegno</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 40px 0 40px;">
              <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#111111;">Hey ${username} —</p>
              <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#111111;">
                You just claimed your spot at
                <a href="${profileUrl}" style="color:#8B5CF6;text-decoration:none;font-weight:500;">${profileUrl}</a>.
              </p>
              <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#111111;font-weight:600;">Now make it worth visiting.</p>

              <p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:#444444;">Your profile is live but empty right now. Here's what takes 5 minutes:</p>

              <table cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
                <tr>
                  <td style="padding:6px 0;vertical-align:top;">
                    <span style="display:inline-block;width:22px;font-size:14px;font-weight:700;color:#8B5CF6;">1.</span>
                    <span style="font-size:15px;line-height:1.6;color:#111111;">Add your bio and what you do</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;vertical-align:top;">
                    <span style="display:inline-block;width:22px;font-size:14px;font-weight:700;color:#8B5CF6;">2.</span>
                    <span style="font-size:15px;line-height:1.6;color:#111111;">Add one project — just a title, a description, and a link</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;vertical-align:top;">
                    <span style="display:inline-block;width:22px;font-size:14px;font-weight:700;color:#8B5CF6;">3.</span>
                    <span style="font-size:15px;line-height:1.6;color:#111111;">Hit "Publish" and share the URL with someone</span>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;">
                <tr>
                  <td style="background:#8B5CF6;border-radius:6px;">
                    <a href="${siteUrl}/dashboard/profile" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.1px;">Go to your profile →</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#444444;">That's it. You don't need it to be perfect. The point is to have something real at a URL that's yours.</p>

              <p style="margin:0 0 28px 0;font-size:15px;line-height:1.6;color:#444444;">If you hit any friction or anything feels broken, reply to this email. I read every reply.</p>

              <p style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:#111111;">— Raúl, founder of Ingegno</p>
            </td>
          </tr>

          <!-- PS -->
          <tr>
            <td style="padding:0 40px 32px 40px;">
              <p style="margin:20px 0 0 0;font-size:13px;line-height:1.6;color:#888888;border-top:1px solid #eeeeee;padding-top:20px;">
                <em>P.S. Free tier includes 2 projects. If you want unlimited, Pro is €9/month — but start with free. Upgrade when you actually need it.</em>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return resend.emails.send({
    from,
    to,
    replyTo,
    subject: 'Your Ingegno profile is waiting',
    text,
    html,
  })
}

export async function sendWelcomeEmailOnce(
  userId: string,
  email: string,
  username: string
) {
  try {
    const admin = createAdminClient()
    const { data: profile } = await admin
      .from('profiles')
      .select('welcome_email_sent_at')
      .eq('id', userId)
      .single()

    if (profile?.welcome_email_sent_at) return

    const result = await sendWelcomeEmail({ to: email, username })
    if (result.error) {
      console.error('[email] sendWelcomeEmail failed:', result.error)
      return
    }

    await admin
      .from('profiles')
      .update({ welcome_email_sent_at: new Date().toISOString() })
      .eq('id', userId)
  } catch (err) {
    console.error('[email] sendWelcomeEmailOnce error:', err)
  }
}
