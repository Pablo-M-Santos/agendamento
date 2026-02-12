<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

import type { Agendamento } from '~/composables/useAgendamentos'
import { onMounted, ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useAgendamentos } from '~/composables/useAgendamentos'

const { user, logout } = useAuth()
const { criarAgendamento, listarAgendamentos, excluirAgendamento, editarAgendamento } = useAgendamentos()

const cliente = ref('')
const telefone = ref('')
const endereco = ref('')
const data = ref('')
const descricao = ref('')

const agendamentos = ref<Agendamento[]>([])
const editandoId = ref<string | null>(null)


const carregarAgendamentos = async () => {
  agendamentos.value = await listarAgendamentos()
}

const iniciarEdicao = (agendamento: Agendamento) => {
  editandoId.value = agendamento.id
  cliente.value = agendamento.cliente
  telefone.value = agendamento.telefone
  endereco.value = agendamento.endereco
  data.value = agendamento.data.toDate().toISOString().substring(0,10) // formata para input date
  descricao.value = agendamento.descricao
}


const salvar = async () => {
  if (!data.value) {
    alert('Escolha uma data')
    return
  }

  if (editandoId.value) {
    // edição
    await editarAgendamento(editandoId.value, {
      cliente: cliente.value,
      telefone: telefone.value,
      endereco: endereco.value,
      data: data.value,
      descricao: descricao.value
    })
    editandoId.value = null
  } else {
    // criação
    await criarAgendamento({
      cliente: cliente.value,
      telefone: telefone.value,
      endereco: endereco.value,
      data: data.value,
      descricao: descricao.value
    })
  }

  // limpa formulário
  cliente.value = ''
  telefone.value = ''
  endereco.value = ''
  data.value = ''
  descricao.value = ''

  await carregarAgendamentos()
}


const remover = async (id: string) => {
  await excluirAgendamento(id)
  await carregarAgendamentos()
}

onMounted(async () => {
  await carregarAgendamentos()
})
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Painel ⚡</h1>

    <button @click="logout" class="mb-6 px-4 py-2 bg-red-500 text-white rounded">Sair</button>

    <h2 class="text-xl font-semibold mb-2">Novo Agendamento</h2>
    <div class="flex flex-col gap-2 mb-4">
      <input v-model="cliente" placeholder="Cliente" class="border p-2 rounded" />
      <input v-model="telefone" placeholder="Telefone" class="border p-2 rounded" />
      <input v-model="endereco" placeholder="Endereço" class="border p-2 rounded" />
      <input type="date" v-model="data" class="border p-2 rounded" />
      <textarea v-model="descricao" placeholder="Descrição" class="border p-2 rounded"></textarea>
      <button @click="salvar" class="px-4 py-2 bg-blue-500 text-white rounded">Salvar</button>
    </div>

    <hr class="my-4" />

    <h2 class="text-xl font-semibold mb-2">Meus Agendamentos</h2>
    <div v-for="item in agendamentos" :key="item.id" class="border p-2 mb-2 rounded flex justify-between items-center">
      <div>
        <p>{{ item.cliente }} - {{ item.data.toDate().toLocaleDateString() }}</p>
        <p>{{ item.descricao }}</p>
      </div>
      <button @click="iniciarEdicao(item)" class="px-2 py-1 bg-yellow-500 text-white rounded">✏️ Editar</button>
      <button @click="remover(item.id)" class="px-2 py-1 bg-red-500 text-white rounded">❌ Excluir</button>
    </div>
  </div>
</template>
