<template>
  <div class="table-responsive">
    <table class="table align-middle table-row-dashed fs-6 gy-5" id="kt_table_patients">
      <thead>
        <tr class="text-start fw-bolder fs-7 text-uppercase gs-0">
          <th v-for="header in tableHeaders" :key="header.key" :class="header.class">
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody class="">
        <template v-if="!loading && requests.length">
          <tr v-for="(patient, index) in requests" :key="patient.id">
            <td class="text-center mb-1">{{ calculateIndex(index) }}</td>
            <td class="text-left mb-1">
              <div class="d-flex flex-column">
                <div class="fw-bolder">{{ patient.name }}</div>
                <span class="text-muted fs-7">CMND/CCCD: {{ patient.identification }}</span>
              </div>
            </td>
            <td class="text-center">{{ patient.age }}</td>
            <td class="text-center">{{ formatGender(patient.gender) }}</td>
            <td class="text-center">{{ patient.phone }}</td>
            <td class="text-center">{{ patient.address }}</td>
            <td class="text-center">{{ formatDate(patient.created_at) }}</td>
            <td class="text-end">
              <button class="btn btn-icon btn-sm btn-light-primary" @click="viewDetail(patient.id)"
                data-bs-toggle="tooltip" title="Xem chi tiết">
                <i class="bi bi-eye fs-5"></i>
              </button>
            </td>
          </tr>
        </template>
        <tr v-else>
          <td :colspan="tableHeaders.length" class="text-center">
            <LoadingSpinner v-if="loading" />
            <span v-else>Không có dữ liệu</span>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination v-if="pagination" :pagination="pagination" @changePage="handleChangePage" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import Pagination from '@/components/Pagination/PaginationPage.vue';
import LoadingSpinner from '@/components/Form/LoadingSpinner.vue';
import { formatDate } from '@/utils/dateUtils';
import type { PaginationData } from '@/types/type';
interface Patient {
  id: number;
  identification: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  symptom: string;
  result: string | null;
  created_at: string;
  updated_at: string | null;
}
interface Props {
  requests: Patient[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  pagination: PaginationData | null;
}

const props = withDefaults(defineProps<Props>(), {
  requests: () => [],
  loading: false,
  currentPage: 1,
  pageSize: 10,
  pagination: null,
});

const router = useRouter();
const emit = defineEmits<{
  (e: 'changePage', page: number): void;
}>();

const tableHeaders = [
  { key: 'stt', label: 'STT', class: 'text-center w-10px pe-2' },
  { key: 'name', label: 'Họ và tên', class: 'text-left min-w-125px' },
  { key: 'age', label: 'Tuổi', class: 'text-center min-w-70px' },
  { key: 'gender', label: 'Giới tính', class: 'text-center min-w-70px' },
  { key: 'phone', label: 'Số điện thoại', class: 'text-center min-w-125px' },
  { key: 'address', label: 'Địa chỉ', class: 'text-center min-w-125px' },
  { key: 'created_at', label: 'Ngày khám', class: 'text-center min-w-100px' },
  { key: 'actions', label: 'Thao tác', class: 'text-end min-w-70px' },
];

const calculateIndex = (index: number): number => {
  return (props.currentPage - 1) * props.pageSize + index + 1;
};

const formatGender = (gender: string): string => {
  const genderMap: Record<string, string> = {
    'male': 'Nam',
    'female': 'Nữ',
    'other': 'Khác'
  };
  return genderMap[gender] || gender;
};

const viewDetail = (id: number): void => {
  router.push({ name: 'request.detail', params: { id: id.toString() } });
};

const handleChangePage = (page: number): void => {
  emit('changePage', page);
};
</script>

<style scoped>
.btn-icon {
  height: 32px;
  width: 32px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-light-primary {
  color: #009ef7;
  background-color: #f1faff;
  border: none;
}

.btn-light-primary:hover {
  color: #ffffff;
  background-color: #009ef7;
}

.table-row-dashed tr {
  border-bottom: 1px dashed #e4e6ef;
}

.table-row-dashed tr:last-child {
  border-bottom: none;
}
</style>