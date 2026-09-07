<script setup lang="ts">
import { CalendarDaysIcon, ChartBarIcon, BellIcon, ClockIcon } from '@heroicons/vue/24/outline'

defineProps<{
  scheduleLabel: string
  reportsLabel: string
  notificationsLabel: string
  historyLabel: string
  title?: string
}>()

const { t } = useAppI18n()
</script>

<template>
  <section class="mb-6 sm:mb-8">
    <div class="flex items-center mb-4 sm:mb-5">
      <h3 class="font-black text-sm sm:text-base text-[#8A93A6]">
        {{ title || t('dashboard.quickLinks.title') }}
      </h3>
      <div class="flex-1 h-[1px] ml-4 bg-[#262E42]" />
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
    <NuxtLink
      to="/schedule"
      class="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 w-full h-[90px] sm:h-[103px] bg-gradient-to-br from-[#1B4F4A] to-[#153D39] shadow-xl shadow-[#1B4F4A]/20 active:scale-95 transition hover:shadow-[#2C6E67]/30"
    >
      <div class="relative h-full flex flex-col justify-between">
        <div class="flex justify-end">
          <span class="p-2 rounded-full bg-[#2C6E67]">
            <CalendarDaysIcon class="w-5 h-5 text-[#DFF7F0]" />
          </span>
        </div>
        <h3 class="font-black text-sm sm:text-base tracking-wide text-[#EAFBF6]">
          {{ scheduleLabel }}
        </h3>
      </div>
    </NuxtLink>

    <NuxtLink
      to="/reports"
      class="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 w-full h-[90px] sm:h-[103px] bg-gradient-to-br from-[#233350] to-[#1C2A45] shadow-xl shadow-[#233350]/20 active:scale-95 transition hover:shadow-[#33517F]/30"
    >
      <div class="relative h-full flex flex-col justify-between">
        <div class="flex justify-end">
          <span class="p-2 rounded-full bg-[#33517F]">
            <ChartBarIcon class="w-5 h-5 text-[#E3EBFB]" />
          </span>
        </div>
        <h3 class="font-black text-sm sm:text-base tracking-wide text-[#EAF0FB]">
          {{ reportsLabel }}
        </h3>
      </div>
    </NuxtLink>

    <NuxtLink
      to="/notifications"
      class="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 w-full h-[90px] sm:h-[103px] bg-gradient-to-br from-[#3D2A2A] to-[#332020] shadow-xl shadow-[#3D2A2A]/20 active:scale-95 transition hover:shadow-[#5C3A3A]/30"
    >
      <div class="relative h-full flex flex-col justify-between">
        <div class="flex justify-end">
          <span class="p-2 rounded-full bg-[#5C3A3A]">
            <BellIcon class="w-5 h-5 text-[#F5A89C]" />
          </span>
        </div>
        <h3 class="font-black text-sm sm:text-base tracking-wide text-[#F5A89C]">
          {{ notificationsLabel }}
        </h3>
      </div>
    </NuxtLink>

    <NuxtLink
      to="/history"
      class="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 w-full h-[90px] sm:h-[103px] bg-gradient-to-br from-[#4A3D2A] to-[#3A3020] shadow-xl shadow-[#4A3D2A]/20 active:scale-95 transition hover:shadow-[#6E5A3A]/30"
    >
      <div class="relative h-full flex flex-col justify-between">
        <div class="flex justify-end">
          <span class="p-2 rounded-full bg-[#6E5A3A]">
            <ClockIcon class="w-5 h-5 text-[#F5C89C]" />
          </span>
        </div>
        <h3 class="font-black text-sm sm:text-base tracking-wide text-[#F5C89C]">
          {{ historyLabel }}
        </h3>
      </div>
    </NuxtLink>
  </div>
</section>
</template>
