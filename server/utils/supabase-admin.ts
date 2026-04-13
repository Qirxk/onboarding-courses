import type { H3Event } from 'h3'
import { createClient } from '@supabase/supabase-js'
import { createError } from 'h3'

export function getSupabaseAdminClient(event: H3Event) {
  const config = useRuntimeConfig(event)
  const supabaseUrl = typeof config.public.supabaseUrl === 'string' ? config.public.supabaseUrl : ''
  const serviceRoleKey = typeof config.supabaseServiceRoleKey === 'string' ? config.supabaseServiceRoleKey : ''

  if (!supabaseUrl || !serviceRoleKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing Supabase server configuration.',
    })
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}