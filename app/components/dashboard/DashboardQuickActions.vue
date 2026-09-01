<script setup lang="ts">
import { CalendarDaysIcon, ChartBarIcon } from '@heroicons/vue/24/outline'

defineProps<{
  scheduleLabel: string
  reportsLabel: string
}>()
</script>

<template>
  <div class="grid grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
    <NuxtLink
      to="/schedule"
      class="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 w-full h-[90px] sm:h-[103px] bg-gradient-to-br from-[#4da69c] to-[#268c80] shadow-xl active:scale-95 transition"
    >
      <div class="relative h-full flex flex-col justify-between">
        <div class="flex justify-end">
          <span class="p-2 rounded-full bg-white/15">
            <CalendarDaysIcon class="w-5 h-5 text-white/95" />
          </span>
        </div>
        <h3 class="font-black text-sm sm:text-base tracking-wide text-white">
          {{ scheduleLabel }}
        </h3>
      </div>
    </NuxtLink>

    <NuxtLink
      to="/reports"
      class="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 w-full h-[90px] sm:h-[103px] bg-gradient-to-br from-[#003733] to-[#002e29] border border-[rgba(255,255,255,0.1)] shadow-xl active:scale-95 transition"
    >
      <div class="relative h-full flex flex-col justify-between">
        <div class="flex justify-end">
          <span class="p-2 rounded-full bg-[#4da69c]/20">
            <ChartBarIcon class="w-5 h-5 text-[#80bfb8]" />
          </span>
        </div>
        <h3 class="font-black text-sm sm:text-base tracking-wide text-white">
          {{ reportsLabel }}
        </h3>
      </div>
    </NuxtLink>
  </div>
</template>
