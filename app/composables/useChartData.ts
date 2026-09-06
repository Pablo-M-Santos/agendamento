import { computed, type Ref } from 'vue'
import { format, getDay, getHours, startOfDay } from 'date-fns'
import type { Agendamento } from '~/composables/useAgendamentos'

type DonutSegment = {
  label: string
  value: number
  color: string
  textColor?: string
}

type TrendPoint = {
  x: string
  total: number
  concluidos: number
}

export const useChartData = (agendamentosRef: Ref<Agendamento[]>) => {
  const total = computed(() => agendamentosRef.value.length)

  const receitaTotal = computed(() =>
    agendamentosRef.value.reduce((acc, item) => acc + (item.valor || 0), 0)
  )

  const ticketMedio = computed(() => {
    if (!total.value) return 0
    return receitaTotal.value / total.value
  })

  const receitaPorDia = computed(() => {
    const mapa = new Map<string, number>()
    agendamentosRef.value.forEach((item) => {
      if (!item.data) return
      const chave = format(item.data.toDate(), 'yyyy-MM-dd')
      mapa.set(chave, (mapa.get(chave) || 0) + (item.valor || 0))
    })
    return Array.from(mapa.entries())
      .map(([chave, valor]) => ({
        x: format(new Date(`${chave}T00:00:00`), 'dd/MM'),
        valor
      }))
      .slice(-14)
  })

  const statusPorDia = computed(() => {
    const ordenados = [...agendamentosRef.value]
      .filter((item) => item.data)
      .sort((a, b) => a.data.toMillis() - b.data.toMillis())

    const grupos = new Map<string, { concluidos: number; abertos: number; semStatus: number }>()
    ordenados.forEach((item) => {
      const chave = format(item.data.toDate(), 'yyyy-MM-dd')
      const atual = grupos.get(chave) || { concluidos: 0, abertos: 0, semStatus: 0 }
      if (item.servicoConcluido === true) atual.concluidos += 1
      else if (item.servicoConcluido === false) atual.abertos += 1
      else atual.semStatus += 1
      grupos.set(chave, atual)
    })

    return Array.from(grupos.entries()).map(([chave, dados]) => ({
      x: format(new Date(`${chave}T00:00:00`), 'dd/MM'),
      concluidos: dados.concluidos,
      abertos: dados.abertos,
      semStatus: dados.semStatus
    }))
  })

  const comparacaoPeriodo = computed(() => {
    const ordenados = [...agendamentosRef.value]
      .filter((item) => item.data)
      .sort((a, b) => a.data.toMillis() - b.data.toMillis())

    const hoje = new Date()
    const dias = 14
    const periodoAtualInicio = new Date(hoje.getTime() - (dias - 1) * 24 * 60 * 60 * 1000)
    const periodoAnteriorInicio = new Date(periodoAtualInicio.getTime() - dias * 24 * 60 * 60 * 1000)

    const atual: { dia: string; total: number }[] = []
    const anterior: { dia: string; total: number }[] = []

    for (let i = 0; i < dias; i++) {
      const dataAtual = new Date(periodoAtualInicio.getTime() + i * 24 * 60 * 60 * 1000)
      const dataAnterior = new Date(periodoAnteriorInicio.getTime() + i * 24 * 60 * 60 * 1000)
      const chaveAtual = format(dataAtual, 'dd/MM')
      const chaveAnterior = format(dataAnterior, 'dd/MM')

      const totalAtual = ordenados.filter((item) => {
        const dia = startOfDay(item.data.toDate())
        return dia.getTime() === startOfDay(dataAtual).getTime()
      }).length
      const totalAnterior = ordenados.filter((item) => {
        const dia = startOfDay(item.data.toDate())
        return dia.getTime() === startOfDay(dataAnterior).getTime()
      }).length

      atual.push({ dia: chaveAtual, total: totalAtual })
      anterior.push({ dia: chaveAnterior, total: totalAnterior })
    }

    return { atual, anterior }
  })

  const buildStatusDonut = (): DonutSegment[] => {
    const concluidos = agendamentosRef.value.filter(
      (item) => item.servicoConcluido === true
    ).length
    const emAberto = agendamentosRef.value.filter(
      (item) => item.servicoConcluido === false
    ).length
    const semStatus = total.value - concluidos - emAberto

    const segments: DonutSegment[] = []
    if (concluidos > 0) {
      segments.push({
        label: 'Concluídos',
        value: concluidos,
        color: '#10B981',
        textColor: '#10B981'
      })
    }
    if (emAberto > 0) {
      segments.push({
        label: 'Em aberto',
        value: emAberto,
        color: '#818CF8',
        textColor: '#818CF8'
      })
    }
    if (semStatus > 0) {
      segments.push({
        label: 'Sem status',
        value: semStatus,
        color: '#F59E0B',
        textColor: '#F59E0B'
      })
    }
    return segments
  }

  const taxaConclusao = computed(() => {
    const concluidos = agendamentosRef.value.filter(
      (item) => item.servicoConcluido === true
    ).length
    if (total.value === 0) return 0
    return Math.round((concluidos / total.value) * 100)
  })

  const buildCompletionTrend = (limit = 14): TrendPoint[] => {
    const ordenados = [...agendamentosRef.value]
      .filter((item) => item.data)
      .sort((a, b) => a.data.toMillis() - b.data.toMillis())

    if (ordenados.length === 0) return []

    const gruposPorDia = new Map<string, { total: number; concluidos: number }>()
    ordenados.forEach((item) => {
      const chave = format(item.data.toDate(), 'yyyy-MM-dd')
      const atual = gruposPorDia.get(chave) || { total: 0, concluidos: 0 }
      atual.total += 1
      if (item.servicoConcluido === true) atual.concluidos += 1
      gruposPorDia.set(chave, atual)
    })

    return Array.from(gruposPorDia.entries())
      .slice(-limit)
      .map(([chave, dados]) => ({
        x: format(new Date(`${chave}T00:00:00`), 'dd/MM'),
        total: dados.total,
        concluidos: dados.concluidos
      }))
  }

  const buildHeatmap = () => {
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const colunas = ['07h', '08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h']

    const dias = diasSemana.slice(1).map((label, idx) => ({ label, dia: idx + 1 }))

    const matriz: number[][] = dias.map(() => colunas.map(() => 0))

    agendamentosRef.value.forEach((item) => {
      if (!item.data) return
      const data = item.data.toDate()
      const diaSemana = getDay(data)
      const hora = getHours(data)

      const diaIdx = dias.findIndex((d) => d.dia === diaSemana)
      const horaStr = `${hora.toString().padStart(2, '0')}h`
      const horaIdx = colunas.indexOf(horaStr)

      if (diaIdx >= 0 && horaIdx >= 0) {
        matriz[diaIdx]![horaIdx]! += 1
      }
    })

    return {
      rows: dias.map((d, idx) => ({
        label: d.label,
        cells: matriz[idx]!.map((value) => ({ value }))
      })),
      columns: colunas
    }
  }

  const totalAtrasados = computed(() => {
    const agora = Date.now()
    return agendamentosRef.value.filter((item) => {
      if (!item.data) return false
      if (item.servicoConcluido === true) return false
      return item.data.toMillis() < agora
    }).length
  })

  const totalProximos = computed(() => {
    const agora = Date.now()
    const limite = agora + 7 * 24 * 60 * 60 * 1000
    return agendamentosRef.value.filter((item) => {
      if (!item.data) return false
      if (item.servicoConcluido === true) return false
      const ts = item.data.toMillis()
      return ts >= agora && ts <= limite
    }).length
  })

  return {
    buildStatusDonut,
    buildCompletionTrend,
    buildHeatmap,
    total,
    taxaConclusao,
    totalAtrasados,
    totalProximos,
    receitaTotal,
    ticketMedio,
    receitaPorDia,
    statusPorDia,
    comparacaoPeriodo
  }
}
