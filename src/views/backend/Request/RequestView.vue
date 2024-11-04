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
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useRequestStore } from '@/stores/requestStore';
import { useToast } from 'vue-toastification';
import SearchBar from '@/components/Search/SearchBar.vue';
import AddButton from '@/components/Button/AddButton.vue';
import RequestTable from '@/components/Pages/Request/RequestTable.vue';
const toast = useToast();
const router = useRouter();
const requestStore = useRequestStore();
const { requests, pagination, loading } = storeToRefs(requestStore);
const currentPage = ref(1);
const pageSize = ref(10);


const fetchData = async () => {
    try {
        await Promise.all([
            requestStore.fetchRequest(currentPage.value, pageSize.value),
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