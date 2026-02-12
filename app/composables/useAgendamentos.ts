import { collection, addDoc, getDocs, query, where, deleteDoc, doc, Timestamp, updateDoc } from 'firebase/firestore'
import { useAuth } from './useAuth' 

export interface Agendamento {
  id: string
  cliente: string
  telefone: string
  endereco: string
  data: Timestamp
  descricao: string
  userId: string
  createdAt: Timestamp
}

export const useAgendamentos = () => {
  const { $db } = useNuxtApp()
  const { user } = useAuth()

  const criarAgendamento = async (dados: {
    cliente: string
    telefone: string
    endereco: string
    data: string
    descricao: string
  }) => {
    if (!user.value) return


    await addDoc(collection($db, 'agendamentos'), {
      cliente: dados.cliente,
      telefone: dados.telefone,
      endereco: dados.endereco,
      descricao: dados.descricao,
      data: Timestamp.fromDate(new Date(dados.data)),
      userId: user.value.uid,
      createdAt: Timestamp.fromDate(new Date())     
    })
  }

  const editarAgendamento = async (id: string, dados: {
    cliente: string
    telefone: string
    endereco: string
    data: string
    descricao: string
    }) => {
    if (!user.value) return

    await updateDoc(doc($db, 'agendamentos', id), {
        cliente: dados.cliente,
        telefone: dados.telefone,
        endereco: dados.endereco,
        descricao: dados.descricao,
        data: Timestamp.fromDate(new Date(dados.data))
    })
    }


  const listarAgendamentos = async (): Promise<Agendamento[]> => {
    if (!user.value) return []

    const q = query(
      collection($db, 'agendamentos'),
      where('userId', '==', user.value.uid)
  
    )

    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
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
