<script setup lang="ts">
import { onMounted, ref, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useAgendamentos, type Agendamento } from '~/composables/useAgendamentos'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns'
import type { AgendamentoForm } from '~/types/agendamento'

definePageMeta({ middleware: 'auth' })

const { user } = useAuth()
const route = useRoute()
const { listarAgendamentos, criarAgendamento, editarAgendamento, excluirAgendamento } =
  useAgendamentos()

const agendamentos = ref<Agendamento[]>([])
const dataSelecionada = ref(new Date())
const isModalOpen = ref(false)
const agendamentoParaEditar = ref<AgendamentoForm | null>(null)
const isDetalhesOpen = ref(false)
const agendamentoDetalhes = ref<Agendamento | null>(null)
const isConfirmOpen = ref(false)
const idParaExcluir = ref<string | null>(null)
const focoAgendamentoId = ref<string | null>(null)
const dataInicialPreferida = ref<Date | null>(null)
const centralizacaoInicialFeita = ref(false)
const centralizacaoInicialEmAndamento = ref(false)

const diasCarrossel = computed(() => {
  const inicio = startOfMonth(dataSelecionada.value)
  const fim = endOfMonth(dataSelecionada.value)
  return eachDayOfInterval({ start: inicio, end: fim })
})

const carregarAgendamentos = async () => {
  if (!user.value) return
  agendamentos.value = await listarAgendamentos()
}

const abrirModalConfirmacao = (id: string) => {
  idParaExcluir.value = id
  isConfirmOpen.value = true
}

const confirmarExclusao = async () => {
  if (!idParaExcluir.value) return

  try {
    await excluirAgendamento(idParaExcluir.value)
    isConfirmOpen.value = false
    idParaExcluir.value = null
    await carregarAgendamentos()
  } catch (error) {
    console.error('Erro ao excluir:', error)
  }
}

watch(
  user,
  async (newUser) => {
    if (newUser) {
      await carregarAgendamentos()
      garantirCentralizacaoInicial()
    }
  },
  { immediate: true }
)

watch(
  () => route.query,
  () => {
    aplicarContextoDaRota()
  },
  { deep: true, immediate: true }
)

const agendamentosFiltrados = computed(() => {
  return agendamentos.value
    .filter((item) => {
      if (!item.data) return false
      const d = item.data.toDate()
      const s = dataSelecionada.value
      return (
        d.getDate() === s.getDate() &&
        d.getMonth() === s.getMonth() &&
        d.getFullYear() === s.getFullYear()
      )
    })
    .sort((a, b) => a.data.toMillis() - b.data.toMillis())
})

const agendamentoAlvoIdNoDia = computed(() => {
  const alvo = focoAgendamentoId.value
  if (!alvo) return null
  return agendamentosFiltrados.value.some((item) => item.id === alvo) ? alvo : null
})

const quantidadePorDia = computed(() => {
  const mapa: Record<string, number> = {}

  agendamentos.value.forEach((item) => {
    if (!item.data) return

    const data = item.data.toDate()
    const chave = format(data, 'yyyy-MM-dd')

    if (!mapa[chave]) {
      mapa[chave] = 0
    }

    mapa[chave]++
  })

  return mapa
})

const abrirModal = (item?: Agendamento) => {
  if (item) {
    agendamentoParaEditar.value = {
      ...item,
      id: item.id,
      data: format(item.data.toDate(), "yyyy-MM-dd'T'HH:mm")
    }
  } else {
    agendamentoParaEditar.value = null
  }
  isModalOpen.value = true
}

const abrirDetalhes = (item: Agendamento) => {
  agendamentoDetalhes.value = item
  isDetalhesOpen.value = true
}

const abrirEdicaoPelosDetalhes = (item: Agendamento) => {
  isDetalhesOpen.value = false
  abrirModal(item)
}

