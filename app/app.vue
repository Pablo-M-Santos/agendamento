<script setup>
const { initAuth } = useAuth()
const { initUserSettings } = useUserSettings()
const { initTheme } = useTheme()

initAuth()
initUserSettings()
initTheme()
</script>

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
