import { describe, it, expect } from 'vitest'
import { validarEmail, validarSenha } from '../../app/utils/validacao'
import type { Agendamento } from '../../app/types/agendamento'

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
    const module = await import('../../app/composables/useAgendamentos')
    expect(module.useAgendamentos).toBeDefined()
  })
})

describe('useReportsPage', () => {
  it('deve ser importavel', async () => {
    const module = await import('../../app/composables/useReportsPage')
    expect(module.useReportsPage).toBeDefined()
  })
})

describe('useChartData', () => {
  it('deve ser importavel', async () => {
    const module = await import('../../app/composables/useChartData')
    expect(module.useChartData).toBeDefined()
  })

  it('receitaPorMes retorna array vazio para dados vazios', async () => {
    const { useChartData } = await import('../../app/composables/useChartData')
    const { receitaPorMes, mediaMensal } = useChartData({ value: [] as Agendamento[] })

    expect(receitaPorMes.value).toEqual([])
    expect(mediaMensal.value).toBe(0)
  })

  it('receitaPorDia retorna array vazio para dados vazios', async () => {
    const { useChartData } = await import('../../app/composables/useChartData')
    const { receitaPorDia } = useChartData({ value: [] as Agendamento[] })

    expect(receitaPorDia.value).toEqual([])
  })
})
