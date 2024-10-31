<template>
    <CommonAttributes @update:attributes="updateAttributes">
      <div class="col-md-6 col-lg-4">
        <label class="form-label">Loại hình</label>
        <select v-model="type" class="form-select form-select-solid" @change="emitChanges">
          <option value="">Tất cả</option>
          <option value="earth">Kênh đất</option>
          <option value="concrete">Kênh bê tông</option>
          <option value="mixed">Kênh hỗn hợp</option>
        </select>
      </div>
      <div class="col-md-6 col-lg-4">
        <label class="form-label">Chiều dài (m)</label>
        <input v-model="length" type="number" class="form-control form-control-solid" min="0" step="0.1" @input="emitChanges" />
      </div>
    </CommonAttributes>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  import CommonAttributes from './CommonAttributes.vue';
  
  const type = ref('');
  const length = ref(null);
  
  const emit = defineEmits(['update:attributes']);
  
  const updateAttributes = (commonAttributes: Record<string, any>) => {
    emitChanges(commonAttributes);
  };
  
  const emitChanges = (commonAttributes = {}) => {
    emit('update:attributes', {
      ...commonAttributes,
      type: type.value,
      length: length.value
    });
  };
  
  watch([type, length], () => emitChanges(), { deep: true });
  </script>