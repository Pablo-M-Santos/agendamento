import type { Firestore } from 'firebase/firestore'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit as firestoreLimit,
  orderBy,
  query,
  startAfter,
  Timestamp,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot
} from 'firebase/firestore'
import type { Agendamento } from '~/types/agendamento'

export const LIMIT_POR_PAGINA = 50

export type AgendamentoInput = {
  cliente: string
  numeroCasa: string
  endereco: string
  valor?: number
  data: string
  materialPronto?: boolean | null
  servicoConcluido?: boolean | null
  observacoes?: string
  userId: string
}

export type AgendamentoUpdate = {
  cliente: string
  numeroCasa: string
  endereco: string
  valor?: number
  data: string
  materialPronto?: boolean | null
  servicoConcluido?: boolean | null
  observacoes?: string
}

export type PaginatedResult<T> = {
  items: T[]
  lastDoc: QueryDocumentSnapshot<DocumentData> | null
  hasMore: boolean
}

export interface IAgendamentoRepository {
  create(dados: AgendamentoInput): Promise<void>
  update(id: string, dados: AgendamentoUpdate): Promise<void>
  updateStatus(id: string, status: { servicoConcluido?: boolean | null; materialPronto?: boolean | null }): Promise<void>
  delete(id: string): Promise<void>
  findAllPaginated(userId: string, opciones?: { limite?: number; ultimoDoc?: QueryDocumentSnapshot<DocumentData> }): Promise<PaginatedResult<Agendamento>>
  findAll(userId: string): Promise<Agendamento[]>
  count(userId: string): Promise<number>
}

export class AgendamentoRepository implements IAgendamentoRepository {
  private db: Firestore
  private colRef: ReturnType<typeof collection>

  constructor(db: Firestore) {
    this.db = db
    this.colRef = collection(db, 'agendamentos')
  }

  private parseDate(dataString: string): Timestamp {
    const formatted = dataString.includes('T')
      ? dataString.replace('T', ' ')
      : `${dataString} 00:00:00`
    return Timestamp.fromDate(new Date(formatted))
  }

  async create(dados: AgendamentoInput): Promise<void> {
    await addDoc(this.colRef, {
      cliente: dados.cliente,
      numeroCasa: dados.numeroCasa,
      endereco: dados.endereco,
      valor: dados.valor ?? 0,
      materialPronto: dados.materialPronto ?? null,
      servicoConcluido: dados.servicoConcluido ?? false,
      observacoes: dados.observacoes,
      data: this.parseDate(dados.data),
      userId: dados.userId,
      createdAt: Timestamp.fromDate(new Date())
    })
  }

  async update(id: string, dados: AgendamentoUpdate): Promise<void> {
    await updateDoc(doc(this.db, 'agendamentos', id), {
      cliente: dados.cliente,
      numeroCasa: dados.numeroCasa,
      endereco: dados.endereco,
      valor: dados.valor ?? 0,
      materialPronto: dados.materialPronto ?? null,
      servicoConcluido: dados.servicoConcluido ?? false,
      observacoes: dados.observacoes,
      data: Timestamp.fromDate(new Date(dados.data))
    })
  }

  async updateStatus(
    id: string,
    status: { servicoConcluido?: boolean | null; materialPronto?: boolean | null }
  ): Promise<void> {
    await updateDoc(doc(this.db, 'agendamentos', id), {
      ...status
    })
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(this.db, 'agendamentos', id))
  }

  async findAllPaginated(
    userId: string,
    opciones?: { limite?: number; ultimoDoc?: QueryDocumentSnapshot<DocumentData> }
  ): Promise<PaginatedResult<Agendamento>> {
    const limite = opciones?.limite ?? LIMIT_POR_PAGINA

    let q = query(
      this.colRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      firestoreLimit(limite)
    )

    if (opciones?.ultimoDoc) {
      q = query(q, startAfter(opciones.ultimoDoc))
    }

    const snapshot = await getDocs(q)

    const items = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Agendamento, 'id'>)
    }))

    return {
      items,
      lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
      hasMore: snapshot.docs.length === limite
    }
  }

  async findAll(userId: string): Promise<Agendamento[]> {
    const q = query(
      this.colRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(q)

    const items = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Agendamento, 'id'>)
    }))

    return items
  }

  async count(userId: string): Promise<number> {
    const q = query(
      this.colRef,
      where('userId', '==', userId)
    )

    const snapshot = await getDocs(q)
    return snapshot.size
  }
}
