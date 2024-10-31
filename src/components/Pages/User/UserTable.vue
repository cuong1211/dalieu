<template>
  <div class="table-responsive">
    <table class="table align-middle table-row-dashed fs-6 gy-5" id="kt_table_users">
      <thead>
        <tr class="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
          <th class="text-center w-10px pe-2">STT</th>
          <th class="text-center min-w-125px">Tên</th>
          <th class="text-center min-w-125px">Tên đăng nhập</th>
          <th class="text-center min-w-125px">Xã</th>
          <th class="text-center min-w-125px">Huyện</th>
          <th class="text-center min-w-125px">Vai trò</th>
          <th class="text-center min-w-125px">Admin</th>
          <th class="text-center min-w-125px">Trạng thái</th>
          <th class="text-end min-w-100px">Thao tác</th>
        </tr>
      </thead>
      <tbody class="text-gray-600 fw-bold">
        <template v-if="!loading && users.length">
          <tr v-for="(user, index) in users" :key="user.id">
            <td class="text-center text-gray-800 mb-1">{{ calculateIndex(index) }}</td>
            <td class="text-left text-gray-800 mb-1">{{ user.name }}</td>
            <td class="text-left text-gray-800 mb-1">{{ user.username }}</td>
            <td class="text-center">{{ getCommuneName(user.commune_id) }}</td>
            <td class="text-center">{{ getDistrictName(user.district_id) }}</td>
            <td class="text-center">{{ getRoleName(user.role_id) }}</td>
            <td class="text-center text-gray-800 mb-1">{{ user.is_super_admin ? 'Có' : 'Không' }}</td>
            <td class="text-center text-gray-800 mb-1">
              <span :class="user.status ? 'text-success' : 'text-danger'">
                {{ user.status ? 'Hoạt động' : 'Không hoạt động' }}
              </span>
            </td>
            <td class="text-end">
              <ActionButton :item="user" :showResetPassword="true" @edit="$emit('edit', user.id)"
                @delete="$emit('delete', user.id)" />
            </td>
          </tr>
        </template>
        <tr v-else>
          <td colspan="8" class="text-center">
            <template v-if="loading">
              <div class="d-flex justify-content-center align-items-center" style="height: 100px;">
                <v-progress-circular indeterminate color="primary" :size="50" :width="5"></v-progress-circular>
              </div>
            </template>
            <template v-else>
              Không có dữ liệu
            </template>
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
import type { User } from '@/types/user';
import type { PaginationData } from '@/types/type';
import { useUserStore } from '@/stores/userStore';
import { useRoleStore } from '@/stores/roleStore';
const props = defineProps<{
  users: User[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  pagination: PaginationData | null;
}>();

const emit = defineEmits(['delete', 'edit', 'changePage']);

const userStore = useUserStore();
const roleStore = useRoleStore();
const districts = computed(() => userStore.districts);
const districtLoading = computed(() => userStore.districtLoading);

const getDistrictName = (districtId: number | string) => {
  if (districtLoading.value) return 'Loading...';
  return userStore.getDistrictById(districtId)?.name || '/';
};

const getCommuneName = (communeId: number | string | null | undefined) => {
  if (districtLoading.value) return 'Loading...';
  if (communeId == null) {
    return '/';
  }
  const commune = userStore.getCommuneById(communeId);
  if (!commune) {
    return 'Unknown';
  }
  return commune.name;
};
const getRoleName = (roleId: number | string) => {
  if (roleStore.loading) return 'Loading...';
  if (roleId == null) return '/';
  const role = roleStore.getRoleById(roleId);

  if (!role) {
    return 'Unknown';
  }
  return role.name;
};
const calculateIndex = (index: number) => {
  return (props.currentPage - 1) * props.pageSize + index + 1;
};

const handleChangePage = (page: number) => {
  emit('changePage', page);
};


</script>