export type StepId = 'profile' | 'motivation' | 'effort' | 'reflection' | 'engagement'

export interface FormData {
  fullName: string
  email: string
  actualGrade: string
  phoneNumber: string
  whyProgramming: string
  whatBuild: string
  techTried: string
  hoursPerWeek: string
  difficultThing: string
  biggestNumberMethod: string
  teaSteps: string
  firstWhenBroken: string
  whatCouldStop: string
  whyChooseYou: string
  howHeardAbout: string
  howHeardAboutDetails: string
}

export interface StepConfig {
  id: StepId
  fields: (keyof FormData)[]
}

export const FIELD_TO_COLUMN: Record<keyof FormData, string> = {
  fullName: 'full_name',
  email: 'email',
  actualGrade: 'actual_grade',
  phoneNumber: 'phone_number',
  whyProgramming: 'why_programming',
  whatBuild: 'what_build',
  techTried: 'tech_tried',
  hoursPerWeek: 'hours_per_week',
  difficultThing: 'difficult_thing',
  biggestNumberMethod: 'biggest_number_method',
  teaSteps: 'tea_steps',
  firstWhenBroken: 'first_when_broken',
  whatCouldStop: 'what_could_stop',
  whyChooseYou: 'why_choose_you',
  howHeardAbout: 'how_heard_about',
  howHeardAboutDetails: 'how_heard_about_details',
}

export const STORAGE_PREFIX = 'cours-info-onboarding-step-'

export const ONBOARDING_STEPS: StepConfig[] = [
  { id: 'motivation', fields: ['whyProgramming', 'whatBuild'] },
  { id: 'effort', fields: ['techTried', 'hoursPerWeek', 'difficultThing'] },
  { id: 'reflection', fields: ['biggestNumberMethod', 'teaSteps', 'firstWhenBroken'] },
  { id: 'engagement', fields: ['whatCouldStop', 'whyChooseYou'] },
  { id: 'profile', fields: ['fullName', 'email', 'actualGrade', 'phoneNumber', 'howHeardAbout', 'howHeardAboutDetails'] },
]

export function buildOnboardingPayload(stepIndex: number, values: Partial<FormData>): Record<string, unknown> {
  const step = ONBOARDING_STEPS[stepIndex]
  if (!step) {
    return {}
  }

  const payload: Record<string, unknown> = {}

  for (const field of step.fields) {
    const value = values[field]

    if (typeof value !== 'string') {
      continue
    }

    const column = FIELD_TO_COLUMN[field]
    payload[column] = field === 'hoursPerWeek' ? Number(value) || null : value
  }

  return payload
}
