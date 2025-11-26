<template>
  <div class="apple-user-container">
    <!-- Header -->
    <div class="user-header">
      <div class="header-right">
        <SearchBar @search="handleSearch" />
        <button class="add-btn" @click="handleAdd">
          <i class="bi bi-plus-lg" style="color: white;"></i>
          <span>Thêm mới</span>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="user-content">
      <div v-if="loading" class="loading-state">
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden">Đang tải...</span>
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
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useToast } from 'vue-toastification';
import { useRoleStore } from '@/stores/roleStore';
import SearchBar from '@/components/Search/SearchBar.vue';
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

<style scoped>
/* Container */
.apple-user-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

/* Header */
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #4caf50;
}

.header-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
  letter-spacing: -0.02em;
}

.header-subtitle {
  font-size: 0.875rem;
  color: #86868b;
  margin: 0.25rem 0 0 0;
  font-weight: 400;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Add Button */
.add-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}

.add-btn:hover {
  background: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.add-btn:active {
  transform: translateY(0);
}

.add-btn i {
  font-size: 1rem;
}

/* Content */
.user-content {
  min-height: 400px;
}

/* Loading State */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #86868b;
}

/* Responsive */
@media (max-width: 768px) {
  .apple-user-container {
    gap: 1.25rem;
  }

  .user-header {
    gap: 1rem;
  }

  .header-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .header-subtitle {
    font-size: 0.8125rem;
  }

  .header-right {
    width: 100%;
    gap: 0.75rem;
  }

  .add-btn {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
  }
}

@media (max-width: 480px) {
  .user-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-title {
    font-size: 1.25rem;
  }

  .header-right {
    width: 100%;
    flex-direction: column;
  }

  .add-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>