<script setup lang="ts">
import { ArrowDownTrayIcon } from '@heroicons/vue/24/outline'

withDefaults(
  defineProps<{
    loading?: boolean
    label: string
    loadingLabel?: string
  }>(),
  {
    loading: false,
    loadingLabel: 'Gerando...'
  }
)

defineEmits<{
  export: []
}>()
</script>

<template>
  <button
    type="button"
    :disabled="loading"
    class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B4F4A] text-[#EAFBF6] border border-[#2C6E67] hover:bg-[#2C6E67] active:scale-95 transition font-black text-xs uppercase tracking-[0.12em] disabled:opacity-60 disabled:cursor-not-allowed"
    @click="$emit('export')"
  >
    <svg
      v-if="loading"
      class="animate-spin w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <ArrowDownTrayIcon v-else class="w-4 h-4" />
    <span>{{ loading ? loadingLabel : label }}</span>
  </button>
</template>
