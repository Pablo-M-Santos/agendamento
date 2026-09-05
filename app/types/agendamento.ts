import type { Timestamp } from 'firebase/firestore'

export interface Agendamento {
  id: string
  cliente: string
  numeroCasa: string
  endereco: string
  valor?: number
  materialPronto?: boolean | null
  servicoConcluido?: boolean | null
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
  valor?: number
  materialPronto?: boolean | null
  servicoConcluido?: boolean | null
  observacoes?: string
  data: string
}
