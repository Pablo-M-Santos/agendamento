<script setup lang="ts">
import { CalendarDaysIcon, ChartBarIcon } from '@heroicons/vue/24/outline'

defineProps<{
  scheduleLabel: string
  reportsLabel: string
}>()
</script>

<template>
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
          {{ scheduleLabel }}
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
          {{ reportsLabel }}
        </h3>
      </div>
    </NuxtLink>
  </div>
</template>
