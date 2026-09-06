<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import VueApexCharts from 'vue3-apexcharts'

type BarItem = {
  label: string
  value: number
  color?: string
}

const props = withDefaults(
  defineProps<{
    items: BarItem[]
    height?: number
    valueLabel?: string
  }>(),
  {
    height: 320,
    valueLabel: ''
  }
)

const total = computed(() => props.items.reduce((acc, item) => acc + item.value, 0))

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'bar',
    height: props.height,
    background: 'transparent',
    foreColor: '#94A3B8',
    toolbar: { show: false },
    fontFamily: 'inherit',
    animations: { enabled: true, easing: 'easeinout', speed: 500 }
  },
  theme: { mode: 'dark' },
  colors: props.items.map((item) => item.color || '#2DD4BF'),
  plotOptions: {
    bar: {
      borderRadius: 6,
      horizontal: true,
      barHeight: '70%',
      distributed: false
    }
  },
  dataLabels: { enabled: false },
  grid: {
    borderColor: '#1E293B',
    strokeDashArray: 3,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } }
  },
  xaxis: {
    categories: props.items.map((item) => item.label),
    labels: {
      style: { colors: '#94A3B8', fontSize: '9px', fontWeight: 700 }
    }
  },
  yaxis: {
    labels: {
      style: { colors: '#94A3B8', fontSize: '9px', fontWeight: 700 },
      formatter: (val: number | string) => `${val} ${props.valueLabel}`
    }
  },
  tooltip: {
    theme: 'dark',
    style: { fontSize: '12px' },
    y: {
      formatter: (val: number) => {
        const pct = total.value ? ((val / total.value) * 100).toFixed(1) : '0.0'
        return `${val} ${props.valueLabel} • ${pct}%`
      }
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
  {
    name: props.valueLabel || 'Total',
    data: props.items.map((item) => item.value)
  }
])
</script>

<template>
  <div class="w-full">
    <div v-if="items.length" class="overflow-x-auto no-scrollbar">
      <VueApexCharts
        type="bar"
        height="320"
        width="100%"
        :options="chartOptions"
        :series="series"
      />
    </div>
    <div v-else class="flex flex-col items-center justify-center py-10 text-center">
      <div
        class="w-12 h-12 rounded-full bg-[#1E293B]/30 border border-[#94A3B8]/30 flex items-center justify-center mb-3"
      >
        <svg class="w-5 h-5 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 002 2v6a2 2 0 002 2h2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <p class="text-sm text-[#F8FAFC] font-bold">Sem dados para ranking</p>
      <p class="text-xs text-[#94A3B8] mt-1">Adicione agendamentos para ver o ranking</p>
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
