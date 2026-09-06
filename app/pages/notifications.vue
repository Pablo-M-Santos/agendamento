<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import DashboardTopBar from '~/components/dashboard/DashboardTopBar.vue'
import DashboardSidebar from '~/components/DashboardSidebar.vue'

definePageMeta({ middleware: 'auth', layout: 'app' })

const { t } = useAppI18n()
const { user } = useAuth()

const isSidebarOpen = ref(false)

onMounted(() => {
  isSidebarOpen.value = window.matchMedia('(min-width: 1024px)').matches
})

const saudacao = computed(() => t('sidebar.notifications'))

const inicialUsuario = computed(() => {
  const nome = user.value?.displayName?.trim()
  if (nome) return nome.charAt(0).toUpperCase()
  return user.value?.email?.charAt(0).toUpperCase() || 'U'
})

type Notification = {
  id: string
  title: string
  description: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: Date
}

const carregando = ref(true)
const notificacoes = ref<Notification[]>([])
const filtro = ref<'todas' | 'nao-lidas' | 'lidas'>('todas')

const marcarComoLida = async (id: string) => {
  const index = notificacoes.value.findIndex((n) => n.id === id)
  if (index >= 0) {
    notificacoes.value[index] = { ...notificacoes.value[index], read: true }
  }
}

const marcarTodasComoLidas = async () => {
  notificacoes.value = notificacoes.value.map((n) => ({ ...n, read: true }))
}

const limparNotificacoes = async () => {
  notificacoes.value = []
}

const carregarNotificacoes = async () => {
  carregando.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 600))
    notificacoes.value = [
      {
        id: '1',
        title: 'Agendamento confirmado',
        description: 'Seu agendamento com Ana para o dia 05/09/2026 às 09:00 foi confirmado.',
        type: 'success',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        id: '2',
        title: 'Material pronto',
        description: 'O material do serviço do Bruno já está pronto para retirada.',
        type: 'info',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
      },
      {
        id: '3',
        title: 'Agendamento cancelado',
        description: 'O agendamento com Diego do dia 04/09/2026 foi cancelado pelo cliente.',
        type: 'error',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
      },
      {
        id: '4',
        title: 'Lembrete de horário',
        description: 'Você tem um agendamento com Carla hoje às 14:00.',
        type: 'warning',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48)
      }
    ]
  } finally {
    carregando.value = false
  }
}

onMounted(() => {
  carregarNotificacoes()
})

const notificacoesFiltradas = computed(() => {
  let resultado = [...notificacoes.value]

  if (filtro.value === 'nao-lidas') {
    resultado = resultado.filter((n) => !n.read)
  } else if (filtro.value === 'lidas') {
    resultado = resultado.filter((n) => n.read)
  }

  return resultado.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
})

const naoLidas = computed(() => notificacoes.value.filter((n) => !n.read).length)

const opcoesFiltro = computed(() => [
  { key: 'todas', label: `Todas (${notificacoes.value.length})` },
  { key: 'nao-lidas', label: `Não lidas (${naoLidas.value})` },
  { key: 'lidas', label: 'Lidas' }
])

const handleFiltroSelect = (valor: string) => {
  if (!['todas', 'nao-lidas', 'lidas'].includes(valor)) return
  filtro.value = valor as typeof filtro.value
}

const formatarData = (data: Date) => {
  const agora = new Date()
  const diff = agora.getTime() - data.getTime()
  const minutos = Math.floor(diff / (1000 * 60))
  const horas = Math.floor(diff / (1000 * 60 * 60))
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutos < 1) return 'Agora'
  if (minutos < 60) return `há ${minutos} min`
  if (horas < 24) return `há ${horas}h`
  if (dias < 7) return `há ${dias}d`
  return format(data, 'dd/MM/yyyy', { locale: ptBR })
}

