<template>
    <div class="card">
        <div class="card-header border-0 pt-6">
            <div class="card-title">
                <SearchBar @search="handleSearch" />
            </div>

        </div>
        <div class="card-body pt-0">
            <div v-if="loading" class="d-flex justify-content-center align-items-center" style="height: 400px;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <RequestTable v-else :requests="requests" :loading="loading" :currentPage="currentPage" :pageSize="pageSize"
                :pagination="pagination" @delete="handleDelete" @edit="handleEdit" @changePage="changePage" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useRequestStore } from '@/stores/requestStore';
import { useToast } from 'vue-toastification';
import SearchBar from '@/components/Search/SearchBar.vue';
import AddButton from '@/components/Button/AddButton.vue';
import RequestTable from '@/components/Pages/Request/RequestTable.vue';
import { api } from '@/utils/api';
import type { PaginatedResponse } from '@/types/common';
import type { Request } from '@/types/request';

const toast = useToast();
const router = useRouter();
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

// Các hàm khác giữ nguyên
const handleAdd = () => {
    router.push({ name: 'request.create' });
};

const handleEdit = (userId: number) => {
    router.push({ name: 'request.edit', params: { id: userId } });
};

const handleDelete = async (userId: number) => {
    try {
        const response = await requestStore.deleteRequest(userId);
        toast.success((response as { message: string }).message);
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