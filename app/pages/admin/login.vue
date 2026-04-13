<template lang="pug">
main.admin-page
  .admin-shell.admin-login
    section.admin-hero
      .admin-copy
        p.admin-eyebrow {{ t('admin.loginEyebrow') }}
        h1.admin-title {{ t('admin.loginTitle') }}
        p.admin-subtitle {{ t('admin.loginSubtitle') }}

    section.admin-card
      form.admin-form(@submit.prevent="handleLogin")
        OnboardingFormField(
          id="adminIdentifier"
          v-model="identifier"
          type="text"
          :label="t('admin.identifierLabel')"
          :placeholder="t('admin.identifierPlaceholder')"
          :required="true"
          :rows="1"
        )
        OnboardingFormField(
          id="adminPassword"
          v-model="password"
          type="password"
          :label="t('admin.passwordLabel')"
          :placeholder="t('admin.passwordPlaceholder')"
          :required="true"
          :rows="1"
        )

        p.admin-feedback.admin-feedback--error(v-if="errorMessage") {{ errorMessage }}

        button.btn.btn--primary(type="submit" :disabled="isSubmitting")
          | {{ isSubmitting ? t('admin.loggingIn') : t('admin.login') }}
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin-guest',
})

const { t } = useI18n({ useScope: 'global' })

useHead({ title: () => t('admin.loginTitle') })

const identifier = ref('')
const password = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  errorMessage.value = ''

  if (!identifier.value.trim()) {
    errorMessage.value = t('admin.identifierRequired')
    return
  }

  if (!password.value.trim()) {
    errorMessage.value = t('admin.passwordRequired')
    return
  }

  isSubmitting.value = true

  try {
    await $fetch('/api/admin/login', {
      body: {
        identifier: identifier.value,
        password: password.value,
      },
      method: 'POST',
    })

    await navigateTo('/admin')
  } catch {
    errorMessage.value = t('admin.loginError')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped src="~/assets/css/admin-page.css"></style>