<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import DashboardTopBar from '~/components/dashboard/DashboardTopBar.vue'
import DashboardSidebar from '~/components/DashboardSidebar.vue'
import { useNotifications } from '~/composables/useNotifications'
import type { NotificationItem } from '~/types/notification'

definePageMeta({ middleware: 'auth', layout: 'app' })

const { t } = useAppI18n()
const { user } = useAuth()
const { listarNotificacoes, criarNotificacao } = useNotifications()

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

const externalId = computed(() => user.value?.uid || '')

const notificacoes = ref<NotificationItem[]>([])
const carregando = ref(true)
const erro = ref<string | null>(null)
const filtro = ref<'todas' | 'nao-lidas' | 'lidas'>('todas')

const abertoCriar = ref(false)
const tituloNotificacao = ref('')
const mensagemNotificacao = ref('')
const horarioNotificacao = ref('')

const carregarNotificacoes = async () => {
  if (!externalId.value) return
  carregando.value = true
  erro.value = null
  try {
    notificacoes.value = await listarNotificacoes(externalId.value)
  } catch {
    erro.value = 'Erro ao carregar notificações'
    notificacoes.value = []
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
    resultado = resultado.filter((n) => n.status === 'PENDING' || n.status === 'SCHEDULED')
  } else if (filtro.value === 'lidas') {
    resultado = resultado.filter((n) => n.status === 'SENT' || n.status === 'FAILED')
  }

  return resultado.sort((a, b) => {
    const dateA = new Date(b.createdAt).getTime()
    const dateB = new Date(a.createdAt).getTime()
    return dateA - dateB
  })
})

const naoLidas = computed(() => notificacoes.value.filter((n) => n.status === 'PENDING' || n.status === 'SCHEDULED').length)

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

const iconePorTipo = (item: NotificationItem) => {
  if (item.channel === 'TELEGRAM') {
    return `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19V5m0 14l-4-4m4 4l4-4" /></svg>`
  }
  if (item.channel === 'EMAIL') {
    return `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12H8m0 0l3-3m-3 3l3 3" /></svg>`
  }
  return `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19V5m0 14l-4-4m4 4l4-4" /></svg>`
}

const corPorCanal = (canal: NotificationItem['channel']) => {
  if (canal === 'TELEGRAM') return 'text-[#2DD4CF]'
  if (canal === 'EMAIL') return 'text-[#60A5FA]'
  return 'text-[#F59E0B]'
}

const bgPorCanal = (canal: NotificationItem['channel']) => {
  if (canal === 'TELEGRAM') return 'bg-[#065F46]/20'
  if (canal === 'EMAIL') return 'bg-[#1E3A5F]/20'
  return 'bg-[#92400E]/20'
}

const statusLabel = (status: NotificationItem['status']) => {
  if (status === 'PENDING') return 'Pendente'
  if (status === 'SCHEDULED') return 'Agendada'
  if (status === 'SENT') return 'Enviada'
  return 'Falhou'
}

const statusColor = (status: NotificationItem['status']) => {
  if (status === 'PENDING') return 'text-[#F59E0B]'
  if (status === 'SCHEDULED') return 'text-[#60A5FA]'
  if (status === 'SENT') return 'text-[#34D399]'
  return 'text-[#EF4444]'
}

const statusBg = (status: NotificationItem['status']) => {
  if (status === 'PENDING') return 'bg-[#92400E]/20'
  if (status === 'SCHEDULED') return 'bg-[#1E3A5F]/20'
  if (status === 'SENT') return 'bg-[#065F46]/20'
  return 'bg-[#991B1B]/20'
}

const abrirModalCriar = () => {
  abertoCriar.value = true
  tituloNotificacao.value = ''
  mensagemNotificacao.value = ''
  horarioNotificacao.value = ''
}

const fecharModalCriar = () => {
  abertoCriar.value = false
  tituloNotificacao.value = ''
  mensagemNotificacao.value = ''
  horarioNotificacao.value = ''
  erro.value = null
}

