<template>
    <div class="apple-diseases-container">
        <!-- Header -->
        <div class="diseases-header">
            <div class="header-right">
                <SearchBar @search="handleSearch" />
                <button class="add-btn" @click="handleAdd">
                    <i class="bi bi-plus-lg" style="color: white;"></i>
                    <span>Thêm mới</span>
                </button>
            </div>
        </div>

        <!-- Content -->
        <div class="diseases-content">
            <div v-if="loading" class="loading-state">
                <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Đang tải...</span>
                </div>
            </div>
            <DiseasesTable v-else :diseases="diseases" :pagination="pagination" :currentPage="currentPage"
                @edit="handleEdit" @delete="handleDelete" @changePage="changePage" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useDiseasesStore } from '@/stores/DiseasesStore';
import DiseasesTable from '@/components/Pages/Diseases/DiseasesTable.vue';
import SearchBar from '@/components/Search/SearchBar.vue';
import { api } from '@/utils/api';
import type { PaginatedResponse } from '@/types/common';
import type { Disease } from '@/types/disease';

const toast = useToast();
const router = useRouter();
const diseasesStore = useDiseasesStore();
const { diseases, pagination, loading } = storeToRefs(diseasesStore);
const currentPage = ref(1);
const pageSize = ref(10);

const fetchData = async () => {
    try {
        await Promise.all([
            diseasesStore.fetchDiseases(currentPage.value, pageSize.value),
        ]);
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại.');
    }
};

onMounted(() => {
    fetchData();
});

const handleSearch = async (query: string) => {
    try {
        if (!query || query === '0') {
            await fetchData();
            return;
        }
        const response = await api.get<PaginatedResponse<Disease>>('/diseases', {
            params: {
                search: query,
                'page-no': currentPage.value,
                'page-size': pageSize.value
            }
        });
        // Cập nhật diseases và pagination từ response
        diseases.value = response.data;
        pagination.value = response.pagination;
    } catch (error) {
        console.error('Lỗi khi tìm kiếm:', error);
        toast.error('Tìm kiếm thất bại. Vui lòng thử lại.');
    }
};

const handleAdd = () => {
    router.push({ name: 'diseases.create' });
};

const handleEdit = (id: number) => {
    router.push({ name: 'diseases.edit', params: { id: id.toString() } });
};

const handleDelete = async (id: number) => {
    try {
        await diseasesStore.deleteDisease(id);
        toast.success('Xóa bệnh thành công');
        await fetchData();
    } catch (error) {
        toast.error('Xóa không thành công. Vui lòng thử lại.');
    }
};

const changePage = async (page: number) => {
    currentPage.value = page;
    await fetchData();
};
</script>

<style scoped>
/* Container */
.apple-diseases-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

/* Header */
.diseases-header {
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
.diseases-content {
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
    .apple-diseases-container {
        gap: 1.25rem;
    }

    .diseases-header {
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
    .diseases-header {
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