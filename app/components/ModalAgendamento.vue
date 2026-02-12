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

<<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="fixed inset-0 bg-[#1B1B1B]/80 backdrop-blur-sm z-[60]" @click="emit('update:modelValue', false)"></div>
    </Transition>

    <Transition name="slide-up">
      <div v-if="modelValue" class="fixed inset-x-0 bottom-0 z-[70] flex items-end justify-center">
        <div class="bg-[#1B1B1B] w-full max-w-lg rounded-t-[2.5rem] shadow-2xl border-t border-white/5 overflow-hidden flex flex-col max-h-[95vh]">
          
          <div class="py-3 w-full flex justify-center border-b border-white/5">
            <div class="w-12 h-1 bg-white rounded-full"></div>
          </div>
          
          <div class="px-6 pb-10 pt-4 overflow-y-auto no-scrollbar relative">
            
            <button 
              @click="emit('update:modelValue', false)"
              class="absolute right-6 top-4 w-10 h-10 flex items-center justify-center rounded-full border-2 border-white bg-[1B1B1B] text-white hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <header class="mb-8 pr-12">
              <span class="bg-[#FA4805]/10 text-[#FA4805] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                {{ format(dataSelecionadaNoPai, "dd 'de' MMMM", { locale: ptBR }) }}
              </span>
              <h3 class="text-2xl font-black text-white mt-3">
                {{ agendamentoInicial ? 'Editar' : 'Nova' }} <span class="text-[#FA4805]">Sessão</span>
              </h3>
            </header>
            
            <div class="space-y-6">
              <div>
                <label class="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Paciente</label>
                <input v-model="cliente" type="text" placeholder="Nome completo" 
                       class="w-full bg-[#1B1B1B] p-4 rounded-2xl border-2 border-[#ffffff] focus:border-[#FA4805] text-white outline-none transition-all font-bold placeholder:text-white/20" />
              </div>

              <div class="bg-[#1B1B1B]/50 p-5 rounded-[2rem] border-2 border-white">
                <label class="text-[10px] font-black text-[#ffffff] uppercase tracking-widest mb-3 block">Horário da Sessão</label>
                <div class="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
                  <button 
                    v-for="hora in horarios" :key="hora"
                    @click="horaSelecionada = hora"
                    :class="[
                      'px-5 py-3 rounded-xl font-bold text-sm flex-shrink-0 border-2 transition-all',
                      horaSelecionada === hora 
                        ? 'bg-[#FA4805] border-[#FA4805] text-white shadow-[0_0_15px_rgba(0,220,130,0.3)]' 
                        : 'bg-[#FA4805]/60 border-transparent text-white'
                    ]"
                  >
                    {{ hora }}
                  </button>
                </div>
              </div>

              <div>
                <label class="text-[10px] font-black text-white uppercase tracking-widest ml-1">Descrição</label>
                <input v-model="descricao" type="text" placeholder="Ex: Avaliação Inicial ou link" 
                       class="w-full bg-[#1B1B1B] p-4 rounded-2xl border-2 border-white focus:border-[#FA4805] text-white outline-none transition-all font-semibold placeholder:text-white/20" />
              </div>
              
              <button @click="handleSalvar" 
                      class="w-full bg-[#FA4805] text-[#020618] py-5 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all mt-4">
                {{ agendamentoInicial ? 'Salvar Alterações' : 'Confirmar Agenda' }}
              </button>

              <button v-if="agendamentoInicial" @click="emit('excluir', agendamentoInicial.id)" 
                      class="w-full text-red-400/60 hover:text-red-400 font-bold text-xs uppercase tracking-widest pt-2 transition-colors">
                Excluir Agendamento
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