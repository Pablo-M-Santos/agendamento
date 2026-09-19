<script setup>
const { initAuth } = useAuth()
const { initUserSettings } = useUserSettings()
const { initTheme } = useTheme()

const retry = ref(false)

function handleRetry () {
  retry.value = false
  navigateTo('/')
}

initAuth()
initUserSettings()
initTheme()
</script>

<template>
  <UApp>
    <NuxtErrorBoundary>
      <NuxtPage :key="retry" />
      <template #error="{ error }">
        <div class="flex flex-col items-center justify-center min-h-screen bg-[#0F1729] text-[#EDEFF4] px-6">
          <div class="w-16 h-16 rounded-full bg-[#991B1B]/30 border border-[#991B1B] flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-[#FCA5A5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 class="text-xl font-black text-[#F8FAFC] mb-2">Algo deu errado</h1>
          <p class="text-sm text-[#94A3B8] mb-6">{{ error?.message || 'Erro desconhecido' }}</p>
          <button
            @click="handleRetry"
            class="px-6 py-2 rounded-lg bg-[#233350] border border-[#33517F] text-[#F8FAFC] text-sm font-black uppercase tracking-[0.12em] hover:bg-[#2A3A55] transition"
          >
            Tentar novamente
          </button>
        </div>
      </template>
    </NuxtErrorBoundary>
  </UApp>
</template>
