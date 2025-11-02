<template>
  <div class="disease-container" ref="diseaseContainerRef">
    <!-- Header Section -->
    <div class="disease-header">
      <div class="header-content">
        <h1 class="header-title">
          <i class="bi bi-journal-medical" style="color: white;"></i>
          Cơ sở dữ liệu các bệnh về da liễu
        </h1>
        <p class="header-subtitle">Tìm kiếm thông tin chi tiết về các bệnh da liễu</p>
      </div>
    </div>

    <div class="disease-wrapper">
      <!-- Search Bar -->
      <div class="search-section">
        <div class="search-box">
          <i class="bi bi-search search-icon"></i>
          <input
            type="text"
            v-model="searchQuery"
            class="search-input"
            placeholder="Tìm kiếm bệnh theo tên hoặc mã bệnh..."
            @input="handleSearch"
          />
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-container">
        <div class="spinner">
          <div class="spinner-ring"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>

      <!-- Disease list -->
      <div v-else>
        <div class="disease-grid">
          <div v-for="disease in diseases" :key="disease.id" class="disease-card">
            <div class="card-header">
              <div class="icon-wrapper">
                <i class="bi bi-journal-medical" style="color: black; font-size: 20px;"></i>
              </div>
              <div class="header-info">
                <router-link :to="{ name: 'disease.detail', params: { id: disease.id } }"
                  class="disease-name">
                  {{ disease.name }}
                </router-link>
                <span class="disease-code">Mã bệnh: {{ disease.code }}</span>
              </div>
            </div>
            <div class="card-body">
              <p class="disease-description">
                {{ stripHtmlAndTruncate(disease.symptom, 120) }}
              </p>
            </div>
            <div class="card-footer">
              <router-link :to="{ name: 'disease.detail', params: { id: disease.id } }"
                class="detail-btn">
                <span>Xem Chi Tiết</span>
                <i class="bi bi-arrow-right" style="color: white;"></i>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="diseases.length === 0" class="empty-state">
          <i class="bi bi-inbox"></i>
          <h3>Không tìm thấy bệnh</h3>
          <p>Vui lòng thử tìm kiếm với từ khóa khác</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && diseases.length > 0" class="pagination-wrapper">
        <PaginationPage :pagination="{ ...pagination, page_size: Number(pagination.page_size) }" @changePage="changePage" />
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
import type { Disease } from '@/types/diseases';

// Store & Refs
const toast = useToast();
const diseasesStore = useDiseasesStore();
const { diseases, pagination, loading } = storeToRefs(diseasesStore);
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(9);
const diseaseContainerRef = ref<HTMLElement | null>(null);
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

// Utility function to strip HTML tags and truncate text
const stripHtmlAndTruncate = (text: string, maxLength: number = 120): string => {
  if (!text) return '';

  // Remove HTML tags
  const stripHtml = text.replace(/<[^>]*>/g, '');

  // Decode HTML entities using a temporary element
  const textarea = document.createElement('textarea');
  textarea.innerHTML = stripHtml;
  const decoded = textarea.value;

  // Additional cleanup for specific entities that might not be decoded
  const cleaned = decoded
    .replace(/\n\n+/g, ' ') // Replace multiple newlines with single space
    .replace(/\n/g, ' ')    // Replace newlines with space
    .replace(/\s+/g, ' ')   // Replace multiple spaces with single space
    .trim();

  // Truncate and add ellipsis
  if (cleaned.length > maxLength) {
    return cleaned.substring(0, maxLength).trim() + '...';
  }

  return cleaned;
};

// API Methods
const fetchData = async () => {
  try {
    await diseasesStore.fetchDiseases(currentPage.value, pageSize.value);
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error);
    toast.error('Không thể tải dữ liệu. Vui lòng thử lại.');
  }
};

