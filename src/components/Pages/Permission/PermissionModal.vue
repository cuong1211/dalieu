<template>
    <!-- Template remains largely the same -->
    <BaseModal v-model="isModalOpen" :title="modalTitle" :loading="localLoading" @close="handleClose"
        @confirm="handleConfirm" :disabled="isFormTouched && !isFormValid">
        <form @submit.prevent="handleConfirm">
            <div class="fv-row mb-7">
                <label class="required fw-bold fs-6 mb-2">Tên quyền</label>
                <input v-model="form.name" type="text" class="form-control form-control-solid mb-3 mb-lg-0"
                    placeholder="Nhập tên quyền" @input="handleInput('name')" />
                <span v-if="errors.name" class="text-danger">{{ errors.name }}</span>
            </div>
            <div class="fv-row mb-7">
                <label class="required fw-bold fs-6 mb-2">Mô tả</label>
                <input v-model="form.description" type="text" class="form-control form-control-solid mb-3 mb-lg-0"
                    placeholder="Nhập mô tả" @input="handleInput('description')" />
                <span v-if="errors.description" class="text-danger">{{ errors.description }}</span>
            </div>
        </form>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import BaseModal from '@/components/Modal/BaseModal.vue';
import type { Permission } from '@/types/permission';
import { usePermissionStore } from '@/stores/permissionStore';
import { useValidation } from '@/utils/validation';
import { useToast } from 'vue-toastification';
import axios from 'axios';

const toast = useToast();
const permissionStore = usePermissionStore();
const localLoading = ref(false);

const props = defineProps<{
    modelValue: boolean;
    editingPermission: Permission | null;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'save', permission: Permission): void;
}>();

const initialForm = {
    name: props.editingPermission?.name || '',
    description: props.editingPermission?.description || '',
};

const { form, errors, isFormTouched, validateForm, handleInput } = useValidation(initialForm);

const isModalOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

const modalTitle = computed(() => props.editingPermission ? 'Chỉnh sửa quyền' : 'Thêm mới quyền');

const isFormValid = computed(() => {
    return validateForm();
});

const handleConfirm = async () => {
    isFormTouched.value = true;
    if (isFormValid.value) {
        localLoading.value = true;
        try {
            const permissionData: Omit<Permission, 'id'> = {
                name: form.value.name.trim(),
                description: form.value.description.trim(),
                created_at: new Date().toISOString(), 
                updated_at: new Date().toISOString(),
            };

            let result: Permission;
            if (props.editingPermission?.id) {
                result = await permissionStore.updatePermissions(props.editingPermission.id, permissionData);
                toast.success('Cập nhật quyền thành công');
            } else {
                result = await permissionStore.createPermissions(permissionData);
                toast.success('Tạo quyền mới thành công');
            }

            isModalOpen.value = false;
            emit('save', result);
        } catch (error) {
            console.error('Error saving permission:', error);
            let errorMessage = 'Đã xảy ra lỗi khi lưu quyền';

            if (axios.isAxiosError(error)) {
                // This is an Axios error
                errorMessage = error.response?.data?.message || error.message || errorMessage;
            } else if (error instanceof Error) {
                // This is a standard Error object
                errorMessage = error.message;
            }

            toast.error(`Lỗi: ${errorMessage}`);
        } finally {
            localLoading.value = false;
        }
    }
};

const resetForm = () => {
    form.value = {
        name: props.editingPermission?.name || '',
        description: props.editingPermission?.description || ''
    };
    Object.keys(errors.value).forEach(key => {
        errors.value[key] = '';
    });
    isFormTouched.value = false;
};

const handleClose = () => {
    if (!localLoading.value) {
        isModalOpen.value = false;
        resetForm();
    }
};

watch(() => props.editingPermission, (newValue) => {
    resetForm();
}, { immediate: true });

watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        resetForm();
    }
});
</script>