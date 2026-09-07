<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import DashboardTopBar from '~/components/dashboard/DashboardTopBar.vue'
import DashboardSidebar from '~/components/DashboardSidebar.vue'

definePageMeta({ middleware: 'auth', layout: 'app' })

const { t } = useAppI18n()
const { user } = useAuth()
const { listarAgendamentos } = useAgendamentos()

const isSidebarOpen = ref(false)

onMounted(() => {
  isSidebarOpen.value = window.matchMedia('(min-width: 1024px)').matches
})

const saudacao = computed(() => t('sidebar.history'))

const inicialUsuario = computed(() => {
  const nome = user.value?.displayName?.trim()
  if (nome) return nome.charAt(0).toUpperCase()
  return user.value?.email?.charAt(0).toUpperCase() || 'U'
})

const agendamentos = ref<Awaited<ReturnType<typeof listarAgendamentos>>>([])
const carregando = ref(true)
const busca = ref('')
const filtroStatus = ref<'todos' | 'concluidos' | 'abertos' | 'materialPronto' | 'atrasados'>('todos')

const carregarAgendamentos = async () => {
  carregando.value = true
  try {
    agendamentos.value = await listarAgendamentos()
  } finally {
    carregando.value = false
  }
}

onMounted(() => {
  carregarAgendamentos()
})

const agora = () => new Date()

const agendamentosFiltrados = computed(() => {
  let resultado = [...agendamentos.value]

  if (busca.value.trim()) {
    const termo = busca.value.trim().toLowerCase()
    resultado = resultado.filter((item) => {
      const cliente = (item.cliente || '').toLowerCase()
      const endereco = (item.endereco || '').toLowerCase()
      const numeroCasa = (item.numeroCasa || '').toLowerCase()
      const observacoes = (item.observacoes || '').toLowerCase()
      return (
        cliente.includes(termo) ||
        endereco.includes(termo) ||
        numeroCasa.includes(termo) ||
        observacoes.includes(termo)
      )
    })
  }

  if (filtroStatus.value !== 'todos') {
    const agoraRef = agora()
    resultado = resultado.filter((item) => {
      if (filtroStatus.value === 'concluidos') return item.servicoConcluido === true
      if (filtroStatus.value === 'abertos') return item.servicoConcluido === false
      if (filtroStatus.value === 'materialPronto') return item.materialPronto === true
      if (filtroStatus.value === 'atrasados') {
        return (
          item.servicoConcluido !== true &&
          item.data &&
          item.data.toMillis() < agoraRef.getTime()
        )
      }
      return true
    })
  }

  return resultado.sort((a, b) => {
    const dataA = a.data ? a.data.toMillis() : 0
    const dataB = b.data ? b.data.toMillis() : 0
    return dataB - dataA
  })
})

