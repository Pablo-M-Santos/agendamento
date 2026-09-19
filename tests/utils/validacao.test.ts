import { describe, it, expect, beforeEach, vi } from 'vitest'
import { validarEmail, validarSenha, EMAIL_REGEX, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, MAX_EMAIL_LENGTH } from '~/utils/validacao'

describe('validarEmail', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('deve retornar true para email valido', () => {
    expect(validarEmail('usuario@example.com')).toBe(true)
  })

  it('deve retornar true para email com subdominio', () => {
    expect(validarEmail('usuario@sub.example.com')).toBe(true)
  })

  it('deve retornar false para email sem arroba', () => {
    expect(validarEmail('usuarioexample.com')).toBe(false)
  })

  it('deve retornar false para email com arroba no inicio', () => {
    expect(validarEmail('@example.com')).toBe(false)
  })

  it('deve retornar false para email sem dominio', () => {
    expect(validarEmail('usuario@')).toBe(false)
  })

  it('deve retornar false para email vazio', () => {
    expect(validarEmail('')).toBe(false)
  })

  it('deve retornar false para email com espacos', () => {
    expect(validarEmail('usuario @example.com')).toBe(false)
  })

  it('deve retornar false para email muito longo', () => {
    const longEmail = 'a'.repeat(255) + '@example.com'
    expect(validarEmail(longEmail)).toBe(false)
  })
})

describe('validarSenha', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('deve retornar true para senha valida de 6 caracteres', () => {
    expect(validarSenha('123456')).toBe(true)
  })

  it('deve retornar true para senha longa', () => {
    expect(validarSenha('MinhaSenha123')).toBe(true)
  })

  it('deve retornar false para senha muito curta', () => {
    expect(validarSenha('12345')).toBe(false)
  })

  it('deve retornar false para senha vazia', () => {
    expect(validarSenha('')).toBe(false)
  })

  it('deve retornar false para senha muito longa', () => {
    const longPassword = 'a'.repeat(129)
    expect(validarSenha(longPassword)).toBe(false)
  })
})

describe('constantes', () => {
  it('EMAIL_REGEX deve validar formato correto', () => {
    expect(EMAIL_REGEX.test('teste@demo.org')).toBe(true)
    expect(EMAIL_REGEX.test('sem-arroba')).toBe(false)
  })

  it('MIN_PASSWORD_LENGTH deve ser 6', () => {
    expect(MIN_PASSWORD_LENGTH).toBe(6)
  })

  it('MAX_PASSWORD_LENGTH deve ser 128', () => {
    expect(MAX_PASSWORD_LENGTH).toBe(128)
  })

  it('MAX_EMAIL_LENGTH deve ser 254', () => {
    expect(MAX_EMAIL_LENGTH).toBe(254)
  })
})
