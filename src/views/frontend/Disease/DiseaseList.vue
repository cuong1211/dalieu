<template>
  <div class="container my-8">
    <div class="row">
      <div class="col-lg-12">
        <!-- Search -->
        <div class="card mb-6">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="position-relative w-100">
                <span class="svg-icon svg-icon-3 svg-icon-gray-500 position-absolute top-50 translate-middle ms-6">
                  <i class="bi bi-search"></i>
                </span>
                <input type="text" v-model="searchQuery" class="form-control form-control-solid ps-10"
                  placeholder="Tìm kiếm bệnh..." @input="handleSearch" />
              </div>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="d-flex justify-content-center align-items-center" style="height: 400px;">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
        </div>

        <!-- Disease list -->
        <div v-else class="row g-6">
          <div v-for="disease in diseases" :key="disease.id" class="col-md-6">
            <div class="card h-100">
              <div class="card-body d-flex flex-column">
                <div class="mb-5">
                  <div class="d-flex align-items-center mb-2">
                    <div class="symbol symbol-50px me-3">
                      <div class="symbol-label bg-light">
                        <i class="bi bi-clipboard-data fs-2x text-primary"></i>
                      </div>
                    </div>
                    <div>
                      <h3 class="fs-4 fw-bold mb-0">
                        <router-link :to="{ name: 'disease.detail', params: { id: disease.id } }"
                          class="text-dark text-hover-primary">
                          {{ disease.name }}
                        </router-link>
                      </h3>
                      <span class="text-muted fs-7">Mã bệnh: {{ disease.code }}</span>
                    </div>
                  </div>
                </div>
                <div class="mt-auto">
                  <router-link :to="{ name: 'disease.detail', params: { id: disease.id } }"
                    class="btn btn-sm btn-light-primary">
                    Chi tiết
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <PaginationPage v-if="pagination" :pagination="pagination" @changePage="changePage" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useDiseasesStore } from '@/stores/DiseasesStore';
import PaginationPage from '@/components/Pagination/PaginationPage.vue';
import { useToast } from 'vue-toastification';
import { api } from '@/utils/api';
import type { PaginatedResponse } from '@/types/common';
import type { Disease } from '@/types/disease';

// Store & Refs
const toast = useToast();
const diseasesStore = useDiseasesStore();
const { diseases, pagination, loading } = storeToRefs(diseasesStore);
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

// API Methods
const fetchData = async () => {
  try {
    await diseasesStore.fetchDiseases(currentPage.value, pageSize.value);
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error);
    toast.error('Không thể tải dữ liệu. Vui lòng thử lại.');
  }
};

const handleSearch = async () => {
  try {
    if (!searchQuery.value || searchQuery.value === '0') {
      await fetchData();
      return;
    }

    currentPage.value = 1;
    const response = await api.get<PaginatedResponse<Disease>>('/diseases', {
      params: {
        search: searchQuery.value,
        'page-no': currentPage.value,
        'page-size': pageSize.value
      }
    });

    diseases.value = response.data;
    pagination.value = response.pagination;
  } catch (error) {
    console.error('Lỗi khi tìm kiếm:', error);
    toast.error('Tìm kiếm thất bại. Vui lòng thử lại.');
  }
};

const changePage = async (page: number) => {
  currentPage.value = page;
  if (searchQuery.value) {
    await handleSearch();
  } else {
    await fetchData();
  }
};

// Lifecycle
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.menu-link {
  display: flex;
  align-items: center;
  padding: 0.65rem 1rem;
  color: #181C32;
  text-decoration: none;
}

.menu-link:hover,
.menu-link.active {
  background-color: #F5F8FA;
  color: #009EF7;
}

.bullet-dot {
  width: 4px;
  height: 4px;
  border-radius: 100%;
  background-color: #B5B5C3;
  display: inline-block;
  margin-right: 0.75rem;
}
</style>