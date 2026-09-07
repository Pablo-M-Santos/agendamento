<script setup lang="ts">
import { computed } from 'vue'

type Cell = {
  value: number
}

const props = withDefaults(
  defineProps<{
    rows: { label: string; cells: Cell[] }[]
    columns: string[]
  }>(),
  {}
)

const max = computed(() => {
  let m = 0
  props.rows.forEach((row) => {
    row.cells.forEach((cell) => {
      if (cell.value > m) m = cell.value
    })
  })
  return m || 1
})

const temDados = computed(() => {
  return props.rows.some((row) => row.cells.some((cell) => cell.value > 0))
})

const getCor = (value: number) => {
  if (value === 0) return '#262E42'
  const intensidade = value / max.value
  if (intensidade < 0.2) return 'rgba(79, 209, 197, 0.25)'
  if (intensidade < 0.4) return 'rgba(79, 209, 197, 0.45)'
  if (intensidade < 0.6) return 'rgba(79, 209, 197, 0.65)'
  if (intensidade < 0.8) return 'rgba(79, 209, 197, 0.85)'
  return 'rgba(79, 209, 197, 1)'
}

const cellSize = 32
const cellGap = 4
const labelWidth = 48
</script>

<template>
  <div v-if="temDados">
    <div class="flex" :style="{ paddingLeft: `${labelWidth}px` }">
      <div
        v-for="(col, i) in columns"
        :key="`col-${i}`"
        :style="{
          width: `${cellSize}px`,
          marginRight: `${cellGap}px`
        }"
        class="text-center text-[10px] font-black uppercase tracking-wider text-[#8A93A6]"
      >
        {{ col }}
      </div>
    </div>

    <div
      v-for="(row, rIdx) in rows"
      :key="`row-${rIdx}`"
      class="flex items-center mt-1"
    >
      <div
        :style="{ width: `${labelWidth}px` }"
        class="text-[10px] font-black uppercase tracking-wider text-[#8A93A6] pr-2 text-right"
      >
        {{ row.label }}
      </div>
      <div
        v-for="(cell, cIdx) in row.cells"
        :key="`cell-${rIdx}-${cIdx}`"
        :style="{
          width: `${cellSize}px`,
          height: `${cellSize}px`,
          marginRight: `${cellGap}px`,
          backgroundColor: getCor(cell.value)
        }"
        class="rounded-md flex items-center justify-center text-[11px] font-black transition-colors"
        :class="cell.value > 0 && cell.value / max > 0.6 ? 'text-[#0F1420]' : 'text-[#EDEFF4]'"
      >
        {{ cell.value > 0 ? cell.value : '' }}
      </div>
    </div>

    <div class="flex items-center justify-end gap-2 mt-4 text-[10px] text-[#8A93A6]">
      <span>Menos</span>
      <div class="flex gap-1">
        <div class="w-3.5 h-3.5 rounded-sm" style="background: #262E42" />
        <div class="w-3.5 h-3.5 rounded-sm" style="background: rgba(79, 209, 197, 0.25)" />
        <div class="w-3.5 h-3.5 rounded-sm" style="background: rgba(79, 209, 197, 0.5)" />
        <div class="w-3.5 h-3.5 rounded-sm" style="background: rgba(79, 209, 197, 0.8)" />
        <div class="w-3.5 h-3.5 rounded-sm" style="background: rgba(79, 209, 197, 1)" />
      </div>
      <span>Mais</span>
    </div>
  </div>

  <div v-else class="flex flex-col items-center justify-center py-10 text-center">
    <div
      class="w-14 h-14 rounded-full bg-[#1B4F4A]/20 border border-[#2C6E67]/30 flex items-center justify-center mb-3"
    >
      <svg class="w-6 h-6 text-[#7FE0CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
    <p class="text-sm text-[#EDEFF4] font-bold">Sem agendamentos no período</p>
    <p class="text-xs text-[#8A93A6] mt-1">
      Cadastre serviços para ver o mapa de movimento
    </p>
  </div>
</template>
