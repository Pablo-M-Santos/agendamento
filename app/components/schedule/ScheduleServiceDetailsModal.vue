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
            <p class="text-[11px] uppercase tracking-[0.18em] font-black text-white/70">
              {{ t('schedule.details') }}
            </p>
            <h3 class="text-2xl font-black mt-1 leading-tight">
              {{ agendamento.cliente || t('schedule.client') }}
            </h3>
            <p class="text-sm text-white/80 mt-1">{{ formatarDataHora(agendamento) }}</p>
          </header>

          <div class="space-y-4">
            <article class="rounded-2xl border border-white/20 bg-white/8 p-4">
              <p class="text-[10px] uppercase tracking-[0.18em] font-black text-white/70">
                {{ t('schedule.address') }}
              </p>
              <p class="text-sm font-semibold mt-1">
                {{ agendamento.endereco || t('schedule.notInformed') }}
                <template v-if="agendamento.numeroCasa"
                  >, Casa {{ agendamento.numeroCasa }}</template
                >
              </p>
            </article>

            <article class="rounded-2xl border border-white/20 bg-white/8 p-4">
              <p class="text-[10px] uppercase tracking-[0.18em] font-black text-white/70">
                {{ t('schedule.service') }}
              </p>
              <p class="text-sm font-semibold mt-1">
                {{ agendamento.descricao || t('schedule.noDescription') }}
              </p>
            </article>

            <article class="rounded-2xl border border-white/20 bg-white/8 p-4">
              <p class="text-[10px] uppercase tracking-[0.18em] font-black text-white/70 mb-2">
                {{ t('schedule.status') }}
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-if="agendamento.materialPronto === true"
                  class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-emerald-400 text-[#003D7A]"
                >
                  {{ t('schedule.materialReady') }}
                </span>
                <span
                  v-else-if="agendamento.materialPronto === false"
                  class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-amber-300 text-[#4A2C00]"
                >
                  {{ t('schedule.noMaterial') }}
                </span>
                <span
                  v-else
                  class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-white/10 text-white/70"
                >
                  {{ t('schedule.materialNotInformed') }}
                </span>

                <span
                  v-if="agendamento.servicoConcluido === true"
                  class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-[#00D3B8] text-[#003D7A]"
                >
                  {{ t('schedule.serviceFinished') }}
                </span>
                <span
                  v-else-if="agendamento.servicoConcluido === false"
                  class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-white/15 text-white"
                >
                  {{ t('schedule.serviceInProgress') }}
                </span>
                <span
                  v-else
                  class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-white/10 text-white/70"
                >
                  {{ t('schedule.serviceNotCompleted') }}
                </span>
              </div>
            </article>

            <article class="rounded-2xl border border-white/20 bg-white/8 p-4">
              <p class="text-[10px] uppercase tracking-[0.18em] font-black text-white/70 mb-2">
                {{ t('schedule.extras') }}
              </p>
              <ul class="space-y-2 text-sm">
                <li>
                  <span class="text-white/65">{{ t('schedule.phone') }}:</span>
                  <span class="font-semibold">
                    {{ agendamento.telefone || t('schedule.notInformed') }}</span
                  >
                </li>
                <li>
                  <span class="text-white/65">{{ t('schedule.reference') }}:</span>
                  <span class="font-semibold">
                    {{ agendamento.referencia || t('schedule.notInformed') }}</span
                  >
                </li>
                <li>
                  <span class="text-white/65">{{ t('schedule.notes') }}:</span>
                  <span class="font-semibold">
                    {{ agendamento.observacoes || t('schedule.none') }}</span
                  >
                </li>
              </ul>
            </article>
          </div>

          <div class="grid grid-cols-2 gap-3 mt-6">
            <button
              class="py-3 rounded-xl border border-white/25 bg-white/10 font-black text-sm"
              @click="fechar"
            >
              {{ t('schedule.close') }}
            </button>
            <button
              class="py-3 rounded-xl bg-[#00D3B8] text-[#003D7A] font-black text-sm"
              @click="editar"
            >
              {{ t('schedule.edit') }}
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
