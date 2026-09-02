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
    <div class="flex justify-between items-center mb-4 sm:mb-6">
      <h3
        class="font-black uppercase text-xs sm:text-sm tracking-[0.15em] text-[#EDEFF4]"
      >
        {{ t('schedule.servicesOfDay') }}
      </h3>
      <div class="h-[1px] flex-1 ml-4 bg-[#262E42]" />
    </div>

    <div v-if="agendamentos.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
      <div
        v-for="item in agendamentos"
        :id="`agendamento-${item.id}`"
        :key="item.id"
        :class="[
          'rounded-2xl border transition-all bg-[#1A2132]',
          item.id === highlightedId
            ? 'border-[#4FD1C5] shadow-[0_0_0_2px_rgba(79,209,197,0.2)]'
            : 'border-[#262E42]'
        ]"
      >
        <div class="p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-[#EDEFF4] truncate">
                {{ item.cliente }}
              </p>
              <p class="text-xs text-[#8A93A6] mt-0.5 truncate">
                {{ item.endereco || t('schedule.addressNotInformed') }}
                <template v-if="item.numeroCasa">, Casa {{ item.numeroCasa }}</template>
              </p>
            </div>

            <div class="flex flex-col items-end flex-shrink-0">
              <span class="text-lg font-black text-[#4FD1C5]">{{ getHora(item.data) }}</span>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 mt-3">
            <span
              v-if="item.materialPronto === true"
              class="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-[#233350] text-[#9FC1F5]"
            >
              {{ t('schedule.materialReady') }}
            </span>
            <span
              v-else-if="item.materialPronto === false"
              class="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-[#233350] text-[#9FC1F5]"
            >
              {{ t('schedule.noMaterial') }}
            </span>

            <span
              v-if="item.servicoConcluido === true"
              class="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-[#1B4F4A] text-[#7FE0CC]"
            >
              {{ t('schedule.serviceCompleted') }}
            </span>
            <span
              v-else-if="item.servicoConcluido === false"
              class="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-[#233350] text-[#9FC1F5]"
            >
              {{ t('schedule.serviceOpen') }}
            </span>
            <span
              v-else
              class="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-[#262E42] text-[#8A93A6]"
            >
              {{ t('schedule.serviceNotCompleted') }}
            </span>
          </div>
        </div>

        <div class="border-t border-[#262E42] p-3 flex gap-2">
          <button
            class="flex-1 py-2.5 rounded-xl font-black text-xs active:scale-95 transition-all bg-[#1E2A3D] text-[#EDEFF4] border border-[#262E42]"
            @click.stop="emit('details', item)"
          >
            {{ t('schedule.view') }}
          </button>

          <button
            class="flex-1 py-2.5 rounded-xl font-black text-xs active:scale-95 transition-all bg-[#1E2A3D] text-[#EDEFF4] border border-[#262E42]"
            @click.stop="emit('edit', item)"
          >
            {{ t('schedule.edit') }}
          </button>

          <button
            class="flex-1 py-2.5 rounded-xl font-black text-xs active:scale-95 transition-all"
            :class="item.servicoConcluido === true
              ? 'bg-[#233350] text-[#9FC1F5] border border-[#33517F]'
              : 'bg-[#1B4F4A] text-[#7FE0CC] border border-[#2C6E67]'"
            @click.stop="emit('toggle-completed', item)"
          >
            {{ item.servicoConcluido === true ? t('schedule.reopen') : t('schedule.complete') }}
          </button>
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
