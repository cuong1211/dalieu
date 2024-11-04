<template>
    <div class="card">
        <!-- Table Container -->
        <div class="table-responsive">
            <table class="table align-middle table-row-dashed fs-6 gy-5">
                <!-- Table Header -->
                <thead>
                    <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                        <th class="min-w-100px">Mã bệnh</th>
                        <th class="min-w-200px">Tên bệnh</th>
                        <th class="min-w-100px text-end">Thao tác</th>
                    </tr>
                </thead>

                <!-- Table Body -->
                <tbody class="text-gray-700">
                    <tr v-for="disease in diseases" :key="disease.id">
                        <td>
                            <span class="text-gray-800 fw-bold">{{ disease.code }}</span>
                        </td>
                        <td>
                            <div class="d-flex align-items-center">
                                <div v-if="disease.image" class="symbol symbol-45px me-5">
                                    <img :src="disease.image" :alt="disease.name" />
                                </div>
                                <div class="d-flex flex-column">
                                    <span class="text-gray-800 fw-bold">{{ disease.name }}</span>
                                    <span class="text-gray-500 fs-7">{{ disease.category }}</span>
                                </div>
                            </div>
                        </td>
                        <td>
                            <ActionButton :item="disease" @edit="$emit('edit', $event)"
                                @delete="$emit('delete', $event)" />
                        </td>
                    </tr>

                    <!-- Empty State -->
                    <tr v-if="diseases.length === 0">
                        <td colspan="4" class="text-center py-10">
                            <div class="text-gray-500">Không có dữ liệu</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <PaginationPage :pagination="pagination" @changePage="handleChangePage" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PaginationPage from '@/components/Pagination/PaginationPage.vue';
import ActionButton from '@/components/Button/ActionButton.vue';
import type { Disease } from '@/types/disease';
import type { PaginationData } from '@/types/type';

interface Props {
    diseases: Disease[];
    pagination: PaginationData | null;
    currentPage: number;
}

defineProps<Props>();
const emit = defineEmits<{
    (e: 'delete', id: number): void;
    (e: 'edit', id: number): void;
    (e: 'changePage', page: number): void;
}>();

const handleChangePage = (page: number): void => {
    emit('changePage', page);
};
</script>

<style scoped>
/* Custom styling cho bảng */
.table-row-dashed tr {
    border-bottom: 1px dashed #e4e6ef;
}

.table-row-dashed tr:last-child {
    border-bottom: none;
}

/* Badge styling */
.badge {
    padding: 0.5rem 0.8rem;
    font-weight: 500;
    font-size: 0.85rem;
}

.badge-light-success {
    color: #50cd89;
    background-color: #e8fff3;
}

.badge-light-danger {
    color: #f1416c;
    background-color: #fff5f8;
}

/* Symbol styling */
.symbol {
    display: inline-block;
    flex-shrink: 0;
    position: relative;
}

.symbol img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.475rem;
}
</style>