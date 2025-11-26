<template>
  <div class="apple-table-container">
    <div class="apple-table-wrapper">
      <table class="apple-table">
        <thead>
          <tr>
            <th v-for="header in tableHeaders" :key="header.key" :class="header.class">
              {{ header.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="!loading && requests.length">
            <tr v-for="(patient, index) in requests" :key="patient.id" class="table-row">
              <td class="text-center">
                <span class="index-badge">{{ calculateIndex(index) }}</span>
              </td>
              <td class="text-left">
                <div class="patient-info">
                  <div class="patient-name">{{ patient.name }}</div>
                  <span class="patient-id">{{ patient.identification }}</span>
                </div>
              </td>
              <td class="text-center">
                <span class="data-cell">{{ patient.age }}</span>
              </td>
              <td class="text-center">
                <span class="gender-badge" :class="`gender-${patient.gender}`">
                  {{ formatGender(patient.gender) }}
                </span>
              </td>
              <td class="text-center">
                <span class="data-cell">{{ patient.phone }}</span>
              </td>
              <td class="text-center">
                <span class="data-cell address">{{ patient.address }}</span>
              </td>
              <td class="text-center">
                <span class="date-cell">{{ formatDate(patient.created_at) }}</span>
              </td>
              <td class="text-end">
                <button class="action-btn" @click="viewDetail(patient.id)" title="Xem chi tiết">
                  <i class="bi bi-eye" style="color: black;"></i>
                </button>
              </td>
            </tr>
          </template>
          <tr v-else class="empty-row">
            <td :colspan="tableHeaders.length">
              <LoadingSpinner v-if="loading" />
              <div v-else class="no-data">
                <i class="bi bi-inbox"></i>
                <span>Không có dữ liệu</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
/* Apple-style Container */
.apple-table-container {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.apple-table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Table Base */
.apple-table {
  width: 100%;
  border-collapse: collapse;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

/* Table Header */
.apple-table thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #4caf50;
}

.apple-table thead tr {
  border-bottom: 2px solid #3d8b40;
}

.apple-table thead th {
  padding: 14px 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: white;
  background: #4caf50;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.apple-table thead th:last-child {
  border-right: none;
}

/* Table Body */
.apple-table tbody .table-row {
  transition: background-color 0.15s ease;
  border-bottom: 1px solid #e0e0e0;
}

.apple-table tbody .table-row:hover {
  background-color: #f0f8f4;
}

.apple-table tbody .table-row:last-child {
  border-bottom: 1px solid #e0e0e0;
}

.apple-table tbody td {
  padding: 14px 16px;
  font-size: 14px;
  color: #1d1d1f;
  vertical-align: middle;
  border-right: 1px solid #e0e0e0;
}

.apple-table tbody td:last-child {
  border-right: none;
}

/* Index Badge */
.index-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(76, 175, 80, 0.08);
  color: #4caf50;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
}

/* Patient Info */
.patient-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.patient-name {
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
  line-height: 1.3;
}

.patient-id {
  font-size: 12px;
  color: #86868b;
  font-weight: 400;
}

/* Data Cells */
.data-cell {
  color: #1d1d1f;
  font-size: 14px;
  font-weight: 400;
}

.data-cell.address {
  max-width: 200px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Gender Badge */
.gender-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: rgba(0, 0, 0, 0.04);
  color: #1d1d1f;
}

.gender-badge.gender-male {
  background: rgba(33, 150, 243, 0.1);
  color: #1976d2;
}

.gender-badge.gender-female {
  background: rgba(233, 30, 99, 0.1);
  color: #c2185b;
}

.gender-badge.gender-other {
  background: rgba(156, 39, 176, 0.1);
  color: #7b1fa2;
}

/* Date Cell */
.date-cell {
  color: #86868b;
  font-size: 13px;
  font-weight: 400;
}

/* Action Button */
.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(76, 175, 80, 0.08);
  color: #4caf50;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-btn:hover {
  background: #4caf50;
  color: white !important;
  transform: scale(1.05);
}

.action-btn:active {
  transform: scale(0.98);
}

/* Empty State */
.empty-row td {
  padding: 60px 20px;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #86868b;
}

.no-data i {
  font-size: 48px;
  color: rgba(0, 0, 0, 0.1);
}

.no-data span {
  font-size: 14px;
  font-weight: 500;
}

/* Text Alignment Utilities */
.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-end {
  text-align: right;
}

/* Responsive */
@media (max-width: 768px) {
  .apple-table-wrapper {
    border-radius: 12px;
  }

  .apple-table thead th {
    padding: 10px 12px;
    font-size: 10px;
  }

  .apple-table tbody td {
    padding: 12px;
    font-size: 13px;
  }

  .patient-name {
    font-size: 13px;
  }

  .patient-id {
    font-size: 11px;
  }

  .data-cell {
    font-size: 13px;
  }

  .data-cell.address {
    max-width: 120px;
  }
}
</style>