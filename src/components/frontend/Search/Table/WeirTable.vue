<template>
  <table class="table table-row-bordered table-row-dashed gy-4 align-middle fw-bolder">
    <thead class="fs-7 text-uppercase">
      <tr>
        <th class="min-w-200px">Tên đập thủy lợi</th>
        <th class="min-w-150px">Đơn vị hành chính</th>
        <th class="min-w-90px">Năm hoạt động</th>
        <th class="min-w-90px">Năm sửa chữa</th>
        <th class="min-w-90px">Chiều dài (m)</th>
        <th class="min-w-90px">Chiều cao (m)</th>
        <th class="min-w-50px text-end">Trạng thái</th>
      </tr>
    </thead>
    <tbody class="fs-6">
      <tr v-for="item in items" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ item.district_name }} - {{ item.commune_name }}</td>
        <td>{{ item.year }}</td>
        <td>{{ item.last_repair_year }}</td>
        <td>{{ item.length }}</td>
        <td>{{ item.height }}</td>
        <td class="text-end">{{ item.status }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { Weir } from '@/utils/frontend/hydraulicStructureApi';

defineProps<{
    items: Weir[];
}>();
</script>