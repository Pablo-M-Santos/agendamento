export default defineNuxtRouteMiddleware((to) => {
  const legacyRoutes: Record<string, string> = {
    '/agenda': '/schedule',
    '/cadastro': '/register',
    '/perfil': '/profile',
    '/relatorios': '/reports'
  }

  const redirectTo = legacyRoutes[to.path]

  if (redirectTo) {
    return navigateTo(redirectTo, { redirectCode: 301, replace: true })
  }
})
