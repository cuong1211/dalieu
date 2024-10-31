<template>
    <div class="fv-row mb-7">
        <label class="fw-bold fs-6 mb-2">{{ label }}</label>
        <input :value="modelValue" @input="handleInput" :type="type" :step="step"
            class="form-control form-control-solid mb-3 mb-lg-0" :placeholder="placeholder" :disabled="disabled"/>
        <span v-if="error" class="text-danger">{{ error }}</span>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    modelValue: string | number | null;
    label: string;
    type?: string;
    step?: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
    (e: 'input', value: string | number): void;
}>();

const handleInput = (event: Event) => {

    const value = (event.target as HTMLInputElement).value;
    
    emit('update:modelValue', value);
    emit('input', value);
};
</script>