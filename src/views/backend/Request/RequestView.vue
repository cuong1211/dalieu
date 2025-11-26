<template>
    <div class="apple-request-container">
        <!-- Header -->
        <div class="request-header">
            <div class="header-right">
                <SearchBar @search="handleSearch" />
            </div>
        </div>

        <!-- Content -->
        <div class="request-content">
            <div v-if="loading" class="loading-state">
                <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Đang tải...</span>
                </div>
            </div>
            <RequestTable v-else :requests="requests" :loading="loading" :currentPage="currentPage" :pageSize="pageSize"
                :pagination="pagination" @changePage="changePage" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRequestStore } from '@/stores/requestStore';
import { useToast } from 'vue-toastification';
import SearchBar from '@/components/Search/SearchBar.vue';
import RequestTable from '@/components/Pages/Request/RequestTable.vue';
import { api } from '@/utils/api';
import type { PaginatedResponse } from '@/types/common';
import type { Request } from '@/types/request';

const toast = useToast();
const requestStore = useRequestStore();
const { requests, pagination, loading } = storeToRefs(requestStore);
const currentPage = ref(1);
const pageSize = ref(10);

// Hàm fetch data ban đầu 
const fetchData = async () => {
    try {
        await Promise.all([
            requestStore.fetchRequest(currentPage.value, pageSize.value),
        ]);
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại.');
    }
};

onMounted(() => {
    fetchData();
});

// Sửa lại hàm handleSearch
const handleSearch = async (query: string) => {
    try {
        if (!query || query === '0') {
            await fetchData();
            return;
        }

        const response = await api.get<PaginatedResponse<Request>>('/patients', {
            params: {
                search: query,
                'page-no': currentPage.value,
                'page-size': pageSize.value
            }
        });

        // Cập nhật requests và pagination từ response
        requests.value = response.data;
        pagination.value = response.pagination;

    } catch (error) {
        console.error('Lỗi khi tìm kiếm:', error);
        toast.error('Tìm kiếm thất bại. Vui lòng thử lại.');
    }
};

const changePage = async (page: number) => {
    currentPage.value = page;
    await fetchData();
};
</script>

<style scoped>
/* Container */
.apple-request-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

/* Header */
.request-header {
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

/* Content */
.request-content {
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
    .apple-request-container {
        gap: 1.25rem;
    }

    .request-header {
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
}

@media (max-width: 480px) {
    .request-header {
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
}
</style>