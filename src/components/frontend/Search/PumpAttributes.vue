<template>
    <CommonAttributes @update:attributes="updateAttributes">
      <div class="col-md-6 col-lg-4">
        <label class="form-label">Công suất (kW)</label>
        <input v-model="power" type="number" class="form-control form-control-solid" min="0" step="0.1" @input="emitChanges" />
      </div>
      <div class="col-md-6 col-lg-4">
        <label class="form-label">Số lượng máy</label>
        <input v-model="pump_number" type="number" class="form-control form-control-solid" min="0" step="1" @input="emitChanges" />
      </div>
    </CommonAttributes>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  import CommonAttributes from './CommonAttributes.vue';
  
  const power = ref(null);
  const pump_number = ref(null);
  
  const emit = defineEmits(['update:attributes']);
  
  const updateAttributes = (commonAttributes: Record<string, any>) => {
    emitChanges(commonAttributes);
  };
  
  const emitChanges = (commonAttributes = {}) => {
    emit('update:attributes', {
      ...commonAttributes,
      power: power.value,
      machineCount: pump_number.value
    });
  };
  
  watch([power, pump_number], () => emitChanges(), { deep: true });
  </script>