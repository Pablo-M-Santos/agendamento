<script setup lang="ts">
import {
  CurrencyDollarIcon,
  CalculatorIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  CubeIcon
} from '@heroicons/vue/24/outline'

defineProps<{
  bookingsLabel: string
  completedLabel: string
  unfinishedLabel: string
  materialReadyLabel: string
  revenueLabel: string
  averageTicketLabel: string
  totalBookings: number
  totalCompleted: number
  totalUnfinished: number
  totalMaterialReady: number
  totalRevenue: number
  averageTicket: number
}>()

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}
</script>

<template>
  <section class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
    <div class="flex items-center gap-2 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-4 rounded-2xl bg-[#1E3A5F] border border-[#1E3A5F]">
      <span class="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/10">
        <CurrencyDollarIcon class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
      </span>
      <div class="min-w-0">
        <p class="text-[11px] sm:text-xs md:text-base font-black text-white truncate">{{ formatCurrency(totalRevenue) }}</p>
        <p class="text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-[0.12em] text-white/90 truncate">{{ revenueLabel }}</p>
      </div>
    </div>

    <div class="flex items-center gap-2 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-4 rounded-2xl bg-[#4C1D95] border border-[#4C1D95]">
      <span class="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/10">
        <CalculatorIcon class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
      </span>
      <div class="min-w-0">
        <p class="text-[11px] sm:text-xs md:text-base font-black text-white truncate">{{ formatCurrency(averageTicket) }}</p>
        <p class="text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-[0.12em] text-white/90 truncate">{{ averageTicketLabel }}</p>
      </div>
    </div>

    <div class="flex items-center gap-2 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-4 rounded-2xl bg-[#334155] border border-[#334155]">
      <span class="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/10">
        <CalendarIcon class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
      </span>
      <div class="min-w-0">
        <p class="text-lg sm:text-xl md:text-2xl font-black text-white">{{ totalBookings }}</p>
        <p class="text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-[0.12em] text-white/90 truncate">{{ bookingsLabel }}</p>
      </div>
    </div>

    <div class="flex items-center gap-2 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-4 rounded-2xl bg-[#065F46] border border-[#065F46]">
      <span class="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/10">
        <CheckCircleIcon class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
      </span>
      <div class="min-w-0">
        <p class="text-lg sm:text-xl md:text-2xl font-black text-white">{{ totalCompleted }}</p>
        <p class="text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-[0.12em] text-white/90 truncate">{{ completedLabel }}</p>
      </div>
    </div>

    <div class="flex items-center gap-2 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-4 rounded-2xl bg-[#991B1B] border border-[#991B1B]">
      <span class="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/10">
        <XCircleIcon class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
      </span>
      <div class="min-w-0">
        <p class="text-lg sm:text-xl md:text-2xl font-black text-white">{{ totalUnfinished }}</p>
        <p class="text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-[0.12em] text-white/90 truncate">{{ unfinishedLabel }}</p>
      </div>
    </div>

    <div class="flex items-center gap-2 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-4 rounded-2xl bg-[#92400E] border border-[#92400E]">
      <span class="p-1.5 sm:p-2 md:p-3 rounded-xl bg-white/10">
        <CubeIcon class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
      </span>
      <div class="min-w-0">
        <p class="text-lg sm:text-xl md:text-2xl font-black text-white">{{ totalMaterialReady }}</p>
        <p class="text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-[0.12em] text-white/90 truncate">{{ materialReadyLabel }}</p>
      </div>
    </div>
  </section>
</template>
