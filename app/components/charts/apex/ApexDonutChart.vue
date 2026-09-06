<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import VueApexCharts from 'vue3-apexcharts'

type Segment = {
  label: string
  value: number
  color: string
}

const props = withDefaults(
  defineProps<{
    segments: Segment[]
    height?: number
  }>(),
  {
    height: 260
  }
)

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'donut',
    height: props.height,
    background: 'transparent',
    foreColor: '#94A3B8',
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 500,
      dynamicAnimation: { enabled: true, speed: 400 }
    },
    toolbar: { show: false },
    fontFamily: 'inherit'
  },
  theme: { mode: 'dark' },
  labels: props.segments.map((s) => s.label),
  colors: props.segments.map((s) => s.color),
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        labels: {
          show: true,
          name: { show: true, fontSize: '10px', fontWeight: 700, color: '#94A3B8' },
          value: {
            show: true,
            fontSize: '16px',
            fontWeight: 900,
            color: '#F8FAFC',
            formatter: (val: string | number) => String(val)
          },
          total: {
            show: true,
            label: 'Total',
            fontSize: '9px',
            fontWeight: 800,
            color: '#F8FAFC',
            formatter: () => String(props.segments.reduce((a, s) => a + s.value, 0))
          }
        }
      }
    }
  },
  dataLabels: { enabled: false },
  stroke: { show: false },
  legend: {
    show: true,
    position: 'bottom',
    fontSize: '10px',
    fontWeight: 700,
    labels: { colors: '#94A3B8' },
    itemMargin: { horizontal: 10, vertical: 3 }
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
        chart: { height: 200 },
        plotOptions: {
          pie: {
            donut: {
              size: '60%',
              labels: {
                value: { fontSize: '14px' },
                name: { fontSize: '9px' },
                total: { fontSize: '8px' }
              }
            }
          }
        },
        legend: { fontSize: '9px', itemMargin: { horizontal: 8, vertical: 2 } }
      }
    }
  ]
}))
</script>

<template>
  <div class="w-full">
    <VueApexCharts
      v-if="segments.length"
      type="donut"
      height="260"
      width="100%"
      :options="chartOptions"
      :series="segments.map((s) => s.value)"
    />
    <div v-else class="flex flex-col items-center justify-center py-10 text-center">
      <div
        class="w-12 h-12 rounded-full bg-[#1E293B]/30 border border-[#94A3B8]/30 flex items-center justify-center mb-3"
      >
        <svg class="w-5 h-5 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <p class="text-sm text-[#F8FAFC] font-bold">Sem dados de status</p>
      <p class="text-xs text-[#94A3B8] mt-1">Adicione agendamentos para ver a distribuição</p>
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
