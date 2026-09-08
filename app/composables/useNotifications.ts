import type { NotificationItem, CreateNotificationPayload, ReminderTime } from '~/types/notification'

const BASE_URL = 'https://notification-service-production-5bc5.up.railway.app'

export const useNotifications = () => {
  const carregando = ref(false)
  const erro = ref<string | null>(null)

  const listarNotificacoes = async (externalId: string): Promise<NotificationItem[]> => {
    carregando.value = true
    erro.value = null
    try {
      return await $fetch<NotificationItem[]>(`${BASE_URL}/notifications`, {
        method: 'GET',
        params: { externalId },
        headers: { Accept: 'application/json' }
      })
    } catch (e: any) {
      if (e?.status_code === 404 || e?.message?.includes('404')) {
        return []
      }
      erro.value = e?.message || 'Erro ao buscar notificações'
      return []
    } finally {
      carregando.value = false
    }
  }

  const criarNotificacao = async (payload: CreateNotificationPayload) => {
    carregando.value = true
    erro.value = null
    try {
      console.log('[createNotification]', payload)
      return await $fetch<NotificationItem>(`${BASE_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: payload
      })
    } catch (e: any) {
      console.error('[createNotification error]', e)
      erro.value = e?.message || 'Erro ao criar notificação'
      throw e
    } finally {
      carregando.value = false
    }
  }

  const buscarNotificacao = async (id: number): Promise<NotificationItem | null> => {
    carregando.value = true
    erro.value = null
    try {
      return await $fetch<NotificationItem>(`${BASE_URL}/notifications/${id}`, {
        method: 'GET',
        headers: { Accept: 'application/json' }
      })
    } catch (e: any) {
      erro.value = e?.message || 'Erro ao buscar notificação'
      return null
    } finally {
      carregando.value = false
    }
  }

  const getReminderOptions = () => [
    { key: 0, label: 'Na hora' },
    { key: 5, label: '5 min antes' },
    { key: 15, label: '15 min antes' },
    { key: 30, label: '30 min antes' }
  ] as Array<{ key: ReminderTime; label: string }>

  return {
    carregando,
    erro,
    listarNotificacoes,
    criarNotificacao,
    buscarNotificacao,
    getReminderOptions
  }
}
