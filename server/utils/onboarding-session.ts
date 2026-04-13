import type { H3Event } from 'h3'
import { createError, useSession } from 'h3'

interface OnboardingSessionData {
  submissionId?: string | null
}

export async function useOnboardingSession(event: H3Event) {
  const config = useRuntimeConfig(event)

  if (!config.adminSessionPassword) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing NUXT_ADMIN_SESSION_PASSWORD configuration.',
    })
  }

  return useSession<OnboardingSessionData>(event, {
    name: 'cours-info-onboarding',
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