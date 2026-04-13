import { createError, defineEventHandler, getRouterParam } from 'h3'
import { requireAdminSession } from '../../../utils/admin-session'
import { getSupabaseAdminClient } from '../../../utils/supabase-admin'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing submission id.',
    })
  }

  const supabase = getSupabaseAdminClient(event)
  const { error } = await supabase
    .from('cours-infos')
    .delete()
    .eq('id', id)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return {
    deleted: true,
  }
})