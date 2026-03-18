<script setup lang="ts">
import { format } from 'date-fns'
import type { Agendamento } from '~/composables/useAgendamentos'

const props = defineProps<{
  modelValue: boolean
  agendamento: Agendamento | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'edit', item: Agendamento): void
}>()

const fechar = () => emit('update:modelValue', false)

const editar = () => {
  if (!props.agendamento) return
  emit('edit', props.agendamento)
}

const formatarDataHora = (item: Agendamento) => format(item.data.toDate(), 'dd/MM/yyyy HH:mm')
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 bg-[#0A2A52]/85 backdrop-blur-sm z-[80]"
        @click="fechar"
      />
    </Transition>

    <Transition name="slide-up">
      <section
        v-if="modelValue && agendamento"
        class="fixed inset-x-0 bottom-0 z-[90] bg-[#003D7A] text-white rounded-t-[2rem] border-t border-white/15 max-h-[88vh] overflow-y-auto"
      >
        <div class="px-6 pt-4 pb-6">
          <div class="w-12 h-1 rounded-full bg-white/35 mx-auto mb-4" />

          <header class="mb-6">
            <p class="text-[11px] uppercase tracking-[0.18em] font-black text-white/70">Detalhes</p>
            <h3 class="text-2xl font-black mt-1 leading-tight">
              {{ agendamento.cliente || 'Cliente' }}
            </h3>
            <p class="text-sm text-white/80 mt-1">{{ formatarDataHora(agendamento) }}</p>
          </header>

          <div class="space-y-4">
            <article class="rounded-2xl border border-white/20 bg-white/8 p-4">
              <p class="text-[10px] uppercase tracking-[0.18em] font-black text-white/70">
                Endereco
              </p>
              <p class="text-sm font-semibold mt-1">
                {{ agendamento.endereco || 'Nao informado' }}
                <template v-if="agendamento.numeroCasa"
                  >, Casa {{ agendamento.numeroCasa }}</template
                >
              </p>
            </article>

            <article class="rounded-2xl border border-white/20 bg-white/8 p-4">
              <p class="text-[10px] uppercase tracking-[0.18em] font-black text-white/70">
                Servico
              </p>
              <p class="text-sm font-semibold mt-1">
                {{ agendamento.descricao || 'Sem descricao' }}
              </p>
            </article>

            <article class="rounded-2xl border border-white/20 bg-white/8 p-4">
              <p class="text-[10px] uppercase tracking-[0.18em] font-black text-white/70 mb-2">
                Status
              </p>
              <span
                v-if="agendamento.materialPronto === true"
                class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-emerald-400 text-[#003D7A]"
              >
                Material pronto
              </span>
              <span
                v-else-if="agendamento.materialPronto === false"
                class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-amber-300 text-[#4A2C00]"
              >
                Sem material
              </span>
              <span v-else class="text-sm text-white/70">Nao informado</span>
            </article>

            <article class="rounded-2xl border border-white/20 bg-white/8 p-4">
              <p class="text-[10px] uppercase tracking-[0.18em] font-black text-white/70 mb-2">
                Complementos
              </p>
              <ul class="space-y-2 text-sm">
                <li>
                  <span class="text-white/65">Telefone:</span>
                  <span class="font-semibold"> {{ agendamento.telefone || 'Nao informado' }}</span>
                </li>
                <li>
                  <span class="text-white/65">Referencia:</span>
                  <span class="font-semibold">
                    {{ agendamento.referencia || 'Nao informada' }}</span
                  >
                </li>
                <li>
                  <span class="text-white/65">Observacoes:</span>
                  <span class="font-semibold"> {{ agendamento.observacoes || 'Nenhuma' }}</span>
                </li>
              </ul>
            </article>
          </div>

          <div class="grid grid-cols-2 gap-3 mt-6">
            <button
              class="py-3 rounded-xl border border-white/25 bg-white/10 font-black text-sm"
              @click="fechar"
            >
              Fechar
            </button>
            <button
              class="py-3 rounded-xl bg-[#00D3B8] text-[#003D7A] font-black text-sm"
              @click="editar"
            >
              Editar
            </button>
          </div>
        </div>
      </section>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.25s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
