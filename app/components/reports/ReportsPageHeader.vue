<script setup lang="ts">
import { ArrowLeftIcon, ChartBarIcon } from '@heroicons/vue/24/outline'

defineProps<{
  isLightTheme: boolean
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
  <header class="mb-7">
    <div class="grid grid-cols-3 items-center mb-4">
      <NuxtLink
        to="/dashboard"
        class="justify-self-start p-2 rounded-xl transition"
        :class="isLightTheme ? 'hover:bg-[#E8F1FF]' : 'hover:bg-white/10'"
        :aria-label="backToDashboardLabel"
      >
        <ArrowLeftIcon class="w-7 h-7" />
      </NuxtLink>

      <h1 class="text-base font-black text-center">{{ title }}</h1>

      <div />
    </div>

    <div class="flex items-center gap-3">
      <span
        class="w-10 h-10 rounded-xl border flex items-center justify-center"
        :class="
          isLightTheme ? 'bg-[#003D7A] border-white/20 text-white' : 'bg-white/15 border-white/20'
        "
      >
        <ChartBarIcon class="w-5 h-5" />
      </span>
      <div>
        <h2 class="text-xl font-black tracking-wide">{{ title }}</h2>
        <p class="text-xs uppercase tracking-[0.16em] font-black tracking-wide">
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
            ? isLightTheme
              ? 'bg-[#00D3B8] text-[#003D7A] border-[#00D3B8] ring-2 ring-white/40 shadow-[0_6px_18px_rgba(0,211,184,0.35)]'
              : 'bg-[#00D3B8] text-[#003D7A] border-[#00D3B8]'
            : isLightTheme
              ? 'bg-[#003D7A] border-white/20 text-white hover:bg-[#004E99] hover:border-white/35'
              : 'bg-white/10 border-white/25 text-white'
        "
        @click="emit('selectPeriod', option.key)"
      >
        {{ option.label }}
      </button>
    </div>
  </header>
</template>
