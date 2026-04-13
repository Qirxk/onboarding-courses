<template lang="pug">
.w-full
  nuxt-page
</template>

<script setup lang="ts">
const { t } = useI18n({ useScope: 'global' })

useHead({
  titleTemplate: (title) => title ? `${title} — TechShelter` : 'TechShelter',
  htmlAttrs: {
    lang: useI18n().locale,
  },
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon-shelter.jpg' },
    { rel: 'apple-touch-icon', href: '/favicon-shelter.jpg' },
  ],
})

useSeoMeta({
  description: () => t('meta.subtitle'),
  ogTitle: () => t('meta.title'),
  ogDescription: () => t('meta.subtitle'),
  ogImage: '/favicon-shelter.jpg',
  ogType: 'website',
  twitterCard: 'summary',
  twitterTitle: () => t('meta.title'),
  twitterDescription: () => t('meta.subtitle'),
  twitterImage: '/favicon-shelter.jpg',
})
</script>
