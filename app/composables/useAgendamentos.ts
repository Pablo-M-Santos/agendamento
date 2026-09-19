import { useAuth } from './useAuth'
import { AgendamentoRepository } from '~/repositories/AgendamentoRepository'
import type { Agendamento } from '~/types/agendamento'
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore'

export type { Agendamento } from '~/types/agendamento'
export { LIMIT_POR_PAGINA } from '~/repositories/AgendamentoRepository'

export const useAgendamentos = () => {
  const { $db } = useNuxtApp()
  const { user } = useAuth()
  const repo = new AgendamentoRepository($db)

  const validarCamposObrigatorios = (dados: {
    cliente: string
    numeroCasa: string
    endereco: string
    valor?: number
    data: string
  }) => {
    if (!dados.cliente || !dados.cliente.trim()) {
      throw new Error('Nome do cliente é obrigatório')
    }
    if (!dados.numeroCasa || !dados.numeroCasa.trim()) {
      throw new Error('Número da casa é obrigatório')
    }
    if (!dados.endereco || !dados.endereco.trim()) {
      throw new Error('Endereço é obrigatório')
    }
    if (
      dados.valor !== undefined &&
      dados.valor !== null &&
      (typeof dados.valor !== 'number' || Number.isNaN(dados.valor) || dados.valor < 0)
    ) {
      throw new Error('Valor do serviço inválido')
    }
    if (!dados.data) {
      throw new Error('Data/hora é obrigatória')
    }
  }

  const criarAgendamento = async (dados: {
    cliente: string
    numeroCasa: string
    endereco: string
    valor?: number
    data: string
    materialPronto?: boolean | null
    servicoConcluido?: boolean | null
    observacoes?: string
  }) => {
    if (!user.value?.uid) throw new Error('Usuário não autenticado')

    validarCamposObrigatorios(dados)

    const cliente = dados.cliente.trim()
    const numeroCasa = dados.numeroCasa.trim()
    const endereco = dados.endereco.trim()
    const observacoes = (dados.observacoes || '').trim()

    await repo.create({
      cliente,
      numeroCasa,
      endereco,
      valor: dados.valor ?? 0,
      data: dados.data,
      materialPronto: dados.materialPronto ?? null,
      servicoConcluido: dados.servicoConcluido ?? false,
      observacoes,
      userId: user.value.uid
    })
  }

  const editarAgendamento = async (
    id: string,
    dados: {
      cliente: string
      numeroCasa: string
      endereco: string
      valor?: number
      data: string
      materialPronto?: boolean | null
      servicoConcluido?: boolean | null
      observacoes?: string
    }
  ) => {
    if (!user.value?.uid) throw new Error('Usuário não autenticado')

    validarCamposObrigatorios(dados)

    const cliente = dados.cliente.trim()
    const numeroCasa = dados.numeroCasa.trim()
    const endereco = dados.endereco.trim()
    const observacoes = (dados.observacoes || '').trim()

    await repo.update(id, {
      cliente,
      numeroCasa,
      endereco,
      valor: dados.valor ?? 0,
      data: dados.data,
      materialPronto: dados.materialPronto ?? null,
      servicoConcluido: dados.servicoConcluido ?? false,
      observacoes
    })
  }

  const atualizarStatus = async (
    id: string,
    status: { servicoConcluido?: boolean | null; materialPronto?: boolean | null }
  ) => {
    if (!user.value?.uid) throw new Error('Usuário não autenticado')

    await repo.updateStatus(id, status)
  }

  const listarAgendamentos = async (
    opciones?: { limite?: number; ultimoDoc?: QueryDocumentSnapshot<DocumentData> }
  ): Promise<Agendamento[]> => {
    if (!user.value) return []

    return repo.findAllPaginated(user.value.uid, opciones)
  }

  const listarAgendamentosCompleto = async (): Promise<Agendamento[]> => {
    if (!user.value) return []

    return repo.findAll(user.value.uid)
  }

  const excluirAgendamento = async (id: string) => {
    await repo.delete(id)
  }

  return {
    criarAgendamento,
    listarAgendamentos,
    listarAgendamentosCompleto,
    excluirAgendamento,
    editarAgendamento,
    atualizarStatus
  }
}
