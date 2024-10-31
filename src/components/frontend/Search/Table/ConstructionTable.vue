<template>
  <table class="table table-row-bordered table-row-dashed gy-4 align-middle fw-bolder">
    <thead class="fs-7 text-uppercase">
      <tr>
        <th class="min-w-200px">Tên công trình</th>
        <th class="min-w-150px">Loại công trình</th>
        <th class="min-w-150px">Đơn vị hành chính</th>
        <th class="min-w-90px">Năm hoạt động</th>
        <th class="min-w-90px">Năm sửa chữa</th>
        <th class="min-w-50px text-end">Trạng thái</th>
      </tr>
    </thead>
    <tbody class="fs-6">
      <tr v-for="item in items" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ getConstructionTypeName(item.type) }}</td>
        <td>{{ item.district_name }} - {{ item.commune_name }}</td>
        <td>{{ item.year }}</td>
        <td>{{ item.last_repair_year }}</td>
        <td class="text-end">{{ item.status }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { HydraulicStructure } from '@/utils/frontend/hydraulicStructureApi';

const props = defineProps<{
  items: HydraulicStructure[];
}>();

const getConstructionTypeName = (type: number) => {
  switch (type) {
    case 2:
      return 'Hồ chứa';
    case 3:
      return 'Trạm bơm';
    case 4:
      return 'Kênh dẫn';
    case 1:
      return 'Đập';
    default:
      return 'Không xác định';
  }
};
</script>