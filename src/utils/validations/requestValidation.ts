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
        if (!form.value.fullName?.trim()) {
            errors.value.fullName = 'Vui lòng nhập họ tên';
            isValid = false;
        }

        // Validate dateOfBirth
        if (!form.value.dateOfBirth) {
            errors.value.dateOfBirth = 'Vui lòng chọn ngày sinh';
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
        if (!form.value.symptomsStartDate) {
            errors.value.symptomsStartDate = 'Vui lòng chọn thời điểm bắt đầu có triệu chứng';
            isValid = false;
        }

        // Validate images
        if (!form.value.images || form.value.images.length === 0) {
            errors.value.images = 'Vui lòng tải lên ít nhất 1 ảnh triệu chứng';
            isValid = false;
        }

        // Validate preferredDateTime
        if (!form.value.preferredDateTime) {
            errors.value.preferredDateTime = 'Vui lòng chọn thời gian khám mong muốn';
            isValid = false;
        } else {
            const selectedDate = new Date(form.value.preferredDateTime);
            const now = new Date();
            if (selectedDate < now) {
                errors.value.preferredDateTime = 'Thời gian khám phải lớn hơn thời gian hiện tại';
                isValid = false;
            }
        }

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