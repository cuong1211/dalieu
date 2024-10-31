<template>
    <div class="table-responsive">
        <table class="table table-responsive align-middle table-row-dashed fs-6 gy-5" id="kt_table_users">
            <thead>
                <tr class="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
                    <th class="text-center w-10px pe-2">STT</th>
                    <th class="text-center min-w-125px">Tên</th>
                    <th class="text-center min-w-125px">Mô tả</th>
                    <th class="text-center min-w-125px">Ngày tạo</th>
                    <th class="text-center min-w-125px">Ngày cập nhập</th>
                    <th class="text-end min-w-100px">Thao tác</th>
                </tr>
            </thead>
            <tbody class="text-gray-600 fw-bold">
                <template v-if="!loading && permissions.length">
                    <tr v-for="(permission, index) in permissions" :key="permission.id">
                        <td class="text-center text-gray-800 mb-1">{{ calculateIndex(index) }}</td>
                        <td class="text-left text-gray-800 mb-1">{{ permission.name }}</td>
                        <td class="text-left text-gray-800 mb-1">{{ permission.description }}</td>
                        <td class="text-center text-gray-800 mb-1">{{ permission.created_at }}</td>
                        <td class="text-center text-gray-800 mb-1">{{ permission.updated_at }}</td>
                        <td class="text-end">
                            <ActionButton :item="permission" @edit="$emit('edit', permission)"
                                @delete="$emit('delete', permission.id)" />
                        </td>
                    </tr>
                </template>
                <tr v-else>
                    <td colspan="7" class="text-center">
                        <template v-if="loading">
                            <div class="d-flex justify-content-center align-items-center" style="height: 100px;">
                                <v-progress-circular indeterminate color="primary" :size="50"
                                    :width="5"></v-progress-circular>
                            </div>
                        </template>
                        <template v-else>
                            Không có dữ liệu
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
        <Pagination :pagination="pagination" @changePage="handleChangePage" />
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import ActionButton from '@/components/Button/ActionButton.vue';
import Pagination from '@/components/Pagination/PaginationPage.vue';
import type { PaginationData } from '@/types/type';
import type { Permission } from '@/types/permission';



interface Props {
    permissions: Permission[];
    loading: boolean;
    currentPage: number;
    pageSize: number;
    pagination: PaginationData | null;
}

const props = defineProps<Props>();

const emit = defineEmits(['delete', 'edit', 'changePage']);

const calculateIndex = (index: number) => {
    return (props.currentPage - 1) * props.pageSize + index + 1;
};

const handleChangePage = (page: number) => {
    emit('changePage', page);
};
</script>