<script setup lang="ts">
import { format } from 'date-fns'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

const { dateLocale } = useUserSettings()
const { t } = useAppI18n()

defineProps<{
  dataSelecionada: Date
}>()

const emit = defineEmits<{
  (e: 'add' | 'prev-month' | 'next-month'): void
}>()
</script>

<template>
  <header
     class=" top-0 z-50 backdrop-blur-md transition-colors border-white/5"
  >
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-1">
        <button
          class="p-1.5 rounded-lg text-[#8A93A6] hover:bg-white/5 hover:text-[#EDEFF4] transition"
          :aria-label="t('schedule.prevMonth')"
          @click="emit('prev-month')"
        >
          <ChevronLeftIcon class="w-5 h-5" />
        </button>
        <h2
          class="text-lg sm:text-xl font-black truncate text-[#EDEFF4]"
        >
          {{ format(dataSelecionada, 'MMMM, yyyy', { locale: dateLocale }) }}
        </h2>
        <button
          class="p-1.5 rounded-lg text-[#8A93A6] hover:bg-white/5 hover:text-[#EDEFF4] transition"
          :aria-label="t('schedule.nextMonth')"
          @click="emit('next-month')"
        >
          <ChevronRightIcon class="w-5 h-5" />
        </button>
      </div>

      <button
        class="px-5 py-2.5 rounded-xl text-sm font-black active:scale-95 transition-all bg-[#1B4F4A] text-[#EAFBF6] shadow-[0_10px_25px_rgba(27,79,74,0.3)]"
        @click="emit('add')"
      >
        {{ t('schedule.register') }}
      </button>
    </div>
  </header>
</template>
