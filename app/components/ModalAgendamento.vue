<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import { format } from 'date-fns'
import type { AgendamentoForm } from '~/types/agendamento'
import { formatarTelefone } from '~/utils/formatarTelefone'

const { dateLocale } = useUserSettings()
const { t, language } = useAppI18n()

const props = defineProps<{
  modelValue: boolean
  agendamentoInicial?: AgendamentoForm | null
  dataSelecionadaNoPai: Date
}>()

type AgendamentoPayload = {
  id?: string
  cliente: string
  numeroCasa: string
  endereco: string
  descricao: string
  materialPronto?: boolean | null
  servicoConcluido?: boolean | null
  telefone?: string
  referencia?: string
  observacoes?: string
  data: string
}

const emit = defineEmits(['update:modelValue', 'salvar'])

const cliente = ref('')
const numeroCasa = ref('')
const endereco = ref('')
const descricao = ref('')
const materialPronto = ref<boolean | null>(null)
const servicoConcluido = ref<boolean>(false)
const telefone = ref('')

const onTelefoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  telefone.value = formatarTelefone(target.value)
}
const referencia = ref('')
const observacoes = ref('')
const horaSelecionada = ref('09:00')

const horarios = computed(() => {
  const lista = []
  for (let h = 7; h <= 20; h++) {
    for (let m = 0; m < 60; m += 30) {
      lista.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }
  return lista
})

const dataHeaderFormat = computed(() => {
  if (language.value === 'en-US') return 'MMMM dd, yyyy'
  return "dd 'de' MMMM, yyyy"
})

const pegarHorarioMaisProximo = () => {
  const agora = new Date()
  const horaAtual = agora.getHours()
  const minutoAtual = agora.getMinutes()

  const minutoAjustado = minutoAtual < 30 ? 30 : 0
  const horaAjustada = minutoAtual < 30 ? horaAtual : horaAtual + 1

  let horaFinal = `${String(horaAjustada).padStart(2, '0')}:${String(minutoAjustado).padStart(2, '0')}`

  if (!horarios.value.includes(horaFinal)) {
    horaFinal = horarios.value[0] || '09:00'
  }

  return horaFinal
}

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      if (props.agendamentoInicial) {
        const dataDoc = new Date(props.agendamentoInicial.data)

        cliente.value = props.agendamentoInicial.cliente
        numeroCasa.value = props.agendamentoInicial.numeroCasa || ''
        endereco.value = props.agendamentoInicial.endereco || ''
        descricao.value = props.agendamentoInicial.descricao || ''
        materialPronto.value = props.agendamentoInicial.materialPronto ?? null
        servicoConcluido.value = props.agendamentoInicial.servicoConcluido ?? false
        telefone.value = formatarTelefone(props.agendamentoInicial.telefone || '')
        referencia.value = props.agendamentoInicial.referencia || ''
        observacoes.value = props.agendamentoInicial.observacoes || ''
        horaSelecionada.value = Number.isNaN(dataDoc.getTime())
          ? pegarHorarioMaisProximo()
          : format(dataDoc, 'HH:mm')
      } else {
        cliente.value = ''
        numeroCasa.value = ''
        endereco.value = ''
        descricao.value = ''
        materialPronto.value = null
        servicoConcluido.value = false
        telefone.value = ''
        referencia.value = ''
        observacoes.value = ''

        horaSelecionada.value = pegarHorarioMaisProximo()
      }

      await nextTick()

      setTimeout(() => {
        const el = document.getElementById('hora-' + horaSelecionada.value)
        el?.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        })
      }, 100)
    }
  }
)

