<template>
  <div class="post d-flex flex-column-fluid" id="kt_post">
    <div id="kt_content_container" class="container">
      <div class="card">
        <div class="card-header border-0 pt-6">
          <div class="card-title">
            <SearchBar @search="handleSearch" />
          </div>
          <div class="card-toolbar">
            <div class="d-flex justify-content-end" data-kt-user-table-toolbar="base">
              <FilterButton />
              <ExportButton />
              <AddButton @add="openAddModal" />
            </div>
            <PermissionModal v-model="isModalOpen" :editingPermission="editingPermission" @save="savePermission" />
            <ModalExport />
          </div>
        </div>
        <div class="card-body pt-0">
          <PermissonTable :permissions="permissions" :loading="loading" :currentPage="currentPage" :pageSize="pageSize"
            :pagination="pagination" @delete="handleDelete" @edit="openEditModal" @changePage="changePage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { usePermissionStore } from '@/stores/permissionStore';
import SearchBar from '@/components/Search/SearchBar.vue';
import AddButton from '@/components/Button/AddButton.vue';
import FilterButton from '@/components/Button/FilterButton.vue';
import ExportButton from '@/components/Button/ExportButton.vue';
import ModalExport from '@/components/Modal/ModalExport.vue';
import PermissonTable from '@/components/Pages/Permission/PermissonTable.vue';
import PermissionModal from '@/components/Pages/Permission/PermissionModal.vue';
import type { Permission } from '@/types/permission';
import { useToast } from 'vue-toastification';

const toast = useToast();
const permissionStore = usePermissionStore();
const { permissions, loading, error, pagination } = storeToRefs(permissionStore);

const isModalOpen = ref(false);
const editingPermission = ref<Permission | null>(null);
const currentPage = ref(1);
const pageSize = ref(10);

onMounted(async () => {
  await fetchPermissions();
});

const fetchPermissions = async () => {
  await permissionStore.fetchPermissions(currentPage.value, pageSize.value);
};

const openAddModal = () => {
  editingPermission.value = null;
  isModalOpen.value = true;
};

const openEditModal = (permission: Permission) => {
  editingPermission.value = permission;
  isModalOpen.value = true;
};

const savePermission = async (permissionData: Permission) => {
  isModalOpen.value = false;
  try {
    // Không cần phân biệt giữa create và update ở đây nữa
    // vì điều này đã được xử lý trong modal

    // Gọi lại API để fetch dữ liệu mới
    await fetchPermissions();
  } catch (error) {
    console.error('Error refreshing permissions:', error);
    // Có thể thêm một thông báo lỗi nếu việc fetch dữ liệu mới thất bại
    toast.error('Không thể cập nhật danh sách quyền. Vui lòng thử lại.');
  }
};

const handleDelete = async (permissionId: number) => {
  try {
    await permissionStore.deletePermissions(permissionId);
    toast.success('Xóa quyền thành công');
    // Gọi lại API để fetch dữ liệu mới
    await fetchPermissions();
  } catch (error) {
    console.error('Error deleting permission:', error);
    toast.error('Đã xảy ra lỗi khi xóa quyền');
  }
};

const changePage = async (page: number) => {
  currentPage.value = page;
  await fetchPermissions();
};

const handleSearch = async (query: string) => {
  // Implement search logic
  // Sau khi search, gọi lại fetchPermissions với các tham số phù hợp
  await fetchPermissions();
};
</script>