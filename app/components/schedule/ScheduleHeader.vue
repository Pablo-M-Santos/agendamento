<script setup lang="ts">
import { format } from 'date-fns'

const { dateLocale } = useUserSettings()
const { t } = useAppI18n()

defineProps<{
  dataSelecionada: Date
}>()

const emit = defineEmits<{
  (e: 'add'): void
}>()
</script>

<template>
  <header
     class=" top-0 z-50 backdrop-blur-md transition-colors border-white/5"
  >
    <div class="flex items-center justify-between gap-4">
      <h2
        class="text-base font-black truncate text-[#EDEFF4]"
      >
        {{ format(dataSelecionada, 'MMMM, yyyy', { locale: dateLocale }) }}
      </h2>

      <button
        class="px-5 py-2.5 rounded-xl text-sm font-black active:scale-95 transition-all bg-[#1B4F4A] text-[#EAFBF6] shadow-[0_10px_25px_rgba(27,79,74,0.3)]"
        @click="emit('add')"
      >
        {{ t('schedule.register') }}
      </button>
    </div>
  </header>
</template>
