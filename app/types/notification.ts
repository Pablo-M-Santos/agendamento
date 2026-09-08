export type NotificationChannel = 'TELEGRAM' | 'EMAIL' | 'SMS'

export type NotificationStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED'

export type ReminderTime = 0 | 5 | 15 | 30

export interface NotificationItem {
  id: number
  externalId: string
  title: string
  message: string
  channel: NotificationChannel
  status: NotificationStatus
  createdAt: string
  sentAt: string | null
}

export interface CreateNotificationPayload {
  externalId: string
  title: string
  message: string
  channel: NotificationChannel
}
