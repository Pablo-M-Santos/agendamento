<script setup lang="ts">
import { Bars3Icon, CalendarDaysIcon, ChartBarIcon } from '@heroicons/vue/24/outline'
import { format } from 'date-fns'
import type { Timestamp } from 'firebase/firestore'

definePageMeta({ middleware: 'auth', layout: 'app' })

const { user } = useAuth()
const { listarAgendamentos } = useAgendamentos()

const agendamentos = ref<Agendamento[]>([])
const isSidebarOpen = ref(false)

const primeiroNome = computed(() => {
  const nome = user.value?.displayName?.trim()
  if (nome) return nome.split(' ')[0] || 'Usuário'

  const email = user.value?.email?.trim()
  if (email) return email.split('@')[0] || 'Usuário'

  return 'Usuário'
})

const saudacaoGenero = computed(() => {
  const nome = primeiroNome.value.toLowerCase()
  return nome.endsWith('a') ? 'vinda' : 'vindo'
})

const inicialUsuario = computed(() => primeiroNome.value.charAt(0).toUpperCase())

const getInitials = (nome?: string) => {
  if (!nome) return 'U'
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte.charAt(0))
    .join('')
    .toUpperCase()
}

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
  <div class="min-h-screen bg-[#003D7A] p-5">
    <div class="relative mb-6 min-h-[56px] flex items-center justify-center">
      <button
        class="absolute left-0 p-2 rounded-xl hover:bg-white/10 transition"
        aria-label="Abrir menu lateral"
        @click="isSidebarOpen = true"
      >
        <Bars3Icon class="w-7 h-7" />
      </button>

      <div class="text-center px-12">
        <p class="text-base font-black text-white">Seja bem {{ saudacaoGenero }},</p>
        <p class="text-base font-black text-white truncate">{{ primeiroNome }}</p>
      </div>

      <NuxtLink
        to="/profile"
        class="absolute right-0 w-11 h-11 rounded-[50%] overflow-hidden border border-white/20 bg-white/10 flex items-center justify-center hover:scale-105 transition"
        aria-label="Ir para o perfil"
      >
        <img
          v-if="user?.photoURL"
          :src="user.photoURL"
          alt="Foto do usuário"
          class="w-full h-full object-cover"
        />
        <span v-else class="text-sm font-black text-white">{{ inicialUsuario }}</span>
      </NuxtLink>
    </div>

    <DashboardSidebar v-model="isSidebarOpen" />

    <div class="grid grid-cols-2 gap-6 mb-10">
      <NuxtLink
        to="/schedule"
        class="relative overflow-hidden rounded-3xl p-5 w-[158px] h-[103px] bg-gradient-to-br from-[#00D3B8] to-[#00BFA5] shadow-xl active:scale-95 transition"
      >
        <div class="relative h-full flex flex-col justify-between">
          <div class="flex justify-end">
            <span class="p-2 rounded-full bg-white/15">
              <CalendarDaysIcon class="w-5 h-5 text-white/95" />
            </span>
          </div>
          <h3 class="font-black text-base tracking-wide">Agenda</h3>
        </div>
      </NuxtLink>

      <NuxtLink
        to="/reports"
        class="relative overflow-hidden rounded-3xl p-5 w-[158px] h-[103px] bg-gradient-to-br from-[#4F9CFF] to-[#2F7BFF] shadow-xl active:scale-95 transition"
      >
        <div class="relative h-full flex flex-col justify-between">
          <div class="flex justify-end">
            <span class="p-2 rounded-full bg-white/15">
              <ChartBarIcon class="w-5 h-5 text-white/95" />
            </span>
          </div>
          <h3 class="font-black text-base tracking-wide">Relatorios</h3>
        </div>
      </NuxtLink>
    </div>

    <section>
      <div class="flex items-center mb-4">
        <h3 class="font-black text-white/90 text-sm">Serviços recentes</h3>
        <div class="flex-1 h-[1px] bg-white/15 ml-4" />
      </div>

      <div v-if="ultimosServicos.length" class="space-y-3">
        <div
          v-for="item in ultimosServicos"
          :key="item.id"
          class="bg-white/95 text-[#0B1F3A] p-4 rounded-2xl shadow-md"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-full bg-[#E8F1FF] text-[#1D4ED8] font-black flex items-center justify-center"
            >
              {{ getInitials(item.cliente) }}
            </div>

            <div class="min-w-0 flex-1">
              <p class="font-bold text-sm text-[#0B1F3A] truncate">
                {{ item.cliente || 'Cliente' }}
              </p>
              <p class="text-xs text-[#5B6B8A] truncate">
                {{ item.descricao || 'Servico agendado' }}
              </p>
            </div>

            <div class="text-[11px] text-[#5B6B8A] font-semibold text-right">
              {{ formatarData(item.data) }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
