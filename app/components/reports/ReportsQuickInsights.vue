<script setup lang="ts">
import { CalendarDaysIcon, CheckBadgeIcon } from '@heroicons/vue/24/outline'

defineProps<{
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
    class="rounded-2xl border p-5 border-[#262E42] bg-[#1A2132]"
  >
    <h2 class="text-sm font-black uppercase tracking-[0.16em] mb-4 text-[#EDEFF4]">
      {{ title }}
    </h2>

    <div class="space-y-3 text-sm font-semibold">
      <p class="flex items-start gap-2">
        <CalendarDaysIcon class="w-4 h-4 mt-0.5 text-[#4FD1C5]" />
        <span class="text-[#8A93A6]">
          {{ busyDayLabel }} <strong class="text-[#EDEFF4]">{{ dayBusiest?.label || '--/--' }}</strong> ({{
            dayBusiest?.total || 0
          }}
          {{ bookingsSuffix }})
        </span>
      </p>

      <p class="flex items-start gap-2">
        <CheckBadgeIcon class="w-4 h-4 mt-0.5 text-[#4FD1C5]" />
        <span class="text-[#8A93A6]">
          {{ bestClientLabel }}
          <strong class="text-[#EDEFF4]">{{ topClients[0]?.cliente || noDataLabel }}</strong>
          ({{ topClients[0]?.total || 0 }} {{ servicesSuffix }})
        </span>
      </p>
    </div>

    <div v-if="topClients.length" class="mt-5">
      <p class="text-[10px] uppercase tracking-[0.16em] font-black mb-2 text-[#8A93A6]">
        {{ topClientsLabel }}
      </p>
      <div class="space-y-3">
        <div
          v-for="cliente in topClients"
          :key="cliente.cliente"
          class="rounded-xl p-3 flex items-center justify-between border bg-[#141A28] border-[#262E42]"
        >
          <span class="font-bold text-sm truncate pr-3 text-[#EDEFF4]">{{ cliente.cliente }}</span>
          <span class="text-xs font-black uppercase tracking-[0.14em] text-[#8A93A6]">
            {{ totalCompletedLabel({ total: cliente.total, completed: cliente.finalizados }) }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
