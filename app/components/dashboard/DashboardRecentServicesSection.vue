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

const formatarData = (data: Agendamento['data']) => format(data.toDate(), 'dd/MM/yyyy HH:mm')
const formatarHora = (data: Agendamento['data']) => format(data.toDate(), 'HH:mm')
const formatarDiaParaRota = (data: Agendamento['data']) => format(data.toDate(), 'yyyy-MM-dd')
</script>

<template>
  <section class="pb-24 md:pb-6">
    <div class="flex items-center mb-4">
      <h3 class="font-black text-sm text-white/90">
        {{ labels.recentServices }}
      </h3>
      <div class="flex-1 h-[1px] ml-4 bg-white/15" />
    </div>

    <div v-if="items.length" class="space-y-3">
      <NuxtLink
        v-for="item in items"
        :key="item.id"
        :to="{
          path: '/schedule',
          query: {
            data: formatarDiaParaRota(item.data),
            agendamento: item.id
          }
        }"
        class="block p-4 rounded-2xl shadow-md active:scale-[0.99] transition bg-white/10 border border-[rgba(255,255,255,0.08)]"
      >
        <div class="flex items-center justify-between gap-3">
          <div
            class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#4da69c]/20 text-[#80bfb8]"
          >
            <span class="text-[10px] font-black uppercase tracking-[0.14em]">{{
              labels.time
            }}</span>
            <span class="text-sm font-black">{{ formatarHora(item.data) }}</span>
          </div>

          <span
            v-if="item.materialPronto === true"
            class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-[#4da69c] text-[#001a17]"
          >
            {{ labels.materialReady }}
          </span>
          <span
            v-else-if="item.materialPronto === false"
            class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-amber-400 text-[#4A2C00]"
          >
            {{ labels.noMaterial }}
          </span>
          <span
            v-else
            class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-white/10 text-white/70"
          >
            {{ labels.noStatus }}
          </span>
        </div>

        <div
          class="mt-3 rounded-xl border border-[rgba(255,255,255,0.1)] bg-white/5 p-3"
        >
          <p class="text-[10px] font-black uppercase tracking-[0.16em] text-[#80bfb8]">
            {{ labels.address }}
          </p>
          <p class="text-sm font-bold mt-1 leading-relaxed text-white">
            {{ item.endereco || labels.addressNotInformed }}
            <template v-if="item.numeroCasa">, Casa {{ item.numeroCasa }}</template>
          </p>
        </div>

        <div class="mt-3 flex justify-end">
          <span
            v-if="item.servicoConcluido === true"
            class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-[#4da69c] text-[#001a17]"
          >
            {{ labels.serviceCompleted }}
          </span>
          <span
            v-else-if="item.servicoConcluido === false"
            class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-white/15 text-white"
          >
            {{ labels.serviceOpen }}
          </span>
          <span
            v-else
            class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-white/10 text-white/70"
          >
            {{ labels.serviceNotCompleted }}
          </span>
        </div>

        <div class="mt-3 text-[11px] font-semibold text-right text-[#80bfb8]">
          {{ formatarData(item.data) }}
        </div>
      </NuxtLink>
    </div>

    <div
      v-else
      class="rounded-2xl p-6 text-center border border-[rgba(255,255,255,0.1)] bg-white/5 text-[#80bfb8]"
    >
      {{ labels.noRecentServices }}
    </div>
  </section>
</template>
