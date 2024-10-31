<template>
  <table class="table table-row-bordered table-row-dashed gy-4 align-middle fw-bolder">
    <thead class="fs-7 text-uppercase">
      <tr>
        <th class="min-w-200px">Tên trạm bơm</th>
        <th class="min-w-150px">Đơn vị hành chính</th>
        <th class="min-w-90px">Năm hoạt động</th>
        <th class="min-w-90px">Năm sửa chữa</th>
        <th class="min-w-90px">Công suất (kW)</th>
        <th class="min-w-90px">Số lượng máy</th>
        <th class="min-w-50px text-end">Trạng thái</th>
      </tr>
    </thead>
    <tbody class="fs-6">
      <tr v-for="item in items" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ item.district_name }} - {{ item.commune_name }}</td>
        <td>{{ item.year }}</td>
        <td>{{ item.last_repair_year }}</td>
        <td>{{ item.power }}</td>
        <td>{{ item.pump_number }}</td>
        <td class="text-end">{{ item.status }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { Pump } from '@/utils/frontend/hydraulicStructureApi';

defineProps<{
  items: Pump[];
}>();
</script>