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
  data: Timestamp
  descricao: string
  materialPronto?: boolean | null
  telefone?: string
  referencia?: string
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
    data: string
  }) => {
    if (!dados.cliente.trim()) throw new Error('Nome do cliente obrigatorio')
    if (!dados.numeroCasa.trim()) throw new Error('Numero da casa obrigatorio')
    if (!dados.endereco.trim()) throw new Error('Endereco obrigatorio')
    if (!dados.data) throw new Error('Data/hora obrigatoria')
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
    data: string
    descricao: string
    materialPronto?: boolean | null
    telefone?: string
    referencia?: string
    observacoes?: string
  }) => {
    if (!user.value?.uid) throw new Error('Usuario nao autenticado')

    validarCamposObrigatorios(dados)

    const cliente = dados.cliente.trim()
    const numeroCasa = dados.numeroCasa.trim()
    const endereco = dados.endereco.trim()
    const descricao = dados.descricao.trim()
    const telefone = (dados.telefone || '').trim()
    const referencia = (dados.referencia || '').trim()
    const observacoes = (dados.observacoes || '').trim()

    await addDoc(collection($db, 'agendamentos'), {
      cliente,
      numeroCasa,
      endereco,
      descricao,
      materialPronto: dados.materialPronto ?? null,
      telefone,
      referencia,
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
      data: string
      descricao: string
      materialPronto?: boolean | null
      telefone?: string
      referencia?: string
      observacoes?: string
    }
  ) => {
    if (!user.value?.uid) throw new Error('Usuario nao autenticado')

    validarCamposObrigatorios(dados)

    const cliente = dados.cliente.trim()
    const numeroCasa = dados.numeroCasa.trim()
    const endereco = dados.endereco.trim()
    const descricao = dados.descricao.trim()
    const telefone = (dados.telefone || '').trim()
    const referencia = (dados.referencia || '').trim()
    const observacoes = (dados.observacoes || '').trim()

    await updateDoc(doc($db, 'agendamentos', id), {
      cliente,
      numeroCasa,
      endereco,
      descricao,
      materialPronto: dados.materialPronto ?? null,
      telefone,
      referencia,
      observacoes,
      data: Timestamp.fromDate(new Date(dados.data))
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
    editarAgendamento
  }
}
