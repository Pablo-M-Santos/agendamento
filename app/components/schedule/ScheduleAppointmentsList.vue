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
  <main class="px-4 mt-4 pb-24 md:pb-6">
    <div class="flex justify-between items-center mb-6">
      <h3
        class="font-black uppercase text-xs tracking-[0.15em] text-white"
      >
        {{ t('schedule.servicesOfDay') }}
      </h3>
      <div class="h-[1px] flex-1 ml-4 bg-[#4da69c]/30" />
    </div>

    <div v-if="agendamentos.length > 0" class="space-y-4">
      <div
        v-for="item in agendamentos"
        :id="`agendamento-${item.id}`"
        :key="item.id"
        :class="[
          'rounded-2xl border transition-all bg-gradient-to-br from-[#003733]/80 to-[#002e29]/80',
          item.id === highlightedId
            ? 'border-[#4da69c] shadow-[0_0_0_2px_rgba(77,166,156,0.25)]'
            : 'border-[#4da69c]/20'
        ]"
      >
        <div class="p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-white truncate">
                {{ item.cliente }}
              </p>
              <p class="text-xs text-[#80bfb8] mt-0.5 truncate">
                {{ item.endereco || t('schedule.addressNotInformed') }}
                <template v-if="item.numeroCasa">, Casa {{ item.numeroCasa }}</template>
              </p>
            </div>

            <div class="flex flex-col items-end flex-shrink-0">
              <span class="text-lg font-black text-[#4da69c]">{{ getHora(item.data) }}</span>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 mt-3">
            <span
              v-if="item.materialPronto === true"
              class="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-[#4da69c] text-white"
            >
              {{ t('schedule.materialReady') }}
            </span>
            <span
              v-else-if="item.materialPronto === false"
              class="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-amber-500 text-white"
            >
              {{ t('schedule.noMaterial') }}
            </span>

            <span
              v-if="item.servicoConcluido === true"
              class="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-emerald-500 text-white"
            >
              {{ t('schedule.serviceCompleted') }}
            </span>
            <span
              v-else-if="item.servicoConcluido === false"
              class="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-sky-500 text-white"
            >
              {{ t('schedule.serviceOpen') }}
            </span>
            <span
              v-else
              class="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-white/20 text-white"
            >
              {{ t('schedule.serviceNotCompleted') }}
            </span>
          </div>
        </div>

        <div class="border-t border-[#4da69c]/20 p-3 flex gap-2">
          <button
            class="flex-1 py-2.5 rounded-xl font-black text-xs active:scale-95 transition-all bg-white/10 text-white border border-white/20"
            @click.stop="emit('details', item)"
          >
            {{ t('schedule.view') }}
          </button>

          <button
            class="flex-1 py-2.5 rounded-xl font-black text-xs active:scale-95 transition-all bg-white/10 text-white border border-white/20"
            @click.stop="emit('edit', item)"
          >
            {{ t('schedule.edit') }}
          </button>

          <button
            class="flex-1 py-2.5 rounded-xl font-black text-xs active:scale-95 transition-all"
            :class="item.servicoConcluido === true
              ? 'bg-sky-500/20 text-white border border-sky-500/30'
              : 'bg-emerald-500/20 text-white border border-emerald-500/30'"
            @click.stop="emit('toggle-completed', item)"
          >
            {{ item.servicoConcluido === true ? t('schedule.reopen') : t('schedule.complete') }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-20">
      <div
        class="w-16 h-16 border-2 border-dashed rounded-full mb-4 flex items-center justify-center border-[#4da69c]/40"
      >
        <span class="text-2xl">📅</span>
      </div>
      <p class="font-bold uppercase tracking-widest text-xs text-[#80bfb8]">
        {{ t('schedule.noServicesScheduled') }}
      </p>
    </div>
  </main>
</template>
