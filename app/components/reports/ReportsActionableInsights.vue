<script setup lang="ts">
import { ClockIcon, ExclamationTriangleIcon, CalendarDaysIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

defineProps<{
  title: string
  proximosLabel: string
  atrasadosLabel: string
  semMaterialLabel: string
  taxaLabel: string
  proximos: number
  atrasados: number
  semMaterial: number
  taxa: number
}>()
</script>

<template>
  <section
    class="rounded-2xl border p-5 border-[#262E42] bg-[#1A2132]"
  >
    <h2 class="text-sm font-black uppercase tracking-[0.16em] mb-4 text-[#EDEFF4]">
      {{ title }}
    </h2>

    <div class="grid grid-cols-2 gap-3">
      <div
        class="rounded-xl p-3 bg-[#141A28] border border-[#262E42]"
      >
        <div class="flex items-center gap-2 mb-1">
          <ClockIcon class="w-4 h-4 text-[#4FD1C5]" />
          <span class="text-[10px] font-black uppercase tracking-wider text-[#8A93A6]">
            {{ proximosLabel }}
          </span>
        </div>
        <p class="text-2xl font-black text-[#4FD1C5] tabular-nums">
          {{ proximos }}
        </p>
        <p class="text-[10px] text-[#8A93A6] mt-0.5">próximos 7 dias</p>
      </div>

      <div
        class="rounded-xl p-3 border"
        :class="atrasados > 0
          ? 'bg-[#3A2E2E] border-[#5C4848]/50'
          : 'bg-[#141A28] border-[#262E42]'"
      >
        <div class="flex items-center gap-2 mb-1">
          <ExclamationTriangleIcon
            class="w-4 h-4"
            :class="atrasados > 0 ? 'text-[#E07373]' : 'text-[#8A93A6]'"
          />
          <span
            class="text-[10px] font-black uppercase tracking-wider"
            :class="atrasados > 0 ? 'text-[#E07373]' : 'text-[#8A93A6]'"
          >
            {{ atrasadosLabel }}
          </span>
        </div>
        <p
          class="text-2xl font-black tabular-nums"
          :class="atrasados > 0 ? 'text-[#E07373]' : 'text-[#EDEFF4]'"
        >
          {{ atrasados }}
        </p>
        <p class="text-[10px] text-[#8A93A6] mt-0.5">
          {{ atrasados === 0 ? 'nenhum pendente' : 'requerem atenção' }}
        </p>
      </div>

      <div
        class="rounded-xl p-3 border"
        :class="semMaterial > 0
          ? 'bg-[#3A3528] border-[#5C5048]/50'
          : 'bg-[#141A28] border-[#262E42]'"
      >
        <div class="flex items-center gap-2 mb-1">
          <CalendarDaysIcon
            class="w-4 h-4"
            :class="semMaterial > 0 ? 'text-[#E0B17F]' : 'text-[#8A93A6]'"
          />
          <span
            class="text-[10px] font-black uppercase tracking-wider"
            :class="semMaterial > 0 ? 'text-[#E0B17F]' : 'text-[#8A93A6]'"
          >
            {{ semMaterialLabel }}
          </span>
        </div>
        <p
          class="text-2xl font-black tabular-nums"
          :class="semMaterial > 0 ? 'text-[#E0B17F]' : 'text-[#EDEFF4]'"
        >
          {{ semMaterial }}
        </p>
        <p class="text-[10px] text-[#8A93A6] mt-0.5">
          {{ semMaterial === 0 ? 'tudo em ordem' : 'sem material' }}
        </p>
      </div>

      <div class="rounded-xl p-3 bg-[#141A28] border border-[#262E42]">
        <div class="flex items-center gap-2 mb-1">
          <CheckCircleIcon class="w-4 h-4 text-[#7FE0CC]" />
          <span class="text-[10px] font-black uppercase tracking-wider text-[#8A93A6]">
            {{ taxaLabel }}
          </span>
        </div>
        <p class="text-2xl font-black text-[#7FE0CC] tabular-nums">
          {{ taxa }}%
        </p>
        <p class="text-[10px] text-[#8A93A6] mt-0.5">no período</p>
      </div>
    </div>
  </section>
</template>
