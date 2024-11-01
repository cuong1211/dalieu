<template>
    <div class="custom-checkbox-container">
        <div class="checkbox-wrapper">
            <input type="checkbox" :id="id" :checked="modelValue" @change="handleChange" class="custom-checkbox"
                :disabled="disabled" />
            <label :for="id" class="checkbox-label" :class="{ 'has-error': error }">
                {{ label }}
                <i v-if="error" class="bi bi-exclamation-circle error-icon"></i>
            </label>
        </div>
        <div v-if="error" class="error-container">
            <span class="error-message">{{ error }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface CheckboxProps {
    modelValue: boolean;
    label: string;
    id?: string;
    disabled?: boolean;
    error?: string;
}

const props = withDefaults(defineProps<CheckboxProps>(), {
    disabled: false,
    id: computed(() => `checkbox-${Math.random().toString(36).substr(2, 9)}`).value
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'change', value: boolean): void;
}>();

const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.checked);
    emit('change', target.checked);
};
</script>

<style scoped>
.custom-checkbox-container {
    margin-bottom: 1rem;
}

.checkbox-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.custom-checkbox {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: #3b82f6;
}

.checkbox-label {
    font-size: 1rem;
    color: #1e293b;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.checkbox-label.has-error {
    color: #dc2626;
}

.error-icon {
    color: #dc2626;
    font-size: 1rem;
}

.error-container {
    margin-top: 0.5rem;
    margin-left: 28px;
    padding: 0.5rem;
    background-color: #fef2f2;
    border-radius: 4px;
}

.error-message {
    display: block;
    font-size: 0.875rem;
    color: #dc2626;
}

.custom-checkbox:disabled,
.custom-checkbox:disabled+.checkbox-label {
    cursor: not-allowed;
    opacity: 0.6;
}
</style>