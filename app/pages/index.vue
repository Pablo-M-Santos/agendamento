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

const { logout, user } = useAuth() 
const { listarAgendamentos, criarAgendamento, editarAgendamento, excluirAgendamento } = useAgendamentos()

const agendamentos = ref<Agendamento[]>([])
const dataSelecionada = ref(new Date())
const isModalOpen = ref(false)
const agendamentoParaEditar = ref<any>(null)


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


watch(user, async (newUser) => {
  if (newUser) {
    await carregarAgendamentos()
    nextTick(() => {
      setTimeout(centralizarDiaAtual, 500) 
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

const centralizarDiaAtual = () => {

  const hojeId = 'dia-' + format(new Date(), 'yyyy-MM-dd');
  const elemento = document.getElementById(hojeId);

  if (elemento) {
    elemento.scrollIntoView({
      behavior: 'smooth',
      inline: 'center', 
      block: 'nearest'
    });
  } else {
    console.warn("Elemento do dia atual não encontrado:", hojeId);
  }
};


watch([user, diasCarrossel], ([newUser, novosDias]) => {
  if (newUser && novosDias.length > 0) {
   
    nextTick(() => {
      setTimeout(centralizarDiaAtual, 800); 
    });
  }
}, { immediate: true });

onMounted(async () => {

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
  <div class="min-h-screen bg-[#1B1B1B] text-white pb-24">
    <header class="p-6 flex justify-between items-center bg-[#1B1B1B] border-b border-white/5 sticky top-0 z-50 backdrop-blur-md">
      <div>
        <h1 class="text-[10px] text-[#FA4805] uppercase tracking-[0.2em] font-black">Agenda</h1>
        <h2 class="text-2xl font-black text-white capitalize">
          {{ format(dataSelecionada, 'MMMM, yyyy', { locale: ptBR }) }}
        </h2>
      </div>
      <button 
        @click="abrirModal()" 
        class="bg-[#FA4805] text-[#1B1B1B] px-5 py-2.5 rounded-xl text-sm font-black shadow-[0_0_20px_rgba(0,220,130,0.2)] active:scale-95 transition-all"
      >
        Novo Agendamento
      </button>
    </header>

    <div 
      ref="scrollContainer"
      class="flex overflow-x-auto px-6 py-8 gap-4 no-scrollbar bg-[#1B1B1B] scroll-smooth"
    >
      <button 
        v-for="dia in diasCarrossel" 
        :key="dia.toISOString()"
        :id="'dia-' + format(dia, 'yyyy-MM-dd')"
        @click="dataSelecionada = dia"
        :class="[
          'flex flex-col items-center min-w-[65px] py-5 rounded-[2rem] transition-all duration-300 border',
        
          isSameDay(dia, dataSelecionada)
            ? 'bg-[#FA4805] border-[#FA4805] text-white scale-110 shadow-md'
            
       
            : eHoje(dia)
              ? 'bg-white border-[#FA4805] text-[#1B1B1B] font-bold'
              
     
              : 'bg-white border-transparent text-[#1B1B1B] hover:bg-orange-50'
        ]"
      >

        <span class="text-[10px] uppercase font-black tracking-widest mb-1">{{ getDiaLetra(dia) }}</span>
        <span class="font-black text-xl">{{ format(dia, 'd') }}</span>
        
        <div v-if="eHoje(dia)" :class="['w-1.5 h-1.5 rounded-full mt-2', isSameDay(dia, dataSelecionada) ? 'bg-[#ffffff]' : 'bg-[#FA4805]']"></div>
      </button>
    </div>

    <main class="px-6 mt-4">
      <div class="flex justify-between items-center mb-6">
        <h3 class="font-black text-[#F5F6FA] uppercase text-xs tracking-[0.15em]">Consultas do Dia</h3>
        <div class="h-[1px] flex-1 bg-white/5 ml-4"></div>
      </div>

      <div class="space-y-4" v-if="agendamentosFiltrados.length > 0">
        <div 
          v-for="item in agendamentosFiltrados" 
          :key="item.id" 
          @click="abrirModal(item)"
          class="bg-[#131314]/40 hover:bg-[#131314] p-5 rounded-[2.5rem] border border-white/5 flex items-start gap-5 active:scale-[0.98] transition-all group"
        >
          <div class="flex flex-col items-center justify-center bg-[#131314] px-3 py-4 rounded-2xl min-w-[60px] border border-white/5 shadow-inner">
            <span class="text-white font-black text-sm">{{ getHora(item.data) }}</span>
          </div>

          <div class="flex-1">
            <div class="flex justify-between items-start">
              <div>
                <span class="text-lg font-black text-white block leading-tight">{{ item.cliente }}</span>
                <span class="text-xs text-[#ffffff] font-bold mt-1 block opacity-80 uppercase tracking-wider">{{ item.descricao || 'Sem descrição' }}</span>
              </div>
              <div class="text-white/20 group-hover:text-[#FA4805] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="#ffffff">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
            </div>

            <div class="mt-4 flex items-center gap-3">
              <div class="w-7 h-7 rounded-full bg-[#FA4805]/10 border border-[#FA4805]/20 flex items-center justify-center text-[#FA4805] text-[10px] font-black">
                {{ item.cliente.charAt(0).toUpperCase() }}
              </div>
              <span class="text-[10px] font-black text-white/30 uppercase tracking-[0.1em]">Sessão Confirmada</span>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="flex flex-col items-center justify-center py-20 opacity-20">
        <div class="w-16 h-16 border-2 border-dashed border-white rounded-full mb-4 flex items-center justify-center">
          <span class="text-2xl">📅</span>
        </div>
        <p class="font-bold uppercase tracking-widest text-xs">Nenhuma sessão agendada</p>
      </div>
    </main>

    <nav class="fixed bottom-6 left-6 right-6 bg-[#131314]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] px-10 py-4 flex justify-between items-center z-40 shadow-2xl">
      <NuxtLink to="/perfil" class="text-white/40 hover:text-[#FA4805] transition-all">
        <span class="text-2xl">👤</span>
      </NuxtLink>
      

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