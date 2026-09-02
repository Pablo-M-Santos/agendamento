<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
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
    <div class="grid grid-cols-3 items-center">
      <NuxtLink
        to="/dashboard"
        class="justify-self-start p-2 rounded-xl transition hover:bg-white/10"
        :aria-label="t('common.backToDashboard')"
      >
        <ArrowLeftIcon class="w-7 h-7" />
      </NuxtLink>

      <h1
        class="text-base font-black text-center text-white"
      >
        {{ t('schedule.title') }}
      </h1>

      <div />
    </div>

    <div class="mt-4 flex items-center justify-between gap-4">
      <h2
        class="text-base font-black truncate text-white"
      >
        {{ format(dataSelecionada, 'MMMM, yyyy', { locale: dateLocale }) }}
      </h2>

      <button
        class="px-5 py-2.5 rounded-xl text-sm font-black active:scale-95 transition-all bg-white text-[#001a17] shadow-[0_10px_25px_rgba(255,255,255,0.15)]"
        @click="emit('add')"
      >
        {{ t('schedule.register') }}
      </button>
    </div>
  </header>
</template>
