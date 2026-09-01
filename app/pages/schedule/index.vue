<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const {
  dataSelecionada,
  isModalOpen,
  agendamentoParaEditar,
  isDetalhesOpen,
  agendamentoDetalhes,
  isConfirmOpen,
  diasCarrossel,
  agendamentosFiltrados,
  agendamentoAlvoIdNoDia,
  quantidadePorDia,
  abrirModalConfirmacao,
  confirmarExclusao,
  abrirModal,
  abrirDetalhes,
  abrirEdicaoPelosDetalhes,
  handleSalvarAgendamento
} = useSchedulePage()
</script>

<template>
  <div
    class="h-full p-5 overflow-y-auto overflow-x-hidden transition-colors bg-[#001a17] text-white"
  >
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
      @delete="abrirModalConfirmacao"
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

    <ScheduleConfirmDeleteModal v-model="isConfirmOpen" @confirm="confirmarExclusao" />
  </div>
</template>
