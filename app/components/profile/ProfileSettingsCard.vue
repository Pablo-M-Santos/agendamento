<script setup lang="ts">
withDefaults(
  defineProps<{
    isLightTheme: boolean
    title: string
    options: Array<{ value: string; label: string }>
    selectedValue: string
    disabled: boolean
    feedback: string
    columnsClass?: string
  }>(),
  {
    columnsClass: 'grid-cols-1 sm:grid-cols-2'
  }
)

const emit = defineEmits<{
  select: [value: string]
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

    <div class="grid gap-2" :class="columnsClass">
      <button
        v-for="option in options"
        :key="option.value"
        class="w-full p-3 rounded-2xl border text-left font-bold text-sm transition active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
        :disabled="disabled"
        :aria-pressed="selectedValue === option.value"
        :class="
          selectedValue === option.value
            ? isLightTheme
              ? 'bg-[#003D7A] border-[#003D7A] text-white'
              : 'bg-white border-white text-[#003D7A]'
            : isLightTheme
              ? 'bg-[#F4F8FF] border-[#D8E7FF] text-[#0B1F3A]'
              : 'bg-white/10 border-white/20 text-white'
        "
        @click="emit('select', option.value)"
      >
        {{ option.label }}
      </button>
    </div>

    <p class="text-xs mt-3" :class="isLightTheme ? 'text-[#5B6B8A]' : 'text-white/70'">
      {{ feedback }}
    </p>
  </section>
</template>
