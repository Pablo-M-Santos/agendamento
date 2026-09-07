<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DashboardStatsCards from '~/components/dashboard/DashboardStatsCards.vue'
import DashboardQuickLinks from '~/components/dashboard/DashboardQuickLinks.vue'

definePageMeta({ middleware: 'auth', layout: 'app' })

const { user } = useAuth()
const { listarAgendamentos, atualizarStatus } = useAgendamentos()
const { t } = useAppI18n()

const agendamentos = ref<Agendamento[]>([])
const isSidebarOpen = ref(false)
const selectedAgendamento = ref<Agendamento | null>(null)
const isDetailsModalOpen = ref(false)

onMounted(() => {
  isSidebarOpen.value = window.matchMedia('(min-width: 1024px)').matches
})

const isGoogleLogin = computed(() => {
  return user.value?.providerData?.some((provider) => provider.providerId === 'google.com') ?? false
})

const primeiroNomeGoogle = computed(() => {
  if (!isGoogleLogin.value) return ''
  const nome = user.value?.displayName?.trim()
  if (!nome) return ''
  return nome.split(' ')[0] || ''
})

const saudacaoDashboard = computed(() => {
  if (primeiroNomeGoogle.value) {
    return t('dashboard.welcomeName', { name: primeiroNomeGoogle.value })
  }
  return t('dashboard.welcome')
})

const inicialUsuario = computed(() => {
  const nome = user.value?.displayName?.trim()
  if (!nome) return 'U'
  return nome.charAt(0).toUpperCase()
})

const carregar = async () => {
  if (!user.value) return
  agendamentos.value = await listarAgendamentos()
}

watch(
  () => user.value,
  async (newUser) => {
    if (newUser) {
      await carregar()
    }
  },
  { immediate: true }
)

const ultimosServicos = computed(() => {
  return [...agendamentos.value].sort((a, b) => b.data.toMillis() - a.data.toMillis()).slice(0, 5)
})

const labelsRecentes = computed(() => ({
  recentServices: t('dashboard.recentServices'),
  noRecentServices: t('dashboard.noRecentServices'),
  time: t('schedule.time'),
  address: t('schedule.address'),
  addressNotInformed: t('schedule.addressNotInformed'),
  materialReady: t('schedule.materialReady'),
  noMaterial: t('schedule.noMaterial'),
  noStatus: t('schedule.noStatus'),
  serviceCompleted: t('schedule.serviceCompleted'),
  serviceOpen: t('schedule.serviceOpen'),
  serviceNotCompleted: t('schedule.serviceNotCompleted')
}))

const handleViewItem = (item: Agendamento) => {
  selectedAgendamento.value = item
  isDetailsModalOpen.value = true
}

const toggleServicoConcluido = async (item: Agendamento) => {
  if (!item.id) return
  const novoStatus = item.servicoConcluido === true ? false : true
  await atualizarStatus(item.id, { servicoConcluido: novoStatus })
  await carregar()
}

const handleToggleStatus = async (item: Agendamento) => {
  await toggleServicoConcluido(item)
  isDetailsModalOpen.value = false
}

const statsTotal = computed(() => agendamentos.value.length)
const statsCompleted = computed(() => agendamentos.value.filter((a) => a.servicoConcluido === true).length)
const statsOpen = computed(() => agendamentos.value.filter((a) => a.servicoConcluido !== true).length)
const hoje = new Date()
hoje.setHours(0, 0, 0, 0)
const statsLate = computed(() =>
  agendamentos.value.filter((a) => {
    const data = a.data.toDate()
    data.setHours(0, 0, 0, 0)
    return data < hoje && a.servicoConcluido !== true
  }).length
)
</script>

<template>
  <div class="h-full px-4  sm:px-8 lg:px-12 py-5 sm:py-8 overflow-y-auto overflow-x-hidden text-[#EDEFF4] bg-[#141A28]" :class="{ 'lg:pl-[22rem]': isSidebarOpen }">
      <DashboardTopBar
        :greeting="saudacaoDashboard"
        :photo-url="user?.photoURL"
        :user-initial="inicialUsuario"
        :open-sidebar-label="t('dashboard.openSidebar')"
        :go-profile-label="t('dashboard.goProfile')"
        :sidebar-open="isSidebarOpen"
        @open-sidebar="isSidebarOpen = !isSidebarOpen"
      />

      <DashboardSidebar v-model="isSidebarOpen" />

      <DashboardStatsCards
        title="Resumo"
        :total="statsTotal"
        :completed="statsCompleted"
        :open="statsOpen"
        :late="statsLate"
      />

      <DashboardQuickLinks
        title="Acesso rapido"
        :schedule-label="t('dashboard.scheduleCard')"
        :reports-label="t('dashboard.reportsCard')"
        :notifications-label="t('dashboard.notificationsCard')"
        :history-label="t('dashboard.historyCard')"
      />

      <DashboardRecentServicesSection
        :items="ultimosServicos"
        :labels="labelsRecentes"
        @view-item="handleViewItem"
      />

      <ScheduleServiceDetailsModal
        v-model="isDetailsModalOpen"
        :agendamento="selectedAgendamento"
        @toggle-status="handleToggleStatus"
      />
  </div>
</template>
