<template>
    <div class="custom-input-container">
        <label v-if="label" class="custom-label" :class="{ 'has-error': error }">
            {{ label }}
            <i v-if="error" class="bi bi-exclamation-circle error-icon"></i>
        </label>
        <div class="input-wrapper">
            <input :value="modelValue" @input="handleInput" :type="type" :step="step" :disabled="disabled"
                :placeholder="placeholder" class="custom-input" :class="{ 'has-error': error }" />
        </div>
        <div v-if="error" class="error-container">
            <span class="error-message">{{ error }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
interface InputProps {
    modelValue: string | number;
    label?: string;
    type?: 'text' | 'number' | 'email' | 'password' | 'tel';
    step?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
}

const props = withDefaults(defineProps<InputProps>(), {
    type: 'text',
    required: false,
    disabled: false
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
    (e: 'input', value: string | number): void;
}>();

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = props.type === 'number' ? Number(target.value) : target.value;
    emit('update:modelValue', value);
    emit('input', value);
};
</script>

<style scoped>
.custom-input-container {
    margin-bottom: 1.5rem;
    width: 100%;
}

.custom-label {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    color: #1e293b;
}

.custom-label.has-error {
    color: #dc2626;
}

.error-icon {
    margin-left: 8px;
    font-size: 1rem;
    color: #dc2626;
}

.input-wrapper {
    position: relative;
    width: 100%;
}

.custom-input {
    width: 100%;
    height: 48px;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #1e293b;
    background-color: #fff;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    transition: all 0.2s ease-in-out;
}

.custom-input:hover {
    border-color: #94a3b8;
}

.custom-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.custom-input.has-error {
    border-color: #dc2626;
    background-color: #fef2f2;
}

.custom-input.has-error:focus {
    box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
}

.custom-input::placeholder {
    color: #94a3b8;
    font-size: 1rem;
}

.error-container {
    margin-top: 0.5rem;
    padding: 0.5rem;
    background-color: #fef2f2;
    border-radius: 4px;
}

.error-message {
    display: block;
    font-size: 0.875rem;
    color: #dc2626;
}
</style>