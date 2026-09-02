import { computed, ref, watch } from 'vue'
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  subDays
} from 'date-fns'
import type { Agendamento } from '~/composables/useAgendamentos'
import { useAgendamentos } from '~/composables/useAgendamentos'
import { useAuth } from '~/composables/useAuth'

export type ReportsPeriod = '7d' | '30d' | 'mes'
export type StatusFilter = 'todos' | 'concluidos' | 'abertos' | 'atrasados'

export const useReportsPage = () => {
  const { user } = useAuth()
  const { listarAgendamentos } = useAgendamentos()

  const periodoSelecionado = ref<ReportsPeriod>('30d')
  const filtroStatus = ref<StatusFilter>('todos')
  const carregando = ref(true)
  const agendamentos = ref<Agendamento[]>([])

  const carregar = async () => {
    if (!user.value) {
      agendamentos.value = []
      carregando.value = false
      return
    }

    carregando.value = true

    try {
      agendamentos.value = await listarAgendamentos()
    } finally {
      carregando.value = false
    }
  }

  watch(
    () => user.value,
    async (newUser) => {
      if (newUser) {
        await carregar()
        return
      }

      agendamentos.value = []
      carregando.value = false
    },
    { immediate: true }
  )

  const intervaloSelecionado = computed(() => {
    const agora = new Date()
    const fim = startOfDay(agora)

    if (periodoSelecionado.value === '7d') {
      return {
        inicio: startOfDay(subDays(agora, 6)),
        fim
      }
    }

    if (periodoSelecionado.value === '30d') {
      return {
        inicio: startOfDay(subDays(agora, 29)),
        fim
      }
    }

    return {
      inicio: startOfDay(startOfMonth(agora)),
      fim: startOfDay(endOfMonth(agora))
    }
  })

  const agendamentosNoPeriodo = computed(() => {
    const { inicio, fim } = intervaloSelecionado.value

    return agendamentos.value.filter((item) => {
      if (!item.data) return false

      const diaItem = startOfDay(item.data.toDate())
      return isWithinInterval(diaItem, { start: inicio, end: fim })
    })
  })

  const agendamentosFiltrados = computed(() => {
    const lista = agendamentosNoPeriodo.value
    const agora = Date.now()

    switch (filtroStatus.value) {
      case 'concluidos':
        return lista.filter((item) => item.servicoConcluido === true)
      case 'abertos':
        return lista.filter((item) => item.servicoConcluido === false)
      case 'atrasados':
        return lista.filter((item) => {
          if (!item.data) return false
          if (item.servicoConcluido === true) return false
          return item.data.toMillis() < agora
        })
      default:
        return lista
    }
  })

  const totalAgendamentos = computed(() => agendamentosFiltrados.value.length)
  const totalFinalizados = computed(
    () => agendamentosFiltrados.value.filter((item) => item.servicoConcluido === true).length
  )
  const totalNaoConcluidos = computed(
    () => agendamentosFiltrados.value.filter((item) => item.servicoConcluido !== true).length
  )
  const totalMaterialPronto = computed(
    () => agendamentosFiltrados.value.filter((item) => item.materialPronto === true).length
  )

  const taxaConclusao = computed(() => {
    if (!totalAgendamentos.value) return 0
    return (totalFinalizados.value / totalAgendamentos.value) * 100
  })

  const materialResumo = computed(() => {
    const pronto = agendamentosFiltrados.value.filter((item) => item.materialPronto === true).length
    const semMaterial = agendamentosFiltrados.value.filter(
      (item) => item.materialPronto === false
    ).length
    const naoInformado = agendamentosFiltrados.value.length - pronto - semMaterial

    return {
      pronto,
      semMaterial,
      naoInformado
    }
  })

  const serieDiaria = computed(() => {
    const { inicio, fim } = intervaloSelecionado.value
    const dias = eachDayOfInterval({ start: inicio, end: fim })

    const mapa = new Map<string, { total: number; finalizados: number }>()

    dias.forEach((dia) => {
      mapa.set(format(dia, 'yyyy-MM-dd'), { total: 0, finalizados: 0 })
    })

    agendamentosFiltrados.value.forEach((item) => {
      const chave = format(item.data.toDate(), 'yyyy-MM-dd')
      const atual = mapa.get(chave)
      if (!atual) return

      atual.total += 1
      if (item.servicoConcluido === true) atual.finalizados += 1
    })

    const maximo = Math.max(
      1,
      ...Array.from(mapa.values()).map((item) => Math.max(item.total, item.finalizados))
    )

    return Array.from(mapa.entries()).map(([chave, valor]) => ({
      chave,
      label: format(new Date(`${chave}T00:00:00`), 'dd/MM'),
      total: valor.total,
      finalizados: valor.finalizados,
      alturaTotal: Math.max(8, Math.round((valor.total / maximo) * 92)),
      alturaFinalizados: Math.max(6, Math.round((valor.finalizados / maximo) * 92))
    }))
  })

  const topClientes = computed(() => {
    const mapa = new Map<string, { total: number; finalizados: number }>()

    agendamentosFiltrados.value.forEach((item) => {
      const nome = (item.cliente || 'Cliente nao informado').trim() || 'Cliente nao informado'
      const atual = mapa.get(nome) || { total: 0, finalizados: 0 }
      atual.total += 1
      if (item.servicoConcluido === true) atual.finalizados += 1
      mapa.set(nome, atual)
    })

    return Array.from(mapa.entries())
      .map(([cliente, dados]) => ({
        cliente,
        total: dados.total,
        finalizados: dados.finalizados
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
  })

  const diaMaisCheio = computed(() => {
    if (!serieDiaria.value.length) return null

    return [...serieDiaria.value].sort((a, b) => b.total - a.total)[0] || null
  })

  return {
    periodoSelecionado,
    filtroStatus,
    carregando,
    agendamentos,
    totalAgendamentos,
    totalFinalizados,
    totalNaoConcluidos,
    totalMaterialPronto,
    taxaConclusao,
    materialResumo,
    serieDiaria,
    topClientes,
    diaMaisCheio,
    agendamentosNoPeriodo,
    agendamentosFiltrados
  }
}
