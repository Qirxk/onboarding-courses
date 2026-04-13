import type { H3Event } from 'h3'
import { createError, useSession } from 'h3'

interface AdminSessionData {
  adminId?: string
  adminEmail?: string | null
  adminFullname?: string | null
  adminUsername?: string | null
}

export async function useAdminSession(event: H3Event) {
  const config = useRuntimeConfig(event)

  if (!config.adminSessionPassword) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing NUXT_ADMIN_SESSION_PASSWORD configuration.',
    })
  }

  return useSession<AdminSessionData>(event, {
    name: 'cours-info-admin',
    password: config.adminSessionPassword,
    maxAge: 60 * 60 * 24 * 30,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    },
  })
}

export async function requireAdminSession(event: H3Event) {
  const session = await useAdminSession(event)

  if (!session.data.adminId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  return session
}