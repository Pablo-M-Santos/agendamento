<script setup lang="ts">
import { ChartBarIcon } from '@heroicons/vue/24/outline'

defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <header class="mb-4 sm:mb-6">
    <div class="flex items-center gap-2 sm:gap-3">
      <span
        class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center bg-[#1E2A3D] border-[#262E42]"
      >
        <ChartBarIcon class="w-4 h-4 sm:w-5 sm:h-5 text-[#4FD1C5]" />
      </span>
      <div>
        <h1 class="text-lg sm:text-xl md:text-2xl font-black tracking-wide text-[#EDEFF4]">{{ title }}</h1>
        <p class="text-[10px] sm:text-xs uppercase tracking-[0.16em] font-black text-[#8A93A6]">
          {{ subtitle }}
        </p>
      </div>
    </div>
  </header>
</template>