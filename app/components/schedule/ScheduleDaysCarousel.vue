<script setup lang="ts">
import { format, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const props = defineProps<{
  diasCarrossel: Date[]
  dataSelecionada: Date
  quantidadePorDia: Record<string, number>
}>()

const emit = defineEmits<{
  (e: 'update:dataSelecionada', value: Date): void
}>()

const eHoje = (dia: Date) => isSameDay(dia, new Date())

const getDiaLetra = (date: Date) => format(date, 'eeeeee', { locale: ptBR }).charAt(0).toUpperCase()

const getQuantidadePorDia = (dia: Date) => {
  const chave = format(dia, 'yyyy-MM-dd')
  return props.quantidadePorDia[chave] || 0
}
</script>

<template>
  <div class="flex overflow-x-auto px-6 py-8 gap-3 no-scrollbar scroll-smooth">
    <button
      v-for="dia in diasCarrossel"
      :id="'dia-' + format(dia, 'yyyy-MM-dd')"
      :key="dia.toISOString()"
      :class="[
        'relative flex flex-col items-center min-w-[65px] py-4 rounded-[10px] transition-all duration-300',
        isSameDay(dia, dataSelecionada)
          ? 'bg-[#FBFBFB] text-white scale-110 shadow-md'
          : eHoje(dia)
            ? 'border-[#FBFBFB] text-white font-bold'
            : 'border-transparent text-white hover:bg-white/10'
      ]"
      @click="emit('update:dataSelecionada', dia)"
    >
      <div
        v-if="getQuantidadePorDia(dia) > 0"
        class="absolute -top-3 bg-green-500 text-black text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-md"
      >
        {{ getQuantidadePorDia(dia) }}
      </div>

      <span
        :class="[
          'text-[16px] uppercase font-black tracking-widest mb-1',
          isSameDay(dia, dataSelecionada) ? 'text-[#003D7A]' : 'text-white'
        ]"
      >
        {{ getDiaLetra(dia) }}
      </span>

      <span
        :class="[
          'font-black text-xl',
          isSameDay(dia, dataSelecionada) ? 'text-[#003D7A]' : 'text-white'
        ]"
      >
        {{ format(dia, 'd') }}
      </span>
    </button>
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
