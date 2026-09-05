import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  Timestamp,
  updateDoc
} from 'firebase/firestore'
import { useAuth } from './useAuth'

export interface Agendamento {
  id: string
  cliente: string
  numeroCasa: string
  endereco: string
  valor?: number
  data: Timestamp
  materialPronto?: boolean | null
  servicoConcluido?: boolean | null
  observacoes?: string
  userId: string
  createdAt: Timestamp
}

export const useAgendamentos = () => {
  const { $db } = useNuxtApp()
  const { user } = useAuth()

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
    if (dados.valor !== undefined && dados.valor !== null && (typeof dados.valor !== 'number' || Number.isNaN(dados.valor) || dados.valor < 0)) {
      throw new Error('Valor do serviço inválido')
    }
    if (!dados.data) {
      throw new Error('Data/hora é obrigatória')
    }
  }

  const formatarDataParaFirestore = (dataString: string) => {
    const dateFormatted = dataString.includes('T')
      ? dataString.replace('T', ' ')
      : `${dataString} 00:00:00`
    return Timestamp.fromDate(new Date(dateFormatted))
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

    await addDoc(collection($db, 'agendamentos'), {
      cliente,
      numeroCasa,
      endereco,
      valor: dados.valor ?? 0,
      materialPronto: dados.materialPronto ?? null,
      servicoConcluido: dados.servicoConcluido ?? false,
      observacoes,
      data: formatarDataParaFirestore(dados.data),
      userId: user.value.uid,
      createdAt: Timestamp.fromDate(new Date())
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

    await updateDoc(doc($db, 'agendamentos', id), {
      cliente,
      numeroCasa,
      endereco,
      valor: dados.valor ?? 0,
      materialPronto: dados.materialPronto ?? null,
      servicoConcluido: dados.servicoConcluido ?? false,
      observacoes,
      data: Timestamp.fromDate(new Date(dados.data))
    })
  }

  const atualizarStatus = async (
    id: string,
    status: { servicoConcluido?: boolean | null; materialPronto?: boolean | null }
  ) => {
    if (!user.value?.uid) throw new Error('Usuário não autenticado')

    await updateDoc(doc($db, 'agendamentos', id), {
      ...status
    })
  }

  const listarAgendamentos = async (): Promise<Agendamento[]> => {
    if (!user.value) return []

    const q = query(collection($db, 'agendamentos'), where('userId', '==', user.value.uid))

    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Agendamento, 'id'>)
    }))
  }

  const excluirAgendamento = async (id: string) => {
    await deleteDoc(doc($db, 'agendamentos', id))
  }

  return {
    criarAgendamento,
    listarAgendamentos,
    excluirAgendamento,
    editarAgendamento,
    atualizarStatus
  }
}
