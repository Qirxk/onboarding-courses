<template lang="pug">
main.admin-page
  .admin-shell
    section.admin-hero
      .admin-copy
        p.admin-eyebrow {{ t('admin.detailEyebrow') }}
        h1.admin-title {{ submissionTitle }}
        p.admin-subtitle {{ t('admin.detailTitle') }}
      .admin-toolbar
        NuxtLink.admin-link.btn.btn--ghost(to="/admin") {{ t('admin.back') }}
        button.btn.btn--danger(type="button" v-if="showDeleteButton" :disabled="isDeleting" @click="handleDelete")
          | {{ isDeleting ? t('admin.deleting') : t('admin.delete') }}
        button.btn.btn--primary(type="button" @click="handleLogout") {{ t('admin.logout') }}

    section.admin-card.admin-detail
      p.admin-feedback.admin-feedback--error(v-if="errorMessage") {{ errorMessage }}

      template(v-else-if="submission")
        .admin-detail__grid
          article.admin-detail__item
            p.admin-detail__label {{ t('admin.submittedAt') }}
            p.admin-detail__value {{ formatDate(submission.created_at) }}
          article.admin-detail__item
            p.admin-detail__label {{ t('admin.source') }}
            p.admin-detail__value {{ submission.source || '—' }}

          article.admin-detail__item(v-for="field in detailFields" :key="field.key")
            p.admin-detail__label {{ t(field.labelKey) }}
            p.admin-detail__value {{ formatValue(submission[field.key]) }}
</template>

<script setup lang="ts">
import { ADMIN_DETAIL_FIELDS, formatSubmissionDate, type AdminSubmission } from '~/utils/admin'

definePageMeta({
  middleware: 'admin-auth',
})

const route = useRoute()
const { t, locale } = useI18n({ useScope: 'global' })

const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
const isDeleting = ref(false)
const errorMessage = ref('')
const detailFields = ADMIN_DETAIL_FIELDS
const showDeleteButton = false

const { data, error } = await useAsyncData(`admin-submission-${route.params.id}`, () =>
  $fetch<{ submission: AdminSubmission }>(`/api/admin/submissions/${route.params.id}`, { headers }),
)

const submission = computed(() => data.value?.submission ?? null)
const submissionTitle = computed(() => submission.value?.full_name || submission.value?.email || `#${route.params.id}`)

useHead({ title: () => submissionTitle.value ? String(submissionTitle.value) : t('admin.detailTitle') })

watchEffect(() => {
  errorMessage.value = error.value ? t('admin.detailError') : ''
})

function formatDate(value?: string | null) {
  return formatSubmissionDate(value, locale.value === 'fr' ? 'fr-FR' : 'en-US')
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  return String(value)
}

async function handleLogout() {
  await $fetch('/api/admin/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}

async function handleDelete() {
  if (!window.confirm(t('admin.deleteConfirm'))) {
    return
  }

  isDeleting.value = true
  errorMessage.value = ''

  try {
    await $fetch(`/api/admin/submissions/${route.params.id}`, {
      method: 'DELETE',
    })
    await navigateTo('/admin')
  } catch {
    errorMessage.value = t('admin.deleteError')
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped src="~/assets/css/admin-page.css"></style>