<template>
    <div class="d-flex justify-content-end gap-2">
        <button class="btn btn-icon btn-sm btn-light-primary" @click="$emit('edit', item.id)" data-bs-toggle="tooltip"
            title="Chỉnh sửa">
            <i class="bi bi-pencil fs-5"></i>
        </button>
        <button class="btn btn-icon btn-sm btn-light-danger" @click="confirmDelete" data-bs-toggle="tooltip"
            title="Xóa">
            <i class="bi bi-trash fs-5"></i>
        </button>
    </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2';

const props = defineProps<{
    item: any;
}>();

const emit = defineEmits(['edit', 'delete']);

const confirmDelete = async () => {
    try {
        const result = await Swal.fire({
            title: 'Xác nhận xóa',
            text: "Bạn có chắc chắn muốn xóa?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy',
            customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-light'
            },
            buttonsStyling: false,
            reverseButtons: true
        });

        if (result.isConfirmed) {
            emit('delete', props.item.id);
        }
    } catch (error) {
        console.error('Error deleting:', error);
        Swal.fire({
            title: 'Lỗi!',
            text: 'Có lỗi xảy ra khi xóa.',
            icon: 'error',
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        });
    }
};
</script>

<style scoped>
.btn-icon {
    height: 32px;
    width: 32px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.btn-light-primary {
    color: #009ef7;
    background-color: #f1faff;
    border: none;
}

.btn-light-primary:hover {
    color: #ffffff;
    background-color: #009ef7;
}

.btn-light-danger {
    color: #f1416c;
    background-color: #fff5f8;
    border: none;
}

.btn-light-danger:hover {
    color: #ffffff;
    background-color: #f1416c;
}

/* SweetAlert Custom Styles */
:deep(.swal2-popup) {
    border-radius: 0.75rem;
    padding: 2rem;
}

:deep(.swal2-title) {
    font-size: 1.25rem;
    font-weight: 600;
}

:deep(.swal2-content) {
    font-size: 1rem;
}

:deep(.btn) {
    padding: 0.65rem 1.25rem;
    font-weight: 500;
    border-radius: 0.475rem;
}

:deep(.btn-light) {
    background-color: #f5f8fa;
    color: #7e8299;
}

:deep(.btn-light:hover) {
    background-color: #e4e6ef;
    color: #3f4254;
}

:deep(.btn-danger) {
    background-color: #f1416c;
    color: #ffffff;
}

:deep(.btn-danger:hover) {
    background-color: #d9214e;
}

:deep(.btn-primary) {
    background-color: #009ef7;
    color: #ffffff;
}

:deep(.btn-primary:hover) {
    background-color: #0095e8;
}
</style>