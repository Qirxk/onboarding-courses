import { defineEventHandler } from 'h3'
import { useAdminSession } from '../../utils/admin-session'

export default defineEventHandler(async (event) => {
  const session = await useAdminSession(event)
  await session.clear()

  return {
    authenticated: false,
  }
})