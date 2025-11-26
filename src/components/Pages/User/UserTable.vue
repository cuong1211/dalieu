<template>
  <div class="apple-user-table-container">
    <!-- Table Container -->
    <div class="apple-table-wrapper">
      <table class="apple-user-table">
        <!-- Table Header -->
        <thead>
          <tr>
            <th class="stt-column">STT</th>
            <th class="name-column">Tên</th>
            <th class="username-column">Tên đăng nhập</th>
            <th class="commune-column">Xã</th>
            <th class="district-column">Huyện</th>
            <th class="role-column">Vai trò</th>
            <th class="admin-column">Admin</th>
            <th class="status-column">Trạng thái</th>
            <th class="action-column">Thao tác</th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody>
          <tr v-for="(user, index) in users" :key="user.id" class="table-row">
            <td class="stt-column">
              <span class="index-badge">{{ calculateIndex(index) }}</span>
            </td>
            <td class="name-column">
              <div class="user-info">
                <div class="user-name">{{ user.name }}</div>
              </div>
            </td>
            <td class="username-column">
              <span class="data-cell">{{ user.username }}</span>
            </td>
            <td class="commune-column">
              <span class="data-cell">{{ getCommuneName(user.commune_id) }}</span>
            </td>
            <td class="district-column">
              <span class="data-cell">{{ getDistrictName(user.district_id) }}</span>
            </td>
            <td class="role-column">
              <span class="role-badge">{{ getRoleName(user.role_id) }}</span>
            </td>
            <td class="admin-column">
              <span class="status-badge" :class="{ 'badge-active': user.is_super_admin }">
                {{ user.is_super_admin ? 'Có' : 'Không' }}
              </span>
            </td>
            <td class="status-column">
              <span class="status-badge" :class="{ 'badge-active': user.status }">
                {{ user.status ? 'Hoạt động' : 'Không hoạt động' }}
              </span>
            </td>
            <td class="action-column">
              <ActionButton :item="user" :showResetPassword="true" @edit="$emit('edit', user.id)"
                @delete="$emit('delete', user.id)" />
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="users.length === 0" class="empty-row">
            <td colspan="9">
              <div class="no-data">
                <i class="bi bi-inbox"></i>
                <span>Không có dữ liệu</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
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

<style scoped>
/* Apple-style Container */
.apple-user-table-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
.apple-user-table {
  width: 100%;
  border-collapse: collapse;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

/* Table Header */
.apple-user-table thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #4caf50;
}

.apple-user-table thead tr {
  border-bottom: 2px solid #3d8b40;
}

.apple-user-table thead th {
  padding: 14px 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: white;
  background: #4caf50;
  text-align: left;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.apple-user-table thead th:last-child {
  border-right: none;
}

/* Column Widths */
.stt-column {
  width: 60px;
  min-width: 60px;
}

.name-column {
  width: 120px;
  min-width: 120px;
}

.username-column {
  width: 120px;
  min-width: 120px;
}

.commune-column {
  width: 120px;
  min-width: 120px;
}

.district-column {
  width: 120px;
  min-width: 120px;
}

.role-column {
  width: 100px;
  min-width: 100px;
}

.admin-column {
  width: 80px;
  min-width: 80px;
}

.status-column {
  width: 130px;
  min-width: 130px;
}

.action-column {
  width: 80px;
  text-align: right;
  min-width: 80px;
}

/* Table Body */
.apple-user-table tbody .table-row {
  transition: background-color 0.15s ease;
  border-bottom: 1px solid #e0e0e0;
}

.apple-user-table tbody .table-row:hover {
  background-color: #f0f8f4;
}

.apple-user-table tbody .table-row:last-child {
  border-bottom: 1px solid #e0e0e0;
}

.apple-user-table tbody td {
  padding: 14px 16px;
  font-size: 14px;
  color: #1d1d1f;
  vertical-align: middle;
  border-right: 1px solid #e0e0e0;
}

.apple-user-table tbody td:last-child {
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

/* User Info */
.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
  line-height: 1.3;
}

/* Data Cells */
.data-cell {
  color: #1d1d1f;
  font-size: 14px;
  font-weight: 400;
}

/* Role Badge */
.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background: rgba(76, 175, 80, 0.08);
  color: #4caf50;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: rgba(233, 30, 99, 0.1);
  color: #c2185b;
}

.status-badge.badge-active {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

/* Empty State */
.empty-row td {
  padding: 60px 20px !important;
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

/* Responsive */
@media (max-width: 768px) {
  .apple-user-table thead th {
    padding: 10px 12px;
    font-size: 10px;
  }

  .apple-user-table tbody td {
    padding: 12px;
    font-size: 13px;
  }

  .user-name {
    font-size: 13px;
  }

  .data-cell {
    font-size: 13px;
  }
}
</style>