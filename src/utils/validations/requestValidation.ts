// utils/validations/dermatologyRequestValidation.ts
import { ref } from 'vue';
import type { Ref } from 'vue';
import type { DermatologyRequestForm } from '@/types/request';

export const useRequestValidation = (form: Ref<DermatologyRequestForm>) => {
    const errors = ref<Partial<Record<keyof DermatologyRequestForm, string>>>({});

    const validateForm = (): boolean => {
        errors.value = {};
        let isValid = true;

        // Validate fullName
        if (!form.value.name?.trim()) {
            errors.value.name = 'Vui lòng nhập họ tên';
            isValid = false;
        }

        // Validate dateOfBirth
        if (!form.value.birthday) {
            errors.value.birthday = 'Vui lòng chọn ngày sinh';
            isValid = false;
        }

        // Validate phone
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!form.value.phone) {
            errors.value.phone = 'Vui lòng nhập số điện thoại';
            isValid = false;
        } else if (!phoneRegex.test(form.value.phone)) {
            errors.value.phone = 'Số điện thoại không hợp lệ';
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (form.value.email && !emailRegex.test(form.value.email)) {
            errors.value.email = 'Email không hợp lệ';
            isValid = false;
        }

        // Validate address
        if (!form.value.address?.trim()) {
            errors.value.address = 'Vui lòng nhập địa chỉ';
            isValid = false;
        }

        // Validate symptoms
        if (!form.value.symptoms?.trim()) {
            errors.value.symptoms = 'Vui lòng mô tả triệu chứng';
            isValid = false;
        }

        // Validate symptomsStartDate

        // Validate images
        if (!form.value.image) {
            errors.value.image = 'Vui lòng tải lên ít nhất 1 ảnh triệu chứng';
            isValid = false;
        }

        // Validate preferredDateTime

        return isValid;
    };

    const handleInput = (field: keyof DermatologyRequestForm, value: any) => {
        if (errors.value[field]) {
            errors.value[field] = '';
        }
    };

    return {
        errors,
        validateForm,
        handleInput
    };
};