// Handle search with debounce (500ms delay)
const handleSearch = async () => {
  // Clear previous timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  // Set new timeout for debounced search
  searchTimeout = setTimeout(async () => {
    try {
      if (!searchQuery.value || searchQuery.value.trim() === '') {
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
  }, 500); // 500ms delay
};

// Change page and scroll to top
const changePage = async (page: number) => {
  currentPage.value = page;

  // Scroll to top of disease container
  if (diseaseContainerRef.value) {
    diseaseContainerRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (searchQuery.value && searchQuery.value.trim() !== '') {
    // If searching, use handleSearch logic directly without debounce
    try {
      const response = await api.get<PaginatedResponse<Disease>>('/diseases', {
        params: {
          search: searchQuery.value,
          'page-no': page,
          'page-size': pageSize.value
        }
      });

      diseases.value = response.data;
      pagination.value = response.pagination;
    } catch (error) {
      console.error('Lỗi khi tải trang:', error);
      toast.error('Không thể tải trang. Vui lòng thử lại.');
    }
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
/* Main Container */
.disease-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f0fdfb 100%);
}

/* Header */
.disease-header {
  background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
  padding: 1.2rem 2rem;
  box-shadow: 0 4px 20px rgba(26, 188, 156, 0.15);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.header-title {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-title i {
  font-size: 2.8rem;
}

.header-subtitle {
  margin: 0.75rem 0 0 0;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 300;
}

/* Wrapper */
.disease-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

/* Search Section */
.search-section {
  margin-bottom: 3rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  font-size: 1.25rem;
  color: #1abc9c;
  pointer-events: none;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3.5rem;
  border: 2px solid #a7f3d0;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  color: #1e293b;
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-input:focus {
  border-color: #1abc9c;
  box-shadow: 0 0 0 3px rgba(26, 188, 156, 0.1);
  background: white;
}

/* Loading */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.spinner-ring {
  width: 48px;
  height: 48px;
  border: 4px solid #a7f3d0;
  border-top-color: #1abc9c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner p {
  color: #64748b;
  font-weight: 600;
  margin: 0;
}

/* Disease Grid */
.disease-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.disease-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(26, 188, 156, 0.08);
  border: 1px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.disease-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(26, 188, 156, 0.12);
  border-color: #a7f3d0;
}

.card-header {
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.icon-wrapper {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #f0fdfb 0%, #ecfdf5 100%);
  border: 2px solid #a7f3d0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #1abc9c;
}

.header-info {
  flex: 1;
  min-width: 0;
}

.disease-name {
  display: block;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.2s;
  word-break: break-word;
}

.disease-name:hover {
  color: #1abc9c;
}

.disease-code {
  display: inline-block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1abc9c;
  background: rgba(26, 188, 156, 0.08);
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
}

.card-body {
  padding: 1.25rem 1.5rem;
  flex: 1;
}

.disease-description {
  margin: 0;
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
}

.card-footer {
  padding: 1.5rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
}

.detail-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(26, 188, 156, 0.15);
}

.detail-btn:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(26, 188, 156, 0.25);
}

.detail-btn i {
  font-size: 0.875rem;
  transition: transform 0.3s ease;
}

.detail-btn:hover i {
  transform: translateX(2px);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.empty-state i {
  font-size: 4rem;
  color: #cbd5e1;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #475569;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: #94a3b8;
  font-size: 1rem;
  margin: 0;
}

/* Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

/* Responsive */
@media (max-width: 768px) {
  .disease-header {
    padding: 2rem 1.5rem;
  }

  .header-title {
    font-size: 1.875rem;
  }

  .header-title i {
    font-size: 2rem;
  }

  .disease-wrapper {
    padding: 2rem 1.5rem;
  }

  .disease-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .search-input {
    font-size: 16px; /* Prevents zoom on mobile */
  }
}

@media (max-width: 576px) {
  .disease-header {
    padding: 1.5rem 1rem;
  }

  .header-title {
    font-size: 1.5rem;
    gap: 0.75rem;
  }

  .header-title i {
    font-size: 1.75rem;
  }

  .header-subtitle {
    font-size: 0.95rem;
  }

  .disease-wrapper {
    padding: 1.5rem 1rem;
  }

  .disease-grid {
    gap: 1rem;
  }

  .card-header,
  .card-body,
  .card-footer {
    padding: 1rem;
  }
}
</style>