<template>
  <div class="row g-8 mb-8">
    <DistricSelect :districtId="district" :communeId="commune" @update:districtId="district = $event"
      @update:communeId="commune = $event" />
    <div class="col-md-6 col-lg-4">
      <label class="form-label">Năm đi vào hoạt động</label>
      <input v-model="year" type="number" class="form-control form-control-solid" :max="currentYear"
        @input="emitChanges" />
    </div>
    <div class="col-md-6 col-lg-4">
      <label class="form-label">Năm sửa chữa</label>
      <input v-model="last_repair_year" type="number" class="form-control form-control-solid" :max="currentYear"
        @input="emitChanges" />
    </div>
    <div class="col-md-6 col-lg-4">
      <label class="form-label">Tình trạng hoạt động</label>
      <select v-model="status" class="form-select form-select-solid" @change="emitChanges">
        <option value="">Tất cả</option>
        <option value="active">Đang hoạt động</option>
        <option value="inactive">Ngừng hoạt động</option>
        <option value="maintenance">Đang bảo trì</option>
      </select>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import DistricSelect from '../DistrictSelect/DistricSelect.vue';

const district = ref<number | string>('');
const commune = ref<number | string>('');
const year = ref(null);
const last_repair_year = ref(null);
const status = ref('');
const currentYear = new Date().getFullYear();

const emit = defineEmits(['update:attributes']);

const emitChanges = () => {
  emit('update:attributes', {
    'district-id': district.value,
    'commune-id': commune.value,
    'year': year.value,
    'last-repair-year': last_repair_year.value,
    'status': status.value
  });
};

watch([district, commune, year, last_repair_year, status], emitChanges, { deep: true });
</script>