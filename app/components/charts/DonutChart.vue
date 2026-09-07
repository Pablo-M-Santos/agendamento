<script setup lang="ts">
import { computed } from 'vue'

type Segment = {
  label: string
  value: number
  color: string
  textColor?: string
}

const props = withDefaults(
  defineProps<{
    segments: Segment[]
    size?: number
    strokeWidth?: number
    centerLabel?: string
    centerSubLabel?: string
  }>(),
  {
    size: 128,
    strokeWidth: 12
  }
)

const raio = computed(() => props.size / 2 - props.strokeWidth / 2)
const circunferencia = computed(() => 2 * Math.PI * raio.value)
const total = computed(() => props.segments.reduce((acc, seg) => acc + seg.value, 0))

let offsetAtual = 0
const arcos = computed(() => {
  offsetAtual = 0
  if (total.value === 0) return []
  return props.segments.map((seg) => {
    const comprimento = (seg.value / total.value) * circunferencia.value
    const arco = {
      ...seg,
      comprimento,
      offset: -offsetAtual,
      percent: (seg.value / total.value) * 100
    }
    offsetAtual += comprimento
    return arco
  })
})
</script>

<template>
  <div
    class="relative inline-flex items-center justify-center"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 128 128"
      class="-rotate-90"
    >
      <circle
        cx="64"
        cy="64"
        :r="54"
        fill="transparent"
        stroke="#262E42"
        :stroke-width="strokeWidth"
      />
      <circle
        v-for="(arco, index) in arcos"
        :key="index"
        cx="64"
        cy="64"
        r="54"
        fill="transparent"
        :stroke="arco.color"
        :stroke-width="strokeWidth"
        :stroke-dasharray="`${arco.comprimento} ${circunferencia}`"
        :stroke-dashoffset="arco.offset"
        stroke-linecap="butt"
        class="transition-all duration-500"
      />
    </svg>
    <div
      v-if="centerLabel || centerSubLabel"
      class="absolute inset-0 flex flex-col items-center justify-center"
    >
      <span
        v-if="centerLabel"
        class="text-2xl sm:text-3xl font-black text-[#EDEFF4] tabular-nums"
      >
        {{ centerLabel }}
      </span>
      <span
        v-if="centerSubLabel"
        class="text-[9px] font-black uppercase tracking-wider text-[#8A93A6] mt-0.5"
      >
        {{ centerSubLabel }}
      </span>
    </div>
  </div>
</template>
