<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { format, getDaysInMonth, setDate } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const props = defineProps<{
  modelValue: boolean
  agendamentoInicial?: any
  dataSelecionadaNoPai: Date 
}>()

const emit = defineEmits(['update:modelValue', 'salvar', 'excluir'])

const cliente = ref('')
const endereco = ref('')
const descricao = ref('')
const horaSelecionada = ref('09:00')

const horarios = computed(() => {
  const lista = []
  for (let h = 7; h <= 20; h++) {
    for (let m = 0; m < 60; m += 15) {
      lista.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }
  return lista
})

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    if (props.agendamentoInicial) {
      // Edição: Usa a data que já estava salva
      const dataDoc = props.agendamentoInicial.data?.toDate 
        ? props.agendamentoInicial.data.toDate() 
        : new Date(props.agendamentoInicial.data)
      
      cliente.value = props.agendamentoInicial.cliente
      endereco.value = props.agendamentoInicial.endereco || ''
      descricao.value = props.agendamentoInicial.descricao || ''
      horaSelecionada.value = format(dataDoc, 'HH:mm')
    } else {
      // Criação: Reseta campos e usa a hora padrão
      cliente.value = ''; endereco.value = ''; descricao.value = '';
      horaSelecionada.value = '09:00'
    }
  }
})


const handleSalvar = () => {
  if (!cliente.value) return alert('Nome do paciente é obrigatório')
  
  // Pega a data que já estava selecionada no carrossel
  const dataFinal = new Date(props.dataSelecionadaNoPai)
  const [h, m] = horaSelecionada.value.split(':')
  dataFinal.setHours(Number(h), Number(m), 0)

  const dados: any = {
    cliente: cliente.value,
    endereco: endereco.value,
    descricao: descricao.value,
    data: format(dataFinal, "yyyy-MM-dd'T'HH:mm")
  }

  if (props.agendamentoInicial?.id) dados.id = props.agendamentoInicial.id

  emit('salvar', dados)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="fixed inset-0 bg-slate-900/60 z-[60]" @click="emit('update:modelValue', false)"></div>
    </Transition>

    <Transition name="slide-up">
      <div v-if="modelValue" class="fixed inset-x-0 bottom-0 z-[70] flex items-end justify-center">
        <div class="bg-white w-full max-w-lg rounded-t-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
          
          <div class="py-3 w-full flex justify-center bg-white border-b border-slate-50">
            <div class="w-12 h-1 bg-slate-200 rounded-full"></div>
          </div>
          
          <div class="px-6 pb-10 pt-4 overflow-y-auto no-scrollbar">
<header class="mb-8">
              <span class="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                Agendando para {{ format(dataSelecionadaNoPai, "dd 'de' MMMM", { locale: ptBR }) }}
              </span>
              <h3 class="text-2xl font-black text-slate-800 mt-3">Nova <span class="text-blue-600">Sessão</span></h3>
            </header>
            
            <div class="space-y-6">
              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Paciente</label>
                <input v-model="cliente" type="text" placeholder="Nome completo" 
                       class="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold" />
              </div>

              <div class="bg-slate-50 p-5 rounded-[2rem]">

                <label class="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-6 mb-3 block">Horário (15/15min)</label>
                <div class="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
                  <button 
                    v-for="hora in horarios" :key="hora"
                    @click="horaSelecionada = hora"
                    :class="[
                      'px-5 py-3 rounded-xl font-bold text-sm flex-shrink-0 border-2 transition-all',
                      horaSelecionada === hora 
                        ? 'bg-slate-800 border-slate-800 text-white shadow-md' 
                        : 'bg-white border-slate-100 text-slate-400'
                    ]"
                  >
                    {{ hora }}
                  </button>
                </div>
              </div>

              <div>
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descricao</label>
                <input v-model="descricao" type="text" placeholder="Endereço ou link" 
                       class="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-semibold" />
              </div>
              
              <button @click="handleSalvar" 
                      class="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all">
                {{ agendamentoInicial ? 'Salvar Alterações' : 'Confirmar Agenda' }}
              </button>

              <button v-if="agendamentoInicial" @click="emit('excluir', agendamentoInicial.id)" 
                      class="w-full text-red-400 font-bold text-xs uppercase tracking-widest pt-2">
                Remover Consulta
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active { transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-leave-active { transition: transform 0.4s ease-in; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>