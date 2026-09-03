<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DashboardTopBar from '~/components/dashboard/DashboardTopBar.vue'
import DashboardSidebar from '~/components/DashboardSidebar.vue'

definePageMeta({ middleware: 'auth', layout: 'app' })

const { user } = useAuth()
const { t } = useAppI18n()

const {
  dataSelecionada,
  isModalOpen,
  agendamentoParaEditar,
  isDetalhesOpen,
  agendamentoDetalhes,
  diasCarrossel,
  agendamentosFiltrados,
  agendamentoAlvoIdNoDia,
  quantidadePorDia,
  abrirModal,
  abrirDetalhes,
  abrirEdicaoPelosDetalhes,
  handleSalvarAgendamento,
  toggleServicoConcluido
} = useSchedulePage()

const isSidebarOpen = ref(false)

onMounted(() => {
  isSidebarOpen.value = window.matchMedia('(min-width: 1024px)').matches
})

const saudacaoAgenda = computed(() => t('schedule.title'))

const inicialUsuario = computed(() => {
  const nome = user.value?.displayName?.trim()
  if (nome) return nome.charAt(0).toUpperCase()
  return user.value?.email?.charAt(0).toUpperCase() || 'U'
})
</script>

<template>
  <div
    class="h-full px-5 sm:px-8 lg:px-12 py-5 sm:py-8 overflow-y-auto overflow-x-hidden transition-colors bg-[#141A28] text-[#EDEFF4]"
    :class="{ 'lg:pl-[22rem]': isSidebarOpen }"
  >
      <DashboardTopBar
        :greeting="saudacaoAgenda"
        :photo-url="user?.photoURL"
        :user-initial="inicialUsuario"
        :open-sidebar-label="t('dashboard.openSidebar')"
        :go-profile-label="t('dashboard.goProfile')"
        :sidebar-open="isSidebarOpen"
        @open-sidebar="isSidebarOpen = !isSidebarOpen"
      />

      <DashboardSidebar v-model="isSidebarOpen" />

      <ScheduleHeader
        :data-selecionada="dataSelecionada"
        @add="abrirModal()"
      />

      <ScheduleDaysCarousel
        :dias-carrossel="diasCarrossel"
        :data-selecionada="dataSelecionada"
        :quantidade-por-dia="quantidadePorDia"
        @update:data-selecionada="dataSelecionada = $event"
      />

      <ScheduleAppointmentsList
        :agendamentos="agendamentosFiltrados"
        :highlighted-id="agendamentoAlvoIdNoDia"
        @details="abrirDetalhes"
        @edit="abrirModal"
        @toggle-completed="toggleServicoConcluido"
      />

      <ScheduleServiceDetailsModal
        v-model="isDetalhesOpen"
        :agendamento="agendamentoDetalhes"
        @edit="abrirEdicaoPelosDetalhes"
      />

      <ModalAgendamento
        v-model="isModalOpen"
        :agendamento-inicial="agendamentoParaEditar"
        :data-selecionada-no-pai="dataSelecionada"
        @salvar="handleSalvarAgendamento"
      />
  </div>
</template>