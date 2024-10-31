<template>
  <CommonAttributes @update:attributes="updateAttributes">
    <div class="col-md-6 col-lg-4">
      <label class="form-label">Dung tích (m³)</label>
      <input v-model="capacity" type="number" class="form-control form-control-solid" min="0" step="0.01"
        @input="emitChanges" />
    </div>
    <div class="col-md-6 col-lg-4">
      <label class="form-label">F lưu vực (km²)</label>
      <input v-model="basin" type="number" class="form-control form-control-solid" min="0" step="0.01"
        @input="emitChanges" />
    </div>
  </CommonAttributes>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import CommonAttributes from './CommonAttributes.vue';

const capacity = ref(null);
const basin = ref(null);

const emit = defineEmits(['update:attributes']);

const updateAttributes = (commonAttributes: Record<string, any>) => {
  emitChanges(commonAttributes);
};

const emitChanges = (commonAttributes = {}) => {
  emit('update:attributes', {
    ...commonAttributes,
    capacity: capacity.value,
    catchmentArea: basin.value
  });
};

watch([capacity, basin], () => emitChanges(), { deep: true });
</script>