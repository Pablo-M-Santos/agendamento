<script setup lang="ts">
import { nextTick, watch } from 'vue'
import { format } from 'date-fns'
import type { Timestamp } from 'firebase/firestore'
import type { Agendamento } from '~/composables/useAgendamentos'

const { t } = useAppI18n()
const { settings } = useUserSettings()
const isLightTheme = computed(() => settings.value.theme === 'light')

const props = defineProps<{
  agendamentos: Agendamento[]
  highlightedId?: string | null
}>()

const emit = defineEmits<{
  (e: 'details' | 'edit', item: Agendamento): void
  (e: 'delete', id: string): void
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
  <main class="px-4 mt-4">
    <div class="flex justify-between items-center mb-6">
      <h3
        class="font-black uppercase text-xs tracking-[0.15em]"
        :class="isLightTheme ? 'text-[#5B6B8A]' : 'text-[#F5F6FA]'"
      >
        {{ t('schedule.servicesOfDay') }}
      </h3>
      <div class="h-[1px] flex-1 ml-4" :class="isLightTheme ? 'bg-[#D8E7FF]' : 'bg-white/5'" />
    </div>

    <div v-if="agendamentos.length > 0" class="space-y-4">
      <div
        v-for="item in agendamentos"
        :id="`agendamento-${item.id}`"
        :key="item.id"
        :class="[
          'p-4 rounded-3xl border active:scale-[0.99] transition-all',
          isLightTheme
            ? 'bg-[#003D7A] hover:bg-[#003872] text-white'
            : 'bg-[#131314]/45 hover:bg-[#131314]',
          item.id === highlightedId
            ? 'border-[#00D3B8] shadow-[0_0_0_2px_rgba(0,211,184,0.25)]'
            : isLightTheme
              ? 'border-white/20'
              : 'border-white/25'
        ]"
        @click="emit('details', item)"
      >
        <div class="flex items-center justify-between gap-3">
          <div
            class="inline-flex items-center gap-2 px-3 py-2 rounded-xl"
            :class="isLightTheme ? 'bg-white/15 text-white' : 'bg-white text-[#003D7A]'"
          >
            <span class="text-[10px] font-black uppercase tracking-[0.14em]">{{
              t('schedule.time')
            }}</span>
            <span class="text-sm font-black">{{ getHora(item.data) }}</span>
          </div>

          <span
            v-if="item.materialPronto === true"
            class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-emerald-400 text-[#003D7A]"
          >
            {{ t('schedule.materialReady') }}
          </span>
          <span
            v-else-if="item.materialPronto === false"
            class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-amber-300 text-[#4A2C00]"
          >
            {{ t('schedule.noMaterial') }}
          </span>
          <span
            v-else
            class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg"
            :class="isLightTheme ? 'bg-white/15 text-white/80' : 'bg-white/10 text-white/70'"
          >
            {{ t('schedule.noStatus') }}
          </span>
        </div>

        <div
          class="mt-4 rounded-2xl border p-4"
          :class="isLightTheme ? 'border-white/20 bg-white/10' : 'border-white/20 bg-white/5'"
        >
          <p
            class="text-[10px] font-black uppercase tracking-[0.16em]"
            :class="isLightTheme ? 'text-white/70' : 'text-white/60'"
          >
            {{ t('schedule.address') }}
          </p>
          <p
            class="text-sm font-bold mt-1 leading-relaxed"
            :class="isLightTheme ? 'text-white' : 'text-white'"
          >
            {{ item.endereco || t('schedule.addressNotInformed') }}
            <template v-if="item.numeroCasa">, Casa {{ item.numeroCasa }}</template>
          </p>
        </div>

        <div class="mt-3 flex items-center justify-end">
          <span
            v-if="item.servicoConcluido === true"
            class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-[#00D3B8] text-[#003D7A]"
          >
            {{ t('schedule.serviceCompleted') }}
          </span>
          <span
            v-else-if="item.servicoConcluido === false"
            class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg"
            :class="isLightTheme ? 'bg-white/20 text-white' : 'bg-white/15 text-white'"
          >
            {{ t('schedule.serviceOpen') }}
          </span>
          <span
            v-else
            class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg"
            :class="isLightTheme ? 'bg-white/15 text-white/80' : 'bg-white/10 text-white/70'"
          >
            {{ t('schedule.serviceNotCompleted') }}
          </span>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-2">
          <button
            class="py-2.5 rounded-xl font-black text-xs active:scale-95 transition-all"
            :class="isLightTheme ? 'bg-white/15 text-white' : 'bg-[#00D3B8]/25 text-white'"
            @click.stop="emit('edit', item)"
          >
            {{ t('schedule.edit') }}
          </button>

          <button
            class="bg-red-600/50 text-white py-2.5 rounded-xl font-black text-xs active:scale-95 transition-all"
            @click.stop="emit('delete', item.id)"
          >
            {{ t('schedule.delete') }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-20">
      <div
        class="w-16 h-16 border-2 border-dashed rounded-full mb-4 flex items-center justify-center"
        :class="isLightTheme ? 'border-[#BFD4F6]' : 'border-white'"
      >
        <span class="text-2xl">📅</span>
      </div>
      <p class="font-bold uppercase tracking-widest text-xs">
        {{ t('schedule.noServicesScheduled') }}
      </p>
    </div>
  </main>
</template>
