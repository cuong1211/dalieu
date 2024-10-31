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
                        <ModalExport />
                        <RoleModal v-model="isModalOpen" :editingRole="editingRole" @save="saveRole" />
                    </div>
                </div>
                <div class="card-body pt-0">
                    <RoleTable :roles="roles" :loading="loading" :currentPage="currentPage" :pageSize="pageSize"
                        :pagination="pagination" @delete="handleDelete" @edit="openEditModal"
                        @changePage="changePage" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoleStore } from '@/stores/roleStore';
import SearchBar from '@/components/Search/SearchBar.vue';
import AddButton from '@/components/Button/AddButton.vue';
import FilterButton from '@/components/Button/FilterButton.vue';
import ExportButton from '@/components/Button/ExportButton.vue';
import ModalExport from '@/components/Modal/ModalExport.vue';
import RoleTable from '@/components/Pages/Role/RoleTable.vue';
import type { Role } from '@/types/role';
import { useToast } from 'vue-toastification';
import RoleModal from '@/components/Pages/Role/RoleModal.vue';

const toast = useToast();
const roleStore = useRoleStore();
const { roles, loading, error, pagination } = storeToRefs(roleStore);

const isModalOpen = ref(false);
const editingRole = ref<Role | null>(null);
const currentPage = ref(1);
const pageSize = ref(10);

onMounted(async () => {
    await fetchRoles();
});

const fetchRoles = async () => {
    await roleStore.fetchRoles(currentPage.value, pageSize.value);
};

const openAddModal = () => {
  editingRole.value = null;
  isModalOpen.value = true;
};

const openEditModal = (role: Role) => {
  editingRole.value = role;
  isModalOpen.value = true;
};

const saveRole = async (roleData: Role) => {
  isModalOpen.value = false;
  try {
    await fetchRoles();
  } catch (error) {
    console.error('Error saving role:', error);
    toast.error('Đã xảy ra lỗi khi lưu quyền');
  }
};

const handleDelete = async (roleId: number) => {
    try {
        await roleStore.deleteRoles(roleId);
        toast.success('Xóa quyền thành công');
        // Gọi lại API để fetch dữ liệu mới
        await fetchRoles();
    } catch (error) {
        console.error('Error deleting role:', error);
        toast.error('Đã xảy ra lỗi khi xóa quyền');
    }
};

const changePage = async (page: number) => {
    currentPage.value = page;
    await fetchRoles();
};

const handleSearch = async (query: string) => {
    // Implement search logic
    // Sau khi search, gọi lại fetchroles với các tham số phù hợp
    await fetchRoles();
};
</script>