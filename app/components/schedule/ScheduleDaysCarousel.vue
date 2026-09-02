<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { format, isSameDay } from 'date-fns'

const { dateLocale } = useUserSettings()

const props = defineProps<{
  diasCarrossel: Date[]
  dataSelecionada: Date
  quantidadePorDia: Record<string, number>
}>()

const emit = defineEmits<{
  (e: 'update:dataSelecionada', value: Date): void
}>()

const eHoje = (dia: Date) => isSameDay(dia, new Date())

const carouselRef = ref<HTMLElement | null>(null)
let selectedCenterTimer: ReturnType<typeof setTimeout> | null = null

const getDiaLetra = (date: Date) =>
  format(date, 'eeeeee', { locale: dateLocale.value }).charAt(0).toUpperCase()

const getQuantidadePorDia = (dia: Date) => {
  const chave = format(dia, 'yyyy-MM-dd')
  return props.quantidadePorDia[chave] || 0
}

const centralizarDataSelecionada = (dia: Date) => {
  const container = carouselRef.value
  if (!container) return

  const dateKey = format(dia, 'yyyy-MM-dd')
  const alvo = container.querySelector<HTMLButtonElement>(`button[data-date='${dateKey}']`)
  if (!alvo) return

  alvo.scrollIntoView({
    behavior: 'smooth',
    inline: 'center',
    block: 'nearest'
  })
}

const reagendarCentralizacao = (dia: Date) => {
  if (selectedCenterTimer) {
    clearTimeout(selectedCenterTimer)
  }

  selectedCenterTimer = setTimeout(() => {
    centralizarDataSelecionada(dia)
  }, 2000)
}

const handleClickDia = (dia: Date) => {
  emit('update:dataSelecionada', dia)
  reagendarCentralizacao(dia)
}

watch(
  () => props.dataSelecionada,
  (novaData) => {
    reagendarCentralizacao(novaData)
  }
)

onBeforeUnmount(() => {
  if (selectedCenterTimer) {
    clearTimeout(selectedCenterTimer)
  }
})
</script>

<template>
  <div
    ref="carouselRef"
    class="flex overflow-x-auto px-2 sm:px-6 py-6 sm:py-8 gap-2 sm:gap-3 no-scrollbar scroll-smooth snap-x snap-proximity"
  >
    <button
      v-for="dia in diasCarrossel"
      :id="'dia-' + format(dia, 'yyyy-MM-dd')"
      :key="dia.toISOString()"
      :data-date="format(dia, 'yyyy-MM-dd')"
        :class="[
          'relative flex flex-col items-center min-w-[65px] py-4 rounded-[10px] transition-all duration-300 snap-center',
          isSameDay(dia, dataSelecionada)
            ? 'bg-[#1B4F4A] text-[#EAFBF6] scale-110 shadow-md'
            : eHoje(dia)
              ? 'border-2 border-[#4FD1C5] text-[#4FD1C5] font-bold'
              : 'border-2 border-transparent text-[#EDEFF4] hover:bg-white/5'
        ]"
      @click="handleClickDia(dia)"
    >
      <div
        v-if="getQuantidadePorDia(dia) > 0"
        :class="[
          'absolute -top-3 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-md',
          isSameDay(dia, dataSelecionada)
            ? 'bg-[#4FD1C5] text-[#141A28]'
            : 'bg-[#1B4F4A] text-[#EAFBF6]'
        ]"
      >
        {{ getQuantidadePorDia(dia) }}
      </div>

      <span
        :class="[
          'text-[16px] uppercase font-black tracking-widest mb-1',
          isSameDay(dia, dataSelecionada) ? 'text-[#EAFBF6]' : 'text-[#EDEFF4]'
        ]"
      >
        {{ getDiaLetra(dia) }}
      </span>

      <span
        :class="[
          'font-black text-xl',
          isSameDay(dia, dataSelecionada) ? 'text-[#EAFBF6]' : 'text-[#EDEFF4]'
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