const handleCriarNotificacao = async () => {
  if (!tituloNotificacao.value.trim() || !mensagemNotificacao.value.trim()) return

  const tituloFinal = tituloNotificacao.value
  const messageFinal = mensagemNotificacao.value

  let scheduledAt: string | undefined = undefined
  if (horarioNotificacao.value) {
    scheduledAt = new Date(horarioNotificacao.value).toISOString()
  }

  try {
    await criarNotificacao({
      externalId: externalId.value,
      title: tituloFinal,
      message: messageFinal,
      channel: 'TELEGRAM',
      scheduledAt
    })
    fecharModalCriar()
    carregarNotificacoes()
  } catch (e: any) {
    erro.value = e?.message || 'Erro ao criar notificação'
  }
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

    <div class="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div>
        <h1 class="text-lg sm:text-xl md:text-2xl font-black tracking-wide text-[#EDEFF4]">
          Notificações
        </h1>
        <p class="text-xs sm:text-sm text-[#8A93A6] font-bold mt-1">
          Acompanhe suas notificações e crie lembretes
        </p>
      </div>
      <button
        class="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#1E3A5F] text-[#E3EBFB] border border-[#33517F] hover:bg-[#33517F] active:scale-95 transition font-black text-[10px] uppercase tracking-[0.12em] whitespace-nowrap"
        @click="abrirModalCriar"
      >
        <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Criar notificação
      </button>
    </div>

    <section v-if="notificacoes.length" class="rounded-2xl border border-[#1E293B] bg-[#1A2338] p-3 sm:p-4 md:p-5 mb-4 sm:mb-6">
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

        <div class="text-xs text-[#94A3B8] font-bold">
          {{ naoLidas }} {{ naoLidas === 1 ? 'não lida' : 'não lidas' }}
        </div>
      </div>
    </section>

    <section v-if="carregando" class="rounded-2xl border p-6 text-center border-[#1E293B] bg-[#1A2338]">
      <p class="font-black uppercase tracking-[0.16em] text-sm text-[#94A3B8]">Carregando...</p>
    </section>

    <section v-else-if="erro" class="rounded-2xl border p-6 text-center border-[#991B1B] bg-[#991B1B]/10">
      <p class="font-black text-[#EF4444]">{{ erro }}</p>
    </section>

    <template v-else>
      <section v-if="notificacoesFiltradas.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
        <div
          v-for="item in notificacoesFiltradas"
          :key="item.id"
          class="rounded-2xl border border-[#1E293B] bg-[#1A2338] p-4 sm:p-5 transition-colors"
          :class="{
            'border-l-4 border-l-[#F59E0B]': item.status === 'PENDING',
            'border-l-4 border-l-[#60A5FA]': item.status === 'SCHEDULED',
            'border-l-4 border-l-[#34D399]': item.status === 'SENT'
          }"
        >
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex items-center gap-3">
              <span
                class="inline-flex items-center justify-center w-10 h-10 rounded-xl border"
                :class="`${bgPorCanal(item.channel)} ${corPorCanal(item.channel)} border-[#1E293B]`"
              >
                <span v-html="iconePorTipo(item)" />
              </span>
              <div class="min-w-0">
                <p class="text-sm font-black text-[#F8FAFC] truncate">{{ item.title }}</p>
                <div class="flex items-center gap-2 flex-wrap">
                  <p class="text-[10px] text-[#94A3B8] font-bold">
                    Criada: {{ formatarData(new Date(item.createdAt)) }}
                  </p>
                  <span
                    class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider"
                    :class="`${statusBg(item.status)} ${statusColor(item.status)}`"
                  >
                    {{ statusLabel(item.status) }}
                  </span>
                </div>
                <p
                  v-if="item.scheduledAt"
                  class="text-[10px] text-[#60A5FA] font-bold mt-0.5"
                >
                  Agendada para: {{ format(new Date(item.scheduledAt), 'dd/MM/yyyy às HH:mm', { locale: ptBR }) }}
                </p>
                <p
                  v-else-if="item.status === 'PENDING'"
                  class="text-[10px] text-[#94A3B8] font-bold mt-0.5"
                >
                  Enviando em instante
                </p>
              </div>
            </div>
            <span
              class="text-[10px] font-black uppercase tracking-wider shrink-0"
              :class="item.channel === 'TELEGRAM' ? 'text-[#2DD4CF]' : item.channel === 'EMAIL' ? 'text-[#60A5FA]' : 'text-[#F59E0B]'"
            >
              {{ item.channel === 'TELEGRAM' ? 'Telegram' : item.channel === 'EMAIL' ? 'E-mail' : 'SMS' }}
            </span>
          </div>

          <p class="text-xs text-[#EDEFF4] font-semibold leading-relaxed mb-3">{{ item.message }}</p>

          <div class="pt-3 border-t border-[#1E293B] flex flex-col gap-1">
            <div v-if="item.sentAt" class="flex items-center gap-2">
              <span class="text-[10px] font-black uppercase tracking-wider bg-[#065F46]/20 text-[#34D399] rounded-md px-2 py-0.5">
                Enviada
              </span>
              <p class="text-[10px] text-[#94A3B8] font-bold">
                {{ format(new Date(item.sentAt), 'dd/MM/yyyy às HH:mm', { locale: ptBR }) }}
              </p>
            </div>
            <div v-else-if="item.status !== 'PENDING'" class="flex items-center gap-2">
              <span class="text-[10px] font-black uppercase tracking-wider bg-[#991B1B]/20 text-[#EF4444] rounded-md px-2 py-0.5">
                Não enviada
              </span>
              <p class="text-[10px] text-[#94A3B8] font-bold">
                Aguardando processamento
              </p>
            </div>
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
          Crie uma notificação para começar
        </p>
      </section>
    </template>

    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="abertoCriar"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
        @click.self="fecharModalCriar"
      >
        <div
          class="relative w-full max-w-lg mx-3 sm:mx-4 rounded-2xl border border-[#1E293B] bg-[#1A2338] p-5 sm:p-6 shadow-2xl shadow-[#0F1729]/70"
        >
          <div class="flex items-center gap-3 mb-4">
            <span
              class="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-[#1E293B] bg-[#065F46]/20 text-[#2DD4CF]"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19V5m0 14l-4-4m4 4l4-4" />
              </svg>
            </span>
            <h3 class="text-sm sm:text-base font-black uppercase tracking-wider text-[#F8FAFC]">
              Nova notificação
            </h3>
            <span
              class="ml-auto inline-flex items-center gap-1 rounded-md bg-[#065F46]/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#2DD4CF]"
            >
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C7.58 2 4 4.92 4 9c0 3.73 2.96 6.83 7 7.7V22h2v-5.3c3.82-.86 6.62-4.37 6.62-8.7A5.99 5.99 0 0012 4z" />
              </svg>
              Telegram
            </span>
          </div>

          <div class="space-y-4">
            <div>
              <label
                class="block text-[10px] font-black uppercase tracking-wider text-[#94A3B8] mb-1"
              >
                Título
              </label>
              <input
                v-model="tituloNotificacao"
                type="text"
                placeholder="Ex: Lembrete de agendamento"
                class="field-input"
              />
            </div>

            <div>
              <label
                class="block text-[10px] font-black uppercase tracking-wider text-[#94A3B8] mb-1"
              >
                Mensagem
              </label>
              <textarea
                v-model="mensagemNotificacao"
                rows="3"
                placeholder="Digite a mensagem da notificação..."
                class="field-input resize-none"
              />
            </div>

            <div>
              <label
                class="block text-[10px] font-black uppercase tracking-wider text-[#94A3B8] mb-1"
              >
                Horário
              </label>
              <div class="relative">
                <input
                  v-model="horarioNotificacao"
                  type="datetime-local"
                  class="field-input pl-10"
                />
                <svg
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#60A5FA]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2zM12 11a3 3 0 100 6 3 3 0 000-6z"
                  />
                </svg>
              </div>
              <p
                v-if="horarioNotificacao"
                class="mt-1.5 text-[10px] text-[#60A5FA] font-bold"
              >
                Enviando em: {{ format(new Date(horarioNotificacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) }}
              </p>
              <p v-else class="mt-1.5 text-[10px] text-[#94A3B8] font-bold">
                Deixe em branco para enviar agora
              </p>
            </div>
          </div>

          <div class="flex gap-3 mt-6">
            <button
              class="flex-1 px-4 py-2.5 rounded-xl bg-[#1E3A5F] text-[#E3EBFB] border border-[#33517F] hover:bg-[#274980] active:scale-95 transition font-black text-xs uppercase tracking-[0.12em] disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!tituloNotificacao.trim() || !mensagemNotificacao.trim()"
              @click="handleCriarNotificacao"
            >
              Confirmar
            </button>
            <button
              class="flex-1 px-4 py-2.5 rounded-xl bg-[#4A3D2A] text-[#FDE68A] border border-[#6E5A3A] hover:bg-[#6E5A3ABA] active:scale-95 transition font-black text-xs uppercase tracking-[0.12em]"
              @click="fecharModalCriar"
            >
              Cancelar
            </button>
          </div>

          <button
            class="absolute top-3 right-3 p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition"
            @click="fecharModalCriar"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.field-input {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid #334155;
  background-color: #0f1729;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: #edefee;
  outline: none;
}
.field-input::placeholder {
  color: #94a3b8;
}
.field-input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 1px #60a5fa;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
