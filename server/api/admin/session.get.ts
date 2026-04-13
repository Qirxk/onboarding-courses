import { defineEventHandler } from 'h3'
import { useAdminSession } from '../../utils/admin-session'

export default defineEventHandler(async (event) => {
  const session = await useAdminSession(event)

  return {
    admin: {
      email: session.data.adminEmail ?? null,
      fullname: session.data.adminFullname ?? null,
      id: session.data.adminId ?? null,
      username: session.data.adminUsername ?? null,
    },
    authenticated: Boolean(session.data.adminId),
  }
})