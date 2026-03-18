<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import { format } from 'date-fns'
import type { AgendamentoForm } from '~/types/agendamento'

const { dateLocale } = useUserSettings()
const { settings } = useUserSettings()
const { t, language } = useAppI18n()
const isLightTheme = computed(() => settings.value.theme === 'light')

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
const servicoConcluido = ref<boolean | null>(null)
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
        servicoConcluido.value = props.agendamentoInicial.servicoConcluido ?? null
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
        servicoConcluido.value = null
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
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 backdrop-blur-sm z-[60]"
        :class="isLightTheme ? 'bg-[#0B1F3A]/35' : 'bg-[#0A2A52]/85'"
      />
    </Transition>

    <Transition name="zoom-in">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[70] transition-colors"
        :class="isLightTheme ? 'bg-[#F4F8FF] text-[#0B1F3A]' : 'bg-[#003D7A] text-white'"
      >
        <div class="h-full flex flex-col">
          <header
            class="px-6 pt-6 pb-4 border-b flex items-center justify-between"
            :class="isLightTheme ? 'border-[#D8E7FF]' : 'border-white/15'"
          >
            <div>
              <p
                class="text-[11px] font-black uppercase tracking-[0.2em]"
                :class="isLightTheme ? 'text-[#5B6B8A]' : 'text-white/70'"
              >
                {{ t('schedule.title') }}
              </p>
              <h3 class="text-2xl font-black mt-1">
                {{
                  agendamentoInicial ? t('schedule.modalTitleEdit') : t('schedule.modalTitleCreate')
                }}
              </h3>
              <p class="text-sm mt-1" :class="isLightTheme ? 'text-[#5B6B8A]' : 'text-white/80'">
                {{ format(dataSelecionadaNoPai, dataHeaderFormat, { locale: dateLocale }) }}
              </p>
              <p class="text-xs mt-1" :class="isLightTheme ? 'text-[#7A8FB1]' : 'text-white/60'">
                {{ t('schedule.fillMainFields') }}
              </p>
            </div>

            <button
              class="w-11 h-11 rounded-xl border flex items-center justify-center transition"
              :class="
                isLightTheme
                  ? 'border-white/25 bg-[#003D7A] text-white hover:bg-[#003872]'
                  : 'border-white/25 bg-white/10 hover:bg-white/20'
              "
              :aria-label="t('schedule.closeForm')"
              @click="emit('update:modelValue', false)"
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
          </header>

          <div class="flex-1 overflow-y-auto px-6 py-6 no-scrollbar space-y-6">
            <section
              class="rounded-3xl border p-5 space-y-4"
              :class="
                isLightTheme
                  ? 'border-white/20 bg-[#003D7A] text-white'
                  : 'border-[#00D3B8]/40 bg-[#00D3B8]/10'
              "
            >
              <div class="flex items-center justify-between">
                <h4
                  class="text-sm font-black uppercase tracking-wider"
                  :class="isLightTheme ? 'text-white' : 'text-[#B5FFF6]'"
                >
                  {{ t('schedule.mainData') }}
                </h4>
                <span
                  class="text-[10px] font-black uppercase tracking-[0.18em]"
                  :class="isLightTheme ? 'text-white/80' : 'text-[#B5FFF6]'"
                >
                  {{ t('schedule.required') }}
                </span>
              </div>

              <div>
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1">
                  {{ t('schedule.clientName') }}
                </label>
                <input
                  v-model="cliente"
                  type="text"
                  :placeholder="t('schedule.clientName')"
                  class="w-full mt-1 p-4 rounded-2xl border focus:border-[#00D3B8] outline-none transition-all font-semibold"
                  :class="
                    isLightTheme
                      ? 'bg-white/10 border-white/30 text-white placeholder:text-white/45'
                      : 'bg-white/8 border-white/30 text-white placeholder:text-white/45'
                  "
                />
              </div>

              <div>
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1">
                  {{ t('schedule.houseNumber') }}
                </label>
                <input
                  v-model="numeroCasa"
                  type="text"
                  inputmode="numeric"
                  :placeholder="t('schedule.houseNumber')"
                  class="w-full mt-1 p-4 rounded-2xl border focus:border-[#00D3B8] outline-none transition-all font-semibold"
                  :class="
                    isLightTheme
                      ? 'bg-white/10 border-white/30 text-white placeholder:text-white/45'
                      : 'bg-white/8 border-white/30 text-white placeholder:text-white/45'
                  "
                />
              </div>

              <div>
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1">
                  {{ t('schedule.clientAddress') }}
                </label>
                <input
                  v-model="endereco"
                  type="text"
                  :placeholder="t('schedule.clientAddress')"
                  class="w-full mt-1 p-4 rounded-2xl border focus:border-[#00D3B8] outline-none transition-all font-semibold"
                  :class="
                    isLightTheme
                      ? 'bg-white/10 border-white/30 text-white placeholder:text-white/45'
                      : 'bg-white/8 border-white/30 text-white placeholder:text-white/45'
                  "
                />
              </div>
            </section>

            <section
              class="rounded-3xl border p-5"
              :class="
                isLightTheme
                  ? 'border-white/20 bg-[#003D7A] text-white'
                  : 'border-white/20 bg-white/8'
              "
            >
              <label class="text-[10px] font-black uppercase tracking-[0.18em] block mb-3">
                {{ t('schedule.serviceTime') }}
              </label>
              <div class="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
                <button
                  v-for="hora in horarios"
                  :id="'hora-' + hora"
                  :key="hora"
                  :class="[
                    'px-5 py-3 rounded-xl font-bold text-sm flex-shrink-0 border transition-all',
                    horaSelecionada === hora
                      ? 'bg-[#00D3B8] border-[#00D3B8] text-[#003D7A]'
                      : isLightTheme
                        ? 'bg-white/10 border-white/25 text-white'
                        : 'bg-white/10 border-white/25 text-white'
                  ]"
                  @click="horaSelecionada = hora"
                >
                  {{ hora }}
                </button>
              </div>
            </section>

            <section
              class="rounded-3xl border p-5"
              :class="
                isLightTheme
                  ? 'border-white/20 bg-[#003D7A] text-white'
                  : 'border-white/20 bg-white/8'
              "
            >
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="text-sm font-black uppercase tracking-wider">
                    {{ t('schedule.materialReadyQuestion') }}
                  </p>
                  <p class="text-xs mt-1" :class="isLightTheme ? 'text-white/70' : 'text-white/70'">
                    {{ t('schedule.materialReadyHint') }}
                  </p>
                </div>

                <div class="flex gap-2">
                  <button
                    class="min-w-[58px] px-4 py-2 rounded-xl border font-black text-sm transition"
                    :class="
                      materialPronto === true
                        ? 'bg-[#00D3B8] border-[#00D3B8] text-[#003D7A]'
                        : isLightTheme
                          ? 'bg-white/10 border-white/30 text-white'
                          : 'bg-white/10 border-white/30 text-white'
                    "
                    @click="materialPronto = true"
                  >
                    {{ t('schedule.yes') }}
                  </button>
                  <button
                    class="min-w-[58px] px-4 py-2 rounded-xl border font-black text-sm transition"
                    :class="
                      materialPronto === false
                        ? 'bg-[#00D3B8] border-[#00D3B8] text-[#003D7A]'
                        : isLightTheme
                          ? 'bg-white/10 border-white/30 text-white'
                          : 'bg-white/10 border-white/30 text-white'
                    "
                    @click="materialPronto = false"
                  >
                    {{ t('schedule.no') }}
                  </button>
                </div>
              </div>
            </section>

            <section
              class="rounded-3xl border p-5"
              :class="
                isLightTheme
                  ? 'border-white/20 bg-[#003D7A] text-white'
                  : 'border-white/20 bg-white/8'
              "
            >
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="text-sm font-black uppercase tracking-wider">
                    {{ t('schedule.serviceStatusQuestion') }}
                  </p>
                  <p class="text-xs mt-1" :class="isLightTheme ? 'text-white/70' : 'text-white/70'">
                    {{ t('schedule.serviceStatusHint') }}
                  </p>
                </div>

                <div class="flex gap-2">
                  <button
                    class="min-w-[58px] px-4 py-2 rounded-xl border font-black text-sm transition"
                    :class="
                      servicoConcluido === true
                        ? 'bg-[#00D3B8] border-[#00D3B8] text-[#003D7A]'
                        : isLightTheme
                          ? 'bg-white/10 border-white/30 text-white'
                          : 'bg-white/10 border-white/30 text-white'
                    "
                    @click="servicoConcluido = true"
                  >
                    {{ t('schedule.serviceCompleted') }}
                  </button>
                  <button
                    class="min-w-[58px] px-4 py-2 rounded-xl border font-black text-sm transition"
                    :class="
                      servicoConcluido === false
                        ? 'bg-[#00D3B8] border-[#00D3B8] text-[#003D7A]'
                        : isLightTheme
                          ? 'bg-white/10 border-white/30 text-white'
                          : 'bg-white/10 border-white/30 text-white'
                    "
                    @click="servicoConcluido = false"
                  >
                    {{ t('schedule.serviceOpen') }}
                  </button>
                </div>
              </div>
            </section>

            <section
              class="rounded-3xl border p-5 space-y-4"
              :class="
                isLightTheme
                  ? 'border-white/20 bg-[#003D7A] text-white'
                  : 'border-white/20 bg-white/8'
              "
            >
              <h4 class="text-sm font-black uppercase tracking-wider">
                {{ t('schedule.optionalFields') }}
              </h4>

              <div>
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1">{{
                  t('schedule.phone')
                }}</label>
                <input
                  v-model="telefone"
                  type="tel"
                  :placeholder="t('schedule.phone')"
                  class="w-full mt-1 p-4 rounded-2xl border focus:border-[#00D3B8] outline-none transition-all font-semibold"
                  :class="
                    isLightTheme
                      ? 'bg-white/10 border-white/30 text-white placeholder:text-white/45'
                      : 'bg-white/8 border-white/30 text-white placeholder:text-white/45'
                  "
                />
              </div>

              <div>
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1">{{
                  t('schedule.reference')
                }}</label>
                <input
                  v-model="referencia"
                  type="text"
                  :placeholder="t('schedule.reference')"
                  class="w-full mt-1 p-4 rounded-2xl border focus:border-[#00D3B8] outline-none transition-all font-semibold"
                  :class="
                    isLightTheme
                      ? 'bg-white/10 border-white/30 text-white placeholder:text-white/45'
                      : 'bg-white/8 border-white/30 text-white placeholder:text-white/45'
                  "
                />
              </div>

              <div>
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1">
                  {{ t('schedule.serviceDetails') }}
                </label>
                <textarea
                  v-model="descricao"
                  rows="3"
                  :placeholder="t('schedule.serviceDetails')"
                  class="w-full mt-1 p-4 rounded-2xl border focus:border-[#00D3B8] outline-none transition-all font-semibold resize-none"
                  :class="
                    isLightTheme
                      ? 'bg-white/10 border-white/30 text-white placeholder:text-white/45'
                      : 'bg-white/8 border-white/30 text-white placeholder:text-white/45'
                  "
                />
              </div>

              <div>
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1">{{
                  t('schedule.notes')
                }}</label>
                <textarea
                  v-model="observacoes"
                  rows="2"
                  :placeholder="t('schedule.notes')"
                  class="w-full mt-1 p-4 rounded-2xl border focus:border-[#00D3B8] outline-none transition-all font-semibold resize-none"
                  :class="
                    isLightTheme
                      ? 'bg-white/10 border-white/30 text-white placeholder:text-white/45'
                      : 'bg-white/8 border-white/30 text-white placeholder:text-white/45'
                  "
                />
              </div>
            </section>
          </div>

          <footer
            class="px-6 py-4 border-t"
            :class="isLightTheme ? 'border-white/15 bg-[#003870]' : 'border-white/15 bg-[#003870]'"
          >
            <div class="grid grid-cols-2 gap-3">
              <button
                class="py-4 rounded-2xl border font-black text-sm"
                :class="
                  isLightTheme
                    ? 'border-white/25 bg-white/10 text-white'
                    : 'border-white/25 bg-white/10 text-white'
                "
                @click="emit('update:modelValue', false)"
              >
                {{ t('schedule.cancel') }}
              </button>

              <button
                class="py-4 rounded-2xl bg-[#00D3B8] text-[#003D7A] font-black text-sm shadow-xl active:scale-[0.99] transition-all"
                @click="handleSalvar"
              >
                {{ agendamentoInicial ? t('schedule.saveChanges') : t('schedule.confirmService') }}
              </button>
            </div>
          </footer>
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

.zoom-in-enter-active,
.zoom-in-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.25s ease;
}
.zoom-in-enter-from,
.zoom-in-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