const handleSalvarAgendamento = async (dados: AgendamentoForm) => {
  try {
    if (dados.id) {
      await editarAgendamento(dados.id, dados)
    } else {
      await criarAgendamento(dados)
    }

    isModalOpen.value = false
    await carregarAgendamentos()
  } catch (error: any) {
    console.error('Erro ao salvar agendamento:', error)
    alert(error?.message || 'Nao foi possivel salvar o agendamento.')
  }
}

function centralizarDiaAtual() {
  return centralizarDia(dataInicialPreferida.value || new Date())
}

function centralizarDia(data: Date) {
  const diaId = 'dia-' + format(data, 'yyyy-MM-dd')
  const elemento = document.getElementById(diaId)

  if (elemento) {
    elemento.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    })
    return true
  } else {
    console.warn('Elemento do dia nao encontrado:', diaId)
    return false
  }
}

function normalizarQueryString(valor: unknown) {
  if (Array.isArray(valor)) return typeof valor[0] === 'string' ? valor[0] : null
  return typeof valor === 'string' ? valor : null
}

function parseDataQuery(valor: unknown) {
  const texto = normalizarQueryString(valor)
  if (!texto || !/^\d{4}-\d{2}-\d{2}$/.test(texto)) return null

  const [ano = 0, mes = 1, dia = 1] = texto.split('-').map(Number)
  const data = new Date(ano, mes - 1, dia)
  if (Number.isNaN(data.getTime())) return null
  return data
}

function aplicarContextoDaRota() {
  dataInicialPreferida.value = parseDataQuery(route.query.data)
  focoAgendamentoId.value = normalizarQueryString(route.query.agendamento)
}

function garantirCentralizacaoInicial() {
  if (centralizacaoInicialFeita.value || centralizacaoInicialEmAndamento.value) return

  centralizacaoInicialEmAndamento.value = true

  const alvo = dataInicialPreferida.value || new Date()
  if (!isSameDay(dataSelecionada.value, alvo)) {
    dataSelecionada.value = alvo
  }

  nextTick(() => {
    let tentativas = 0
    const maxTentativas = 6

    const tentarCentralizar = () => {
      const centralizado = centralizarDiaAtual()
      if (centralizado) {
        centralizacaoInicialFeita.value = true
        centralizacaoInicialEmAndamento.value = false
        return
      }

      tentativas += 1
      if (tentativas >= maxTentativas) {
        centralizacaoInicialEmAndamento.value = false
        return
      }

      setTimeout(tentarCentralizar, 180)
    }

    setTimeout(tentarCentralizar, 120)
  })
}

onMounted(() => {
  garantirCentralizacaoInicial()
})
</script>

<template>
  <div class="h-screen bg-[#003D7A] p-5 overflow-hidden">
    <ScheduleHeader :data-selecionada="dataSelecionada" @add="abrirModal()" />

    <ScheduleDaysCarousel
      :dias-carrossel="diasCarrossel"
      :data-selecionada="dataSelecionada"
      :quantidade-por-dia="quantidadePorDia"
      @update:data-selecionada="dataSelecionada = $event"
    />

    <ScheduleAppointmentsList
      :agendamentos="agendamentosFiltrados"
      :highlighted-id="agendamentoAlvoIdNoDia"
      @details="abrirDetalhes"
      @edit="abrirModal"
      @delete="abrirModalConfirmacao"
    />

    <ScheduleServiceDetailsModal
      v-model="isDetalhesOpen"
      :agendamento="agendamentoDetalhes"
      @edit="abrirEdicaoPelosDetalhes"
    />

    <ModalAgendamento
      v-model="isModalOpen"
      :agendamento-inicial="agendamentoParaEditar"
      :data-selecionada-no-pai="dataSelecionada"
      @salvar="handleSalvarAgendamento"
    />

    <ScheduleConfirmDeleteModal v-model="isConfirmOpen" @confirm="confirmarExclusao" />
  </div>
</template>
