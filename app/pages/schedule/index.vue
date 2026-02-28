<script setup lang="ts">
import { onMounted, ref, computed, watch, nextTick } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useAgendamentos, type Agendamento } from '~/composables/useAgendamentos'
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import type { AgendamentoForm } from '~/types/agendamento'

definePageMeta({ middleware: 'auth' })

const { user } = useAuth()
const { listarAgendamentos, criarAgendamento, editarAgendamento, excluirAgendamento } =
  useAgendamentos()

const agendamentos = ref<Agendamento[]>([])
const dataSelecionada = ref(new Date())
const isModalOpen = ref(false)
const agendamentoParaEditar = ref<AgendamentoForm | null>(null)
const isConfirmOpen = ref(false)
const idParaExcluir = ref<string | null>(null)

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
      nextTick(() => {
        setTimeout(centralizarDiaAtual, 500)
      })
    }
  },
  { immediate: true }
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

const handleSalvarAgendamento = async (dados: AgendamentoForm) => {
  if (dados.id) {
    await editarAgendamento(dados.id, dados)
  } else {
    await criarAgendamento(dados)
  }
  isModalOpen.value = false
  await carregarAgendamentos()
}

const centralizarDiaAtual = () => {
  const hojeId = 'dia-' + format(new Date(), 'yyyy-MM-dd')
  const elemento = document.getElementById(hojeId)

  if (elemento) {
    elemento.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    })
  } else {
    console.warn('Elemento do dia atual não encontrado:', hojeId)
  }
}

watch(
  [user, diasCarrossel],
  ([newUser, novosDias]) => {
    if (newUser && novosDias.length > 0) {
      nextTick(() => {
        setTimeout(centralizarDiaAtual, 800)
      })
    }
  },
  { immediate: true }
)

onMounted(async () => {
  if (user.value) {
    await carregarAgendamentos()
    nextTick(() => {
      setTimeout(centralizarDiaAtual, 600)
    })
  }
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
      @edit="abrirModal"
      @delete="abrirModalConfirmacao"
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