const handleSalvar = () => {
  if (!cliente.value.trim()) return alert(t('schedule.validation.clientRequired'))
  if (!numeroCasa.value.trim()) return alert(t('schedule.validation.houseRequired'))
  if (!endereco.value.trim()) return alert(t('schedule.validation.addressRequired'))

  const dataFinal = new Date(props.dataSelecionadaNoPai)
  const [h, m] = horaSelecionada.value.split(':')
  dataFinal.setHours(Number(h), Number(m), 0)

  const dados: AgendamentoPayload = {
    cliente: cliente.value.trim(),
    numeroCasa: numeroCasa.value.trim(),
    endereco: endereco.value.trim(),
    descricao: descricao.value.trim(),
    materialPronto: materialPronto.value,
    servicoConcluido: servicoConcluido.value,
    telefone: telefone.value.trim(),
    referencia: referencia.value.trim(),
    observacoes: observacoes.value.trim(),
    data: format(dataFinal, "yyyy-MM-dd'T'HH:mm")
  }

  if (props.agendamentoInicial?.id) dados.id = props.agendamentoInicial.id

  emit('salvar', dados)
}

const fechar = () => emit('update:modelValue', false)
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
          <div
            v-if="modelValue"
            class="relative w-full h-full sm:max-w-2xl sm:max-h-[85vh] sm:h-auto rounded-none sm:rounded-3xl border border-[#262E42] bg-[#141A28] text-[#EDEFF4] shadow-2xl shadow-black/50 z-[101] flex flex-col overflow-hidden"
            @click.stop
          >
            <div class="p-5 sm:p-6 pt-8 sm:pt-6 flex-none border-b border-[#262E42]/50">
              <div class="flex items-start justify-between gap-3">
                <div class="flex-1 min-w-0">
                  <p class="text-[10px] font-black uppercase tracking-[0.2em] text-[#8A93A6]">
                    {{ t('schedule.title') }}
                  </p>
                  <h3 class="text-xl sm:text-2xl font-black mt-1 truncate">
                    {{
                      agendamentoInicial ? t('schedule.modalTitleEdit') : t('schedule.modalTitleCreate')
                    }}
                  </h3>
                  <p class="text-sm mt-1 text-[#8A93A6]">
                    {{ format(dataSelecionadaNoPai, dataHeaderFormat, { locale: dateLocale }) }}
                  </p>
                </div>

                <button
                  class="w-10 h-10 rounded-xl border flex items-center justify-center transition border-[#262E42] bg-[#1E2A3D] hover:bg-[#262E42] hover:border-[#8A93A6]/30 flex-shrink-0"
                  :aria-label="t('schedule.closeForm')"
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

            <div class="flex-1 overflow-y-auto px-5 sm:px-6 py-5 sm:py-6">
              <div class="space-y-4">
                <section
                  class="rounded-2xl border p-4 sm:p-5 space-y-4 border-[#262E42] bg-[#1A2132]"
                >
                  <div class="flex items-center justify-between">
                    <h4 class="text-sm font-black uppercase tracking-wider text-[#8A93A6]">
                      {{ t('schedule.mainData') }}
                    </h4>
                    <span class="text-[10px] font-black uppercase tracking-[0.18em] text-[#4FD1C5]">
                      {{ t('schedule.required') }}
                    </span>
                  </div>

                  <div>
                    <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1 text-[#6E7789]">
                      {{ t('schedule.clientName') }}
                    </label>
                    <input
                      v-model="cliente"
                      type="text"
                      :placeholder="t('schedule.clientName')"
                      class="w-full mt-1 p-3 rounded-xl border focus:border-[#4FD1C5] outline-none transition-all font-semibold bg-[#141A28] border-[#262E42] text-[#EDEFF4] placeholder:text-[#6E7789]"
                    />
                  </div>

                  <div class="sm:hidden space-y-3">
                    <div>
                      <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1 text-[#6E7789]">
                        {{ t('schedule.clientAddress') }}
                      </label>
                      <input
                        v-model="endereco"
                        type="text"
                        :placeholder="t('schedule.clientAddress')"
                        class="w-full mt-1 p-3 rounded-xl border focus:border-[#4FD1C5] outline-none transition-all font-semibold bg-[#141A28] border-[#262E42] text-[#EDEFF4] placeholder:text-[#6E7789]"
                      />
                    </div>
                    <div>
                      <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1 text-[#6E7789]">
                        {{ t('schedule.houseNumber') }}
                      </label>
                      <input
                        v-model="numeroCasa"
                        type="text"
                        inputmode="numeric"
                        :placeholder="t('schedule.houseNumber')"
                        class="w-full mt-1 p-3 rounded-xl border focus:border-[#4FD1C5] outline-none transition-all font-semibold bg-[#141A28] border-[#262E42] text-[#EDEFF4] placeholder:text-[#6E7789]"
                      />
                    </div>
                  </div>

                  <div class="hidden sm:grid sm:grid-cols-3 sm:gap-3">
                    <div class="sm:col-span-1">
                      <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1 text-[#6E7789]">
                        {{ t('schedule.houseNumber') }}
                      </label>
                      <input
                        v-model="numeroCasa"
                        type="text"
                        inputmode="numeric"
                        :placeholder="t('schedule.houseNumber')"
                        class="w-full mt-1 p-3 rounded-xl border focus:border-[#4FD1C5] outline-none transition-all font-semibold bg-[#141A28] border-[#262E42] text-[#EDEFF4] placeholder:text-[#6E7789]"
                      />
                    </div>
                    <div class="sm:col-span-2">
                      <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1 text-[#6E7789]">
                        {{ t('schedule.clientAddress') }}
                      </label>
                      <input
                        v-model="endereco"
                        type="text"
                        :placeholder="t('schedule.clientAddress')"
                        class="w-full mt-1 p-3 rounded-xl border focus:border-[#4FD1C5] outline-none transition-all font-semibold bg-[#141A28] border-[#262E42] text-[#EDEFF4] placeholder:text-[#6E7789]"
                      />
                    </div>
                  </div>
                </section>

                <section
                  class="rounded-2xl border p-4 sm:p-5 border-[#262E42] bg-[#1A2132]"
                >
                  <div class="flex items-center justify-between mb-3">
                    <label class="text-[10px] font-black uppercase tracking-[0.18em] text-[#6E7789]">
                      {{ t('schedule.serviceTime') }}
                    </label>
                    <span class="text-[10px] font-black text-[#4FD1C5]">
                      {{ horaSelecionada }}
                    </span>
                  </div>
                  <div class="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[160px] overflow-y-auto no-scrollbar">
                    <button
                      v-for="hora in horarios"
                      :id="'hora-' + hora"
                      :key="hora"
                      :class="[
                        'px-2 py-2 rounded-lg font-bold text-xs border transition-all',
                        horaSelecionada === hora
                          ? 'bg-[#1B4F4A] text-[#EAFBF6] border-[#2C6E67]'
                          : 'bg-[#141A28] border-[#262E42] text-[#EDEFF4] hover:bg-[#1E2A3D]'
                      ]"
                      @click="horaSelecionada = hora"
                    >
                      {{ hora }}
                    </button>
                  </div>
                </section>

                <section
                  class="rounded-2xl border p-4 sm:p-5 border-[#262E42] bg-[#1A2132]"
                >
                  <div class="flex items-center justify-between gap-4">
                    <div class="flex-1">
                      <p class="text-sm font-black uppercase tracking-wider text-[#EDEFF4]">
                        {{ t('schedule.materialReadyQuestion') }}
                      </p>
                      <p class="text-xs mt-1 text-[#6E7789]">
                        {{ t('schedule.materialReadyHint') }}
                      </p>
                    </div>

                    <div class="flex gap-2 flex-shrink-0">
                      <button
                        class="min-w-[56px] px-3 py-2 rounded-xl border font-black text-sm transition"
                        :class="
                          materialPronto === true
                            ? 'bg-[#1B4F4A] text-[#EAFBF6] border-[#2C6E67]'
                            : 'bg-[#141A28] border-[#262E42] text-[#EDEFF4]'
                        "
                        @click="materialPronto = true"
                      >
                        {{ t('schedule.yes') }}
                      </button>
                      <button
                        class="min-w-[56px] px-3 py-2 rounded-xl border font-black text-sm transition"
                        :class="
                          materialPronto === false
                            ? 'bg-[#233350] text-[#9FC1F5] border-[#33517F]'
                            : 'bg-[#141A28] border-[#262E42] text-[#EDEFF4]'
                        "
                        @click="materialPronto = false"
                      >
                        {{ t('schedule.no') }}
                      </button>
                    </div>
                  </div>
                </section>

                <section
                  class="rounded-2xl border p-4 sm:p-5 space-y-4 border-[#262E42] bg-[#1A2132]"
                >
                  <h4 class="text-sm font-black uppercase tracking-wider text-[#8A93A6]">
                    {{ t('schedule.optionalFields') }}
                  </h4>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1 text-[#6E7789]">{{
                        t('schedule.phone')
                      }}</label>
                      <input
                        type="tel"
                        :placeholder="t('schedule.phone')"
                        :value="telefone"
                        class="w-full mt-1 p-3 rounded-xl border focus:border-[#4FD1C5] outline-none transition-all font-semibold bg-[#141A28] border-[#262E42] text-[#EDEFF4] placeholder:text-[#6E7789]"
                        @input="onTelefoneInput"
                      />
                    </div>

                    <div>
                      <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1 text-[#6E7789]">{{
                        t('schedule.reference')
                      }}</label>
                      <input
                        v-model="referencia"
                        type="text"
                        :placeholder="t('schedule.reference')"
                        class="w-full mt-1 p-3 rounded-xl border focus:border-[#4FD1C5] outline-none transition-all font-semibold bg-[#141A28] border-[#262E42] text-[#EDEFF4] placeholder:text-[#6E7789]"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1 text-[#6E7789]">
                      {{ t('schedule.serviceDetails') }}
                    </label>
                    <textarea
                      v-model="descricao"
                      rows="3"
                      :placeholder="t('schedule.serviceDetails')"
                      class="w-full mt-1 p-3 rounded-xl border focus:border-[#4FD1C5] outline-none transition-all font-semibold resize-none bg-[#141A28] border-[#262E42] text-[#EDEFF4] placeholder:text-[#6E7789]"
                    />
                  </div>

                  <div>
                    <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1 text-[#6E7789]">{{
                      t('schedule.notes')
                    }}</label>
                    <textarea
                      v-model="observacoes"
                      rows="2"
                      :placeholder="t('schedule.notes')"
                      class="w-full mt-1 p-3 rounded-xl border focus:border-[#4FD1C5] outline-none transition-all font-semibold resize-none bg-[#141A28] border-[#262E42] text-[#EDEFF4] placeholder:text-[#6E7789]"
                    />
                  </div>
                </section>
              </div>
            </div>

            <div class="p-5 sm:p-6 pt-5 sm:pt-6 border-t border-[#262E42] bg-[#0F1420]/50 space-y-3 flex-none pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <div class="grid grid-cols-2 gap-3">
                <button
                  class="py-3.5 rounded-xl border font-black text-sm border-[#262E42] bg-[#1E2A3D] text-[#EDEFF4] hover:bg-[#262E42] hover:border-[#8A93A6]/30 transition-all active:scale-[0.99]"
                  @click="fechar"
                >
                  {{ t('schedule.cancel') }}
                </button>
                <button
                  class="py-3.5 rounded-xl font-black text-sm transition-all active:scale-[0.99] shadow-lg bg-[#1B4F4A] text-[#EAFBF6] border border-[#2C6E67] shadow-[#1B4F4A]/30 hover:bg-[#23655F]"
                  @click="handleSalvar"
                >
                  {{ agendamentoInicial ? t('schedule.saveChanges') : t('schedule.confirmService') }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

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
