<template>
    <BaseModal v-model="isModalOpen" :title="modalTitle" :loading="localLoading" @close="handleClose"
        @confirm="handleConfirm" :disabled="isFormTouched && !isFormValid">
        <form @submit.prevent="handleConfirm">
            <div class="fv-row mb-7">
                <label class="required fw-bold fs-6 mb-2">Tên vai trò</label>
                <input v-model="form.name" type="text" class="form-control form-control-solid mb-3 mb-lg-0"
                    placeholder="Nhập tên vai trò" @input="handleInput('name')" />
                <span v-if="errors.name" class="text-danger">{{ errors.name }}</span>
            </div>
            <div class="fv-row mb-7">
                <label class="required fw-bold fs-6 mb-2">Mô tả</label>
                <textarea v-model="form.description" @input="handleInput('description')"
                    class="form-control form-control-solid mb-3 mb-lg-0">
                </textarea>
                <span v-if="errors.description" class="text-danger">{{ errors.description }}</span>
            </div>
            <div class="fv-row">
                <label class="fs-5 fw-bolder form-label mb-2">Quyền hạn</label>
                <div class="table-responsive ">
                    <table class="table align-middle table-row-dashed fs-6 gy-5">
                        <tbody class="text-gray-600 fw-bold">
                            <tr v-for="permission in permissions" :key="permission.id">
                                <td class="text-gray-800">{{ permission.name }}</td>

                                <td v-for="action in actions" :key="action.key">
                                    <label
                                        class="form-check form-check-sm form-check-custom form-check-solid me-5 me-lg-5">
                                        <input class="form-check-input" type="checkbox"
                                            v-model="selectedPermissions[permission.id][action.key]"
                                            :name="`${permission.name}_${action.key}`" />
                                        <span class="form-check-label">{{ action.label }}</span>
                                    </label>
                                </td>
                                <td>
                                    <label
                                        class="form-check form-check-sm form-check-custom form-check-solid me-5 me-lg-5">
                                        <input class="form-check-input" type="checkbox"
                                            v-model="selectedAllForPermission[permission.id]"
                                            @change="toggleAllForPermission(permission.id)" />
                                        <span class="form-check-label">Tất cả</span>
                                    </label>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </form>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import BaseModal from '@/components/Modal/BaseModal.vue';
import type { Permission } from '@/types/permission';
import { useRoleStore } from '@/stores/roleStore';
import { usePermissionStore } from '@/stores/permissionStore';
import { useValidation } from '@/utils/validation';
import { useToast } from 'vue-toastification';
import type { Role, RolePermission } from '@/types/role';



interface ServerResponse {
    message: string;
    data: {
        id: number;
        name: string;
        description: string;
        permissions?: RolePermission[];
        created_at: string;
        updated_at: string;
    };
}
const toast = useToast();
const props = defineProps<{
    modelValue: boolean;
    editingRole: Role | null;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'save', role: Role): void;
}>();

const roleStore = useRoleStore();
const permissionStore = usePermissionStore();
const localLoading = ref(false);
const permissions = ref<Permission[]>([]);
const selectedPermissions = ref<Record<number, Record<string, boolean>>>({});
const actions = [
    { key: 'can_view', label: 'Xem' },
    { key: 'can_create', label: 'Tạo' },
    { key: 'can_update', label: 'Sửa' },
    { key: 'can_delete', label: 'Xóa' },
    { key: 'can_export', label: 'Thống kê' }
];

const initialForm = {
    name: props.editingRole?.name || '',
    description: props.editingRole?.description || '',
};

const { form, errors, isFormTouched, validateForm, handleInput } = useValidation(initialForm);

const isModalOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

const modalTitle = computed(() => props.editingRole ? 'Chỉnh sửa vai trò' : 'Thêm mới vai trò');

const isFormValid = computed(() => {
    return validateForm();
});

onMounted(async () => {
    await fetchPermissions();
});

const fetchPermissions = async () => {
    try {
        const response = await permissionStore.fetchPermissions();
        if (response && response.data) {
            permissions.value = response.data;
        }
        initializeSelectedPermissions();
    } catch (error) {
        console.error('Error fetching permissions:', error);
    }
};

