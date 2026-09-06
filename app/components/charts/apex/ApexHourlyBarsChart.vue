<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import VueApexCharts from 'vue3-apexcharts'

type ColumnItem = {
  label: string
  total: number
}

const props = withDefaults(
  defineProps<{
    items: ColumnItem[]
    height?: number
  }>(),
  {
    height: 320
  }
)

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
  colors: ['#10B981'],
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: '55%'
    }
  },
  dataLabels: { enabled: false },
  grid: {
    borderColor: '#1E293B',
    strokeDashArray: 3,
    yaxis: { lines: { show: true } },
    xaxis: { lines: { show: false } }
  },
  xaxis: {
    categories: props.items.map((item) => item.label),
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: {
      style: { colors: '#94A3B8', fontSize: '9px', fontWeight: 700 },
      formatter: (val: number) => Math.round(val).toString()
    }
  },
  tooltip: {
    theme: 'dark',
    style: { fontSize: '12px' },
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
        chart: { height: 240 }
      }
    }
  ]
}))

const series = computed(() => [
  {
    name: 'Agendamentos',
    data: props.items.map((item) => item.total)
  }
])
</script>

<template>
  <div class="w-full">
    <div v-if="items.some((item) => item.total > 0)" class="overflow-x-auto no-scrollbar">
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-sm text-[#F8FAFC] font-bold">Sem dados de horário</p>
      <p class="text-xs text-[#94A3B8] mt-1">Adicione agendamentos para ver o pico</p>
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
