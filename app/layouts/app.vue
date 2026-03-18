<script setup>
const { settings } = useUserSettings()
const isLightTheme = computed(() => settings.value.theme === 'light')
</script>

<template>
  <div
    class="min-h-screen flex flex-col transition-colors"
    :class="isLightTheme ? 'bg-[#F4F8FF] text-[#0B1F3A]' : 'bg-[#003D7A] text-white'"
  >
    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</template>
