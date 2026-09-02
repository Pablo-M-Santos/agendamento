<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

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
</script>

<template>
  <div
    class="h-full px-5 sm:px-8 lg:px-12 py-5 sm:py-8 overflow-y-auto overflow-x-hidden transition-colors bg-[#141A28] text-[#EDEFF4]"
  >
    <div class="max-w-7xl mx-auto">
      <ScheduleHeader :data-selecionada="dataSelecionada" @add="abrirModal()" />

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
  </div>
</template>
