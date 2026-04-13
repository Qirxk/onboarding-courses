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
  const { data, error } = await supabase
    .from('cours-infos')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Submission not found.',
    })
  }

  return {
    submission: data,
  }
})