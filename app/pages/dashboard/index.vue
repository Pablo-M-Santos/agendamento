<script setup lang="ts">
import { Bars3Icon, CalendarDaysIcon, ChartBarIcon } from '@heroicons/vue/24/outline'
import { format } from 'date-fns'
import type { Timestamp } from 'firebase/firestore'

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

const formatarData = (ts: Timestamp) => format(ts.toDate(), 'dd/MM/yyyy HH:mm')
const formatarDiaParaRota = (ts: Timestamp) => format(ts.toDate(), 'yyyy-MM-dd')
</script>

<template>
  <div
    class="h-screen p-5 overflow-hidden transition-colors"
    :class="isLightTheme ? 'bg-[#F4F8FF] text-[#0B1F3A]' : 'bg-[#003D7A] text-white'"
  >
    <div class="relative mb-6 h-[56px] flex items-center justify-center">
      <button
        class="absolute left-0 p-2 rounded-xl transition"
        :class="isLightTheme ? 'hover:bg-[#E8F1FF]' : 'hover:bg-white/10'"
        :aria-label="t('dashboard.openSidebar')"
        @click="isSidebarOpen = true"
      >
        <Bars3Icon class="w-7 h-7" />
      </button>

      <div class="text-center px-12">
        <p
          class="text-base font-black truncate"
          :class="isLightTheme ? 'text-[#0B1F3A]' : 'text-white'"
        >
          {{ saudacaoDashboard }}
        </p>
      </div>

      <NuxtLink
        to="/profile"
        class="absolute right-0 w-11 h-11 rounded-[50%] overflow-hidden border flex items-center justify-center hover:scale-105 transition"
        :class="isLightTheme ? 'border-[#D8E7FF] bg-white' : 'border-white/20 bg-white/10'"
        :aria-label="t('dashboard.goProfile')"
      >
        <img
          v-if="user?.photoURL"
          :src="user.photoURL"
          alt="Foto do usuário"
          class="w-full h-full object-cover"
        />
        <span
          v-else
          class="text-sm font-black"
          :class="isLightTheme ? 'text-[#003D7A]' : 'text-white'"
        >
          {{ inicialUsuario }}
        </span>
      </NuxtLink>
    </div>

    <DashboardSidebar v-model="isSidebarOpen" />

    <div class="grid grid-cols-2 gap-6 mb-10">
      <NuxtLink
        to="/schedule"
        class="relative overflow-hidden rounded-3xl p-5 w-[158px] h-[103px] bg-gradient-to-br from-[#00D3B8] to-[#00BFA5] shadow-xl active:scale-95 transition"
      >
        <div class="relative h-full flex flex-col justify-between">
          <div class="flex justify-end">
            <span class="p-2 rounded-full bg-white/15">
              <CalendarDaysIcon class="w-5 h-5 text-white/95" />
            </span>
          </div>
          <h3 class="font-black text-base tracking-wide text-white">
            {{ t('dashboard.scheduleCard') }}
          </h3>
        </div>
      </NuxtLink>

      <NuxtLink
        to="/reports"
        class="relative overflow-hidden rounded-3xl p-5 w-[158px] h-[103px] bg-gradient-to-br from-[#4F9CFF] to-[#2F7BFF] shadow-xl active:scale-95 transition"
      >
        <div class="relative h-full flex flex-col justify-between">
          <div class="flex justify-end">
            <span class="p-2 rounded-full bg-white/15">
              <ChartBarIcon class="w-5 h-5 text-white/95" />
            </span>
          </div>
          <h3 class="font-black text-base tracking-wide text-white">
            {{ t('dashboard.reportsCard') }}
          </h3>
        </div>
      </NuxtLink>
    </div>

    <section>
      <div class="flex items-center mb-4">
        <h3 class="font-black text-sm" :class="isLightTheme ? 'text-[#0B1F3A]' : 'text-white/90'">
          {{ t('dashboard.recentServices') }}
        </h3>
        <div class="flex-1 h-[1px] ml-4" :class="isLightTheme ? 'bg-[#D8E7FF]' : 'bg-white/15'" />
      </div>

      <div v-if="ultimosServicos.length" class="space-y-3">
        <NuxtLink
          v-for="item in ultimosServicos"
          :key="item.id"
          :to="{
            path: '/schedule',
            query: {
              data: formatarDiaParaRota(item.data),
              agendamento: item.id
            }
          }"
          class="block p-4 rounded-2xl shadow-md active:scale-[0.99] transition"
          :class="isLightTheme ? 'bg-[#003D7A] text-white' : 'bg-white/95 text-[#0B1F3A]'"
        >
          <div class="flex items-center justify-between gap-3">
            <div
              class="inline-flex items-center gap-2 px-3 py-2 rounded-xl"
              :class="isLightTheme ? 'bg-white/15 text-white' : 'bg-[#E8F1FF] text-[#003D7A]'"
            >
              <span class="text-[10px] font-black uppercase tracking-[0.14em]">{{
                t('schedule.time')
              }}</span>
              <span class="text-sm font-black">{{ format(item.data.toDate(), 'HH:mm') }}</span>
            </div>

            <span
              v-if="item.materialPronto === true"
              class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-emerald-400 text-[#003D7A]"
            >
              {{ t('schedule.materialReady') }}
            </span>
            <span
              v-else-if="item.materialPronto === false"
              class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-amber-300 text-[#4A2C00]"
            >
              {{ t('schedule.noMaterial') }}
            </span>
            <span
              v-else
              class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg"
              :class="isLightTheme ? 'bg-white/15 text-white/80' : 'bg-[#E8F1FF] text-[#5B6B8A]'"
            >
              {{ t('schedule.noStatus') }}
            </span>
          </div>

          <div
            class="mt-3 rounded-xl border p-3"
            :class="isLightTheme ? 'border-white/20 bg-white/10' : 'border-[#D8E7FF] bg-[#F4F8FF]'"
          >
            <p
              class="text-[10px] font-black uppercase tracking-[0.16em]"
              :class="isLightTheme ? 'text-white/70' : 'text-[#5B6B8A]'"
            >
              {{ t('schedule.address') }}
            </p>
            <p
              class="text-sm font-bold mt-1 leading-relaxed"
              :class="isLightTheme ? 'text-white' : 'text-[#0B1F3A]'"
            >
              {{ item.endereco || t('schedule.addressNotInformed') }}
              <template v-if="item.numeroCasa">, Casa {{ item.numeroCasa }}</template>
            </p>
          </div>

          <div class="mt-3 flex justify-end">
            <span
              v-if="item.servicoConcluido === true"
              class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-[#00D3B8] text-[#003D7A]"
            >
              {{ t('schedule.serviceCompleted') }}
            </span>
            <span
              v-else-if="item.servicoConcluido === false"
              class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg"
              :class="isLightTheme ? 'bg-white/20 text-white' : 'bg-[#DDE7FA] text-[#3F5170]'"
            >
              {{ t('schedule.serviceOpen') }}
            </span>
            <span
              v-else
              class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg"
              :class="isLightTheme ? 'bg-white/15 text-white/80' : 'bg-[#E8F1FF] text-[#5B6B8A]'"
            >
              {{ t('schedule.serviceNotCompleted') }}
            </span>
          </div>

          <div
            class="mt-3 text-[11px] font-semibold text-right"
            :class="isLightTheme ? 'text-white/70' : 'text-[#5B6B8A]'"
          >
            {{ formatarData(item.data) }}
          </div>
        </NuxtLink>
      </div>

      <div
        v-else
        class="rounded-2xl p-6 text-center border"
        :class="
          isLightTheme
            ? 'bg-white text-[#5B6B8A] border-[#D8E7FF]'
            : 'bg-white/10 text-white/80 border-white/15'
        "
      >
        {{ t('dashboard.noRecentServices') }}
      </div>
    </section>
  </div>
</template>
