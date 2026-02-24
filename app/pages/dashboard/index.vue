<script setup lang="ts">
import { format } from 'date-fns'
import type { Timestamp } from 'firebase/firestore'

definePageMeta({ middleware: 'auth', layout: 'app' })

const { user } = useAuth()
const { listarAgendamentos } = useAgendamentos()

const agendamentos = ref<Agendamento[]>([])

const carregar = async () => {
  if (!user.value) return
  agendamentos.value = await listarAgendamentos()
}

onMounted(carregar)

const ultimosServicos = computed(() => {
  return [...agendamentos.value].sort((a, b) => b.data.toMillis() - a.data.toMillis()).slice(0, 5)
})

const formatarData = (ts: Timestamp) => format(ts.toDate(), 'dd/MM/yyyy HH:mm')
</script>

<template>
  <div>
    <!-- CARDS -->
    <div class="grid grid-cols-2 gap-6 mb-10">
      <NuxtLink
        to="/schedule"
        class="bg-gradient-to-br from-[#FA4805] to-orange-600 p-6 rounded-3xl shadow-xl active:scale-95 transition"
      >
        <h3 class="font-black text-lg">Serviços</h3>
        <p class="text-xs opacity-80 mt-1">Minha Agenda</p>
      </NuxtLink>

      <NuxtLink
        to="/reports"
        class="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-xl active:scale-95 transition"
      >
        <h3 class="font-black text-lg">Relatórios</h3>
        <p class="text-xs opacity-80 mt-1">Estatísticas</p>
      </NuxtLink>
    </div>

    <!-- SERVIÇOS RECENTES -->
    <section>
      <div class="flex items-center mb-6">
        <h3 class="font-black uppercase text-xs tracking-widest">Serviços Recentes</h3>
        <div class="flex-1 h-[1px] bg-white/10 ml-4"></div>
      </div>

      <div v-if="ultimosServicos.length" class="space-y-4">
        <div
          v-for="item in ultimosServicos"
          :key="item.id"
          class="bg-[#131314]/50 p-5 rounded-3xl border border-white/5"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="font-black text-white text-lg">
                {{ item.cliente }}
              </p>
              <p class="text-xs text-white/60 uppercase tracking-wider">
                {{ item.descricao || 'Sem descrição' }}
              </p>
            </div>

            <div class="text-right text-xs text-white/50 font-bold">
              {{ formatarData(item.data) }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
