// constants/datetime.ts

export const WEEK_DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export const MONTHS = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

export const DEFAULT_FORMAT = 'dd/MM/yyyy';
export const DEFAULT_TIME_FORMAT = 'HH:mm';
export const DATE_SEPARATOR = '/';
export const TIME_SEPARATOR = ':';

export const MIN_YEAR = 1900;
export const MAX_YEAR = new Date().getFullYear() + 10;
export const YEARS_PER_PAGE = 20;