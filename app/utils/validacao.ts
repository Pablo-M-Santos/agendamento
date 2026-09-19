export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const MIN_PASSWORD_LENGTH = 6
export const MAX_PASSWORD_LENGTH = 128
export const MAX_EMAIL_LENGTH = 254

export const validarEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false
  if (email.length > MAX_EMAIL_LENGTH) return false
  return EMAIL_REGEX.test(email)
}

export const validarSenha = (senha: string): boolean => {
  if (!senha || typeof senha !== 'string') return false
  if (senha.length < MIN_PASSWORD_LENGTH) return false
  if (senha.length > MAX_PASSWORD_LENGTH) return false
  return true
}
