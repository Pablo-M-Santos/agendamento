import { watch } from 'vue'

export default defineNuxtRouteMiddleware(async () => {

  if (import.meta.server) {
    return
  }

  const { user, loading } = useAuth()

  if (loading.value) {
    await new Promise<void>((resolve) => {
      const stop = watch(loading, (isLoading) => {
        if (!isLoading) {
          stop()
          resolve()
        }
      })
    })
  }

  if (!user.value) {
    return navigateTo('/')
  }
})