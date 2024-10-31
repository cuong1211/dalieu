// components/Form/SwitchButton.vue
<template>
    <div class="form-check form-switch">
        <input :id="id" class="form-check-input" type="checkbox" :checked="modelValue"
            @change="$emit('update:modelValue', $event.target.checked)">
        <label v-if="label" class="form-check-label" :for="id">
            {{ label }}
        </label>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    modelValue: boolean;
    label?: string;
    id?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    label: '',
    id: () => `switch-${Math.random().toString(36).substr(2, 9)}`
});

defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();
</script>

<style scoped>
.form-check-input {
    cursor: pointer;
}

.form-switch .form-check-input {
    width: 2.5em;
}

.form-check-input:checked {
    background-color: #009ef7;
    border-color: #009ef7;
}
</style>