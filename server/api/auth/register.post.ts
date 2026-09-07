import { createError, defineEventHandler, readBody } from 'h3'
import { createFirebaseUser, generateEmailVerificationLink, checkIfUserExists } from '#server/utils/firebase-admin'
import { sendVerificationEmail } from '#server/utils/email-service'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6
const MAX_EMAIL_LENGTH = 254
const MAX_PASSWORD_LENGTH = 128

interface RegisterBody {
  email: string
  password: string
}

function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  if (email.length > MAX_EMAIL_LENGTH) return false
  return EMAIL_REGEX.test(email)
}

function validatePassword(password: string): boolean {
  if (!password || typeof password !== 'string') return false
  if (password.length < MIN_PASSWORD_LENGTH) return false
  if (password.length > MAX_PASSWORD_LENGTH) return false
  return true
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    const body = await readBody<RegisterBody>(event)

    if (!body || typeof body !== 'object') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Dados inválidos'
      })
    }

    const email = (body.email || '').trim().toLowerCase()
    const password = body.password || ''

    if (!validateEmail(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'E-mail inválido'
      })
    }

    if (!validatePassword(password)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`
      })
    }

    const userExists = await checkIfUserExists(email)
    if (userExists) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Este e-mail já está cadastrado'
      })
    }

    const userRecord = await createFirebaseUser(email, password)

    const appUrl = config.public.appUrl || 'http://localhost:3000'
    const verificationLink = await generateEmailVerificationLink(email, appUrl)

    const emailResult = await sendVerificationEmail({
      to: email,
      verificationLink,
      appUrl
    })

    if (!emailResult.success) {
      console.warn(`Usuário ${userRecord.uid} criado, mas e-mail não enviado: ${emailResult.error}`)
    }

    return {
      ok: true,
      message: 'Cadastro realizado com sucesso. Verifique seu e-mail para confirmar a conta.',
      emailSent: emailResult.success
    }
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string; code?: string }

    if (err.statusCode) {
      throw error
    }

    console.error('Erro no registro:', err.message)

    if (err.code === 'auth/email-already-in-use') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Este e-mail já está cadastrado'
      })
    }

    if (err.code === 'auth/invalid-email') {
      throw createError({
        statusCode: 400,
        statusMessage: 'E-mail inválido'
      })
    }

    if (err.code === 'auth/weak-password') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Senha muito fraca'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao processar cadastro. Tente novamente.'
    })
  }
})
