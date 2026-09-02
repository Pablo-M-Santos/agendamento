<script setup lang="ts">
import { computed } from 'vue'

type Point = {
  x: string
  total: number
  concluidos: number
}

const props = withDefaults(
  defineProps<{
    points: Point[]
    height?: number
    showGrid?: boolean
  }>(),
  {
    height: 200,
    showGrid: true
  }
)

const padding = { top: 16, right: 12, bottom: 32, left: 36 }
const width = 600
const innerWidth = width - padding.left - padding.right
const innerHeight = computed(() => props.height - padding.top - padding.bottom)

const maxValue = computed(() => {
  const max = Math.max(...props.points.map((p) => Math.max(p.total, p.concluidos)), 1)
  return Math.ceil(max) || 1
})

const totalPontos = computed(() => {
  if (!props.points.length) return 0
  return props.points.reduce((acc, p) => acc + p.total, 0)
})

const mediaPorDia = computed(() => {
  if (!props.points.length) return 0
  return (totalPontos.value / props.points.length).toFixed(1)
})

const pontosMapeados = computed(() => {
  if (!props.points.length) return []
  const stepX = props.points.length === 1 ? 0 : innerWidth / (props.points.length - 1)

  return props.points.map((p, i) => {
    const x = padding.left + i * stepX
    const yTotal = padding.top + innerHeight.value - (p.total / maxValue.value) * innerHeight.value
    const yConcluidos = padding.top + innerHeight.value - (p.concluidos / maxValue.value) * innerHeight.value
    return { ...p, x, yTotal, yConcluidos, stepX }
  })
})

const pathLineTotal = computed(() => {
  if (pontosMapeados.value.length === 0) return ''
  return pontosMapeados.value
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.yTotal}` : `L ${p.x} ${p.yTotal}`))
    .join(' ')
})

const pathLineConcluidos = computed(() => {
  if (pontosMapeados.value.length === 0) return ''
  return pontosMapeados.value
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.yConcluidos}` : `L ${p.x} ${p.yConcluidos}`))
    .join(' ')
})

const pathAreaTotal = computed(() => {
  if (pontosMapeados.value.length === 0) return ''
  const first = pontosMapeados.value[0]
  const last = pontosMapeados.value[pontosMapeados.value.length - 1]
  if (!first || !last) return ''

  const baseY = padding.top + innerHeight.value
  return [
    `M ${first.x} ${baseY}`,
    `L ${first.x} ${first.yTotal}`,
    ...pontosMapeados.value.slice(1).map((p) => `L ${p.x} ${p.yTotal}`),
    `L ${last.x} ${baseY}`,
    'Z'
  ].join(' ')
})

const gridLines = computed(() => {
  if (!props.showGrid) return []
  const lines = []
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (innerHeight.value / 4) * i
    const value = maxValue.value - (maxValue.value / 4) * i
    lines.push({ y, value: Math.round(value) })
  }
  return lines
})

const xLabels = computed(() => {
  if (pontosMapeados.value.length === 0) return []
  if (pontosMapeados.value.length <= 8) {
    return pontosMapeados.value.map((p) => ({ x: p.x, label: p.x }))
  }
  const step = Math.ceil(pontosMapeados.value.length / 7)
  return pontosMapeados.value
    .filter((_, i) => i % step === 0 || i === pontosMapeados.value.length - 1)
    .map((p) => ({ x: p.x, label: p.x }))
})
</script>

<template>
  <div class="w-full">
    <div v-if="points.length > 0" class="flex items-center gap-4 mb-3 text-[10px]">
      <div class="flex items-center gap-1.5">
        <div class="w-3 h-3 rounded-sm bg-[#8A93A6]" />
        <span class="text-[#8A93A6] font-bold uppercase tracking-wider">Total</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-3 h-3 rounded-sm bg-[#4FD1C5]" />
        <span class="text-[#8A93A6] font-bold uppercase tracking-wider">Concluídos</span>
      </div>
      <div class="ml-auto flex items-center gap-3 text-[#8A93A6]">
        <span><strong class="text-[#EDEFF4]">{{ totalPontos }}</strong> no período</span>
        <span>Média <strong class="text-[#EDEFF4]">{{ mediaPorDia }}</strong>/dia</span>
      </div>
    </div>

    <div class="overflow-x-auto no-scrollbar">
      <svg
        v-if="points.length > 0"
        :viewBox="`0 0 ${width} ${height}`"
        class="w-full min-w-[320px]"
        :style="{ height: `${height}px` }"
      >
        <g v-if="showGrid">
          <line
            v-for="(line, i) in gridLines"
            :key="`grid-${i}`"
            :x1="padding.left"
            :x2="width - padding.right"
            :y1="line.y"
            :y2="line.y"
            stroke="#262E42"
            stroke-width="1"
            stroke-dasharray="3 3"
          />
          <text
            v-for="(line, i) in gridLines"
            :key="`label-${i}`"
            :x="padding.left - 6"
            :y="line.y + 3"
            text-anchor="end"
            font-size="9"
            font-weight="700"
            fill="#8A93A6"
          >
            {{ line.value }}
          </text>
        </g>

        <path
          v-if="pathAreaTotal"
          :d="pathAreaTotal"
          fill="#8A93A6"
          opacity="0.08"
        />
        <path
          v-if="pathLineTotal"
          :d="pathLineTotal"
          fill="none"
          stroke="#8A93A6"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-dasharray="4 4"
        />
        <path
          v-if="pathLineConcluidos"
          :d="pathLineConcluidos"
          fill="none"
          stroke="#4FD1C5"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <circle
          v-for="(p, i) in pontosMapeados"
          :key="`dot-total-${i}`"
          :cx="p.x"
          :cy="p.yTotal"
          r="3"
          fill="#8A93A6"
          stroke="#141A28"
          stroke-width="2"
        />
        <circle
          v-for="(p, i) in pontosMapeados"
          :key="`dot-conc-${i}`"
          :cx="p.x"
          :cy="p.yConcluidos"
          r="3.5"
          fill="#4FD1C5"
          stroke="#141A28"
          stroke-width="2"
        />

        <text
          v-for="(label, i) in xLabels"
          :key="`xlabel-${i}`"
          :x="label.x"
          :y="height - 8"
          text-anchor="middle"
          font-size="9"
          font-weight="700"
          fill="#8A93A6"
        >
          {{ label.label }}
        </text>
      </svg>

      <div
        v-else
        class="flex flex-col items-center justify-center py-12 text-center"
      >
        <div
          class="w-12 h-12 rounded-full bg-[#1B4F4A]/20 border border-[#2C6E67]/30 flex items-center justify-center mb-3"
        >
          <svg class="w-5 h-5 text-[#7FE0CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p class="text-sm text-[#EDEFF4] font-bold">Sem dados de tendência</p>
        <p class="text-xs text-[#8A93A6] mt-1">
          Adicione agendamentos para ver a evolução
        </p>
      </div>
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
