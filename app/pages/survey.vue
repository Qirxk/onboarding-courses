<template lang="pug">
main.page
  section.hero
    nuxt-link.hero__brand(to="/")
      img.hero__brand-logo(:src="shelterLogo" alt="Tech Shelter")
    .hero__top.mt-5
      .hero__copy
        p.hero__eyebrow {{ t('surveyMeta.eyebrow') }}
        h1.hero__title {{ t('surveyMeta.title') }}
        p.hero__subtitle
          | {{ t('surveyMeta.subtitle') }}
      .lang-switch
        p.lang-switch__label {{ t('language.label') }}
        .lang-switch__actions
          button.lang-switch__button(
            v-for="item in localeOptions"
            :key="item.code"
            type="button"
            :class="{ 'lang-switch__button--active': item.code === locale }"
            @click="setLocale(item.code)"
          )
            | {{ item.name }}

  section.form-card
    OnboardingStepProgress(
      :current-step="currentStep"
      :total-steps="steps.length"
      :step-titles="stepTitles"
      :step-label="t('progress.step')"
    )

    form.form(@submit.prevent="handleSubmit")
      template(v-if="currentStepData.id === 'profile'")
        OnboardingFormField(
          id="fullName"
          v-model="formData.fullName"
          type="text"
          :label="t('questions.fullName.label')"
          :placeholder="t('questions.fullName.placeholder')"
          :required="true"
          :rows="1"
        )
        OnboardingFormField(
          id="email"
          v-model="formData.email"
          type="email"
          :label="t('questions.email.label')"
          :placeholder="t('questions.email.placeholder')"
          :required="true"
          :rows="1"
        )
        OnboardingFormField(
          id="actualGrade"
          v-model="formData.actualGrade"
          type="text"
          :label="t('questions.actualGrade.label')"
          :placeholder="t('questions.actualGrade.placeholder')"
          :required="true"
          :rows="1"
        )
        OnboardingFormField(
          id="phoneNumber"
          v-model="formData.phoneNumber"
          type="tel"
          :label="t('questions.phoneNumber.label')"
          :placeholder="t('questions.phoneNumber.placeholder')"
          :required="true"
          :rows="1"
        )
        OnboardingFormField(
          id="howHeardAbout"
          v-model="formData.howHeardAbout"
          type="select"
          :label="t('questions.howHeardAbout.label')"
          :placeholder="t('questions.howHeardAbout.placeholder')"
          :required="true"
          :options="howHeardAboutOptions"
        )
        OnboardingFormField(
          v-if="formData.howHeardAbout"
          id="howHeardAboutDetails"
          v-model="formData.howHeardAboutDetails"
          :label="t('questions.howHeardAboutDetails.label')"
          :placeholder="t('questions.howHeardAboutDetails.placeholder')"
          :required="true"
          :rows="2"
        )

      template(v-else-if="currentStepData.id === 'motivation'")
        OnboardingFormField(
          id="whyProgramming"
          v-model="formData.whyProgramming"
          :label="t('questions.whyProgramming.label')"
          :placeholder="t('questions.whyProgramming.placeholder')"
          :required="true"
          :rows="5"
        )
        OnboardingFormField(
          id="whatBuild"
          v-model="formData.whatBuild"
          :label="t('questions.whatBuild.label')"
          :placeholder="t('questions.whatBuild.placeholder')"
          :required="true"
          :rows="4"
        )

      template(v-else-if="currentStepData.id === 'effort'")
        OnboardingFormField(
          id="techTried"
          v-model="formData.techTried"
          :label="t('questions.techTried.label')"
          :placeholder="t('questions.techTried.placeholder')"
          :required="true"
          :rows="4"
        )
        OnboardingFormField(
          id="hoursPerWeek"
          v-model="formData.hoursPerWeek"
          type="number"
          :label="t('questions.hoursPerWeek.label')"
          :placeholder="t('questions.hoursPerWeek.placeholder')"
          :required="true"
          :min="1"
          :max="80"
        )
        OnboardingFormField(
          id="difficultThing"
          v-model="formData.difficultThing"
          :label="t('questions.difficultThing.label')"
          :placeholder="t('questions.difficultThing.placeholder')"
          :required="true"
          :rows="4"
        )

      template(v-else-if="currentStepData.id === 'reflection'")
        OnboardingFormField(
          id="biggestNumberMethod"
          v-model="formData.biggestNumberMethod"
          :label="t('questions.biggestNumberMethod.label')"
          :placeholder="t('questions.biggestNumberMethod.placeholder')"
          :required="true"
          :rows="4"
        )
        OnboardingFormField(
          id="teaSteps"
          v-model="formData.teaSteps"
          :label="t('questions.teaSteps.label')"
          :placeholder="t('questions.teaSteps.placeholder')"
          :required="true"
          :rows="5"
        )
        OnboardingFormField(
          id="firstWhenBroken"
          v-model="formData.firstWhenBroken"
          :label="t('questions.firstWhenBroken.label')"
          :placeholder="t('questions.firstWhenBroken.placeholder')"
          :required="true"
          :rows="4"
        )

      template(v-else-if="currentStepData.id === 'engagement'")
        OnboardingFormField(
          id="whatCouldStop"
          v-model="formData.whatCouldStop"
          :label="t('questions.whatCouldStop.label')"
          :placeholder="t('questions.whatCouldStop.placeholder')"
          :required="true"
          :rows="4"
        )
        OnboardingFormField(
          id="whyChooseYou"
          v-model="formData.whyChooseYou"
          :label="t('questions.whyChooseYou.label')"
          :placeholder="t('questions.whyChooseYou.placeholder')"
          :required="true"
          :rows="4"
        )

      p.feedback.feedback--error(v-if="errorMessage") {{ errorMessage }}
      p.feedback.feedback--success(v-if="successMessage") {{ successMessage }}

      .actions
        button.btn.btn--ghost(type="button" @click="goToPreviousStep" :disabled="currentStep === 0 || isSubmitting")
          | {{ t('actions.previous') }}
        button.btn.btn--primary(
          v-if="!isLastStep"
          type="button"
          @click="goToNextStep"
          :disabled="isSubmitting"
        )
          | {{ t('actions.next') }}
        button.btn.btn--primary(
          v-else
          type="submit"
          :disabled="isSubmitting"
        )
          | {{ isSubmitting ? t('actions.submitting') : t('actions.submit') }}
</template>

<script setup lang="ts">
import shelterLogo from '~/assets/logo/logo-shelter.png'

const { t, tm, rt, locale, locales, setLocale } = useI18n({ useScope: 'global' })

useHead({ title: () => t('surveyMeta.title') })

const localeOptions = computed(() =>
  locales.value.map((item: string | { code: string; name?: string }) => {
    if (typeof item === 'string') {
      return { code: item, name: item.toUpperCase() }
    }

    return { code: item.code, name: item.name || item.code.toUpperCase() }
  }),
)

const howHeardAboutOptions = computed(() => {
  const rawOptions = tm('selectOptions.howHeardAbout') as Array<{ value: string; label: string }>
  return rawOptions.map(opt => ({
    value: opt.value,
    label: typeof opt.label === 'string' ? opt.label : rt(opt.label),
  }))
})

const {
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
} = useOnboardingForm()
</script>

<style scoped src="~/assets/css/onboarding-page.css"></style>