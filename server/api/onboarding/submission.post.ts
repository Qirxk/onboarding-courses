import { createError, defineEventHandler, readBody } from 'h3'
import { buildOnboardingPayload, type FormData, ONBOARDING_STEPS } from '~/utils/onboarding'
import { getSupabaseAdminClient } from '../../utils/supabase-admin'
import { useOnboardingSession } from '../../utils/onboarding-session'

interface SaveSubmissionBody {
  stepIndex?: number
  values?: Partial<FormData>
  complete?: boolean
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export default defineEventHandler(async (event) => {
  const body = await readBody<SaveSubmissionBody>(event)
  const rawStepIndex = body.stepIndex

  if (typeof rawStepIndex !== 'number' || !Number.isInteger(rawStepIndex) || rawStepIndex < 0 || rawStepIndex >= ONBOARDING_STEPS.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid onboarding step.',
    })
  }

  const stepIndex = rawStepIndex

  if (!isRecord(body.values)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid onboarding values.',
    })
  }

  const payload = buildOnboardingPayload(stepIndex, body.values as Partial<FormData>)
  if (Object.keys(payload).length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing onboarding payload.',
    })
  }

  const session = await useOnboardingSession(event)
  const supabase = getSupabaseAdminClient(event)
  const submissionId = session.data.submissionId

  if (!submissionId) {
    const { data, error } = await supabase
      .from('cours-infos')
      .insert({ ...payload, source: 'nuxt_onboarding_form' })
      .select('id')
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      })
    }

    await session.update({
      submissionId: data?.id !== undefined && data?.id !== null ? String(data.id) : null,
    })
  } else {
    const { error } = await supabase
      .from('cours-infos')
      .update(payload)
      .eq('id', submissionId)

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      })
    }
  }

  if (body.complete) {
    await session.clear()
  }

  return {
    saved: true,
  }
})