// types/datetime.ts

export interface DateTimePickerProps {
    modelValue: Date | string | null;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    enableTime?: boolean;
    format?: string;
    minDate?: Date;
    maxDate?: Date;
    yearRange?: [number, number];
}

export interface CalendarDay {
    date: Date;
    dayNumber: number;
    currentMonth: boolean;
}

export interface TimeValue {
    hours: number;
    minutes: number;
}

export type DateTimeEmits = {
    (e: 'update:modelValue', value: Date | null): void;
    (e: 'change', value: Date | null): void;
    (e: 'blur'): void;
};