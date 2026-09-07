<script setup lang="ts">
defineProps<{
  title: string
}>()

const emit = defineEmits<{
  back: []
}>()
</script>

<template>
  <header
    class="sticky top-0 z-20 px-5 sm:px-8 lg:px-12 py-4 sm:py-6 flex items-center gap-4 border-b backdrop-blur-sm border-[#262E42] bg-[#141A28]/80"
  >
    <button
      class="p-2 rounded-full transition-colors active:scale-95 hover:bg-white/5"
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