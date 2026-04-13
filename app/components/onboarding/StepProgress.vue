<template lang="pug">
.progress
  p.progress__meta {{ stepLabel }} {{ currentStep + 1 }} / {{ totalSteps }}
  .progress__bar-wrap
    .progress__bar(:style="{ width: progressWidth }")
  ul.progress__steps
    li.progress__step(
      v-for="(title, index) in stepTitles"
      :key="title"
      :class="getStepClass(index)"
    )
      span {{ index + 1 }}
      | {{ title }}
</template>

<script setup lang="ts">
const props = defineProps<{
  currentStep: number
  totalSteps: number
  stepTitles: string[]
  stepLabel: string
}>()

const progressWidth = computed(() => {
  if (props.totalSteps <= 1) {
    return '100%'
  }

  const ratio = (props.currentStep / (props.totalSteps - 1)) * 100
  return `${Math.max(0, Math.min(ratio, 100))}%`
})

function getStepClass(index: number) {
  return {
    'progress__step--active': index === props.currentStep,
    'progress__step--done': index < props.currentStep,
  }
}
</script>

<style scoped>
.progress {
  display: grid;
  gap: 0.75rem;
}

.progress__meta {
  margin: 0;
  font-size: 0.88rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  color: var(--brand-primary, #ef4423);
}

.progress__bar-wrap {
  height: 0.5rem;
  border-radius: 999px;
  background: #ffd9c7;
  overflow: hidden;
}

.progress__bar {
  height: 100%;
  background: linear-gradient(90deg, var(--brand-primary, #ef4423) 0%, var(--brand-accent, #ff8a1f) 100%);
  transition: width 0.25s ease;
}

.progress__steps {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.progress__step {
  border: 1px solid #ffd0bc;
  border-radius: 999px;
  padding: 0.35rem 0.7rem;
  font-size: 0.82rem;
  color: var(--text-muted, #5e463f);
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: var(--surface-raised, #ffffff);
}

.progress__step span {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background: #ffe5d8;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.progress__step--active {
  border-color: var(--brand-primary, #ef4423);
  color: var(--brand-ink, #1a120f);
}

.progress__step--active span {
  background: var(--brand-primary, #ef4423);
  color: #ffffff;
}

.progress__step--done {
  border-color: var(--brand-accent, #ff8a1f);
  color: var(--brand-ink, #1a120f);
}

.progress__step--done span {
  background: var(--brand-accent, #ff8a1f);
  color: #ffffff;
}
</style>
