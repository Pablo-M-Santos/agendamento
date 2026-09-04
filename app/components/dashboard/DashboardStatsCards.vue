<script setup lang="ts">
import { CalendarDaysIcon, ChartBarIcon, BellIcon, ClockIcon } from '@heroicons/vue/24/outline'

defineProps<{
  total: number
  completed: number
  open: number
  late: number
  title?: string
}>()

const { t } = useAppI18n()
</script>

<template>
  <section class="mb-6 sm:mb-8">
    <div class="flex items-center mb-4 sm:mb-5">
      <h3 class="font-black text-sm sm:text-base text-[#8A93A6]">
        {{ title || t('dashboard.stats.title') }}
      </h3>
      <div class="flex-1 h-[1px] ml-4 bg-[#262E42]" />
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
      <div class="flex items-center gap-3 sm:gap-4">
        <span class="p-2 sm:p-3 rounded-xl bg-[#262E42]">
          <CalendarDaysIcon class="w-5 h-5 sm:w-6 sm:h-6 text-[#EDEFF4]" />
        </span>
        <div>
          <p class="text-xl sm:text-2xl font-black text-[#EDEFF4]">{{ total }}</p>
          <p class="text-[10px] sm:text-xs font-black uppercase tracking-[0.12em] text-[#8A93A6]">Total</p>
        </div>
      </div>

      <div class="flex items-center gap-3 sm:gap-4">
        <span class="p-2 sm:p-3 rounded-xl bg-[#1B4F4A]">
          <ChartBarIcon class="w-5 h-5 sm:w-6 sm:h-6 text-[#7FE0CC]" />
        </span>
        <div>
          <p class="text-xl sm:text-2xl font-black text-[#7FE0CC]">{{ completed }}</p>
          <p class="text-[10px] sm:text-xs font-black uppercase tracking-[0.12em] text-[#8A93A6]">Concluídos</p>
        </div>
      </div>

      <div class="flex items-center gap-3 sm:gap-4">
        <span class="p-2 sm:p-3 rounded-xl bg-[#233350]">
          <BellIcon class="w-5 h-5 sm:w-6 sm:h-6 text-[#9FC1F5]" />
        </span>
        <div>
          <p class="text-xl sm:text-2xl font-black text-[#9FC1F5]">{{ open }}</p>
          <p class="text-[10px] sm:text-xs font-black uppercase tracking-[0.12em] text-[#8A93A6]">Abertos</p>
        </div>
      </div>

      <div class="flex items-center gap-3 sm:gap-4">
        <span class="p-2 sm:p-3 rounded-xl bg-[#1A3F4A]">
          <ClockIcon class="w-5 h-5 sm:w-6 sm:h-6 text-[#7FE0E8]" />
        </span>
        <div>
          <p class="text-xl sm:text-2xl font-black text-[#7FE0E8]">{{ late }}</p>
          <p class="text-[10px] sm:text-xs font-black uppercase tracking-[0.12em] text-[#8A93A6]">Atrasados</p>
        </div>
      </div>
    </div>
  </section>
</template>