const iconePorTipo = (tipo: Notification['type']) => {
  if (tipo === 'success') {
    return `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
  }
  if (tipo === 'warning') {
    return `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>`
  }
  if (tipo === 'error') {
    return `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
  }
  return `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
}

const corPorTipo = (tipo: Notification['type']) => {
  if (tipo === 'success') return 'text-[#10B981]'
  if (tipo === 'warning') return 'text-[#F59E0B]'
  if (tipo === 'error') return 'text-[#EF4444]'
  return 'text-[#60A5FA]'
}

const bgPorTipo = (tipo: Notification['type']) => {
  if (tipo === 'success') return 'bg-[#065F46]/20'
  if (tipo === 'warning') return 'bg-[#92400E]/20'
  if (tipo === 'error') return 'bg-[#991B1B]/20'
  return 'bg-[#1E3A5F]/20'
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
        Notificações
      </h1>
      <p class="text-xs sm:text-sm text-[#8A93A6] font-bold mt-1">
        Acompanhe suas notificações e lembretes
      </p>
    </div>

    <section v-if="!carregando && notificacoes.length" class="rounded-2xl border border-[#1E293B] bg-[#1A2338] p-3 sm:p-4 md:p-5 mb-4 sm:mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
        <div class="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            v-for="option in opcoesFiltro"
            :key="option.key"
            class="px-3 py-2 rounded-lg border text-[10px] font-black uppercase tracking-[0.12em] whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            :class="
              filtro === option.key
                ? 'bg-gradient-to-br from-[#233350] to-[#1C2A45] text-white border-[#33517F] shadow-lg shadow-[#33517F]/20'
                : 'bg-gradient-to-br from-[#233350] to-[#1C2A45] text-white/80 border-[#33517F]/30'
            "
            @click="handleFiltroSelect(option.key)"
          >
            {{ option.label }}
          </button>
        </div>

        <div class="flex gap-2">
          <button
            v-if="naoLidas > 0"
            class="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#1E3A5F] text-[#E3EBFB] border border-[#33517F] hover:bg-[#33517F] active:scale-95 transition font-black text-[10px] uppercase tracking-[0.12em]"
            @click="marcarTodasComoLidas"
          >
            Marcar todas como lidas
          </button>
          <button
            class="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#991B1B] text-[#E3EBFB] border border-[#991B1B] hover:bg-[#B91C1C] active:scale-95 transition font-black text-[10px] uppercase tracking-[0.12em]"
            @click="limparNotificacoes"
          >
            Limpar tudo
          </button>
        </div>
      </div>
    </section>

    <section v-if="carregando" class="rounded-2xl border p-6 text-center border-[#1E293B] bg-[#1A2338]">
      <p class="font-black uppercase tracking-[0.16em] text-sm text-[#94A3B8]">Carregando...</p>
    </section>

    <template v-else>
      <section v-if="notificacoesFiltradas.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
        <div
          v-for="item in notificacoesFiltradas"
          :key="item.id"
          class="rounded-2xl border border-[#1E293B] bg-[#1A2338] p-4 sm:p-5"
          :class="!item.read ? 'border-l-4 border-l-[#60A5FA]' : ''"
        >
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex items-center gap-3">
              <span
                class="inline-flex items-center justify-center w-10 h-10 rounded-xl border"
                :class="`${bgPorTipo(item.type)} ${corPorTipo(item.type)} border-[#1E293B]`"
              >
                <span v-html="iconePorTipo(item.type)" />
              </span>
              <div class="min-w-0">
                <p class="text-sm font-black text-[#F8FAFC] truncate">{{ item.title }}</p>
                <p class="text-[10px] text-[#94A3B8] font-bold">{{ formatarData(item.createdAt) }}</p>
              </div>
            </div>
            <button
              v-if="!item.read"
              class="text-[10px] font-black uppercase tracking-wider text-[#60A5FA] hover:text-white transition whitespace-nowrap"
              @click="marcarComoLida(item.id)"
            >
              Marcar como lida
            </button>
          </div>

          <p class="text-xs text-[#EDEFF4] font-semibold leading-relaxed">{{ item.description }}</p>

          <div v-if="item.read" class="mt-3 pt-3 border-t border-[#1E293B]">
            <span class="text-[10px] font-black uppercase tracking-wider text-[#94A3B8]">Lida</span>
          </div>
        </div>
      </section>

      <section v-else class="rounded-2xl border border-[#1E293B] bg-[#1A2338] p-8 sm:p-12 text-center">
        <div class="w-16 h-16 rounded-full bg-[#262E42] flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-[#8A93A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <p class="text-[#EDEFF4] font-black text-sm sm:text-base">Nenhuma notificação encontrada</p>
        <p class="text-xs text-[#94A3B8] mt-1">
          Quando houver novidades, elas aparecerão aqui
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
