<template>
    <div class="custom-textarea-container">
        <label v-if="label" class="custom-label" :class="{ 'has-error': error }">
            {{ label }}
            <i v-if="error" class="bi bi-exclamation-circle error-icon"></i>
        </label>
        <div class="textarea-wrapper">
            <textarea :value="modelValue" @input="handleInput" class="custom-textarea" :class="{ 'has-error': error }"
                :placeholder="placeholder" :disabled="disabled" :rows="rows"></textarea>
        </div>
        <div v-if="error" class="error-container">
            <span class="error-message">{{ error }}</span>
        </div>
        <span v-if="hint" class="hint-text">{{ hint }}</span>
    </div>
</template>

<script setup lang="ts">
interface TextareaProps {
    modelValue: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    hint?: string;
    rows?: number;
}

const props = withDefaults(defineProps<TextareaProps>(), {
    required: false,
    disabled: false,
    rows: 4
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'input', value: string): void;
}>();

const handleInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    emit('update:modelValue', target.value);
    emit('input', target.value);
};
</script>

<style scoped>
.custom-textarea-container {
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

.textarea-wrapper {
    position: relative;
    width: 100%;
}

.custom-textarea {
    width: 100%;
    min-height: 120px;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #1e293b;
    background-color: #fff;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    resize: vertical;
    transition: all 0.2s ease-in-out;
}

.custom-textarea:hover {
    border-color: #94a3b8;
}

.custom-textarea:focus {
    outline: none;
    border-color: #5b9fd9;
    box-shadow: 0 0 0 4px rgba(91, 159, 217, 0.1);
}

.custom-textarea.has-error {
    border-color: #dc2626;
    background-color: #fef2f2;
}

.custom-textarea.has-error:focus {
    box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
}

.custom-textarea::placeholder {
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

.hint-text {
    display: block;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #64748b;
}
</style>