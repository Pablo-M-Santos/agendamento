<script setup lang="ts">
import { format } from 'date-fns'
import type { Agendamento } from '~/composables/useAgendamentos'

const { t } = useAppI18n()

const props = defineProps<{
  modelValue: boolean
  agendamento: Agendamento | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'edit' | 'toggle-status', item: Agendamento): void
}>()

const fechar = () => emit('update:modelValue', false)

const editar = () => {
  if (!props.agendamento) return
  emit('edit', props.agendamento)
}

const toggleStatus = () => {
  if (!props.agendamento) return
  emit('toggle-status', props.agendamento)
}

const formatarDataHora = (item: Agendamento) => format(item.data.toDate(), 'dd/MM/yyyy HH:mm')
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 backdrop-blur-sm z-[80] bg-[#001a17]/85"
        @click="fechar"
      />
    </Transition>

    <Transition name="slide-up">
      <section
        v-if="modelValue && agendamento"
        class="fixed inset-0 z-[90] overflow-y-auto bg-gradient-to-br from-[#002e29] via-[#001a17] to-[#001a17] text-white"
      >
        <div class="min-h-full flex flex-col">
          <div class="px-6 pt-6 pb-4">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-[11px] font-black uppercase tracking-[0.2em] text-[#80bfb8]">
                  {{ t('schedule.details') }}
                </p>
                <h3 class="text-2xl font-black mt-1">
                  {{ agendamento.cliente || t('schedule.client') }}
                </h3>
                <div class="flex items-center gap-2 mt-2">
                  <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#4da69c]/20">
                    <svg class="w-3.5 h-3.5 text-[#80bfb8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-sm font-bold text-[#80bfb8]">{{ formatarDataHora(agendamento) }}</span>
                  </div>
                </div>
              </div>

              <button
                class="w-11 h-11 rounded-xl border flex items-center justify-center transition border-[#4da69c]/30 bg-[#4da69c]/10 hover:bg-[#4da69c]/20"
                :aria-label="t('schedule.close')"
                @click="fechar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex-1 px-6 py-4 space-y-4">
            <article class="rounded-2xl border border-[#4da69c]/20 bg-[#003733]/50 p-4">
              <p class="text-[10px] uppercase tracking-[0.18em] font-black text-[#80bfb8]">
                {{ t('schedule.address') }}
              </p>
              <p class="text-sm font-semibold mt-1 text-white">
                {{ agendamento.endereco || t('schedule.notInformed') }}
                <template v-if="agendamento.numeroCasa">, Casa {{ agendamento.numeroCasa }}</template>
              </p>
            </article>

            <article
              v-if="agendamento.descricao"
              class="rounded-2xl border border-[#4da69c]/20 bg-[#003733]/50 p-4"
            >
              <p class="text-[10px] uppercase tracking-[0.18em] font-black text-[#80bfb8]">
                {{ t('schedule.service') }}
              </p>
              <p class="text-sm font-semibold mt-1 text-white">
                {{ agendamento.descricao }}
              </p>
            </article>

            <article class="rounded-2xl border border-[#4da69c]/20 bg-[#003733]/50 p-4">
              <p class="text-[10px] uppercase tracking-[0.18em] font-black mb-3 text-[#80bfb8]">
                {{ t('schedule.status') }}
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-if="agendamento.materialPronto === true"
                  class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-[#4da69c] text-white"
                >
                  {{ t('schedule.materialReady') }}
                </span>
                <span
                  v-else-if="agendamento.materialPronto === false"
                  class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-amber-500 text-white"
                >
                  {{ t('schedule.noMaterial') }}
                </span>
                <span
                  v-else
                  class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-white/20 text-white"
                >
                  {{ t('schedule.materialNotInformed') }}
                </span>

                <span
                  v-if="agendamento.servicoConcluido === true"
                  class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-emerald-500 text-white"
                >
                  {{ t('schedule.serviceCompleted') }}
                </span>
                <span
                  v-else-if="agendamento.servicoConcluido === false"
                  class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-sky-500 text-white"
                >
                  {{ t('schedule.serviceOpen') }}
                </span>
                <span
                  v-else
                  class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-white/20 text-white"
                >
                  {{ t('schedule.serviceNotCompleted') }}
                </span>
              </div>
            </article>

            <article
              v-if="agendamento.telefone || agendamento.referencia || agendamento.observacoes"
              class="rounded-2xl border border-[#4da69c]/20 bg-[#003733]/50 p-4"
            >
              <p class="text-[10px] uppercase tracking-[0.18em] font-black mb-3 text-[#80bfb8]">
                {{ t('schedule.extras') }}
              </p>
              <ul class="space-y-2 text-sm">
                <li v-if="agendamento.telefone">
                  <span class="text-[#80bfb8]">{{ t('schedule.phone') }}:</span>
                  <span class="font-semibold text-white ml-1">{{ agendamento.telefone }}</span>
                </li>
                <li v-if="agendamento.referencia">
                  <span class="text-[#80bfb8]">{{ t('schedule.reference') }}:</span>
                  <span class="font-semibold text-white ml-1">{{ agendamento.referencia }}</span>
                </li>
                <li v-if="agendamento.observacoes">
                  <span class="text-[#80bfb8]">{{ t('schedule.notes') }}:</span>
                  <span class="font-semibold text-white ml-1">{{ agendamento.observacoes }}</span>
                </li>
              </ul>
            </article>
          </div>

          <div class="px-6 py-4 border-t border-[#4da69c]/20 bg-[#001a17]/80 space-y-3">
            <button
              class="w-full py-3.5 rounded-xl font-black text-sm transition-all"
              :class="agendamento.servicoConcluido === true
                ? 'bg-sky-500/20 text-white border border-sky-500/30'
                : 'bg-emerald-500/20 text-white border border-emerald-500/30'"
              @click="toggleStatus"
            >
              {{ agendamento.servicoConcluido === true ? t('schedule.reopen') : t('schedule.complete') }}
            </button>

            <div class="grid grid-cols-2 gap-3">
              <button
                class="py-3.5 rounded-xl border font-black text-sm border-white/20 bg-white/10 text-white"
                @click="fechar"
              >
                {{ t('schedule.close') }}
              </button>
              <button
                class="py-3.5 rounded-xl bg-white text-[#001a17] font-black text-sm active:scale-[0.99] transition"
                @click="editar"
              >
                {{ t('schedule.edit') }}
              </button>
            </div>
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
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
