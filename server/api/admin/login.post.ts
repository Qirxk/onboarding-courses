import { createError, defineEventHandler, readBody } from 'h3'
import { useAdminSession } from '../../utils/admin-session'
import { getSupabaseAdminClient } from '../../utils/supabase-admin'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ identifier?: string; password?: string }>(event)
  const identifier = body.identifier?.trim()
  const password = body.password?.trim()

  if (!identifier || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing credentials.',
    })
  }

  const supabase = getSupabaseAdminClient(event)
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('password', password)
    .or(`username.eq.${identifier},email.eq.${identifier}`)
    .limit(1)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  const admin = data?.[0]

  if (!admin?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials.',
    })
  }

  const session = await useAdminSession(event)
  await session.update({
    adminEmail: typeof admin.email === 'string' ? admin.email : null,
    adminFullname: typeof admin.fullname === 'string' ? admin.fullname : null,
    adminId: String(admin.id),
    adminUsername: typeof admin.username === 'string' ? admin.username : null,
  })

  return {
    authenticated: true,
    admin: {
      email: typeof admin.email === 'string' ? admin.email : null,
      fullname: typeof admin.fullname === 'string' ? admin.fullname : null,
      id: String(admin.id),
      username: typeof admin.username === 'string' ? admin.username : null,
    },
  }
})