<script setup lang="ts">
import { format } from 'date-fns'
import type { Agendamento } from '~/composables/useAgendamentos'

defineProps<{
  isLightTheme: boolean
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
      <h3 class="font-black text-sm" :class="isLightTheme ? 'text-[#0B1F3A]' : 'text-white/90'">
        {{ labels.recentServices }}
      </h3>
      <div class="flex-1 h-[1px] ml-4" :class="isLightTheme ? 'bg-[#D8E7FF]' : 'bg-white/15'" />
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
        class="block p-4 rounded-2xl shadow-md active:scale-[0.99] transition"
        :class="isLightTheme ? 'bg-[#003D7A] text-white' : 'bg-white/95 text-[#0B1F3A]'"
      >
        <div class="flex items-center justify-between gap-3">
          <div
            class="inline-flex items-center gap-2 px-3 py-2 rounded-xl"
            :class="isLightTheme ? 'bg-white/15 text-white' : 'bg-[#E8F1FF] text-[#003D7A]'"
          >
            <span class="text-[10px] font-black uppercase tracking-[0.14em]">{{
              labels.time
            }}</span>
            <span class="text-sm font-black">{{ formatarHora(item.data) }}</span>
          </div>

          <span
            v-if="item.materialPronto === true"
            class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-emerald-400 text-[#003D7A]"
          >
            {{ labels.materialReady }}
          </span>
          <span
            v-else-if="item.materialPronto === false"
            class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-amber-300 text-[#4A2C00]"
          >
            {{ labels.noMaterial }}
          </span>
          <span
            v-else
            class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg"
            :class="isLightTheme ? 'bg-white/15 text-white/80' : 'bg-[#E8F1FF] text-[#5B6B8A]'"
          >
            {{ labels.noStatus }}
          </span>
        </div>

        <div
          class="mt-3 rounded-xl border p-3"
          :class="isLightTheme ? 'border-white/20 bg-white/10' : 'border-[#D8E7FF] bg-[#F4F8FF]'"
        >
          <p
            class="text-[10px] font-black uppercase tracking-[0.16em]"
            :class="isLightTheme ? 'text-white/70' : 'text-[#5B6B8A]'"
          >
            {{ labels.address }}
          </p>
          <p
            class="text-sm font-bold mt-1 leading-relaxed"
            :class="isLightTheme ? 'text-white' : 'text-[#0B1F3A]'"
          >
            {{ item.endereco || labels.addressNotInformed }}
            <template v-if="item.numeroCasa">, Casa {{ item.numeroCasa }}</template>
          </p>
        </div>

        <div class="mt-3 flex justify-end">
          <span
            v-if="item.servicoConcluido === true"
            class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-[#00D3B8] text-[#003D7A]"
          >
            {{ labels.serviceCompleted }}
          </span>
          <span
            v-else-if="item.servicoConcluido === false"
            class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg"
            :class="isLightTheme ? 'bg-white/20 text-white' : 'bg-[#DDE7FA] text-[#3F5170]'"
          >
            {{ labels.serviceOpen }}
          </span>
          <span
            v-else
            class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg"
            :class="isLightTheme ? 'bg-white/15 text-white/80' : 'bg-[#E8F1FF] text-[#5B6B8A]'"
          >
            {{ labels.serviceNotCompleted }}
          </span>
        </div>

        <div
          class="mt-3 text-[11px] font-semibold text-right"
          :class="isLightTheme ? 'text-white/70' : 'text-[#5B6B8A]'"
        >
          {{ formatarData(item.data) }}
        </div>
      </NuxtLink>
    </div>

    <div
      v-else
      class="rounded-2xl p-6 text-center border"
      :class="
        isLightTheme
          ? 'bg-white text-[#5B6B8A] border-[#D8E7FF]'
          : 'bg-white/10 text-white/80 border-white/15'
      "
    >
      {{ labels.noRecentServices }}
    </div>
  </section>
</template>
