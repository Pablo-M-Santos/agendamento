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
        class="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F1420]/70 sm:backdrop-blur-sm sm:p-6"
        @click="fechar"
      >
        <Transition name="scale">
          <section
            v-if="modelValue && agendamento"
            class="relative w-full h-full sm:max-w-lg sm:max-h-[85vh] rounded-none sm:rounded-3xl border border-[#262E42] bg-[#141A28] text-[#EDEFF4] shadow-2xl shadow-black/50 sm:z-[101] flex flex-col overflow-hidden"
            @click.stop
          >
            <div class="p-5 sm:p-6 pt-8 sm:pt-6 flex-none">
              <div class="flex items-start justify-between gap-3 mb-5">
                <div class="flex-1 min-w-0">
                  <p class="text-[10px] font-black uppercase tracking-[0.2em] text-[#8A93A6]">
                    {{ t('schedule.details') }}
                  </p>
                  <h3 class="text-xl sm:text-2xl font-black mt-1 truncate">
                    {{ agendamento.cliente || t('schedule.client') }}
                  </h3>
                  <div class="flex items-center gap-2 mt-2.5">
                    <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1B4F4A]/30 border border-[#2C6E67]/50">
                      <svg class="w-3.5 h-3.5 text-[#7FE0CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="text-sm font-bold text-[#7FE0CC]">{{ formatarDataHora(agendamento) }}</span>
                    </div>
                  </div>
                </div>

                <button
                  class="w-10 h-10 rounded-xl border flex items-center justify-center transition border-[#262E42] bg-[#1E2A3D] hover:bg-[#262E42] hover:border-[#8A93A6]/30 flex-shrink-0"
                  :aria-label="t('schedule.close')"
                  @click="fechar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
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

            <div class="flex-1 overflow-y-auto px-5 sm:px-6 pb-5 sm:pb-6">
              <div class="space-y-3">
                <article class="rounded-2xl border border-[#262E42] bg-[#1A2132] p-4">
                  <p class="text-[10px] uppercase tracking-[0.18em] font-black text-[#8A93A6] mb-1.5">
                    {{ t('schedule.address') }}
                  </p>
                  <p class="text-sm font-semibold text-[#EDEFF4]">
                    {{ agendamento.endereco || t('schedule.notInformed') }}
                    <template v-if="agendamento.numeroCasa">, Casa {{ agendamento.numeroCasa }}</template>
                  </p>
                </article>

                <article
                  v-if="agendamento.descricao"
                  class="rounded-2xl border border-[#262E42] bg-[#1A2132] p-4"
                >
                  <p class="text-[10px] uppercase tracking-[0.18em] font-black text-[#8A93A6] mb-1.5">
                    {{ t('schedule.service') }}
                  </p>
                  <p class="text-sm font-semibold text-[#EDEFF4]">
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
                      class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-[#1B4F4A] text-[#7FE0CC] border border-[#2C6E67]"
                    >
                      {{ t('schedule.materialReady') }}
                    </span>
                    <span
                      v-else-if="agendamento.materialPronto === false"
                      class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-[#3D2A2A] text-[#F5A89C] border border-[#5C3A3A]"
                    >
                      {{ t('schedule.noMaterial') }}
                    </span>
                    <span
                      v-else
                      class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-[#262E42] text-[#8A93A6] border border-[#333D52]"
                    >
                      {{ t('schedule.materialNotInformed') }}
                    </span>

                    <span
                      v-if="agendamento.servicoConcluido === true"
                      class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-[#233350] text-[#9FC1F5] border border-[#33517F]"
                    >
                      {{ t('schedule.serviceCompleted') }}
                    </span>
                    <span
                      v-else-if="agendamento.servicoConcluido === false"
                      class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-[#2A3D2A] text-[#B8E0C8] border border-[#3A5C3A]"
                    >
                      {{ t('schedule.serviceOpen') }}
                    </span>
                    <span
                      v-else
                      class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-[#262E42] text-[#8A93A6] border border-[#333D52]"
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
                  <ul class="space-y-2.5 text-sm">
                    <li v-if="agendamento.telefone" class="flex items-start gap-2">
                      <span class="text-[#8A93A6] font-bold min-w-[70px]">{{ t('schedule.phone') }}:</span>
                      <span class="font-semibold text-[#EDEFF4]">{{ agendamento.telefone }}</span>
                    </li>
                    <li v-if="agendamento.referencia" class="flex items-start gap-2">
                      <span class="text-[#8A93A6] font-bold min-w-[70px]">{{ t('schedule.reference') }}:</span>
                      <span class="font-semibold text-[#EDEFF4]">{{ agendamento.referencia }}</span>
                    </li>
                    <li v-if="agendamento.observacoes" class="flex items-start gap-2">
                      <span class="text-[#8A93A6] font-bold min-w-[70px]">{{ t('schedule.notes') }}:</span>
                      <span class="font-semibold text-[#EDEFF4]">{{ agendamento.observacoes }}</span>
                    </li>
                  </ul>
                </article>
              </div>
            </div>

            <div class="p-5 sm:p-6 pt-5 sm:pt-6 border-t border-[#262E42] bg-[#0F1420]/50 space-y-3 flex-none pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <button
                class="w-full py-3.5 rounded-xl font-black text-sm transition-all active:scale-[0.99] shadow-lg"
                :class="agendamento.servicoConcluido === true
                  ? 'bg-[#233350] text-[#9FC1F5] border border-[#33517F] shadow-[#233350]/30 hover:bg-[#2A3D52]'
                  : 'bg-[#1B4F4A] text-[#7FE0CC] border border-[#2C6E67] shadow-[#1B4F4A]/30 hover:bg-[#23655F]'"
                @click="toggleStatus"
              >
                {{ agendamento.servicoConcluido === true ? t('schedule.reopen') : t('schedule.complete') }}
              </button>

              <div class="grid grid-cols-2 gap-3">
                <button
                  class="py-3.5 rounded-xl border font-black text-sm border-[#262E42] bg-[#1E2A3D] text-[#EDEFF4] hover:bg-[#262E42] hover:border-[#8A93A6]/30 transition-all active:scale-[0.99]"
                  @click="fechar"
                >
                  {{ t('schedule.close') }}
                </button>
                <button
                  class="py-3.5 rounded-xl bg-[#233350] text-[#9FC1F5] border border-[#33517F] font-black text-sm hover:bg-[#2A3D52] active:scale-[0.99] transition-all shadow-lg shadow-[#233350]/20"
                  @click="editar"
                >
                  {{ t('schedule.edit') }}
                </button>
              </div>
            </div>
          </section>
        </Transition>
      </div>
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

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
</style>
