<script setup>
const { initAuth } = useAuth()
const { initUserSettings } = useUserSettings()
initAuth()
initUserSettings()
</script>

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
