<template>
    <div class="custom-select-container">
        <label v-if="label" class="custom-label" :class="{ 'has-error': error }">
            {{ label }}
            <i v-if="error" class="bi bi-exclamation-circle error-icon"></i>
        </label>
        <div class="select-wrapper">
            <select :value="modelValue" @change="handleChange" class="custom-select" :class="{ 'has-error': error }"
                :disabled="disabled">
                <option value="" disabled selected hidden>
                    {{ placeholder || 'Vui lòng chọn' }}
                </option>
                <option v-for="option in options" :key="option.value" :value="option.value">
                    {{ option.label }}
                </option>
            </select>
            <span class="select-arrow">
                <i class="bi bi-chevron-down"></i>
            </span>
        </div>
        <div v-if="error" class="error-container">
            <span class="error-message">{{ error }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps {
    modelValue: string | number;
    options: SelectOption[];
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
}

const props = withDefaults(defineProps<SelectProps>(), {
    required: false,
    disabled: false
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
    (e: 'change', value: string | number): void;
}>();

const handleChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    emit('update:modelValue', target.value);
    emit('change', target.value);
};
</script>

<style scoped>
.custom-select-container {
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

.select-wrapper {
    position: relative;
    width: 100%;
}

.custom-select {
    width: 100%;
    height: 48px;
    padding: 0.75rem 1rem;
    padding-right: 2.5rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #1e293b;
    background-color: #fff;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    appearance: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

.custom-select:hover {
    border-color: #94a3b8;
}

.custom-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.custom-select.has-error {
    border-color: #dc2626;
    background-color: #fef2f2;
}

.custom-select.has-error:focus {
    box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
}

.select-arrow {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #64748b;
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