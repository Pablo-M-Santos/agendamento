import { Resend } from 'resend'

let resendInstance: Resend | null = null

function getResendInstance(): Resend {
  if (resendInstance) {
    return resendInstance
  }

  const config = useRuntimeConfig()

  if (!config.resendApiKey) {
    throw new Error('Resend: API key não configurada')
  }

  resendInstance = new Resend(config.resendApiKey)
  return resendInstance
}

interface SendVerificationEmailParams {
  to: string
  verificationLink: string
  appUrl: string
}

export async function sendResendVerificationEmail({
  to,
  verificationLink,
  appUrl
}: SendVerificationEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendInstance()
    const config = useRuntimeConfig()

    const fromEmail = config.resendFromEmail || 'noreply@agendamento.app'
    const fromName = 'Agendamento'

    await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [to],
      subject: 'Confirme seu e-mail — Agendamento',
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirme seu e-mail</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #e6f2f0; font-family: 'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <tr>
              <td style="background-color: #ffffff; border-radius: 16px; padding: 48px 32px; box-shadow: 0 4px 24px rgba(0, 46, 41, 0.08);">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="text-align: center; padding-bottom: 32px;">
                      <img src="${appUrl}/logo.png" alt="Agendamento" width="80" style="display: block; margin: 0 auto;">
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 24px;">
                      <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #002e29; text-align: center;">
                        Confirme seu e-mail
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 32px;">
                      <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #06443d; text-align: center;">
                        Obrigado por se cadastrar no Agendamento! Para começar a usar sua conta, confirme seu endereço de e-mail clicando no botão abaixo:
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="text-align: center; padding-bottom: 32px;">
                      <a href="${verificationLink}" style="display: inline-block; background-color: #002e29; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; padding: 16px 32px; border-radius: 8px;">
                        Confirmar E-mail
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 24px;">
                      <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #0a5750; text-align: center;">
                        Ou copie e cole este link no seu navegador:
                      </p>
                      <p style="margin: 8px 0 0; font-size: 13px; line-height: 1.5; color: #006b63; text-align: center; word-break: break-all;">
                        ${verificationLink}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="border-top: 1px solid #d1eee6; padding-top: 24px;">
                      <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #62c0b5; text-align: center;">
                        Este link expira em 7 dias. Se você não criou esta conta, ignore este e-mail.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 24px;">
                <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #62c0b5; text-align: center;">
                  © 2026 Agendamento. Todos os direitos reservados.
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    })

    return { success: true }
  } catch (error: unknown) {
    const err = error as { message?: string }
    console.error('Resend: erro ao enviar e-mail:', err.message)
    return { success: false, error: err.message }
  }
}
