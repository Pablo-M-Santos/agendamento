import nodemailer from 'nodemailer'

let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter {
  if (transporter) {
    return transporter
  }

  const config = useRuntimeConfig()

  transporter = nodemailer.createTransport({
    host: config.mailHost,
    port: config.mailPort,
    secure: config.mailPort === 465,
    auth: config.mailUser
      ? {
          user: config.mailUser,
          pass: config.mailPassword
        }
      : undefined
  })

  return transporter
}

export interface SendEmailParams {
  to: string
  subject: string
  html: string
  from: string
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const mailer = getTransporter()

    await mailer.sendMail({
      from,
      to,
      subject,
      html
    })

    return { success: true }
  } catch (error: unknown) {
    const err = error as { message?: string }
    console.error('Mailpit: erro ao enviar e-mail:', err.message)
    return { success: false, error: err.message }
  }
}
