<template>
    <div class="fv-row mb-7">
        <label class="fw-bold fs-6 mb-2">{{ label }}</label>
        <select :value="modelValue" @change="handleChange" class="form-select form-select-solid" :disabled="disabled">
            <option value="">{{ placeholder || '-- Chọn --' }}</option>
            <option v-for="option in options" :key="option.value" :value="option.value"
                :selected="modelValue === option.value">
                {{ option.label }}
            </option>
        </select>
        <span v-if="error" class="text-danger">{{ error }}</span>
    </div>
</template>

<script setup lang="ts">
interface Option {
    value: string | number;
    label: string;
}

defineProps<{
    modelValue: string | number;
    label: string;
    options: Option[];
    disabled?: boolean;
    error?: string;
    placeholder?: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const handleChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    emit('update:modelValue', target.value);
};
</script>