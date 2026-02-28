<script setup lang="ts">
import { format } from 'date-fns'
import type { Timestamp } from 'firebase/firestore'
import type { Agendamento } from '~/composables/useAgendamentos'

defineProps<{
  agendamentos: Agendamento[]
}>()

const emit = defineEmits<{
  (e: 'edit', item: Agendamento): void
  (e: 'delete', id: string): void
}>()

const getHora = (ts: Timestamp | null | undefined): string =>
  ts ? format(ts.toDate(), 'HH:mm') : '--:--'
</script>

<template>
  <main class="px-6 mt-4">
    <div class="flex justify-between items-center mb-6">
      <h3 class="font-black text-[#F5F6FA] uppercase text-xs tracking-[0.15em]">Serviços do Dia</h3>
      <div class="h-[1px] flex-1 bg-white/5 ml-4" />
    </div>

    <div v-if="agendamentos.length > 0" class="space-y-4">
      <div
        v-for="item in agendamentos"
        :key="item.id"
        class="bg-[#131314]/40 hover:bg-[#131314] p-5 rounded-[2.5rem] border-2 border-white flex items-start gap-5 active:scale-[0.98] transition-all group"
        @click="emit('edit', item)"
      >
        <div
          class="flex flex-col items-center justify-center bg-[#FBFBFB] px-3 py-4 rounded-2xl min-w-[60px] border border-white/5 shadow-inner"
        >
          <span class="text-white font-black text-sm">{{ getHora(item.data) }}</span>
        </div>

        <div class="flex-1">
          <div class="flex justify-between items-start">
            <div>
              <span class="text-lg font-black text-white block leading-tight">{{
                item.cliente
              }}</span>
              <span
                class="text-xs text-[#ffffff] font-bold mt-1 block opacity-80 uppercase tracking-wider"
                >{{ item.descricao || 'Sem descrição' }}</span
              >
            </div>
            <button
              class="bg-red-600/50 text-white px-5 py-3 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all"
              @click.stop="emit('delete', item.id)"
            >
              Excluir
            </button>
          </div>
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
