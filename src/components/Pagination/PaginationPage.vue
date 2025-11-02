<template>
    <div v-if="pagination" class="pagination-container">
        <div class="pagination-info">
            <div class="info-badge">
                <i class="bi bi-list-ul"></i>
                <span>{{ (pagination.page_no - 1) * pagination.page_size + 1 }} - {{ Math.min(pagination.page_no * pagination.page_size, pagination.total) }}</span>
                <span class="total-text">trong {{ pagination.total }} mục</span>
            </div>
        </div>

        <div class="pagination-controls">
            <button
                class="page-btn prev-btn"
                :disabled="pagination.page_no == 1"
                @click="$emit('changePage', pagination.page_no - 1)"
                title="Trang trước"
            >
                <i class="bi bi-chevron-left"></i>
            </button>

            <div class="page-numbers">
                <button
                    v-for="page in pageNumbers"
                    :key="page"
                    class="page-btn"
                    :class="{ 'active': page == pagination.page_no }"
                    @click="$emit('changePage', page)"
                >
                    {{ page }}
                </button>
            </div>

            <button
                class="page-btn next-btn"
                :disabled="pagination.page_no == pagination.last_page"
                @click="$emit('changePage', pagination.page_no + 1)"
                title="Trang sau"
            >
                <i class="bi bi-chevron-right"></i>
            </button>
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

<style scoped>
.pagination-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    padding: 1.5rem 0;
    flex-wrap: wrap;
}

.pagination-info {
    flex: 1;
    min-width: 250px;
}

.info-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.25rem;
    background: linear-gradient(135deg, #f0fdfb 0%, #ecfdf5 100%);
    border: 1.5px solid #a7f3d0;
    border-radius: 8px;
    color: #0d7d6e;
    font-weight: 600;
    font-size: 0.95rem;
}

.info-badge i {
    font-size: 1.1rem;
    color: #1abc9c;
}

.total-text {
    color: #64748b;
    font-weight: 500;
    margin-left: 0.25rem;
}

.pagination-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
}

.page-numbers {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.page-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 40px;
    padding: 0.5rem;
    background: white;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    color: #475569;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.page-btn:hover:not(:disabled) {
    border-color: #a7f3d0;
    background: #f0fdfb;
    color: #1abc9c;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(26, 188, 156, 0.1);
}

.page-btn.active {
    background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
    border-color: #1abc9c;
    color: white;
    box-shadow: 0 4px 12px rgba(26, 188, 156, 0.3);
}

.page-btn.active:hover {
    background: linear-gradient(135deg, #16a085 0%, #0d7d6e 100%);
    box-shadow: 0 6px 16px rgba(26, 188, 156, 0.4);
}

.page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #f8fafc;
}

.prev-btn,
.next-btn {
    flex-shrink: 0;
    padding: 0.5rem;
}

.prev-btn i,
.next-btn i {
    font-size: 1.2rem;
}

/* Responsive */
@media (max-width: 768px) {
    .pagination-container {
        gap: 1rem;
        padding: 1rem 0;
    }

    .pagination-info {
        width: 100%;
    }

    .info-badge {
        width: 100%;
        justify-content: flex-start;
    }

    .pagination-controls {
        width: 100%;
        justify-content: center;
    }

    .page-btn {
        min-width: 36px;
        height: 36px;
        font-size: 0.8rem;
    }
}

@media (max-width: 576px) {
    .pagination-container {
        flex-direction: column;
        align-items: center;
    }

    .pagination-info,
    .pagination-controls {
        width: 100%;
    }

    .page-numbers {
        gap: 0.25rem;
    }

    .page-btn {
        min-width: 32px;
        height: 32px;
        font-size: 0.75rem;
        padding: 0.25rem;
    }

    .info-badge {
        font-size: 0.85rem;
        padding: 0.5rem 1rem;
    }
}
</style>