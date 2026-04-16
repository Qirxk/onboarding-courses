<template lang="pug">
main.landing-page
  section.landing-hero
    .landing-shell
      nuxt-link.landing-brand(to="/")
        img.landing-brand__logo(:src="shelterLogo" alt="Tech Shelter")
      .landing-topbar
        p.landing-topbar__label {{ t('language.label') }}
        .landing-topbar__actions
          button.landing-chip(
            v-for="item in localeOptions"
            :key="item.code"
            type="button"
            :class="{ 'landing-chip--active': item.code === locale }"
            @click="setLocale(item.code)"
          )
            | {{ item.name }}

      .landing-hero__grid
        .landing-hero__copy
          p.landing-eyebrow {{ t('landing.hero.eyebrow') }}
          h1.landing-title {{ t('landing.hero.title') }}
          p.landing-subtitle {{ t('landing.hero.subtitle') }}

          .landing-stats
            article.landing-stat(v-for="stat in stats" :key="stat.value")
              p.landing-stat__value {{ stat.value }}
              p.landing-stat__label {{ stat.label }}

          .landing-actions
            NuxtLink.landing-button.landing-button--primary(to="/survey") {{ t('landing.hero.primaryCta') }}
            a.landing-button.landing-button--ghost(href="#program") {{ t('landing.hero.secondaryCta') }}

        .landing-hero__visual(aria-hidden="true")
          .landing-orbit
            .landing-orbit__core
              span.landing-orbit__eyebrow {{ t('landing.hero.visualEyebrow') }}
              strong.landing-orbit__title {{ t('landing.hero.visualTitle') }}
            .landing-orbit__card.landing-orbit__card--top {{ t('landing.hero.visualCards.logic') }}
            .landing-orbit__card.landing-orbit__card--right {{ t('landing.hero.visualCards.code') }}
            .landing-orbit__card.landing-orbit__card--bottom {{ t('landing.hero.visualCards.ai') }}

  section#program.landing-section
    .landing-shell
      .landing-section__header
        p.landing-section__eyebrow {{ t('landing.program.eyebrow') }}
        h2.landing-section__title {{ t('landing.program.title') }}
        p.landing-section__subtitle {{ t('landing.program.subtitle') }}

      .landing-months
        article.landing-month(v-for="month in months" :key="month.id")
          .landing-month__header
            p.landing-month__eyebrow {{ month.eyebrow }}
            h3.landing-month__title {{ month.title }}
            p.landing-month__subtitle {{ month.subtitle }}

          .landing-weeks
            article.landing-week(v-for="week in month.weeks" :key="week.title")
              p.landing-week__step {{ week.step }}
              h4.landing-week__title {{ week.title }}
              ul.landing-week__topics
                li(v-for="topic in week.topics" :key="topic") {{ topic }}

  section.landing-section.landing-section--skills
    .landing-shell
      .landing-skills
        .landing-skills__copy
          p.landing-section__eyebrow {{ t('landing.skills.eyebrow') }}
          h2.landing-section__title {{ t('landing.skills.title') }}
          p.landing-section__subtitle {{ t('landing.skills.subtitle') }}
        .landing-skills__list
          article.landing-skill(v-for="skill in skills" :key="skill")
            span.landing-skill__dot
            p {{ skill }}

  section.landing-cta
    .landing-shell
      .landing-cta__panel
        .landing-cta__copy
          p.landing-section__eyebrow {{ t('landing.cta.eyebrow') }}
          h2.landing-section__title {{ t('landing.cta.title') }}
          p.landing-section__subtitle {{ t('landing.cta.subtitle') }}
        NuxtLink.landing-button.landing-button--primary(to="/survey") {{ t('landing.cta.button') }}
</template>

<script setup lang="ts">
interface LandingWeek {
  step: string
  title: string
  topics: string[]
}

interface LandingMonth {
  id: string
  eyebrow: string
  title: string
  subtitle: string
  weeks: LandingWeek[]
}

interface LandingStat {
  value: string
  label: string
}

import shelterLogo from '~/assets/logo/logo-shelter.png'

const { t, tm, rt, locale, locales, setLocale } = useI18n({ useScope: 'global' })

useHead({ title: () => t('landing.meta.title') })

const localeOptions = computed(() =>
  locales.value.map((item: string | { code: string; name?: string }) => {
    if (typeof item === 'string') {
      return { code: item, name: item.toUpperCase() }
    }

    return { code: item.code, name: item.name || item.code.toUpperCase() }
  }),
)

function renderMessage(value: unknown) {
  if (typeof value === 'string') {
    return value
  }

  return rt(value as Parameters<typeof rt>[0])
}

const stats = computed(() => {
  const translatedStats = tm('landing.hero.stats') as Array<Record<string, unknown>>

  return translatedStats.map((stat) => ({
    value: renderMessage(stat.value),
    label: renderMessage(stat.label),
  })) satisfies LandingStat[]
})

const months = computed(() => {
  const translatedMonths = tm('landing.program.months') as Array<Record<string, unknown>>

  return translatedMonths.map((month) => ({
    id: renderMessage(month.id),
    eyebrow: renderMessage(month.eyebrow),
    title: renderMessage(month.title),
    subtitle: renderMessage(month.subtitle),
    weeks: ((month.weeks as Array<Record<string, unknown>> | undefined) ?? []).map((week) => ({
      step: renderMessage(week.step),
      title: renderMessage(week.title),
      topics: ((week.topics as unknown[]) ?? []).map((topic) => renderMessage(topic)),
    })),
  })) satisfies LandingMonth[]
})

const skills = computed(() => {
  const translatedSkills = tm('landing.skills.items') as unknown[]

  return translatedSkills.map((skill) => renderMessage(skill))
})
</script>

<style scoped src="~/assets/css/landing-page.css"></style>