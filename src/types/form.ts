// types/form.ts
export interface BaseFormControlProps {
    label: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    placeholder?: string;
}

export interface ValidationRule {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
}