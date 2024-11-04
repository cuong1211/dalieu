import { ref } from 'vue';
import type { Ref } from 'vue';
import type { DermatologyRequestForm } from '@/types/request';

// Interface cho các hàm validate riêng biệt
interface ValidationRule {
    validate: (value: any) => boolean;
    errorMessage: string;
}

// Các rules validate riêng cho từng trường
const identificationRules: ValidationRule = {
    validate: (value: string): boolean => {
        const numbersOnly = String(value).replace(/\D/g, '');
        return numbersOnly.length === 12;
    },
    errorMessage: 'Số CCCD phải đủ 12 số'
};

export const useRequestValidation = (form: Ref<DermatologyRequestForm>) => {
    const errors = ref<Partial<Record<keyof DermatologyRequestForm, string>>>({});

    // Hàm xử lý validate CCCD
    const validateIdentification = (value: string): string => {
        const numbersOnly = String(value).replace(/\D/g, '').slice(0, 12);
        if (!identificationRules.validate(numbersOnly)) {
            return identificationRules.errorMessage;
        }
        return '';
    };

    // Hàm xử lý input CCCD
    const handleIdentificationInput = (value: string | number): string => {
        const numbersOnly = String(value).replace(/\D/g, '').slice(0, 12);
        const error = validateIdentification(numbersOnly);

        // Cập nhật giá trị và lỗi
        form.value.identification = numbersOnly;
        errors.value.identification = error;

        return numbersOnly;
    };

    const validateForm = (): boolean => {
        errors.value = {};
        let isValid = true;

        // Validate name
        if (!form.value.name?.trim()) {
            errors.value.name = 'Vui lòng nhập họ tên';
            isValid = false;
        }

        // Validate age
        if (!form.value.age) {
            errors.value.age = 'Vui lòng nhập tuổi';
            isValid = false;
        }

        // Validate gender
        if (form.value.gender === '') {
            errors.value.gender = 'Vui lòng chọn giới tính';
            isValid = false;
        }

        // Validate CCCD
        const identificationError = validateIdentification(form.value.identification);
        if (identificationError) {
            errors.value.identification = identificationError;
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

        // Validate symptom
        if (!form.value.symptom?.trim() && !form.value.image) {
            errors.value.symptom = 'Vui lòng nhập mô tả triệu chứng hoặc chụp ảnh';
            isValid = false;
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
        handleInput,
        handleIdentificationInput
    };
};