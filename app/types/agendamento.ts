import type { Timestamp } from 'firebase/firestore'

export interface Agendamento {
  id: string
  cliente: string
  numeroCasa: string
  endereco: string
  descricao: string
  materialPronto?: boolean | null
  telefone?: string
  referencia?: string
  observacoes?: string
  userId: string
  createdAt: Timestamp
  data: Timestamp
}

export type AgendamentoForm = {
  id?: string
  cliente: string
  numeroCasa: string
  endereco: string
  descricao: string
  materialPronto?: boolean | null
  telefone?: string
  referencia?: string
  observacoes?: string
  data: string
}
