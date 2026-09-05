<script setup lang="ts">
import { format } from 'date-fns'
import { onMounted, onUnmounted, watch } from 'vue'
import type { Agendamento } from '~/composables/useAgendamentos'
import { formatarTelefone } from '~/utils/formatarTelefone'

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

const bloquearScroll = () => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = 'hidden'
  document.body.style.touchAction = 'none'
}

const liberarScroll = () => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = ''
  document.body.style.touchAction = ''
}

watch(
  () => props.modelValue,
  (aberto) => {
    if (aberto) {
      bloquearScroll()
    } else {
      liberarScroll()
    }
  }
)

onMounted(() => {
  if (props.modelValue) bloquearScroll()
})

onUnmounted(() => {
  liberarScroll()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] flex items-center sm:items-center justify-center bg-[#0F1420]/80 sm:backdrop-blur-sm sm:p-6"
        @click="fechar"
      >
        <Transition name="slide-up">
          <section
            v-if="modelValue && agendamento"
            class="relative w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[90vh] rounded-none sm:rounded-3xl border border-[#262E42] bg-[#141A28] text-[#EDEFF4] shadow-2xl shadow-black/70 sm:z-[101] flex flex-col sm:overflow-hidden overflow-hidden"
            @click.stop
          >
            <header class="relative px-5 sm:px-6 pt-4 sm:pt-6 pb-4 sm:pb-5 border-b border-[#262E42]/60 flex-none">
              <div class="flex items-start gap-3">
                <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1B4F4A] border border-[#2C6E67] flex items-center justify-center flex-shrink-0">
                  <span class="text-base sm:text-lg font-black text-[#7FE0CC]">
                    {{ (agendamento.cliente || t('schedule.client')).charAt(0).toUpperCase() }}
                  </span>
                </div>

                <div class="flex-1 min-w-0">
                  <p class="text-[10px] font-black uppercase tracking-[0.2em] text-[#4FD1C5]">
                    {{ t('schedule.details') }}
                  </p>
                  <h3 class="text-lg sm:text-xl font-black mt-0.5 truncate text-[#EDEFF4]">
                    {{ agendamento.cliente || t('schedule.client') }}
                  </h3>
                  <div class="flex items-center gap-1.5 mt-1.5 text-xs text-[#8A93A6]">
                    <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="font-semibold text-[#7FE0CC]">{{ formatarDataHora(agendamento) }}</span>
                  </div>
                </div>

                <button
                  class="w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition border-[#262E42] bg-[#1E2A3D] hover:bg-[#4FD1C5]/10 hover:border-[#4FD1C5]/40 text-[#8A93A6] hover:text-[#4FD1C5] flex-shrink-0"
                  :aria-label="t('schedule.close')"
                  @click="fechar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </header>

            <div class="flex-1 overflow-y-auto px-5 sm:px-6 py-5 sm:py-6">
              <div class="space-y-3 sm:flex sm:flex-col sm:justify-center sm:min-h-full">
                <div :class="agendamento.descricao ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'grid grid-cols-1 gap-3'">
                  <article
                    :class="agendamento.descricao ? '' : 'sm:col-span-1'"
                    class="rounded-2xl border border-[#262E42] bg-[#1A2132] p-4"
                  >
                    <div class="flex items-center gap-2 mb-2">
                      <svg class="w-3.5 h-3.5 text-[#4FD1C5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.413 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p class="text-[10px] uppercase tracking-[0.18em] font-black text-[#4FD1C5]">
                        {{ t('schedule.address') }}
                      </p>
                    </div>
                    <p class="text-sm leading-relaxed text-[#EDEFF4]">
                      {{ agendamento.endereco || t('schedule.notInformed') }}
                      <template v-if="agendamento.numeroCasa">, Casa {{ agendamento.numeroCasa }}</template>
                    </p>
                  </article>

                  <article
                    v-if="agendamento.descricao"
                    class="rounded-2xl border border-[#262E42] bg-[#1A2132] p-4"
                  >
                    <div class="flex items-center gap-2 mb-2">
                      <svg class="w-3.5 h-3.5 text-[#4FD1C5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p class="text-[10px] uppercase tracking-[0.18em] font-black text-[#4FD1C5]">
                        {{ t('schedule.service') }}
                      </p>
                    </div>
                    <p class="text-sm leading-relaxed text-[#EDEFF4]">
                      {{ agendamento.descricao }}
                    </p>
                  </article>
                </div>

                <article class="rounded-2xl border border-[#262E42] bg-[#1A2132] p-4">
                  <div class="flex items-center gap-2 mb-3">
                    <svg class="w-3.5 h-3.5 text-[#4FD1C5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-[10px] uppercase tracking-[0.18em] font-black text-[#4FD1C5]">
                      {{ t('schedule.status') }}
                    </p>
                  </div>
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
                      class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-[#4A3D2A] text-[#F5C89C] border border-[#6E5A3A]"
                    >
                      {{ t('schedule.serviceCompleted') }}
                    </span>
                    <span
                      v-else-if="agendamento.servicoConcluido === false"
                      class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-[#1B4F4A] text-[#7FE0CC] border border-[#2C6E67]"
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
                  <div class="flex items-center gap-2 mb-3">
                    <svg class="w-3.5 h-3.5 text-[#4FD1C5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-[10px] uppercase tracking-[0.18em] font-black text-[#4FD1C5]">
                      {{ t('schedule.extras') }}
                    </p>
                  </div>
                  <ul class="space-y-2.5 text-sm">
                    <li v-if="agendamento.telefone" class="flex items-start gap-3">
                      <span class="text-[#4FD1C5] font-bold min-w-[70px] uppercase text-[10px] tracking-[0.15em] pt-0.5">{{ t('schedule.phone') }}:</span>
                      <span class="font-semibold text-[#EDEFF4] leading-relaxed">{{ formatarTelefone(agendamento.telefone) }}</span>
                    </li>
                    <li v-if="agendamento.referencia" class="flex items-start gap-3">
                      <span class="text-[#4FD1C5] font-bold min-w-[70px] uppercase text-[10px] tracking-[0.15em] pt-0.5">{{ t('schedule.reference') }}:</span>
                      <span class="font-semibold text-[#EDEFF4] leading-relaxed">{{ agendamento.referencia }}</span>
                    </li>
                    <li v-if="agendamento.observacoes" class="flex items-start gap-3">
                      <span class="text-[#4FD1C5] font-bold min-w-[70px] uppercase text-[10px] tracking-[0.15em] pt-0.5">{{ t('schedule.notes') }}:</span>
                      <span class="font-semibold text-[#EDEFF4] leading-relaxed">{{ agendamento.observacoes }}</span>
                    </li>
                  </ul>
                </article>
              </div>
            </div>

            <footer class="p-4 sm:p-6 pt-4 border-t border-[#262E42] bg-[#0F1420]/60 pb-[calc(1rem+env(safe-area-inset-bottom))] flex-none">
              <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  class="w-full sm:flex-1 sm:order-2 py-3.5 rounded-xl font-black text-sm transition-all active:scale-[0.99] shadow-lg"
                  :class="agendamento.servicoConcluido === true
                    ? 'bg-[#4A3D2A] text-[#F5C89C] border border-[#6E5A3A] shadow-[#4A3D2A]/40 hover:bg-[#5C4A33]'
                    : 'bg-[#1B4F4A] text-[#7FE0CC] border border-[#2C6E67] shadow-[#1B4F4A]/40 hover:bg-[#23655F]'"
                  @click="toggleStatus"
                >
                  {{ agendamento.servicoConcluido === true ? t('schedule.reopen') : t('schedule.complete') }}
                </button>
                <button
                  class="w-full sm:flex-1 sm:order-1 py-3.5 rounded-xl font-black text-sm transition-all active:scale-[0.99] bg-[#233350] text-[#9FC1F5] border border-[#33517F] hover:bg-[#2A3D52] shadow-lg shadow-[#233350]/30"
                  @click="editar"
                >
                  {{ t('schedule.edit') }}
                </button>
              </div>
            </footer>
          </section>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px) scale(0.98);
  opacity: 0;
}
</style>
