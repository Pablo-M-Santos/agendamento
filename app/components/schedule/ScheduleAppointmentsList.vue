<script setup lang="ts">
import { computed, nextTick, watch } from 'vue'
import { format } from 'date-fns'
import type { Timestamp } from 'firebase/firestore'
import type { Agendamento } from '~/composables/useAgendamentos'

const props = defineProps<{
  agendamentos: Agendamento[]
  highlightedId?: string | null
}>()

const emit = defineEmits<{
  (e: 'details', item: Agendamento): void
  (e: 'edit', item: Agendamento): void
  (e: 'delete', id: string): void
}>()

const getHora = (ts: Timestamp | null | undefined): string =>
  ts ? format(ts.toDate(), 'HH:mm') : '--:--'

const indiceAlvo = computed(() => {
  const alvo = props.highlightedId
  if (!alvo) return -1
  return props.agendamentos.findIndex((item) => item.id === alvo)
})

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
      <h3 class="font-black text-[#F5F6FA] uppercase text-xs tracking-[0.15em]">Serviços do Dia</h3>
      <div class="h-[1px] flex-1 bg-white/5 ml-4" />
    </div>

    <div v-if="agendamentos.length > 0" class="space-y-4">
      <div
        v-for="item in agendamentos"
        :key="item.id"
        :id="`agendamento-${item.id}`"
        :class="[
          'bg-[#131314]/45 hover:bg-[#131314] p-4 rounded-3xl border active:scale-[0.99] transition-all',
          item.id === highlightedId
            ? 'border-[#00D3B8] shadow-[0_0_0_2px_rgba(0,211,184,0.25)]'
            : 'border-white/25'
        ]"
        @click="emit('details', item)"
      >
        <div class="flex items-center justify-between gap-3">
          <div class="inline-flex items-center gap-2 bg-white text-[#003D7A] px-3 py-2 rounded-xl">
            <span class="text-[10px] font-black uppercase tracking-[0.14em]">Horario</span>
            <span class="text-sm font-black">{{ getHora(item.data) }}</span>
          </div>

          <span
            v-if="item.materialPronto === true"
            class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-emerald-400 text-[#003D7A]"
          >
            Material pronto
          </span>
          <span
            v-else-if="item.materialPronto === false"
            class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-amber-300 text-[#4A2C00]"
          >
            Sem material
          </span>
          <span
            v-else
            class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-white/10 text-white/70"
          >
            Sem status
          </span>
        </div>

        <div class="mt-4 rounded-2xl border border-white/20 bg-white/5 p-4">
          <p class="text-[10px] text-white/60 font-black uppercase tracking-[0.16em]">Endereco</p>
          <p class="text-sm text-white font-bold mt-1 leading-relaxed">
            {{ item.endereco || 'Endereco nao informado' }}
            <template v-if="item.numeroCasa">, Casa {{ item.numeroCasa }}</template>
          </p>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-2">
          <button
            class="bg-[#00D3B8]/25 text-white py-2.5 rounded-xl font-black text-xs active:scale-95 transition-all"
            @click.stop="emit('edit', item)"
          >
            Editar
          </button>

          <button
            class="bg-red-600/50 text-white py-2.5 rounded-xl font-black text-xs active:scale-95 transition-all"
            @click.stop="emit('delete', item.id)"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-20">
      <div
        class="w-16 h-16 border-2 border-dashed border-white rounded-full mb-4 flex items-center justify-center"
      >
        <span class="text-2xl">📅</span>
      </div>
      <p class="font-bold uppercase tracking-widest text-xs">Nenhum Serviço agendado</p>
    </div>
  </main>
</template>
