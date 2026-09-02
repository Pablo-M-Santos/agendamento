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
        class="fixed inset-0 backdrop-blur-sm z-[80] bg-[#0F1420]/70"
        @click="fechar"
      />
    </Transition>

    <Transition name="slide-up">
      <section
        v-if="modelValue && agendamento"
        class="fixed inset-0 z-[90] overflow-y-auto bg-[#141A28] text-[#EDEFF4]"
      >
        <div class="min-h-full flex flex-col max-w-2xl mx-auto">
          <div class="px-6 pt-6 pb-4">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-[11px] font-black uppercase tracking-[0.2em] text-[#8A93A6]">
                  {{ t('schedule.details') }}
                </p>
                <h3 class="text-2xl font-black mt-1">
                  {{ agendamento.cliente || t('schedule.client') }}
                </h3>
                <div class="flex items-center gap-2 mt-2">
                  <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1B4F4A]/30">
                    <svg class="w-3.5 h-3.5 text-[#7FE0CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-sm font-bold text-[#7FE0CC]">{{ formatarDataHora(agendamento) }}</span>
                  </div>
                </div>
              </div>

                <button
                  class="w-11 h-11 rounded-xl border flex items-center justify-center transition border-[#262E42] bg-[#1E2A3D] hover:bg-[#262E42]"
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
            <article class="rounded-2xl border border-[#262E42] bg-[#1A2132] p-4">
              <p class="text-[10px] uppercase tracking-[0.18em] font-black text-[#8A93A6]">
                {{ t('schedule.address') }}
              </p>
              <p class="text-sm font-semibold mt-1 text-[#EDEFF4]">
                {{ agendamento.endereco || t('schedule.notInformed') }}
                <template v-if="agendamento.numeroCasa">, Casa {{ agendamento.numeroCasa }}</template>
              </p>
            </article>

            <article
              v-if="agendamento.descricao"
              class="rounded-2xl border border-[#262E42] bg-[#1A2132] p-4"
            >
              <p class="text-[10px] uppercase tracking-[0.18em] font-black text-[#8A93A6]">
                {{ t('schedule.service') }}
              </p>
              <p class="text-sm font-semibold mt-1 text-[#EDEFF4]">
                {{ agendamento.descricao }}
              </p>
            </article>

            <article class="rounded-2xl border border-[#262E42] bg-[#1A2132] p-4">
              <p class="text-[10px] uppercase tracking-[0.18em] font-black mb-3 text-[#8A93A6]">
                {{ t('schedule.status') }}
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-if="agendamento.materialPronto === true"
                  class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-[#233350] text-[#9FC1F5]"
                >
                  {{ t('schedule.materialReady') }}
                </span>
                <span
                  v-else-if="agendamento.materialPronto === false"
                  class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-[#233350] text-[#9FC1F5]"
                >
                  {{ t('schedule.noMaterial') }}
                </span>
                <span
                  v-else
                  class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-[#262E42] text-[#8A93A6]"
                >
                  {{ t('schedule.materialNotInformed') }}
                </span>

                <span
                  v-if="agendamento.servicoConcluido === true"
                  class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-[#1B4F4A] text-[#7FE0CC]"
                >
                  {{ t('schedule.serviceCompleted') }}
                </span>
                <span
                  v-else-if="agendamento.servicoConcluido === false"
                  class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-[#233350] text-[#9FC1F5]"
                >
                  {{ t('schedule.serviceOpen') }}
                </span>
                <span
                  v-else
                  class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-[#262E42] text-[#8A93A6]"
                >
                  {{ t('schedule.serviceNotCompleted') }}
                </span>
              </div>
            </article>

            <article
              v-if="agendamento.telefone || agendamento.referencia || agendamento.observacoes"
              class="rounded-2xl border border-[#262E42] bg-[#1A2132] p-4"
            >
              <p class="text-[10px] uppercase tracking-[0.18em] font-black mb-3 text-[#8A93A6]">
                {{ t('schedule.extras') }}
              </p>
              <ul class="space-y-2 text-sm">
                <li v-if="agendamento.telefone">
                  <span class="text-[#8A93A6]">{{ t('schedule.phone') }}:</span>
                  <span class="font-semibold text-[#EDEFF4] ml-1">{{ agendamento.telefone }}</span>
                </li>
                <li v-if="agendamento.referencia">
                  <span class="text-[#8A93A6]">{{ t('schedule.reference') }}:</span>
                  <span class="font-semibold text-[#EDEFF4] ml-1">{{ agendamento.referencia }}</span>
                </li>
                <li v-if="agendamento.observacoes">
                  <span class="text-[#8A93A6]">{{ t('schedule.notes') }}:</span>
                  <span class="font-semibold text-[#EDEFF4] ml-1">{{ agendamento.observacoes }}</span>
                </li>
              </ul>
            </article>
          </div>

          <div class="px-6 py-4 border-t border-[#262E42] bg-[#0F1420] space-y-3">
            <button
              class="w-full py-3.5 rounded-xl font-black text-sm transition-all"
              :class="agendamento.servicoConcluido === true
                ? 'bg-[#233350] text-[#9FC1F5] border border-[#33517F]'
                : 'bg-[#1B4F4A] text-[#7FE0CC] border border-[#2C6E67]'"
              @click="toggleStatus"
            >
              {{ agendamento.servicoConcluido === true ? t('schedule.reopen') : t('schedule.complete') }}
            </button>

            <div class="grid grid-cols-2 gap-3">
              <button
                class="py-3.5 rounded-xl border font-black text-sm border-[#262E42] bg-[#1E2A3D] text-[#EDEFF4]"
                @click="fechar"
              >
                {{ t('schedule.close') }}
              </button>
              <button
                class="py-3.5 rounded-xl bg-[#1B4F4A] text-[#EAFBF6] font-black text-sm active:scale-[0.99] transition"
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
