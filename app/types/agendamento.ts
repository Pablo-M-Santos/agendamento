import type { Timestamp } from 'firebase/firestore'

export interface Agendamento {
  id: string
  cliente: string
  telefone: string
  endereco: string
  descricao: string
  userId: string
  createdAt: Timestamp
  data: Timestamp
}

export type AgendamentoForm = {
  id?: string
  cliente: string
  telefone: string
  endereco: string
  descricao: string
  data: string
}
