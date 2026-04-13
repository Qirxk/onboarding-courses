<template lang="pug">
main.admin-page
  .admin-shell
    section.admin-hero
      .admin-copy
        p.admin-eyebrow {{ t('admin.dashboardEyebrow') }}
        h1.admin-title {{ t('admin.dashboardTitle') }}
        p.admin-subtitle {{ t('admin.dashboardSubtitle') }}
      .admin-toolbar
        button.btn.btn--ghost(type="button" @click="refresh()") {{ t('admin.refresh') }}
        button.btn.btn--primary(type="button" @click="handleLogout") {{ t('admin.logout') }}

    section.admin-card
      p.admin-feedback.admin-feedback--error(v-if="errorMessage") {{ errorMessage }}
      p.admin-empty(v-else-if="!submissions.length") {{ t('admin.empty') }}

      .admin-list(v-else)
        article.admin-list__item(v-for="submission in submissions" :key="submission.id")
          .admin-list__head
            div
              h2.admin-list__title
                NuxtLink.admin-link(:to="`/admin/submissions/${submission.id}`")
                  | {{ submission.full_name || submission.email || `#${submission.id}` }}
              .admin-list__meta
                span {{ submission.email || '—' }}
                span {{ submission.phone_number || '—' }}
                span {{ submission.actual_grade || '—' }}
                span {{ formatDate(submission.created_at) }}
            .admin-list__actions
              NuxtLink.admin-link.btn.btn--ghost(:to="`/admin/submissions/${submission.id}`") {{ t('admin.open') }}
              button.btn.btn--danger(
                v-if="showDeleteButton"
                type="button"
                :disabled="deletingId === String(submission.id)"
                @click="handleDelete(submission.id)"
              )
                | {{ deletingId === String(submission.id) ? t('admin.deleting') : t('admin.delete') }}
</template>

<script setup lang="ts">
import { formatSubmissionDate, type AdminSubmission } from '~/utils/admin'

definePageMeta({
  middleware: 'admin-auth',
})

const { t, locale } = useI18n({ useScope: 'global' })

useHead({ title: () => t('admin.dashboardTitle') })

const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
const showDeleteButton = false
const deletingId = ref<string | null>(null)
const errorMessage = ref('')

const { data, error, refresh } = await useAsyncData('admin-submissions', () =>
  $fetch<{ submissions: AdminSubmission[] }>('/api/admin/submissions', { headers }),
)

const submissions = computed(() => data.value?.submissions ?? [])

watchEffect(() => {
  errorMessage.value = error.value ? t('admin.listError') : ''
})

function formatDate(value?: string | null) {
  return formatSubmissionDate(value, locale.value === 'fr' ? 'fr-FR' : 'en-US')
}

async function handleLogout() {
  await $fetch('/api/admin/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}

async function handleDelete(id: number | string) {
  if (!window.confirm(t('admin.deleteConfirm'))) {
    return
  }

  deletingId.value = String(id)
  errorMessage.value = ''

  try {
    await $fetch(`/api/admin/submissions/${id}`, {
      method: 'DELETE',
    })
    await refresh()
  } catch {
    errorMessage.value = t('admin.deleteError')
  } finally {
    deletingId.value = null
  }
}
</script>

<style scoped src="~/assets/css/admin-page.css"></style>