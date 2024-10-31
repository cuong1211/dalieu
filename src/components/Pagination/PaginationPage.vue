<template>
    <div v-if="pagination" class="d-flex justify-content-between align-items-center flex-wrap mt-5">
        <div class="d-flex align-items-center py-3">
            <span class="text-muted">Hiển thị {{ (pagination.page_no - 1) * pagination.page_size + 1 }} đến {{
                Math.min(pagination.page_no * pagination.page_size, pagination.total) }} trong tổng số {{
        pagination.total }} mục</span>
        </div>
        <div class="d-flex flex-wrap py-2 mr-3">
            <a href="#" class="btn btn-icon btn-sm btn-light mr-2 my-1" :class="{ 'disabled': pagination.page_no == 1 }"
                @click.prevent="$emit('changePage', pagination.page_no - 1)">
                <i class="bi bi-caret-left-fill"></i>
            </a>
            <a v-for="page in pageNumbers" :key="page" href="#" class="btn btn-icon btn-sm border-0 btn-light mr-2 my-1"
                :class="{ 'btn-primary active': page == pagination.page_no }" @click.prevent="$emit('changePage', page)">
                {{ page }}
            </a>
            <a href="#" class="btn btn-icon btn-sm btn-light mr-2 my-1"
                :class="{ 'disabled': pagination.page_no == pagination.last_page }"
                @click.prevent="$emit('changePage', pagination.page_no + 1)">
                <i class="bi bi-caret-right-fill"></i>
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Pagination {
    total: number;
    page_size: number;
    page_no: number;
    last_page: number;
} 

const props = defineProps<{
    pagination: Pagination | null;
}>();
const emit = defineEmits(['changePage']);

const pageNumbers = computed(() => {
    if (!props.pagination) return [];
    const totalPages = props.pagination.last_page;
    const currentPage = props.pagination.page_no;
    const pageRange = 2;

    let startPage = Math.max(1, currentPage - pageRange);
    let endPage = Math.min(totalPages, currentPage + pageRange);

    if (endPage - startPage < pageRange * 2) {
        if (startPage === 1) {
            endPage = Math.min(startPage + pageRange * 2, totalPages);
        } else {
            startPage = Math.max(endPage - pageRange * 2, 1);
        }
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
});
</script>