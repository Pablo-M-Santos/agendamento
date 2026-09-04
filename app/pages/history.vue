<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DashboardTopBar from '~/components/dashboard/DashboardTopBar.vue'
import DashboardSidebar from '~/components/DashboardSidebar.vue'
import { ClockIcon } from '@heroicons/vue/24/outline'

definePageMeta({ middleware: 'auth', layout: 'app' })

const { user } = useAuth()
const { t } = useAppI18n()

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
</script>

<template>
  <div
    class="h-full px-5 sm:px-8 lg:px-12 py-5 sm:py-8 overflow-y-auto overflow-x-hidden transition-colors bg-[#141A28] text-[#EDEFF4]"
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

    <div class="flex items-center gap-4 mb-4 sm:mb-5">
      <h3 class="font-black text-sm sm:text-base text-[#8A93A6]">
        {{ t('sidebar.history') }}
      </h3>
      <div class="flex-1 h-[1px] bg-[#262E42]" />
    </div>

    <div class="rounded-2xl p-8 sm:p-12 text-center border border-[#262E42] bg-[#1A2132]">
      <div class="w-16 h-16 rounded-full bg-[#262E42] flex items-center justify-center mx-auto mb-4">
        <ClockIcon class="w-8 h-8 text-[#8A93A6]" />
      </div>
      <p class="text-[#EDEFF4] font-black text-sm sm:text-base">{{ t('reports.noData') }}</p>
    </div>
  </div>
</template>
