<script setup lang="ts">
defineProps<{
  isLightTheme: boolean
  title: string
}>()

const emit = defineEmits<{
  back: []
}>()
</script>

<template>
  <header
    class="sticky top-0 z-20 p-6 flex items-center gap-4 border-b backdrop-blur-sm"
    :class="isLightTheme ? 'border-[#D8E7FF]' : 'border-white/10'"
  >
    <button
      class="p-2 rounded-full transition-colors active:scale-95"
      :class="isLightTheme ? 'hover:bg-[#E8F1FF]' : 'hover:bg-white/10'"
      @click="emit('back')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <h1 class="text-xl font-black">{{ title }}</h1>
  </header>
</template>
