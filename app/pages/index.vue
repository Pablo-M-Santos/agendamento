<script setup lang="ts">
import { onMounted, ref, computed, watch, nextTick } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useAgendamentos, type Agendamento } from '~/composables/useAgendamentos'
import { 
  format, 
  isSameDay, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval 
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

definePageMeta({ middleware: 'auth' })

const { logout, user } = useAuth() // Certifique-se que o useAuth exporta o 'user'
const { listarAgendamentos, criarAgendamento, editarAgendamento, excluirAgendamento } = useAgendamentos()

const agendamentos = ref<Agendamento[]>([])
const dataSelecionada = ref(new Date())
const isModalOpen = ref(false)
const agendamentoParaEditar = ref<any>(null)

// --- Lógica de Dias ---
const diasCarrossel = computed(() => {
  const inicio = startOfMonth(dataSelecionada.value) 
  const fim = endOfMonth(dataSelecionada.value)     
  return eachDayOfInterval({ start: inicio, end: fim })
})

const eHoje = (dia: Date) => isSameDay(dia, new Date())

// --- Lógica de Dados ---
const carregarAgendamentos = async () => {
  if (!user.value) return // Evita erro de busca sem usuário
  agendamentos.value = await listarAgendamentos()
}

// MÁGICA DO F5: Observa o usuário. Quando o Firebase logar, ele carrega e faz o scroll.
watch(user, async (newUser) => {
  if (newUser) {
    await carregarAgendamentos()
    nextTick(() => {
      setTimeout(centralizarDiaAtual, 500) // Tempo extra para garantir renderização
    })
  }
}, { immediate: true })

const agendamentosFiltrados = computed(() => {
  return agendamentos.value.filter(item => {
    if (!item.data) return false
    const d = item.data.toDate()
    const s = dataSelecionada.value
    return d.getDate() === s.getDate() && 
           d.getMonth() === s.getMonth() && 
           d.getFullYear() === s.getFullYear()
  }).sort((a, b) => a.data.toMillis() - b.data.toMillis())
})

// --- Ações ---
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

const handleSalvarAgendamento = async (dados: any) => {
  if (dados.id) {
    await editarAgendamento(dados.id, dados)
  } else {
    await criarAgendamento(dados)
  }
  isModalOpen.value = false
  await carregarAgendamentos()
}

const handleExcluir = async (id: string) => {
  if (!id) return
  if (confirm('Deseja realmente excluir?')) {
    try {
      await excluirAgendamento(id)
      isModalOpen.value = false
      await carregarAgendamentos()
    } catch (error) {
      console.error("Erro ao excluir:", error)
    }
  }
}

// --- Scroll e Auxiliares ---
const centralizarDiaAtual = () => {
  const hojeId = 'dia-' + format(new Date(), 'yyyy-MM-dd')
  const elemento = document.getElementById(hojeId)
  if (elemento) {
    elemento.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    })
  }
}

onMounted(async () => {
  // Se o usuário já estiver disponível de cara
  if (user.value) {
    await carregarAgendamentos()
    nextTick(() => {
      setTimeout(centralizarDiaAtual, 600)
    })
  }
})

const getDiaLetra = (date: Date) => format(date, 'eeeeee', { locale: ptBR }).charAt(0).toUpperCase()
const getHora = (ts: any) => ts ? format(ts.toDate(), 'HH:mm') : '--:--'
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-24">
    <header class="p-6 flex justify-between items-center bg-white shadow-sm">
      <div>
        <h1 class="text-xs text-gray-400 uppercase tracking-widest font-bold">Agenda</h1>
        <h2 class="text-2xl font-bold text-blue-600 capitalize">
          {{ format(dataSelecionada, 'MMM, yyyy', { locale: ptBR }) }}
        </h2>
      </div>
      <button @click="abrirModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm active:scale-95 transition">
        Adicionar consulta
      </button>
    </header>

    <div ref="scrollContainer" class="flex overflow-x-auto px-6 py-4 gap-3 no-scrollbar bg-gray-50 scroll-smooth">
      <button 
        v-for="dia in diasCarrossel" 
        :key="dia.toISOString()"
        @click="dataSelecionada = dia"
        :class="[
          'flex flex-col items-center min-w-[55px] p-4 rounded-2xl shadow-sm transition-all border-2',
   
          isSameDay(dia, dataSelecionada) 
            ? 'bg-blue-500 text-white border-blue-500 shadow-md scale-105' 
            : eHoje(dia)
       
              ? 'bg-white text-green-600 border-green-500 font-black'
      
              : 'bg-white text-gray-400 border-transparent'
        ]"
      >
        <span class="text-[10px] uppercase font-bold">{{ getDiaLetra(dia) }}</span>
        <span class="font-bold text-lg">{{ format(dia, 'd') }}</span>
        
        <div v-if="eHoje(dia) && !isSameDay(dia, dataSelecionada)" class="w-1 h-1 bg-green-500 rounded-full mt-1"></div>
      </button>
    </div>

    <main class="px-6 mt-4">
      <div class="flex justify-between items-baseline mb-4">
        <h3 class="font-bold text-gray-800">Consultas agendadas</h3>
        <button class="text-blue-500 text-xl font-bold">≡</button>
      </div>

      <div class="space-y-4" v-if="agendamentosFiltrados.length > 0">
        <div 
          v-for="item in agendamentosFiltrados" 
          :key="item.id" 
          @click="abrirModal(item)"
          class="bg-white p-5 rounded-[2rem] shadow-sm flex items-start gap-4 border border-gray-50 active:bg-gray-50"
        >
          <div class="text-gray-900 text-sm font-bold pt-1 min-w-[45px]">
            {{ getHora(item.data) }}
          </div>

          <div class="flex-1">
            <div class="flex justify-between items-start">
              <div>
                <span class="text-sm font-black text-gray-900 block">{{ item.cliente }}</span>
                <span class="text-xs text-gray-400 font-medium line-clamp-1">{{ item.descricao}}</span>
              </div>
              <button class="text-gray-300">⋮</button>
            </div>

            <div class="mt-4 flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                {{ item.cliente.charAt(0).toUpperCase() }}
              </div>
              <span class="text-sm font-bold text-gray-700">{{ item.cliente }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-20 text-gray-300 font-medium">
        Nenhuma consulta para este dia.
      </div>
    </main>

    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-8 py-4 flex justify-between items-center z-40">
      <button class="flex flex-col items-center text-blue-600">

      </button>
      <button class="flex flex-col items-center text-gray-400">

      </button>
      <button @click="logout" class="flex flex-col items-center text-red-400">
        <span class="text-xl">🚪</span>
        <span class="text-[10px]">Sair</span>
      </button>
    </nav>

    <ModalAgendamento 
  v-model="isModalOpen"
  :agendamento-inicial="agendamentoParaEditar"
  :data-selecionada-no-pai="dataSelecionada" 
  @salvar="handleSalvarAgendamento"
  @excluir="handleExcluir"
/>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease-out;
}
.slide-enter-from, .slide-leave-to {
  transform: translateY(100%);
}
</style>