<script setup lang="ts">
import { nextTick, watch } from 'vue'
import { format } from 'date-fns'
import type { Timestamp } from 'firebase/firestore'
import type { Agendamento } from '~/composables/useAgendamentos'

const { t } = useAppI18n()

const props = defineProps<{
  agendamentos: Agendamento[]
  highlightedId?: string | null
}>()

const emit = defineEmits<{
  (e: 'details' | 'edit' | 'toggle-completed', item: Agendamento): void
}>()

const getHora = (ts: Timestamp | null | undefined): string =>
  ts ? format(ts.toDate(), 'HH:mm') : '--:--'

watch(
  () => [props.agendamentos, props.highlightedId],
  async () => {
    const alvo = props.highlightedId
    if (!alvo) return

    await nextTick()

    setTimeout(() => {
      const el = document.getElementById(`agendamento-${alvo}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 180)
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <main class="mt-4 sm:mt-6 pb-24 md:pb-8">
    <div class="flex items-center gap-4 mb-4 sm:mb-5">
      <div class="flex-1 h-[1px] bg-[#262E42]" />
      <h3
        class="font-black text-xs sm:text-sm tracking-[0.15em] text-[#8A93A6] uppercase"
      >
        {{ t('schedule.servicesOfDay') }}
      </h3>
      <div class="flex-1 h-[1px] bg-[#262E42]" />
    </div>

    <div v-if="agendamentos.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
      <div
        v-for="item in agendamentos"
        :id="`agendamento-${item.id}`"
        :key="item.id"
        :class="[
          'rounded-2xl border bg-[#1A2132] p-5 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 cursor-pointer',
          item.id === highlightedId
            ? 'border-[#4FD1C5] shadow-[0_0_0_2px_rgba(79,209,197,0.15)]'
            : 'border-[#262E42] hover:border-[#8A93A6]/30'
        ]"
        @click.stop="emit('details', item)"
      >
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-black text-[#EDEFF4] truncate">
              {{ item.cliente }}
            </p>
            <p class="text-xs text-[#8A93A6] mt-1 truncate">
              {{ item.endereco || t('schedule.addressNotInformed') }}
              <template v-if="item.numeroCasa">, Casa {{ item.numeroCasa }}</template>
            </p>
          </div>

          <div class="flex flex-col items-end flex-shrink-0 pl-3">
            <span class="text-xl font-black text-[#4FD1C5]">{{ getHora(item.data) }}</span>
            <span class="text-[10px] font-bold text-[#6E7789] uppercase tracking-wider mt-0.5">Agendado</span>
          </div>
        </div>

        <div v-if="item.descricao" class="text-xs text-[#8A93A6] mb-3 line-clamp-2">
          {{ item.descricao }}
        </div>

        <div class="flex flex-wrap gap-2">
          <span
            v-if="item.materialPronto === true"
            class="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#1B4F4A] text-[#7FE0CC]"
          >
            {{ t('schedule.materialReady') }}
          </span>
          <span
            v-else-if="item.materialPronto === false"
            class="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#3D2A2A] text-[#F5A89C]"
          >
            {{ t('schedule.noMaterial') }}
          </span>
          <span
            v-else
            class="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#262E42] text-[#8A93A6]"
          >
            Material não informado
          </span>

          <span
            v-if="item.servicoConcluido === true"
            class="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#233350] text-[#9FC1F5]"
          >
            {{ t('schedule.serviceCompleted') }}
          </span>
          <span
            v-else-if="item.servicoConcluido === false"
            class="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#2A3D2A] text-[#B8E0C8]"
          >
            {{ t('schedule.serviceOpen') }}
          </span>
          <span
            v-else
            class="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#262E42] text-[#8A93A6]"
          >
            {{ t('schedule.serviceNotCompleted') }}
          </span>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-20">
      <div
        class="w-16 h-16 border-2 border-dashed rounded-full mb-4 flex items-center justify-center border-[#262E42]"
      >
        <span class="text-2xl">📅</span>
      </div>
      <p class="font-bold uppercase tracking-widest text-xs text-[#8A93A6]">
        {{ t('schedule.noServicesScheduled') }}
      </p>
    </div>
  </main>
</template>
