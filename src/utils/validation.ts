// validation.ts
import { ref } from 'vue';
import type { Ref } from 'vue';

interface ValidationRule {
    validate: (value: any) => boolean;
    message: string;
}

interface FieldValidation {
    [key: string]: ValidationRule[];
}

function stripHtml(html: string): string {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

export function useValidation(initialForm: Record<string, any>) {
    const form = ref(initialForm) as Ref<Record<string, any>>;
    const errors = ref({}) as Ref<Record<string, string>>;
    const isFormTouched = ref(false);

    const rules: FieldValidation = {
        name: [
            { validate: (value) => !!value.trim(), message: 'Tên là bắt buộc' },
            { validate: (value) => value.length >= 3, message: 'Tên phải có ít nhất 3 ký tự' },
            { validate: (value) => value.length <= 50, message: 'Tên không được vượt quá 50 ký tự' },
        ],
        email: [
            { validate: (value) => !!value.trim(), message: 'Email là bắt buộc' },
            { validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), message: 'Email không hợp lệ' },
        ],
        // password: [
        //     { validate: (value) => !!value, message: 'Mật khẩu là bắt buộc' },
        //     { validate: (value) => value.length >= 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
        // ],
        role_id: [
            { validate: (value) => value > 0, message: 'Vui lòng chọn vai trò' },
        ],
        district_id: [
            { validate: (value) => value !== null && value !== '', message: 'Vui lòng chọn huyện' },
        ],
        commune_id: [
            { validate: (value) => value !== null && value !== '', message: 'Vui lòng chọn xã' },
        ],
        description: [
            {
                validate: (value) => !value || stripHtml(value).trim().length > 0,
                message: 'Mô tả không được chỉ chứa khoảng trắng'
            },
            {
                validate: (value) => !value || stripHtml(value).length <= 1000,
                message: 'Mô tả không được vượt quá 1000 ký tự'
            },
        ],
    };

    const validateField = (field: string) => {
        const value = form.value[field];
        const fieldRules = rules[field];

        if (fieldRules) {
            for (const rule of fieldRules) {
                if (!rule.validate(value)) {
                    errors.value[field] = rule.message;
                    return;
                }
            }
        }
        errors.value[field] = '';
    };

    const validateForm = () => {
        let isValid = true;
        for (const field in form.value) {
            if (rules[field]) {
                validateField(field);
                if (errors.value[field]) {
                    isValid = false;
                }
            }
        }
        return isValid;
    };

    const handleInput = (field: string) => {
        isFormTouched.value = true;
        validateField(field);
    };

    return {
        form,
        errors,
        isFormTouched,
        validateField,
        validateForm,
        handleInput,
    };
}