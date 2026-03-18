<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { AgendamentoForm } from '~/types/agendamento'

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
  if (!cliente.value.trim()) return alert('Nome do cliente e obrigatorio')
  if (!numeroCasa.value.trim()) return alert('Numero da casa e obrigatorio')
  if (!endereco.value.trim()) return alert('Endereco e obrigatorio')

  const dataFinal = new Date(props.dataSelecionadaNoPai)
  const [h, m] = horaSelecionada.value.split(':')
  dataFinal.setHours(Number(h), Number(m), 0)

  const dados: AgendamentoPayload = {
    cliente: cliente.value.trim(),
    numeroCasa: numeroCasa.value.trim(),
    endereco: endereco.value.trim(),
    descricao: descricao.value.trim(),
    materialPronto: materialPronto.value,
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
      <div v-if="modelValue" class="fixed inset-0 bg-[#0A2A52]/85 backdrop-blur-sm z-[60]" />
    </Transition>

    <Transition name="zoom-in">
      <div v-if="modelValue" class="fixed inset-0 z-[70] bg-[#003D7A] text-white">
        <div class="h-full flex flex-col">
          <header class="px-6 pt-6 pb-4 border-b border-white/15 flex items-center justify-between">
            <div>
              <p class="text-[11px] font-black uppercase tracking-[0.2em] text-white/70">Agenda</p>
              <h3 class="text-2xl font-black mt-1">
                {{ agendamentoInicial ? 'Editar Servico' : 'Cadastrar Servico' }}
              </h3>
              <p class="text-sm text-white/80 mt-1">
                {{ format(dataSelecionadaNoPai, "dd 'de' MMMM, yyyy", { locale: ptBR }) }}
              </p>
              <p class="text-xs text-white/60 mt-1">Preencha os campos principais para salvar.</p>
            </div>

            <button
              class="w-11 h-11 rounded-xl border border-white/25 bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
              aria-label="Fechar cadastro"
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
            <section class="rounded-3xl border border-[#00D3B8]/40 bg-[#00D3B8]/10 p-5 space-y-4">
              <div class="flex items-center justify-between">
                <h4 class="text-sm font-black uppercase tracking-wider text-[#B5FFF6]">
                  Dados principais
                </h4>
                <span class="text-[10px] font-black uppercase tracking-[0.18em] text-[#B5FFF6]">
                  Obrigatorio
                </span>
              </div>

              <div>
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1">
                  Nome do Cliente
                </label>
                <input
                  v-model="cliente"
                  type="text"
                  placeholder="Ex: Joao Silva"
                  class="w-full mt-1 bg-white/8 p-4 rounded-2xl border border-white/30 focus:border-[#00D3B8] text-white outline-none transition-all font-semibold placeholder:text-white/45"
                />
              </div>

              <div>
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1">
                  Numero da Casa
                </label>
                <input
                  v-model="numeroCasa"
                  type="text"
                  inputmode="numeric"
                  placeholder="Ex: 120"
                  class="w-full mt-1 bg-white/8 p-4 rounded-2xl border border-white/30 focus:border-[#00D3B8] text-white outline-none transition-all font-semibold placeholder:text-white/45"
                />
              </div>

              <div>
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1">
                  Endereco do Cliente
                </label>
                <input
                  v-model="endereco"
                  type="text"
                  placeholder="Rua, bairro ou condominio"
                  class="w-full mt-1 bg-white/8 p-4 rounded-2xl border border-white/30 focus:border-[#00D3B8] text-white outline-none transition-all font-semibold placeholder:text-white/45"
                />
              </div>
            </section>

            <section class="rounded-3xl border border-white/20 bg-white/8 p-5">
              <label class="text-[10px] font-black uppercase tracking-[0.18em] block mb-3">
                Horario do Servico
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
                      : 'bg-white/10 border-white/25 text-white'
                  ]"
                  @click="horaSelecionada = hora"
                >
                  {{ hora }}
                </button>
              </div>
            </section>

            <section class="rounded-3xl border border-white/20 bg-white/8 p-5">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="text-sm font-black uppercase tracking-wider">Material Pronto</p>
                  <p class="text-xs text-white/70 mt-1">
                    Opcional: marque se o material ja esta no local
                  </p>
                </div>

                <div class="flex gap-2">
                  <button
                    class="min-w-[58px] px-4 py-2 rounded-xl border font-black text-sm transition"
                    :class="
                      materialPronto === true
                        ? 'bg-[#00D3B8] border-[#00D3B8] text-[#003D7A]'
                        : 'bg-white/10 border-white/30 text-white'
                    "
                    @click="materialPronto = true"
                  >
                    Sim
                  </button>
                  <button
                    class="min-w-[58px] px-4 py-2 rounded-xl border font-black text-sm transition"
                    :class="
                      materialPronto === false
                        ? 'bg-[#00D3B8] border-[#00D3B8] text-[#003D7A]'
                        : 'bg-white/10 border-white/30 text-white'
                    "
                    @click="materialPronto = false"
                  >
                    Nao
                  </button>
                </div>
              </div>
            </section>

            <section class="rounded-3xl border border-white/20 bg-white/8 p-5 space-y-4">
              <h4 class="text-sm font-black uppercase tracking-wider">Campos Opcionais</h4>

              <div>
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1"
                  >Telefone</label
                >
                <input
                  v-model="telefone"
                  type="tel"
                  placeholder="Ex: (11) 99999-0000"
                  class="w-full mt-1 bg-white/8 p-4 rounded-2xl border border-white/30 focus:border-[#00D3B8] text-white outline-none transition-all font-semibold placeholder:text-white/45"
                />
              </div>

              <div>
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1"
                  >Referencia</label
                >
                <input
                  v-model="referencia"
                  type="text"
                  placeholder="Ex: Casa com portao preto"
                  class="w-full mt-1 bg-white/8 p-4 rounded-2xl border border-white/30 focus:border-[#00D3B8] text-white outline-none transition-all font-semibold placeholder:text-white/45"
                />
              </div>

              <div>
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1">
                  Detalhes do Servico
                </label>
                <textarea
                  v-model="descricao"
                  rows="3"
                  placeholder="Opcional: escopo do servico"
                  class="w-full mt-1 bg-white/8 p-4 rounded-2xl border border-white/30 focus:border-[#00D3B8] text-white outline-none transition-all font-semibold placeholder:text-white/45 resize-none"
                />
              </div>

              <div>
                <label class="text-[10px] font-black uppercase tracking-[0.18em] ml-1"
                  >Observacoes</label
                >
                <textarea
                  v-model="observacoes"
                  rows="2"
                  placeholder="Opcional: observacoes internas"
                  class="w-full mt-1 bg-white/8 p-4 rounded-2xl border border-white/30 focus:border-[#00D3B8] text-white outline-none transition-all font-semibold placeholder:text-white/45 resize-none"
                />
              </div>
            </section>
          </div>

          <footer class="px-6 py-4 border-t border-white/15 bg-[#003870]">
            <div class="grid grid-cols-2 gap-3">
              <button
                class="py-4 rounded-2xl border border-white/25 bg-white/10 text-white font-black text-sm"
                @click="emit('update:modelValue', false)"
              >
                Cancelar
              </button>

              <button
                class="py-4 rounded-2xl bg-[#00D3B8] text-[#003D7A] font-black text-sm shadow-xl active:scale-[0.99] transition-all"
                @click="handleSalvar"
              >
                {{ agendamentoInicial ? 'Salvar Alteracoes' : 'Confirmar Servico' }}
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
