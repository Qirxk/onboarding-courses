export default defineNuxtRouteMiddleware(async () => {
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

  try {
    const response = await $fetch<{ authenticated: boolean }>('/api/admin/session', {
      headers,
    })

    if (!response.authenticated) {
      return navigateTo('/admin/login')
    }
  } catch {
    return navigateTo('/admin/login')
  }
})