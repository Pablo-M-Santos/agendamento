import { computed, type Ref } from 'vue'
import { format, getDay, getHours } from 'date-fns'
import type { Agendamento } from '~/composables/useAgendamentos'

type DonutSegment = {
  label: string
  value: number
  color: string
  textColor?: string
}

export const useChartData = (agendamentosRef: Ref<Agendamento[]>) => {
  const total = computed(() => agendamentosRef.value.length)

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
        color: '#7FE0CC',
        textColor: '#7FE0CC'
      })
    }
    if (emAberto > 0) {
      segments.push({
        label: 'Em aberto',
        value: emAberto,
        color: '#4FD1C5',
        textColor: '#4FD1C5'
      })
    }
    if (semStatus > 0) {
      segments.push({
        label: 'Sem status',
        value: semStatus,
        color: '#8A93A6',
        textColor: '#8A93A6'
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

  const buildCompletionTrend = (limit = 14) => {
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
    const colunas = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

    const horarios: { label: string; hora: number }[] = []
    for (let h = 7; h <= 20; h++) {
      horarios.push({ label: `${String(h).padStart(2, '0')}h`, hora: h })
    }

    const matriz: number[][] = horarios.map(() => colunas.map(() => 0))

    agendamentosRef.value.forEach((item) => {
      if (!item.data) return
      const data = item.data.toDate()
      const diaSemana = getDay(data)
      const hora = getHours(data)
      const diaLabel = diasSemana[diaSemana]

      if (!diaLabel) return

      const colIdx = colunas.indexOf(diaLabel)
      const rowIdx = horarios.findIndex((h) => h.hora === hora)

      if (colIdx >= 0 && rowIdx >= 0) {
        matriz[rowIdx]![colIdx]! += 1
      }
    })

    return {
      rows: horarios.map((h, idx) => ({
        label: h.label,
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
    totalProximos
  }
}
