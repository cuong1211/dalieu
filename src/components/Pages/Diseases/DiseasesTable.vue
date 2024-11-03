<template>
    <div class="table-responsive">
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>Mã bệnh</th>
                    <th>Tên bệnh</th>
                    <th>Triệu chứng</th>
                    <!-- <th>Điều trị</th> -->
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="disease in diseases" :key="disease.id">
                    <td>{{ disease.code }}</td>
                    <td>{{ disease.name }}</td>
                    <!-- <td>{{ disease.symptom }}</td> -->
                    <td>{{ disease.treatment }}</td>
                    <td>
                        <button class="btn btn-sm btn-primary me-2" @click="$emit('edit', disease.id)">
                            Sửa
                        </button>
                        <button class="btn btn-sm btn-danger" @click="$emit('delete', disease.id)">
                            Xóa
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="pagination" class="d-flex justify-content-between align-items-center mt-4">
            <div>
                Hiển thị {{ diseases.length }} / {{ pagination.total }} bệnh
            </div>
            <nav aria-label="Page navigation">
                <ul class="pagination">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <a class="page-link" href="#" @click.prevent="$emit('changePage', currentPage - 1)">
                            Trước
                        </a>
                    </li>
                    <li v-for="page in pagination.last_page" :key="page" class="page-item"
                        :class="{ active: page === currentPage }">
                        <a class="page-link" href="#" @click.prevent="$emit('changePage', page)">
                            {{ page }}
                        </a>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === pagination.last_page }">
                        <a class="page-link" href="#" @click.prevent="$emit('changePage', currentPage + 1)">
                            Sau
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Disease, PaginationData } from '@/types/diseases';

interface Props {
    diseases: Disease[];
    pagination: PaginationData | null;
    currentPage: number;
}

defineProps<Props>();

defineEmits<{
    (e: 'edit', id: number): void;
    (e: 'delete', id: number): void;
    (e: 'changePage', page: number): void;
}>();
</script>