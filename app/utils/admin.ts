export interface AdminSubmission {
  id: number | string
  created_at?: string | null
  source?: string | null
  full_name?: string | null
  email?: string | null
  actual_grade?: string | null
  phone_number?: string | null
  why_programming?: string | null
  what_build?: string | null
  tech_tried?: string | null
  hours_per_week?: number | string | null
  difficult_thing?: string | null
  biggest_number_method?: string | null
  tea_steps?: string | null
  first_when_broken?: string | null
  what_could_stop?: string | null
  why_choose_you?: string | null
  [key: string]: unknown
}

export const ADMIN_DETAIL_FIELDS = [
  { key: 'full_name', labelKey: 'questions.fullName.label' },
  { key: 'email', labelKey: 'questions.email.label' },
  { key: 'actual_grade', labelKey: 'questions.actualGrade.label' },
  { key: 'phone_number', labelKey: 'questions.phoneNumber.label' },
  { key: 'why_programming', labelKey: 'questions.whyProgramming.label' },
  { key: 'what_build', labelKey: 'questions.whatBuild.label' },
  { key: 'tech_tried', labelKey: 'questions.techTried.label' },
  { key: 'hours_per_week', labelKey: 'questions.hoursPerWeek.label' },
  { key: 'difficult_thing', labelKey: 'questions.difficultThing.label' },
  { key: 'biggest_number_method', labelKey: 'questions.biggestNumberMethod.label' },
  { key: 'tea_steps', labelKey: 'questions.teaSteps.label' },
  { key: 'first_when_broken', labelKey: 'questions.firstWhenBroken.label' },
  { key: 'what_could_stop', labelKey: 'questions.whatCouldStop.label' },
  { key: 'why_choose_you', labelKey: 'questions.whyChooseYou.label' },
] as const

export function formatSubmissionDate(value?: string | null, locale = 'fr-FR') {
  if (!value) {
    return '—'
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}