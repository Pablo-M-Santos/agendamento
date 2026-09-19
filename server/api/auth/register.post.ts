import { createError, defineEventHandler, readBody } from 'h3'
import { validarEmail, validarSenha, MIN_PASSWORD_LENGTH } from '~/utils/validacao'
import { createFirebaseUser, generateEmailVerificationLink, checkIfUserExists } from '#server/utils/firebase-admin'
import { sendVerificationEmail } from '#server/utils/email-service'

const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000

const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now()
  const record = rateLimitStore.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false
  }

  record.count += 1
  return true
}

interface RegisterBody {
  email: string
  password: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    const clientIP =
      (event.node.req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      event.node.req.socket.remoteAddress ||
      'unknown'

    if (!checkRateLimit(clientIP)) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Muitas tentativas. Tente novamente em alguns minutos.'
      })
    }

    const body = await readBody<RegisterBody>(event)

    if (!body || typeof body !== 'object') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Dados inválidos'
      })
    }

    const email = (body.email || '').trim().toLowerCase()
    const password = body.password || ''

    if (!validarEmail(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'E-mail inválido'
      })
    }

    if (!validarSenha(password)) {
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
