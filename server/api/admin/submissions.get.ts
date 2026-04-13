import { createError, defineEventHandler } from 'h3'
import { requireAdminSession } from '../../utils/admin-session'
import { getSupabaseAdminClient } from '../../utils/supabase-admin'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const supabase = getSupabaseAdminClient(event)
  const { data, error } = await supabase
    .from('cours-infos')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return {
    submissions: data ?? [],
  }
})