<script setup lang="ts">
import { format } from 'date-fns'
import type { Agendamento } from '~/composables/useAgendamentos'

defineProps<{
  items: Agendamento[]
  labels: {
    recentServices: string
    noRecentServices: string
    time: string
    address: string
    addressNotInformed: string
    materialReady: string
    noMaterial: string
    noStatus: string
    serviceCompleted: string
    serviceOpen: string
    serviceNotCompleted: string
  }
}>()

const emit = defineEmits<{
  'view-item': [item: Agendamento]
}>()

const formatarData = (data: Agendamento['data']) => format(data.toDate(), 'dd/MM/yyyy')
const formatarHora = (data: Agendamento['data']) => format(data.toDate(), 'HH:mm')
</script>

<template>
  <section class="pb-24 md:pb-8 lg:pb-10">
    <div class="flex items-center mb-4 sm:mb-5">
      <h3 class="font-black text-sm sm:text-base text-[#8A93A6]">
        {{ labels.recentServices }}
      </h3>
      <div class="flex-1 h-[1px] ml-4 bg-[#262E42]" />
    </div>

    <div v-if="items.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      <article
        v-for="item in items"
        :key="item.id"
        class="rounded-2xl border border-[#262E42] bg-[#1A2132] p-4 sm:p-5 hover:border-[#4FD1C5]/30 active:scale-[0.99] transition-all cursor-pointer"
        @click="emit('view-item', item)"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-[#EDEFF4] truncate">
              {{ item.cliente }}
            </p>
            <p class="text-xs text-[#8A93A6] mt-0.5 truncate">
              {{ item.endereco || labels.addressNotInformed }}
              <template v-if="item.numeroCasa">, Casa {{ item.numeroCasa }}</template>
            </p>
          </div>

          <div class="flex flex-col items-end flex-shrink-0">
            <span class="text-lg font-black text-[#4FD1C5]">{{ formatarHora(item.data) }}</span>
            <span class="text-[10px] text-[#6E7789]">{{ formatarData(item.data) }}</span>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mt-3">
          <span
            v-if="item.materialPronto === true"
            class="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-[#233350] text-[#9FC1F5]"
          >
            {{ labels.materialReady }}
          </span>
          <span
            v-else-if="item.materialPronto === false"
            class="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-[#233350] text-[#9FC1F5]"
          >
            {{ labels.noMaterial }}
          </span>

          <span
            v-if="item.servicoConcluido === true"
            class="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-[#1B4F4A] text-[#7FE0CC]"
          >
            {{ labels.serviceCompleted }}
          </span>
          <span
            v-else-if="item.servicoConcluido === false"
            class="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-[#233350] text-[#9FC1F5]"
          >
            {{ labels.serviceOpen }}
          </span>
          <span
            v-else
            class="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-[#262E42] text-[#8A93A6]"
          >
            {{ labels.serviceNotCompleted }}
          </span>
        </div>
      </article>
    </div>

    <div
      v-else
      class="rounded-2xl p-8 text-center border border-[#262E42] bg-[#1A2132]"
    >
      <div class="w-16 h-16 rounded-full bg-[#262E42] flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-[#8A93A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p class="text-[#8A93A6] font-medium">{{ labels.noRecentServices }}</p>
    </div>
  </section>
</template>
