<template>
    <div class="fv-row mb-7">
        <label class="fw-bold fs-6 mb-2">{{ label }}</label>
        <textarea :value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
            class="form-control form-control-solid mb-3 mb-lg-0" :placeholder="placeholder" :disabled="disabled"></textarea>
        <span v-if="error" class="text-danger">{{ error }}</span>
    </div>
</template>

<script setup lang="ts">
import { disable } from 'ol/rotationconstraint';

defineProps<{
    modelValue: string;
    label: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
}>();

defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();
</script>