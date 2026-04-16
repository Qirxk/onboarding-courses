import { ONBOARDING_STEPS, STORAGE_PREFIX, type FormData } from '~/utils/onboarding'

function createInitialFormData(): FormData {
  return {
    fullName: '',
    email: '',
    actualGrade: '',
    phoneNumber: '',
    whyProgramming: '',
    whatBuild: '',
    techTried: '',
    hoursPerWeek: '',
    difficultThing: '',
    biggestNumberMethod: '',
    teaSteps: '',
    firstWhenBroken: '',
    whatCouldStop: '',
    whyChooseYou: '',
    howHeardAbout: '',
    howHeardAboutDetails: '',
  }
}

function normalizeStepIndex(value: number | null | undefined, stepCount: number): number {
  if (!Number.isInteger(value)) {
    return 0
  }

  const normalizedValue = value ?? 0
  return Math.min(Math.max(normalizedValue, 0), Math.max(stepCount - 1, 0))
}

export function useOnboardingForm() {
  const { t } = useI18n({ useScope: 'global' })
  const steps = ONBOARDING_STEPS

  // Persists the current step index so a reload resumes at the same step.
  const stepCookie = useCookie<number>('cours-info-current-step', {
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
    sameSite: 'lax',
  })

  const formData = reactive<FormData>(createInitialFormData())

  const currentStep = ref(normalizeStepIndex(stepCookie.value, steps.length))
  const errorMessage = ref('')
  const successMessage = ref('')
  const isSubmitting = ref(false)
  const hasMounted = ref(false)
  let resetTimer: ReturnType<typeof setTimeout> | null = null

  const stepTitles = computed(() => steps.map((step) => t(`steps.${step.id}`)))
  const currentStepData = computed(() => steps[currentStep.value] ?? steps[0]!)
  const isLastStep = computed(() => currentStep.value === steps.length - 1)

  const requiredFields = computed(() => currentStepData.value.fields)

  function getStorageKey(stepIndex: number) {
    return `${STORAGE_PREFIX}${stepIndex + 1}`
  }

  function pickStepValues(stepIndex: number): Partial<FormData> {
    const values: Partial<FormData> = {}
    const step = steps[stepIndex]

    if (!step) {
      return values
    }

    for (const field of step.fields) {
      values[field] = formData[field]
    }

    return values
  }

  function saveStep(stepIndex: number) {
    if (!import.meta.client) {
      return
    }

    const key = getStorageKey(stepIndex)
    localStorage.setItem(key, JSON.stringify(pickStepValues(stepIndex)))
  }

  function loadSavedSteps() {
    if (!import.meta.client) {
      return
    }

    for (let i = 0; i < steps.length; i += 1) {
      const step = steps[i]
      if (!step) {
        continue
      }

      const raw = localStorage.getItem(getStorageKey(i))
      if (!raw) {
        continue
      }

      try {
        const parsed = JSON.parse(raw) as Partial<FormData>
        for (const field of step.fields) {
          const value = parsed[field]
          if (typeof value === 'string') {
            formData[field] = value
          }
        }
      } catch {
        localStorage.removeItem(getStorageKey(i))
      }
    }
  }

  function clearSavedSteps() {
    if (!import.meta.client) {
      return
    }

    for (let i = localStorage.length - 1; i >= 0; i -= 1) {
      const key = localStorage.key(i)
      if (key?.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key)
      }
    }
  }

  function resetFormState() {
    Object.assign(formData, createInitialFormData())
    currentStep.value = 0
    errorMessage.value = ''
    successMessage.value = ''
  }

  function clearPersistedState() {
    clearSavedSteps()
    stepCookie.value = 0
  }

  function scheduleCompletionReset() {
    if (resetTimer) {
      clearTimeout(resetTimer)
    }

    resetTimer = setTimeout(() => {
      clearPersistedState()
      resetFormState()
      resetTimer = null
    }, 10_000)
  }

  async function saveStepToServer(stepIndex: number, complete = false): Promise<void> {
    const values = pickStepValues(stepIndex)
    if (Object.keys(values).length === 0) {
      return
    }

    await $fetch('/api/onboarding/submission', {
      method: 'POST',
      body: {
        stepIndex,
        values,
        complete,
      },
    })
  }

  function validateCurrentStep() {
    const missingRequired = requiredFields.value.some((field) => !formData[field].trim())
    if (missingRequired) {
      errorMessage.value = t('feedback.required')
      return false
    }

    if (currentStepData.value.id === 'effort') {
      const weeklyHours = Number(formData.hoursPerWeek)
      if (!Number.isFinite(weeklyHours) || weeklyHours < 1) {
        errorMessage.value = t('feedback.hours')
        return false
      }
    }

    if (currentStepData.value.id === 'profile') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const phoneRegex = /^[+()\-\s\d]{7,20}$/

      if (!emailRegex.test(formData.email.trim())) {
        errorMessage.value = t('feedback.email')
        return false
      }

      if (!phoneRegex.test(formData.phoneNumber.trim())) {
        errorMessage.value = t('feedback.phone')
        return false
      }
    }

    errorMessage.value = ''
    return true
  }

  async function goToNextStep() {
    if (!validateCurrentStep()) {
      return
    }

    saveStep(currentStep.value)
    errorMessage.value = ''
    successMessage.value = ''
    isSubmitting.value = true

    try {
      await saveStepToServer(currentStep.value)
      currentStep.value += 1
    } catch {
      errorMessage.value = t('feedback.submitError')
    } finally {
      isSubmitting.value = false
    }
  }

  function goToPreviousStep() {
    saveStep(currentStep.value)
    successMessage.value = ''

    if (currentStep.value > 0) {
      currentStep.value -= 1
    }
  }

  async function handleSubmit() {
    if (!validateCurrentStep()) {
      return
    }

    saveStep(currentStep.value)
    errorMessage.value = ''
    successMessage.value = ''
    isSubmitting.value = true

    try {
      await saveStepToServer(currentStep.value, true)
      successMessage.value = t('feedback.success')
      scheduleCompletionReset()
    } catch {
      errorMessage.value = t('feedback.submitError')
    } finally {
      isSubmitting.value = false
    }
  }

  watch(currentStep, (val) => {
    stepCookie.value = val
  })

  watch(
    formData,
    () => {
      if (!hasMounted.value) {
        return
      }

      saveStep(currentStep.value)
    },
    { deep: true },
  )

  onMounted(() => {
    currentStep.value = normalizeStepIndex(stepCookie.value, steps.length)
    loadSavedSteps()
    hasMounted.value = true
  })

  onBeforeUnmount(() => {
    if (resetTimer) {
      clearTimeout(resetTimer)
    }
  })

  return {
    steps,
    formData,
    currentStep,
    errorMessage,
    successMessage,
    isSubmitting,
    stepTitles,
    currentStepData,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    handleSubmit,
  }
}
