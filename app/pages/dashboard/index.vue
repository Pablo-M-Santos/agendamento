<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'app' })

const { user } = useAuth()
const { listarAgendamentos } = useAgendamentos()
const { settings } = useUserSettings()
const { t } = useAppI18n()

const agendamentos = ref<Agendamento[]>([])
const isSidebarOpen = ref(false)
const isLightTheme = computed(() => settings.value.theme === 'light')

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
</script>

<template>
  <div
    class="h-screen p-5 overflow-hidden transition-colors"
    :class="isLightTheme ? 'bg-[#F4F8FF] text-[#0B1F3A]' : 'bg-[#003D7A] text-white'"
  >
    <DashboardTopBar
      :is-light-theme="isLightTheme"
      :greeting="saudacaoDashboard"
      :photo-url="user?.photoURL"
      :user-initial="inicialUsuario"
      :open-sidebar-label="t('dashboard.openSidebar')"
      :go-profile-label="t('dashboard.goProfile')"
      @open-sidebar="isSidebarOpen = true"
    />

    <DashboardSidebar v-model="isSidebarOpen" />

    <DashboardQuickActions
      :schedule-label="t('dashboard.scheduleCard')"
      :reports-label="t('dashboard.reportsCard')"
    />

    <DashboardRecentServicesSection
      :is-light-theme="isLightTheme"
      :items="ultimosServicos"
      :labels="labelsRecentes"
    />
  </div>
</template>
