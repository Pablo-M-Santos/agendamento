<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import { format } from 'date-fns'
import type { AgendamentoForm } from '~/types/agendamento'

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
        telefone.value = props.agendamentoInicial.telefone || ''
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
        class="fixed inset-0 backdrop-blur-sm z-[60] bg-[#001a17]/85"
        @click="fechar"
      />
    </Transition>

    <Transition name="slide-up">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[70] overflow-y-auto bg-gradient-to-br from-[#002e29] via-[#001a17] to-[#001a17] text-white"
      >
        <div class="min-h-full flex flex-col">
          <div class="px-6 pt-6 pb-4">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-[11px] font-black uppercase tracking-[0.2em] text-[#80bfb8]">
                  {{ t('schedule.title') }}
                </p>
                <h3 class="text-2xl font-black mt-1">
                  {{
                    agendamentoInicial ? t('schedule.modalTitleEdit') : t('schedule.modalTitleCreate')
                  }}
                </h3>
                <p class="text-sm mt-1 text-white/70">
                  {{ format(dataSelecionadaNoPai, dataHeaderFormat, { locale: dateLocale }) }}
                </p>
              </div>

              <button
                class="w-11 h-11 rounded-xl border flex items-center justify-center transition border-[#4da69c]/30 bg-[#4da69c]/10 hover:bg-[#4da69c]/20"
                :aria-label="t('schedule.closeForm')"
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

          <div class="flex-1 px-6 py-4 space-y-5">
            <section
              class="rounded-2xl border p-4 space-y-4 border-[#4da69c]/30 bg-[#003733]/50"
            >
              <div class="flex items-center justify-between">
                <h4 class="text-sm font-black uppercase tracking-wider text-[#80bfb8]">
                  {{ t('schedule.mainData') }}
                </h4>
                <span class="text-[10px] font-black uppercase tracking-[0.18em] text-[#4da69c]">
                  {{ t('schedule.required') }}
                </span>
              </div>

              <div>
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1 text-white/70">
                  {{ t('schedule.clientName') }}
                </label>
                <input
                  v-model="cliente"
                  type="text"
                  :placeholder="t('schedule.clientName')"
                  class="w-full mt-1 p-3 rounded-xl border focus:border-[#4da69c] outline-none transition-all font-semibold bg-[#002e29]/80 border-[#4da69c]/30 text-white placeholder:text-white/40"
                />
              </div>

              <div>
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1 text-white/70">
                  {{ t('schedule.houseNumber') }}
                </label>
                <input
                  v-model="numeroCasa"
                  type="text"
                  inputmode="numeric"
                  :placeholder="t('schedule.houseNumber')"
                  class="w-full mt-1 p-3 rounded-xl border focus:border-[#4da69c] outline-none transition-all font-semibold bg-[#002e29]/80 border-[#4da69c]/30 text-white placeholder:text-white/40"
                />
              </div>

              <div>
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1 text-white/70">
                  {{ t('schedule.clientAddress') }}
                </label>
                <input
                  v-model="endereco"
                  type="text"
                  :placeholder="t('schedule.clientAddress')"
                  class="w-full mt-1 p-3 rounded-xl border focus:border-[#4da69c] outline-none transition-all font-semibold bg-[#002e29]/80 border-[#4da69c]/30 text-white placeholder:text-white/40"
                />
              </div>
            </section>

            <section
              class="rounded-2xl border p-4 border-[#4da69c]/20 bg-[#002e29]/50"
            >
              <label class="text-[10px] font-black uppercase tracking-[0.18em] block mb-3 text-white/70">
                {{ t('schedule.serviceTime') }}
              </label>
              <div class="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[160px] overflow-y-auto no-scrollbar">
                <button
                  v-for="hora in horarios"
                  :id="'hora-' + hora"
                  :key="hora"
                  :class="[
                    'px-2 py-2 rounded-lg font-bold text-xs border transition-all',
                    horaSelecionada === hora
                      ? 'bg-white text-[#001a17] border-white'
                      : 'bg-[#003733]/50 border-[#4da69c]/20 text-white hover:bg-[#003733]'
                  ]"
                  @click="horaSelecionada = hora"
                >
                  {{ hora }}
                </button>
              </div>
            </section>

            <section
              class="rounded-2xl border p-4 border-[#4da69c]/20 bg-[#002e29]/50"
            >
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="text-sm font-black uppercase tracking-wider text-white">
                    {{ t('schedule.materialReadyQuestion') }}
                  </p>
                  <p class="text-xs mt-1 text-white/60">
                    {{ t('schedule.materialReadyHint') }}
                  </p>
                </div>

                <div class="flex gap-2">
                  <button
                    class="min-w-[56px] px-3 py-2 rounded-xl border font-black text-sm transition"
                    :class="
                      materialPronto === true
                        ? 'bg-white text-[#001a17] border-white'
                        : 'bg-[#003733]/50 border-[#4da69c]/20 text-white'
                    "
                    @click="materialPronto = true"
                  >
                    {{ t('schedule.yes') }}
                  </button>
                  <button
                    class="min-w-[56px] px-3 py-2 rounded-xl border font-black text-sm transition"
                    :class="
                      materialPronto === false
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-[#003733]/50 border-[#4da69c]/20 text-white'
                    "
                    @click="materialPronto = false"
                  >
                    {{ t('schedule.no') }}
                  </button>
                </div>
              </div>
            </section>

            <section
              class="rounded-2xl border p-4 space-y-4 border-[#4da69c]/20 bg-[#002e29]/50"
            >
              <h4 class="text-sm font-black uppercase tracking-wider text-[#80bfb8]">
                {{ t('schedule.optionalFields') }}
              </h4>

              <div>
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1 text-white/70">{{
                  t('schedule.phone')
                }}</label>
                <input
                  v-model="telefone"
                  type="tel"
                  :placeholder="t('schedule.phone')"
                  class="w-full mt-1 p-3 rounded-xl border focus:border-[#4da69c] outline-none transition-all font-semibold bg-[#002e29]/80 border-[#4da69c]/30 text-white placeholder:text-white/40"
                />
              </div>

              <div>
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1 text-white/70">{{
                  t('schedule.reference')
                }}</label>
                <input
                  v-model="referencia"
                  type="text"
                  :placeholder="t('schedule.reference')"
                  class="w-full mt-1 p-3 rounded-xl border focus:border-[#4da69c] outline-none transition-all font-semibold bg-[#002e29]/80 border-[#4da69c]/30 text-white placeholder:text-white/40"
                />
              </div>

              <div>
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1 text-white/70">
                  {{ t('schedule.serviceDetails') }}
                </label>
                <textarea
                  v-model="descricao"
                  rows="3"
                  :placeholder="t('schedule.serviceDetails')"
                  class="w-full mt-1 p-3 rounded-xl border focus:border-[#4da69c] outline-none transition-all font-semibold resize-none bg-[#002e29]/80 border-[#4da69c]/30 text-white placeholder:text-white/40"
                />
              </div>

              <div>
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1 text-white/70">{{
                  t('schedule.notes')
                }}</label>
                <textarea
                  v-model="observacoes"
                  rows="2"
                  :placeholder="t('schedule.notes')"
                  class="w-full mt-1 p-3 rounded-xl border focus:border-[#4da69c] outline-none transition-all font-semibold resize-none bg-[#002e29]/80 border-[#4da69c]/30 text-white placeholder:text-white/40"
                />
              </div>
            </section>
          </div>

          <div class="px-6 py-4 border-t border-[#4da69c]/20 bg-[#001a17]/80">
            <div class="grid grid-cols-2 gap-3">
              <button
                class="py-3.5 rounded-xl border font-black text-sm border-white/20 bg-white/10 text-white"
                @click="fechar"
              >
                {{ t('schedule.cancel') }}
              </button>

              <button
                class="py-3.5 rounded-xl bg-white text-[#001a17] font-black text-sm shadow-xl active:scale-[0.99] transition-all"
                @click="handleSalvar"
              >
                {{ agendamentoInicial ? t('schedule.saveChanges') : t('schedule.confirmService') }}
              </button>
            </div>
          </div>
        </div>
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
  transition: opacity 0.3s;
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