const initializeSelectedPermissions = () => {
    permissions.value.forEach(permission => {
        selectedPermissions.value[permission.id] = {};
        actions.forEach(action => {
            selectedPermissions.value[permission.id][action.key] = false;
        });
    });

    if (props.editingRole && props.editingRole.permissions) {
        props.editingRole.permissions.forEach(perm => {
            if (selectedPermissions.value[perm.permission_id]) {
                actions.forEach(action => {
                    selectedPermissions.value[perm.permission_id][action.key] =
                        Boolean(perm[action.key as keyof typeof perm]);
                });
            }
        });
    }
};

const selectedAllForPermission = ref<Record<number, boolean>>({});

const toggleAllPermissions = (event: Event) => {
    const isChecked = (event.target as HTMLInputElement).checked;
    permissions.value.forEach(permission => {
        selectedAllForPermission.value[permission.id] = isChecked;
        actions.forEach(action => {
            selectedPermissions.value[permission.id][action.key] = isChecked;
        });
    });
};

const toggleAllForPermission = (permissionId: number) => {
    const isChecked = selectedAllForPermission.value[permissionId];
    actions.forEach(action => {
        selectedPermissions.value[permissionId][action.key] = isChecked;
    });
};

// Thêm watcher để cập nhật trạng thái "Tất cả" cho mỗi quyền
watch(selectedPermissions, (newVal) => {
    Object.keys(newVal).forEach(permissionId => {
        const id = Number(permissionId);
        selectedAllForPermission.value[id] = actions.every(action => newVal[id][action.key]);
    });
}, { deep: true });


const handleConfirm = async () => {
    isFormTouched.value = true;
    if (isFormValid.value) {
        localLoading.value = true;
        try {
            const roleData: Omit<Role, 'id'> = {
                name: form.value.name.trim(),
                description: form.value.description.trim(),
                permissions: Object.entries(selectedPermissions.value).map(([permissionId, actions]) => ({
                    permission_id: Number(permissionId),
                    can_view: Boolean(actions.can_view),
                    can_create: Boolean(actions.can_create),
                    can_update: Boolean(actions.can_update),
                    can_delete: Boolean(actions.can_delete),
                    can_export: Boolean(actions.can_export)
                })).filter(perm =>
                    perm.can_view || perm.can_create || perm.can_update || perm.can_delete || perm.can_export
                ),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            let serverResponse: ServerResponse;
            if (props.editingRole) {
                serverResponse = await roleStore.updateRoles(props.editingRole.id, roleData);
            } else {
                serverResponse = await roleStore.createRoles(roleData);
            }

            if (serverResponse && serverResponse.data) {
                const savedRole: Role = {
                    id: serverResponse.data.id,
                    name: serverResponse.data.name,
                    description: serverResponse.data.description,
                    permissions: serverResponse.data.permissions || [],
                    created_at: serverResponse.data.created_at,
                    updated_at: serverResponse.data.updated_at
                };

                isModalOpen.value = false;
                emit('save', savedRole);
                toast.success(props.editingRole ? 'Cập nhật vai trò thành công' : 'Tạo vai trò mới thành công');
            } else {
                toast.error('Không thể lưu vai trò. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error saving role:', error);
            if (error instanceof Error) {
                toast.error(`Lỗi: ${error.message}`);
            } else {
                toast.error('Đã xảy ra lỗi khi lưu vai trò');
            }
        } finally {
            localLoading.value = false;
        }
    }
};

const resetForm = () => {
    form.value = {
        name: props.editingRole?.name || '',
        description: props.editingRole?.description || ''
    };
    Object.keys(errors.value).forEach(key => {
        errors.value[key] = '';
    });
    isFormTouched.value = false;
    initializeSelectedPermissions();
};

const handleClose = () => {
    if (!localLoading.value) {
        isModalOpen.value = false;
        resetForm();
    }
};

watch(() => props.editingRole, (newValue) => {
    resetForm();
}, { immediate: true });

watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        resetForm();
    }
});
</script>
