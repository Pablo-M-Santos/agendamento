<script setup lang="ts">
import { CalendarDaysIcon, ChartBarIcon } from '@heroicons/vue/24/outline'

defineProps<{
  scheduleLabel: string
  reportsLabel: string
}>()
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
    <NuxtLink
      to="/schedule"
      class="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 w-full h-[90px] sm:h-[103px] bg-[#1B4F4A] shadow-xl shadow-[#1B4F4A]/20 active:scale-95 transition"
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
      class="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 w-full h-[90px] sm:h-[103px] bg-[#233350] shadow-xl shadow-[#233350]/20 active:scale-95 transition"
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
  </div>
</template>