const formatarData = (timestamp: { toDate: () => Date }) => {
  if (!timestamp) return ''
  return format(timestamp.toDate(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
}

const formatarValor = (valor?: number) => {
  if (valor === undefined || valor === null) return '—'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

const opcoesStatus = computed(() => [
  { key: 'todos', label: 'Todos' },
  { key: 'concluidos', label: 'Concluídos' },
  { key: 'abertos', label: 'Em aberto' },
  { key: 'materialPronto', label: 'Material pronto' },
  { key: 'atrasados', label: 'Atrasados' }
])

const handleStatusSelect = (status: string) => {
  if (!['todos', 'concluidos', 'abertos', 'materialPronto', 'atrasados'].includes(status)) return
  filtroStatus.value = status as typeof filtroStatus.value
}
</script>

<template>
  <div
    class="h-screen overflow-y-auto px-3 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8 bg-[#0F1729] text-[#EDEFF4]"
    :class="{ 'lg:pl-[22rem]': isSidebarOpen }"
  >
    <DashboardTopBar
      :greeting="saudacao"
      :photo-url="user?.photoURL"
      :user-initial="inicialUsuario"
      :open-sidebar-label="t('dashboard.openSidebar')"
      :go-profile-label="t('dashboard.goProfile')"
      :sidebar-open="isSidebarOpen"
      @open-sidebar="isSidebarOpen = !isSidebarOpen"
    />

    <DashboardSidebar v-model="isSidebarOpen" />

    <div class="mb-4 sm:mb-6">
      <h1 class="text-lg sm:text-xl md:text-2xl font-black tracking-wide text-[#EDEFF4]">
        Histórico de agendamentos
      </h1>
      <p class="text-xs sm:text-sm text-[#8A93A6] font-bold mt-1">
        Pesquise e filtre seus agendamentos passados e atuais
      </p>
    </div>

    <section class="rounded-2xl border border-[#1E293B] bg-[#1A2338] p-3 sm:p-4 md:p-5 mb-4 sm:mb-6">
      <div class="flex items-center gap-2 mb-3">
        <h2 class="text-xs font-black uppercase tracking-[0.16em] text-[#94A3B8]">Busca e filtros</h2>
      </div>
      <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div class="relative flex-1">
          <input
            v-model="busca"
            type="text"
            placeholder="Buscar por cliente, endereço ou observação..."
            class="w-full rounded-xl border border-[#334155] bg-[#0F1729] px-3 py-2 text-sm text-[#EDEFF4] placeholder-[#94A3B8] outline-none focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA]"
          />
        </div>

        <div class="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            v-for="option in opcoesStatus"
            :key="option.key"
            class="px-3 py-2 rounded-lg border text-[10px] font-black uppercase tracking-[0.12em] whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            :class="
              filtroStatus === option.key
                ? 'bg-gradient-to-br from-[#233350] to-[#1C2A45] text-white border-[#33517F] shadow-lg shadow-[#33517F]/20'
                : 'bg-gradient-to-br from-[#233350] to-[#1C2A45] text-white/80 border-[#33517F]/30'
            "
            @click="handleStatusSelect(option.key)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </section>

    <section v-if="carregando" class="rounded-2xl border p-6 text-center border-[#1E293B] bg-[#1A2338]">
      <p class="font-black uppercase tracking-[0.16em] text-sm text-[#94A3B8]">Carregando...</p>
    </section>

    <template v-else>
      <div v-if="agendamentosFiltrados.length" class="flex items-center gap-2 mb-3 sm:mb-4">
        <h2 class="text-xs font-black uppercase tracking-[0.16em] text-[#94A3B8]">
          {{ agendamentosFiltrados.length }} {{ agendamentosFiltrados.length === 1 ? 'agendamento encontrado' : 'agendamentos encontrados' }}
        </h2>
        <div class="flex-1 h-[1px] bg-[#1E293B]" />
      </div>

      <section v-if="agendamentosFiltrados.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
        <div
          v-for="item in agendamentosFiltrados"
          :key="item.id"
          class="rounded-2xl border border-[#1E293B] bg-[#1A2338] p-4 sm:p-5"
        >
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="min-w-0">
              <p class="text-sm sm:text-base font-black text-[#F8FAFC] truncate">{{ item.cliente }}</p>
              <p class="text-xs text-[#94A3B8] font-bold truncate">{{ item.endereco }}, {{ item.numeroCasa }}</p>
            </div>
            <span
              class="inline-flex items-center rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-wider border"
              :class="
                item.servicoConcluido === true
                  ? 'bg-[#065F46]/20 text-[#10B981] border-[#065F46]'
                  : item.servicoConcluido === false
                    ? 'bg-[#991B1B]/20 text-[#EF4444] border-[#991B1B]'
                    : 'bg-[#92400E]/20 text-[#F59E0B] border-[#92400E]'
              "
            >
              {{ item.servicoConcluido === true ? 'Concluído' : item.servicoConcluido === false ? 'Em aberto' : 'Sem status' }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
            <div>
              <p class="text-[10px] uppercase tracking-wider text-[#94A3B8] font-black mb-0.5">Data</p>
              <p class="text-[#F8FAFC] font-bold">{{ formatarData(item.data) }}</p>
            </div>
            <div>
              <p class="text-[10px] uppercase tracking-wider text-[#94A3B8] font-black mb-0.5">Valor</p>
              <p class="text-[#F8FAFC] font-bold">{{ formatarValor(item.valor) }}</p>
            </div>
            <div>
              <p class="text-[10px] uppercase tracking-wider text-[#94A3B8] font-black mb-0.5">Material</p>
              <p class="font-bold" :class="item.materialPronto ? 'text-[#10B981]' : 'text-[#94A3B8]'">
                {{ item.materialPronto ? 'Pronto' : 'Não informado' }}
              </p>
            </div>
            <div>
              <p class="text-[10px] uppercase tracking-wider text-[#94A3B8] font-black mb-0.5">Status</p>
              <p class="font-bold" :class="item.servicoConcluido === true ? 'text-[#10B981]' : item.servicoConcluido === false ? 'text-[#EF4444]' : 'text-[#F59E0B]'">
                {{ item.servicoConcluido === true ? 'Concluído' : item.servicoConcluido === false ? 'Pendente' : 'Sem status' }}
              </p>
            </div>
          </div>

          <div v-if="item.observacoes" class="mt-3 pt-3 border-t border-[#1E293B]">
            <p class="text-[10px] uppercase tracking-wider text-[#94A3B8] font-black mb-1">Observações</p>
            <p class="text-xs text-[#EDEFF4] font-semibold leading-relaxed">{{ item.observacoes }}</p>
          </div>
        </div>
      </section>

      <section v-else class="rounded-2xl border border-[#1E293B] bg-[#1A2338] p-8 sm:p-12 text-center">
        <div class="w-16 h-16 rounded-full bg-[#262E42] flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-[#8A93A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p class="text-[#EDEFF4] font-black text-sm sm:text-base">{{ t('reports.noData') }}</p>
        <p class="text-xs text-[#94A3B8] mt-1">
          Nenhum agendamento encontrado para este filtro
        </p>
      </section>
    </template>
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
</style>
