<script setup lang="ts">
import { onMounted, ref, computed, watch, nextTick } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useAgendamentos, type Agendamento } from '~/composables/useAgendamentos'
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { ptBR } from 'date-fns/locale'
import type { Timestamp } from 'firebase/firestore'
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
const isSidebarOpen = ref(false)

const diasCarrossel = computed(() => {
  const inicio = startOfMonth(dataSelecionada.value)
  const fim = endOfMonth(dataSelecionada.value)
  return eachDayOfInterval({ start: inicio, end: fim })
})

const eHoje = (dia: Date) => isSameDay(dia, new Date())

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

const getQuantidadePorDia = (dia: Date) => {
  const chave = format(dia, 'yyyy-MM-dd')
  return quantidadePorDia.value[chave] || 0
}

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

const getDiaLetra = (date: Date) => format(date, 'eeeeee', { locale: ptBR }).charAt(0).toUpperCase()
const getHora = (ts: Timestamp | null | undefined): string =>
  ts ? format(ts.toDate(), 'HH:mm') : '--:--'
</script>

<template>
  <div class="h-screen bg-[#003D7A] p-5 overflow-hidden">
    <header class="border-b border-white/5 sticky top-0 z-50 backdrop-blur-md">
      <div class="grid grid-cols-3 items-center">
        <button
          class="justify-self-start p-2 rounded-xl hover:bg-white/10 transition"
          aria-label="Abrir menu lateral"
          @click="isSidebarOpen = true"
        >
          <Bars3Icon class="w-7 h-7" />
        </button>

        <h1 class="text-base font-black text-white text-center">Agenda</h1>

        <div />
      </div>

      <div class="mt-4 flex items-center justify-between gap-4">
        <h2 class="text-base font-black text-white truncate">
          {{ format(dataSelecionada, 'MMMM, yyyy', { locale: ptBR }) }}
        </h2>

        <button
          class="bg-[#FBFBFB] text-black px-5 py-2.5 rounded-xl text-sm font-black shadow-[0_10px_25px_rgba(250,72,5,0.25)] active:scale-95 transition-all"
          @click="abrirModal()"
        >
          Cadastrar
        </button>
      </div>
    </header>

    <div
      ref="scrollContainer"
      class="flex overflow-x-auto px-6 py-8 gap-3 no-scrollbar scroll-smooth"
    >
      <button
        v-for="dia in diasCarrossel"
        :id="'dia-' + format(dia, 'yyyy-MM-dd')"
        :key="dia.toISOString()"
        :class="[
          'relative flex flex-col items-center min-w-[65px] py-4 rounded-[10px] transition-all duration-300',
          isSameDay(dia, dataSelecionada)
            ? 'bg-[#FBFBFB] text-white scale-110 shadow-md'
            : eHoje(dia)
              ? 'border-[#FBFBFB] text-white font-bold'
              : 'border-transparent text-white hover:bg-white/10'
        ]"
        @click="dataSelecionada = dia"
      >
        <div
          v-if="getQuantidadePorDia(dia) > 0"
          class="absolute -top-3 bg-green-500 text-black text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-md"
        >
          {{ getQuantidadePorDia(dia) }}
        </div>

        <span
          :class="[
            'text-[16px] uppercase font-black tracking-widest mb-1',
            isSameDay(dia, dataSelecionada) ? 'text-[#003D7A]' : 'text-white'
          ]"
        >
          {{ getDiaLetra(dia) }}
        </span>

        <span
          :class="[
            'font-black text-xl',
            isSameDay(dia, dataSelecionada) ? 'text-[#003D7A]' : 'text-white'
          ]"
        >
          {{ format(dia, 'd') }}
        </span>
      </button>
    </div>

    <main class="px-6 mt-4">
      <div class="flex justify-between items-center mb-6">
        <h3 class="font-black text-[#F5F6FA] uppercase text-xs tracking-[0.15em]">
          Serviços do Dia
        </h3>
        <div class="h-[1px] flex-1 bg-white/5 ml-4" />
      </div>

      <div v-if="agendamentosFiltrados.length > 0" class="space-y-4">
        <div
          v-for="item in agendamentosFiltrados"
          :key="item.id"
          class="bg-[#131314]/40 hover:bg-[#131314] p-5 rounded-[2.5rem] border-2 border-white flex items-start gap-5 active:scale-[0.98] transition-all group"
          @click="abrirModal(item)"
        >
          <div
            class="flex flex-col items-center justify-center bg-[#FBFBFB] px-3 py-4 rounded-2xl min-w-[60px] border border-white/5 shadow-inner"
          >
            <span class="text-white font-black text-sm">{{ getHora(item.data) }}</span>
          </div>

          <div class="flex-1">
            <div class="flex justify-between items-start">
              <div>
                <span class="text-lg font-black text-white block leading-tight">{{
                  item.cliente
                }}</span>
                <span
                  class="text-xs text-[#ffffff] font-bold mt-1 block opacity-80 uppercase tracking-wider"
                  >{{ item.descricao || 'Sem descrição' }}</span
                >
              </div>
              <button
                class="bg-red-600/50 text-white px-5 py-3 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all"
                @click.stop="abrirModalConfirmacao(item.id)"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-20 opacity-20">
        <div
          class="w-16 h-16 border-2 border-dashed border-white rounded-full mb-4 flex items-center justify-center"
        >
          <span class="text-2xl">📅</span>
        </div>
        <p class="font-bold uppercase tracking-widest text-xs">Nenhuma sessão agendada</p>
      </div>
    </main>

    <nav
      class="fixed bottom-6 left-6 right-6 bg-[#131314]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] px-10 py-4 flex justify-between items-center z-40 shadow-2xl"
    >
      <NuxtLink to="/profile" class="text-white/40 hover:text-[#FBFBFB] transition-all">
        <span class="text-2xl">👤</span>
      </NuxtLink>
    </nav>

    <ModalAgendamento
      v-model="isModalOpen"
      :agendamento-inicial="agendamentoParaEditar"
      :data-selecionada-no-pai="dataSelecionada"
      @salvar="handleSalvarAgendamento"
    />

    <Teleport to="body">
      <div
        v-if="isConfirmOpen"
        class="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center"
      >
        <div class="bg-[#1B1B1B] p-8 rounded-3xl w-full max-w-sm border border-white/10">
          <h3 class="text-white text-xl font-black mb-6">Confirmar Exclusão</h3>

          <p class="text-white/70 mb-8">Deseja realmente excluir este serviço?</p>

          <div class="flex gap-4">
            <button
              class="flex-1 bg-white/10 text-white py-3 rounded-xl font-bold"
              @click="isConfirmOpen = false"
            >
              Cancelar
            </button>

            <button
              class="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold"
              @click="confirmarExclusao"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-out;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(100%);
}
</style>
