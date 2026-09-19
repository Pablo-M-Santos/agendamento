import { describe, it, expect } from 'vitest'
import { validarEmail, validarSenha } from '~/utils/validacao'

describe('validacao', () => {
  it('validarEmail - email valido', () => {
    expect(validarEmail('usuario@example.com')).toBe(true)
  })

  it('validarEmail - email invalido', () => {
    expect(validarEmail('invalido')).toBe(false)
  })

  it('validarSenha - senha valida', () => {
    expect(validarSenha('123456')).toBe(true)
  })

  it('validarSenha - senha curta', () => {
    expect(validarSenha('123')).toBe(false)
  })
})

describe('useAgendamentos', () => {
  it('deve ser importavel', async () => {
    const module = await import('~/composables/useAgendamentos')
    expect(module.useAgendamentos).toBeDefined()
  })
})

describe('useReportsPage', () => {
  it('deve ser importavel', async () => {
    const module = await import('~/composables/useReportsPage')
    expect(module.useReportsPage).toBeDefined()
  })
})

describe('useChartData', () => {
  it('deve ser importavel', async () => {
    const module = await import('~/composables/useChartData')
    expect(module.useChartData).toBeDefined()
  })

  it('receitaPorMes retorna array vazio para dados vazios', async () => {
    const { useChartData } = await import('~/composables/useChartData')
    const { receitaPorMes, mediaMensal } = useChartData({ value: [] } as any)

    expect(receitaPorMes.value).toEqual([])
    expect(mediaMensal.value).toBe(0)
  })

  it('receitaPorDia retorna array vazio para dados vazios', async () => {
    const { useChartData } = await import('~/composables/useChartData')
    const { receitaPorDia } = useChartData({ value: [] } as any)

    expect(receitaPorDia.value).toEqual([])
  })
})
