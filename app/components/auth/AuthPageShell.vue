<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <div
    class="min-h-dvh flex items-center justify-center px-4 py-4 sm:px-6 sm:py-8 md:px-8 lg:px-12 transition-colors duration-300 overflow-y-auto auth-bg-dark"
  >
    <div class="w-full max-w-md md:max-w-lg lg:max-w-xl auth-card my-auto">
      <div class="text-center mb-5 sm:mb-8">
        <div
          class="inline-flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl mb-3 sm:mb-6 auth-logo-container"
        >
          <img src="/logo.png" alt="Agendamento" class="w-9 h-9 sm:w-14 sm:h-14 object-contain" />
        </div>

        <h1
          class="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-1 sm:mb-2"
        >
          {{ title }}
        </h1>
        <p class="text-xs sm:text-sm md:text-base text-[var(--color-text-secondary)]">
          {{ subtitle }}
        </p>
      </div>

      <slot />
    </div>
  </div>
</template>

<style scoped>
.auth-bg-dark {
  background:
    radial-gradient(ellipse at top left, rgba(79, 209, 197, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, rgba(44, 110, 103, 0.06) 0%, transparent 50%),
    linear-gradient(135deg, #0F1420 0%, #141A28 50%, #0F1420 100%);
}

.auth-logo-container {
  background: linear-gradient(135deg, #1E2A3D 0%, #262E42 100%);
  border: 1px solid #262E42;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

@media (prefers-reduced-motion: reduce) {
  .auth-bg-dark {
    background: #141A28;
  }
}
</style>
