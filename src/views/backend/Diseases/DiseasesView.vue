<template>
    <div class="card">
        <div class="card-header border-0 pt-6">
            <div class="card-title">
                <SearchBar @search="handleSearch" />
            </div>
            <div class="card-toolbar">
                <div class="d-flex justify-content-end">
                    <button class="btn btn-primary" @click="handleAdd">
                        Thêm mới
                    </button>
                </div>
            </div>
        </div>
        <div class="card-body pt-0">
            <div v-if="loading" class="d-flex justify-content-center align-items-center" style="height: 400px;">
                <div class="spinner-border text-primary" role="status">
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

const toast = useToast();
const router = useRouter();
const diseasesStore = useDiseasesStore();
const { diseases, pagination, loading } = storeToRefs(diseasesStore);
const currentPage = ref(1);
const pageSize = ref(10);

const fetchData = async () => {
    try {
        await diseasesStore.fetchDiseases(currentPage.value, pageSize.value);
    } catch (error) {
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại.');
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