<template>
    <div class="table-responsive">
      <table class="table align-middle table-row-dashed fs-6 gy-5" id="kt_table_users">
        <thead>
          <tr class="text-start fw-bolder fs-7 text-uppercase gs-0">
            <th v-for="header in tableHeaders" :key="header.key" :class="header.class">
              {{ header.label }}
            </th>
          </tr>
        </thead>
        <tbody class="">
          <template v-if="!loading && requests.length">
            <tr v-for="(request, index) in requests" :key="request.id">
              <td class="text-center mb-1">{{ calculateIndex(index) }}</td>
              <td class="text-left mb-1">
                <div class="d-flex flex-column">
                  <div class="fw-bolder">
                    {{ request.name }}
                  </div>
                  <span class="text-sm ">
                    {{ request.address }}
                  </span>
                </div>
  
              </td>
              <td class="text-center">{{ request.phone_rescue }}</td>
              <td class="text-center">{{ request.phone }}</td>
              <td class="text-center">{{ request.address }}</td>
              <td class="text-center">{{ request.address }}</td>
              <td class="text-center mb-1">
                <span :class="getStatusClass(request.status || '')">
                  {{ getStatusText(request.status || '') }}
                </span>
              </td>
              <td class="text-end">
                <ActionButton :item="request" @edit="handleEdit(request.id)" @delete="handleDelete(request.id)" />
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
      <Pagination :pagination="pagination" @changePage="handleChangePage" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import ActionButton from '@/components/Button/ActionButton.vue';
  import Pagination from '@/components/Pagination/PaginationPage.vue';
  import LoadingSpinner from '@/components/Form/LoadingSpinner.vue';
  import type { Request } from '@/types/request';
  import type { PaginationData } from '@/types/type';
  
  interface Props {
    requests: Request[];
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
  
  const emit = defineEmits<{
    (e: 'delete', id: number): void;
    (e: 'edit', id: number): void;
    (e: 'changePage', page: number): void;
  }>();
  
  const tableHeaders = [
    { key: 'stt', label: 'STT', class: 'text-center w-10px pe-2' },
    { key: 'name', label: 'Tên người gửi', class: 'text-left min-w-125px' },
    { key: 'SĐT liên hệ', label: 'SĐT liên hệ', class: 'text-center min-w-125px' },
    { key: 'SĐT yêu cầu', label: 'SĐT yêu cầu', class: 'text-center min-w-125px' },
    { key: 'Địa chỉ', label: 'Địa chỉ', class: 'text-center min-w-125px' },
    { key: 'Xã/Huyện', label: 'Xã/Huyện', class: 'text-center min-w-125px' },
    { key: 'Trạng thái', label: 'Trạng thái', class: 'text-center min-w-125px' },
    { key: 'actions', label: 'Thao tác', class: 'text-end min-w-100px' },
  ];
  
  const calculateIndex = (index: number): number => {
    return (props.currentPage - 1) * props.pageSize + index + 1;
  };
  
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'badge badge-light-success';
      case 'pending':
        return 'badge badge-light-warning';
      case 'done':
        return 'badge badge-light-primary';
      case 'cancel':
        return 'badge badge-light-danger';
      case 'in progess':
        return 'badge badge-light-info';
      default:
        return 'badge badge-light-dark';
    }
  };
  
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'done':
        return 'Đã hoàn thành';
      case 'cancel':
        return 'Đã hủy';
      case 'in progess':
        return 'Đang cứu trợ';
      default:
        return '';
    }
  };
  
  const handleChangePage = (page: number): void => {
    emit('changePage', page);
  };
  
  const handleEdit = (id: number): void => {
    emit('edit', id);
  };
  
  const handleDelete = (id: number): void => {
    emit('delete', id);
  };
  </script>