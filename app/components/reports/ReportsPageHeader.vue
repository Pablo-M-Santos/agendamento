<script setup lang="ts">
import { ArrowLeftIcon, ChartBarIcon } from '@heroicons/vue/24/outline'

defineProps<{
  title: string
  subtitle: string
  backToDashboardLabel: string
  periodOptions: Array<{ key: string; label: string }>
  selectedPeriod: string
}>()

const emit = defineEmits<{
  selectPeriod: [period: string]
}>()
</script>

<template>
  <header class="mb-6 sm:mb-8">
    <div class="grid grid-cols-3 items-center mb-4">
      <NuxtLink
        to="/dashboard"
        class="justify-self-start p-2 rounded-xl transition hover:bg-white/5"
        :aria-label="backToDashboardLabel"
      >
        <ArrowLeftIcon class="w-7 h-7 text-[#EDEFF4]" />
      </NuxtLink>

      <h1 class="text-base sm:text-lg font-black text-center text-[#EDEFF4]">{{ title }}</h1>

      <div />
    </div>

    <div class="flex items-center gap-3">
      <span
        class="w-10 h-10 rounded-xl border flex items-center justify-center bg-[#1E2A3D] border-[#262E42]"
      >
        <ChartBarIcon class="w-5 h-5 text-[#4FD1C5]" />
      </span>
      <div>
        <h2 class="text-xl sm:text-2xl font-black tracking-wide text-[#EDEFF4]">{{ title }}</h2>
        <p class="text-xs uppercase tracking-[0.16em] font-black text-[#8A93A6]">
          {{ subtitle }}
        </p>
      </div>
    </div>

    <div class="mt-5 flex gap-2 overflow-x-auto no-scrollbar">
      <button
        v-for="option in periodOptions"
        :key="option.key"
        class="px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-[0.16em] whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        :class="
          selectedPeriod === option.key
            ? 'bg-[#1B4F4A] text-[#EAFBF6] border-[#2C6E67]'
            : 'bg-[#1E2A3D] border-[#262E42] text-[#EDEFF4]'
        "
        @click="emit('selectPeriod', option.key)"
      >
        {{ option.label }}
      </button>
    </div>
  </header>
</template>