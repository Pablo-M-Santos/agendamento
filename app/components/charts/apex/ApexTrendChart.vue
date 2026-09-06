<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import VueApexCharts from 'vue3-apexcharts'

type Point = {
  x: string
  total: number
  concluidos: number
}

const props = withDefaults(
  defineProps<{
    points: Point[]
    height?: number
  }>(),
  {
    height: 320
  }
)

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'area',
    height: props.height,
    background: 'transparent',
    foreColor: '#94A3B8',
    toolbar: { show: false },
    fontFamily: 'inherit',
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 500,
      dynamicAnimation: { enabled: true, speed: 350 }
    },
    zoom: { enabled: false }
  },
  theme: { mode: 'dark' },
  colors: ['#1E3A5F', '#10B981'],
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: [2.5, 2.5],
    dashArray: [0, 4]
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.15,
      opacityTo: 0.05,
      stops: [0, 90, 100]
    }
  },
  grid: {
    borderColor: '#1E293B',
    strokeDashArray: 3,
    yaxis: { lines: { show: true } },
    xaxis: { lines: { show: false } },
    padding: { left: 6, right: 6 }
  },
  xaxis: {
    categories: props.points.map((p) => p.x),
    axisBorder: { show: false },
    axisTicks: { show: false },
    tooltip: { enabled: false },
    labels: { show: false }
  },
  yaxis: {
    labels: {
      style: { colors: '#94A3B8', fontSize: '9px', fontWeight: 700 },
      formatter: (val: number) => Math.round(val).toString()
    }
  },
  legend: {
    show: true,
    position: 'top',
    fontSize: '9px',
    fontWeight: 700,
    labels: { colors: '#94A3B8' },
    itemMargin: { horizontal: 10, vertical: 2 }
  },
  tooltip: {
    theme: 'dark',
    style: { fontSize: '12px' },
    x: { show: true },
    y: {
      formatter: (val: number) => `${val} agendamento${val === 1 ? '' : 's'}`
    }
  },
  states: {
    hover: { filter: { type: 'none' } },
    active: { filter: { type: 'none' } }
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: { height: 240 },
        legend: { position: 'bottom' }
      }
    }
  ]
}))

const series = computed(() => [
  { name: 'Total', data: props.points.map((p) => p.total) },
  { name: 'Concluídos', data: props.points.map((p) => p.concluidos) }
])
</script>

<template>
  <div class="w-full">
    <div v-if="points.length" class="flex flex-wrap items-center gap-2 sm:gap-4 mb-2 sm:mb-3 text-[9px] sm:text-[10px]">
      <div class="flex items-center gap-1.5">
        <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-[#1E3A5F]" />
        <span class="text-[#94A3B8] font-bold uppercase tracking-wider">Total</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-[#10B981]" />
        <span class="text-[#94A3B8] font-bold uppercase tracking-wider">Concluídos</span>
      </div>
      <div class="ml-auto flex items-center gap-2 sm:gap-3 text-[#94A3B8]">
        <span>
          <strong class="text-[#F8FAFC]">{{ points.reduce((a, p) => a + p.total, 0) }}</strong> no período
        </span>
        <span class="hidden sm:inline">
          Média <strong class="text-[#F8FAFC]">{{ points.length ? (points.reduce((a, p) => a + p.total, 0) / points.length).toFixed(1) : '0' }}</strong>/dia
        </span>
      </div>
    </div>

    <div v-if="points.length" class="overflow-x-auto no-scrollbar">
      <VueApexCharts
        type="area"
        height="320"
        width="100%"
        :options="chartOptions"
        :series="series"
      />
    </div>

    <div
      v-else
      class="flex flex-col items-center justify-center py-12 text-center"
    >
      <div
        class="w-12 h-12 rounded-full bg-[#1E293B]/30 border border-[#94A3B8]/30 flex items-center justify-center mb-3"
      >
        <svg class="w-5 h-5 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <p class="text-sm text-[#F8FAFC] font-bold">Sem dados de tendência</p>
      <p class="text-xs text-[#94A3B8] mt-1">
        Adicione agendamentos para ver a evolução
      </p>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
