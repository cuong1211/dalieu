import { ref } from 'vue';
import type { ClusterFormData } from '@/types/cluster';

export function useClusterValidation(initialData: ClusterFormData) {
    const errors = ref<Partial<Record<keyof ClusterFormData, string>>>({});

    const validateForm = (): boolean => {
        errors.value = {};

        // if (!initialData.name) {
        //     errors.value.name = 'Tên cụm là bắt buộc';
        // }

        // if (!initialData.location) {
        //     errors.value.location = 'Địa điểm là bắt buộc';
        // }

        // if (!initialData.manager_id) {
        //     errors.value.manager_id = 'Người quản lý là bắt buộc';
        // }

        // if (!initialData.mission_id) {
        //     errors.value.mission_id = 'Chiến dịch là bắt buộc';
        // }

        // if (!initialData.status) {
        //     errors.value.status = 'Trạng thái là bắt buộc';
        // }

        return Object.keys(errors.value).length === 0;
    };

    const handleInput = (field: keyof ClusterFormData, value: any) => {
        if (errors.value[field]) {
            errors.value[field] = '';
        }
    };

    const initializeValidation = (data: ClusterFormData) => {
        Object.assign(initialData, data);
    };

    return {
        errors,
        validateForm,
        handleInput,
        initializeValidation
    };
}