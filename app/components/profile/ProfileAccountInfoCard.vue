<script setup lang="ts">
defineProps<{
  title: string
  providerLabel: string
  providerValue: string
  uidLabel: string
  uidValue: string
}>()
</script>

<template>
  <section
    class="p-5 rounded-3xl border transition-colors border-[#262E42] bg-[#1A2132]"
  >
    <h3
      class="text-xs font-black uppercase tracking-[0.2em] mb-4 text-[#8A93A6]"
    >
      {{ title }}
    </h3>

    <div class="space-y-3 text-sm">
      <div class="flex items-center justify-between gap-3">
        <span class="text-[#6E7789]">
          {{ providerLabel }}
        </span>
        <span class="font-bold text-[#EDEFF4]">
          {{ providerValue }}
        </span>
      </div>

      <div class="flex items-center justify-between gap-3">
        <span class="text-[#6E7789]">
          {{ uidLabel }}
        </span>
        <span class="font-bold text-[#EDEFF4]">
          {{ uidValue }}
        </span>
      </div>
    </div>
  </section>
</template>