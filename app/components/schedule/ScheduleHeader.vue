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
  <header class="border-b border-white/5 sticky top-0 z-50 backdrop-blur-md">
    <div class="grid grid-cols-3 items-center">
      <NuxtLink
        to="/dashboard"
        class="justify-self-start p-2 rounded-xl hover:bg-white/10 transition"
        :aria-label="t('common.backToDashboard')"
      >
        <ArrowLeftIcon class="w-7 h-7" />
      </NuxtLink>

      <h1 class="text-base font-black text-white text-center">{{ t('schedule.title') }}</h1>

      <div />
    </div>

    <div class="mt-4 flex items-center justify-between gap-4">
      <h2 class="text-base font-black text-white truncate">
        {{ format(dataSelecionada, 'MMMM, yyyy', { locale: dateLocale }) }}
      </h2>

      <button
        class="bg-[#FBFBFB] text-black px-5 py-2.5 rounded-xl text-sm font-black shadow-[0_10px_25px_rgba(250,72,5,0.25)] active:scale-95 transition-all"
        @click="emit('add')"
      >
        {{ t('schedule.register') }}
      </button>
    </div>
  </header>
</template>
