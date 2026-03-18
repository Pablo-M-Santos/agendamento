<script setup lang="ts">
import { CalendarDaysIcon, CheckBadgeIcon } from '@heroicons/vue/24/outline'

defineProps<{
  isLightTheme: boolean
  title: string
  busyDayLabel: string
  bestClientLabel: string
  bookingsSuffix: string
  servicesSuffix: string
  noDataLabel: string
  topClientsLabel: string
  totalCompletedLabel: (payload: { total: number; completed: number }) => string
  dayBusiest: { label: string; total: number } | null
  topClients: Array<{ cliente: string; total: number; finalizados: number }>
}>()
</script>

<template>
  <section
    class="rounded-3xl border p-5 mb-10"
    :class="isLightTheme ? 'border-white/20 bg-[#003D7A] text-white' : 'border-white/20 bg-white/8'"
  >
    <h2 class="text-sm font-black uppercase tracking-[0.16em] mb-4">
      {{ title }}
    </h2>

    <div class="space-y-3 text-sm font-semibold">
      <p class="flex items-start gap-2">
        <CalendarDaysIcon class="w-4 h-4 mt-0.5 text-[#B5FFF6]" />
        <span>
          {{ busyDayLabel }} <strong>{{ dayBusiest?.label || '--/--' }}</strong> ({{
            dayBusiest?.total || 0
          }}
          {{ bookingsSuffix }})
        </span>
      </p>

      <p class="flex items-start gap-2">
        <CheckBadgeIcon class="w-4 h-4 mt-0.5 text-[#B5FFF6]" />
        <span>
          {{ bestClientLabel }}
          <strong>{{ topClients[0]?.cliente || noDataLabel }}</strong>
          ({{ topClients[0]?.total || 0 }} {{ servicesSuffix }})
        </span>
      </p>
    </div>

    <div v-if="topClients.length" class="mt-5">
      <p class="text-[10px] uppercase tracking-[0.16em] font-black mb-2 text-white/70">
        {{ topClientsLabel }}
      </p>
      <div class="space-y-3">
        <div
          v-for="cliente in topClients"
          :key="cliente.cliente"
          class="rounded-xl p-3 flex items-center justify-between border"
          :class="isLightTheme ? 'bg-white/10 border-white/15' : 'bg-white/8 border-white/15'"
        >
          <span class="font-bold text-sm truncate pr-3">{{ cliente.cliente }}</span>
          <span class="text-xs font-black uppercase tracking-[0.14em] text-[#B5FFF6]">
            {{ totalCompletedLabel({ total: cliente.total, completed: cliente.finalizados }) }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
