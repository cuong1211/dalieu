<template>
    <CommonAttributes @update:attributes="updateAttributes">
      <div class="col-md-6 col-lg-4">
        <label class="form-label">Chiều dài đập (m)</label>
        <input v-model="length" type="number" class="form-control form-control-solid" min="0" step="0.1" @input="emitChanges" />
      </div>
      <div class="col-md-6 col-lg-4">
        <label class="form-label">Chiều cao đập (m)</label>
        <input v-model="height" type="number" class="form-control form-control-solid" min="0" step="0.1" @input="emitChanges" />
      </div>
    </CommonAttributes>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  import CommonAttributes from './CommonAttributes.vue';
  
  const length = ref(null);
  const height = ref(null);
  
  const emit = defineEmits(['update:attributes']);
  
  const updateAttributes = (commonAttributes: Record<string, any>) => {
    emitChanges(commonAttributes);
  };
  
  const emitChanges = (commonAttributes = {}) => {
    emit('update:attributes', {
      ...commonAttributes,
      length: length.value,
      height: height.value
    });
  };
  
  watch([length, height], () => emitChanges(), { deep: true });
  </script>