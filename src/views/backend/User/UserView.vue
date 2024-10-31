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
              <AddButton @add="handleAdd" />
            </div>
            <ModalExport />
          </div>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading" class="d-flex justify-content-center align-items-center" style="height: 400px;">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <UserTable 
            v-else
            :users="users" 
            :loading="loading"
            :currentPage="currentPage" 
            :pageSize="pageSize"
            :pagination="pagination" 
            @delete="handleDelete" 
            @edit="handleEdit"
            @changePage="changePage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useToast } from 'vue-toastification';
import { useRoleStore } from '@/stores/roleStore';
import SearchBar from '@/components/Search/SearchBar.vue';
import AddButton from '@/components/Button/AddButton.vue';
import FilterButton from '@/components/Button/FilterButton.vue';
import ExportButton from '@/components/Button/ExportButton.vue';
import ModalExport from '@/components/Modal/ModalExport.vue';
import UserTable from '@/components/Pages/User/UserTable.vue';
const toast = useToast();
const router = useRouter();
const userStore = useUserStore();
const { users, pagination , loading} = storeToRefs(userStore);
const roleStore = useRoleStore();
const currentPage = ref(1);
const pageSize = ref(10);

const fetchData = async () => {
  try {
    await Promise.all([
      userStore.fetchUsers(currentPage.value, pageSize.value),
      userStore.fetchDistrictsIfNeeded(),
      roleStore.fetchRolesIfNeeded()
    ]);
  } catch (error) {
    console.error('Error fetching data:', error);
    toast.error('Failed to load data. Please try again.');
  } 
};

onMounted(() => {
  fetchData();
});

const handleSearch = async (query: string) => {
  // Implement search logic here
  await fetchData();
};

const handleAdd = () => {
  router.push({ name: 'user.create' });
};

const handleEdit = (userId: number) => {
  router.push({ name: 'user.edit', params: { id: userId } });
};

const handleDelete = async (userId: number) => {
  try {
    await userStore.deleteUser(userId);
    toast.success('User deleted successfully');
    await fetchData();
  } catch (error) {
    console.error('Error deleting user:', error);
    toast.error('Failed to delete user');
  }
};

const changePage = async (page: number) => {
  currentPage.value = page;
  await fetchData();
};
</script>