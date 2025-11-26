<template>
    <div class="apple-diseases-table-container">
        <!-- Table Container -->
        <div class="apple-table-wrapper">
            <table class="apple-diseases-table">
                <!-- Table Header -->
                <thead>
                    <tr>
                        <th class="code-column">Mã bệnh</th>
                        <th class="name-column">Tên bệnh</th>
                        <th class="action-column">Thao tác</th>
                    </tr>
                </thead>

                <!-- Table Body -->
                <tbody>
                    <tr v-for="disease in diseases" :key="disease.id" class="table-row">
                        <td class="code-column">
                            <span class="disease-code">{{ disease.code }}</span>
                        </td>
                        <td class="name-column">
                            <div class="disease-info">
                                <div v-if="disease.image" class="disease-image">
                                    <img :src="disease.image" :alt="disease.name" />
                                </div>
                                <div class="disease-content">
                                    <div class="disease-name">{{ disease.name }}</div>
                                    <span v-if="disease.category" class="disease-category">{{ disease.category }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="action-column">
                            <ActionButton :item="disease" @edit="$emit('edit', $event)"
                                @delete="$emit('delete', $event)" />
                        </td>
                    </tr>

                    <!-- Empty State -->
                    <tr v-if="diseases.length === 0" class="empty-row">
                        <td colspan="3">
                            <div class="no-data">
                                <i class="bi bi-inbox"></i>
                                <span>Không có dữ liệu</span>
                            </div>
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
/* Apple-style Container */
.apple-diseases-table-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.06);
}

.apple-table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

/* Table Base */
.apple-diseases-table {
    width: 100%;
    border-collapse: collapse;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

/* Table Header */
.apple-diseases-table thead {
    position: sticky;
    top: 0;
    z-index: 10;
    background: #4caf50;
}

.apple-diseases-table thead tr {
    border-bottom: 2px solid #3d8b40;
}

.apple-diseases-table thead th {
    padding: 14px 16px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: white;
    background: #4caf50;
    text-align: left;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.apple-diseases-table thead th:last-child {
    border-right: none;
}

/* Column Widths */
.code-column {
    width: 100px;
    min-width: 100px;
}

.name-column {
    flex: 1;
    min-width: 250px;
}

.action-column {
    width: 80px;
    text-align: right;
    min-width: 80px;
}

/* Table Body */
.apple-diseases-table tbody .table-row {
    transition: background-color 0.15s ease;
    border-bottom: 1px solid #e0e0e0;
}

.apple-diseases-table tbody .table-row:hover {
    background-color: #f0f8f4;
}

.apple-diseases-table tbody .table-row:last-child {
    border-bottom: 1px solid #e0e0e0;
}

.apple-diseases-table tbody td {
    padding: 14px 16px;
    font-size: 14px;
    color: #1d1d1f;
    vertical-align: middle;
    border-right: 1px solid #e0e0e0;
}

.apple-diseases-table tbody td:last-child {
    border-right: none;
}

/* Disease Code */
.disease-code {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 10px;
    background: rgba(76, 175, 80, 0.08);
    color: #4caf50;
    font-size: 12px;
    font-weight: 600;
    border-radius: 6px;
}

/* Disease Info */
.disease-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.disease-image {
    width: 45px;
    height: 45px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
    background: #f5f5f7;
}

.disease-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.disease-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
}

.disease-name {
    font-size: 14px;
    font-weight: 600;
    color: #1d1d1f;
    line-height: 1.3;
}

.disease-category {
    font-size: 12px;
    color: #86868b;
    font-weight: 400;
}

/* Empty State */
.empty-row td {
    padding: 60px 20px !important;
}

.no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    color: #86868b;
}

.no-data i {
    font-size: 48px;
    color: rgba(0, 0, 0, 0.1);
}

.no-data span {
    font-size: 14px;
    font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
    .apple-diseases-table thead th {
        padding: 10px 12px;
        font-size: 10px;
    }

    .apple-diseases-table tbody td {
        padding: 12px;
        font-size: 13px;
    }

    .disease-image {
        width: 40px;
        height: 40px;
    }

    .disease-name {
        font-size: 13px;
    }

    .disease-category {
        font-size: 11px;
    }

    .code-column {
        width: 80px;
        min-width: 80px;
    }

    .name-column {
        min-width: 200px;
    }
}

@media (max-width: 480px) {
    .disease-info {
        gap: 10px;
    }

    .disease-image {
        width: 35px;
        height: 35px;
    }

    .disease-name {
        font-size: 12px;
    }
}
</style>