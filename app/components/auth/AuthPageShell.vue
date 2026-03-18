<script setup lang="ts">
defineProps<{
  isLightTheme: boolean
  title: string
  subtitle: string
}>()
</script>

<template>
  <div
    class="h-dvh flex justify-center overflow-hidden transition-colors"
    :class="isLightTheme ? 'bg-[#F4F8FF] text-[#0B1F3A]' : 'bg-[#003D7A] text-white'"
  >
    <div class="w-full max-w-md text-center px-6 pt-20">
      <img src="/logo.png" alt="Logo" class="w-20 mx-auto mb-4" />

      <h1 class="text-3xl font-bold" :class="isLightTheme ? 'text-[#0B1F3A]' : 'text-white'">
        {{ title }}
      </h1>
      <p class="mb-10" :class="isLightTheme ? 'text-[#5B6B8A]' : 'text-gray-300'">
        {{ subtitle }}
      </p>

      <slot />
    </div>
  </div>
</template>
