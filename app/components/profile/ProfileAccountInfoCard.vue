<script setup lang="ts">
defineProps<{
  isLightTheme: boolean
  title: string
  providerLabel: string
  providerValue: string
  uidLabel: string
  uidValue: string
}>()
</script>

<template>
  <section
    class="p-5 rounded-3xl border transition-colors"
    :class="isLightTheme ? 'border-[#D8E7FF] bg-white' : 'border-white/15 bg-white/10'"
  >
    <h3
      class="text-xs font-black uppercase tracking-[0.2em] mb-4"
      :class="isLightTheme ? 'text-[#5B6B8A]' : 'text-white/80'"
    >
      {{ title }}
    </h3>

    <div class="space-y-3 text-sm">
      <div class="flex items-center justify-between gap-3">
        <span :class="isLightTheme ? 'text-[#5B6B8A]' : 'text-white/70'">
          {{ providerLabel }}
        </span>
        <span class="font-bold" :class="isLightTheme ? 'text-[#0B1F3A]' : 'text-white'">
          {{ providerValue }}
        </span>
      </div>

      <div class="flex items-center justify-between gap-3">
        <span :class="isLightTheme ? 'text-[#5B6B8A]' : 'text-white/70'">
          {{ uidLabel }}
        </span>
        <span class="font-bold" :class="isLightTheme ? 'text-[#0B1F3A]' : 'text-white'">
          {{ uidValue }}
        </span>
      </div>
    </div>
  </section>
</template>
