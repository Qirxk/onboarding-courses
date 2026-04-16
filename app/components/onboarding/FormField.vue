<template lang="pug">
.field
  label.field__label(:for="id")
    | {{ label }}
    span.field__required(v-if="required") *

  textarea.field__control.field__control--textarea(
    v-if="type === 'textarea'"
    :id="id"
    v-model="model"
    :placeholder="placeholder"
    :rows="rows"
    :required="required"
  )

  select.field__control(
    v-else-if="type === 'select'"
    :id="id"
    v-model="model"
    :required="required"
  )
    option(value="") {{ placeholder }}
    option(v-for="opt in options" :key="opt.value" :value="opt.value")
      | {{ opt.label }}

  input.field__control(
    v-else
    :id="id"
    v-model="model"
    :type="type"
    :placeholder="placeholder"
    :required="required"
    :min="min"
    :max="max"
  )
</template>

<script setup lang="ts">
interface Option {
  value: string
  label: string
}

interface Props {
  id: string
  label: string
  placeholder?: string
  type?: 'text' | 'number' | 'url' | 'email' | 'tel' | 'password' | 'textarea' | 'select'
  required?: boolean
  rows?: number
  min?: number
  max?: number
  options?: Option[]
}

withDefaults(defineProps<Props>(), {
  placeholder: '',
  type: 'textarea',
  required: false,
  rows: 4,
  min: undefined,
  max: undefined,
  options: () => [],
})

// Accept string | number so that <input type="number"> doesn't trigger a prop
// type warning. The getter always returns a string; the setter coerces to string
// so the parent reactive object keeps its declared `string` type.
const rawModel = defineModel<string | number>({ required: true })

const model = computed({
  get() {
    return String(rawModel.value ?? '')
  },
  set(val: string | number) {
    rawModel.value = String(val)
  },
})
</script>

<style scoped>
.field {
  display: grid;
  gap: 0.55rem;
}

.field__label {
  font-size: 0.98rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: var(--brand-ink, #1a120f);
}

.field__required {
  color: var(--brand-primary, #ef4423);
  margin-left: 0.2rem;
}

.field__control {
  border: 1px solid var(--border-soft, #f4b298);
  border-radius: 0.9rem;
  padding: 0.9rem 1rem;
  font-size: 1rem;
  background: var(--surface-raised, #ffffff);
  color: var(--brand-ink, #1a120f);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field__control--textarea {
  resize: vertical;
}

.field__control:focus {
  outline: none;
  border-color: var(--brand-primary, #ef4423);
  box-shadow: 0 0 0 4px rgba(239, 68, 35, 0.16);
}
</style>
