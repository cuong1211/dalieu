<template>
    <div class="custom-datetime-container">
        <label v-if="label" class="custom-label" :class="{ 'has-error': error }">
            {{ label }}
            <i v-if="error" class="bi bi-exclamation-circle error-icon"></i>
        </label>

        <div class="datetime-wrapper" :class="{ 'has-error': error }">
            <input ref="inputRef" type="text" v-model="inputValue" class="datetime-input" :placeholder="placeholder"
                :disabled="disabled" @focus="handleFocus" @blur="handleBlur" @input="handleManualInput"
                @keydown.enter.prevent />
            <span class="datetime-icon" @click="togglePicker">
                <i class="bi bi-calendar3"></i>
            </span>

            <Transition name="fade">
                <div v-if="showPicker" class="datetime-picker" ref="pickerRef">
                    <!-- Header với year & month selector -->
                    <div class="picker-header">
                        <div class="year-month-selectors">
                            <!-- Year Selector -->
                            <div class="year-selector" @click.stop="toggleYearSelect">
                                <span>{{ currentYear }}</span>
                                <i class="bi bi-chevron-down"></i>

                                <Transition name="fade">
                                    <div v-if="showYearSelect" class="year-list">
                                        <div class="year-list-header">
                                            <button @click.stop="scrollYears(-YEARS_PER_PAGE)">
                                                <i class="bi bi-chevron-up"></i>
                                            </button>
                                        </div>

                                        <div class="year-list-content">
                                            <button v-for="year in yearList" :key="year" @click.stop="selectYear(year)"
                                                :class="{ active: year === currentYear }">
                                                {{ year }}
                                            </button>
                                        </div>

                                        <div class="year-list-footer">
                                            <button @click.stop="scrollYears(YEARS_PER_PAGE)">
                                                <i class="bi bi-chevron-down"></i>
                                            </button>
                                        </div>
                                    </div>
                                </Transition>
                            </div>

                            <!-- Month Selector -->
                            <div class="month-selector" @click.stop="toggleMonthSelect">
                                <span>{{ currentMonthName }}</span>
                                <i class="bi bi-chevron-down"></i>

                                <Transition name="fade">
                                    <div v-if="showMonthSelect" class="month-list">
                                        <button v-for="(month, index) in MONTHS" :key="index"
                                            @click.stop="selectMonth(index)"
                                            :class="{ active: index === currentMonth }">
                                            {{ month }}
                                        </button>
                                    </div>
                                </Transition>
                            </div>
                        </div>

                        <div class="month-navigation">
                            <button @click.stop="navigateMonth(-1)" class="nav-btn">
                                <i class="bi bi-chevron-left"></i>
                            </button>
                            <button @click.stop="navigateMonth(1)" class="nav-btn">
                                <i class="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Calendar -->
                    <div class="calendar">
                        <!-- Weekdays -->
                        <div class="weekdays">
                            <span v-for="day in WEEK_DAYS" :key="day" class="weekday">
                                {{ day }}
                            </span>
                        </div>

                        <!-- Days -->
                        <div class="days">
                            <button v-for="(day, index) in calendarDays" :key="index" class="day-btn" :class="{
                                'other-month': !day.currentMonth,
                                'selected': isSelectedDate(day.date),
                                'today': isToday(day.date),
                                'disabled': isDisabledDate(day.date)
                            }" :disabled="!day.currentMonth || isDisabledDate(day.date)" @click="selectDate(day.date)">
                                {{ day.dayNumber }}
                            </button>
                        </div>
                    </div>

                    <!-- Time Picker -->
                    <div v-if="enableTime" class="time-picker">
                        <div class="time-inputs">
                            <div class="time-input">
                                <input type="number" v-model="timeValue.hours" min="0" max="23"
                                    @change="validateTime" />
                                <span class="time-label">Giờ</span>
                            </div>

                            <span class="time-separator">:</span>

                            <div class="time-input">
                                <input type="number" v-model="timeValue.minutes" min="0" max="59"
                                    @change="validateTime" />
                                <span class="time-label">Phút</span>
                            </div>
                        </div>
                    </div>

                    <!-- Action buttons -->
                    <div class="picker-actions">
                        <button type="button" class="btn-cancel" @click="cancelSelection">
                            Hủy
                        </button>
                        <button type="button" class="btn-confirm" @click="confirmSelection">
                            Xác nhận
                        </button>
                    </div>
                </div>
            </Transition>
        </div>

        <div v-if="error" class="error-container">
            <span class="error-message">{{ error }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import {
    WEEK_DAYS,
    MONTHS,
    DEFAULT_FORMAT,
    MIN_YEAR,
    MAX_YEAR,
    YEARS_PER_PAGE
} from './constant';
import type {
    DateTimePickerProps,
    CalendarDay,
    TimeValue,
    DateTimeEmits
} from './datetime';

// Props
const props = withDefaults(defineProps<DateTimePickerProps>(), {
    placeholder: 'Chọn thời gian',
    disabled: false,
    enableTime: false,
    format: DEFAULT_FORMAT,
    yearRange: () => [MIN_YEAR, MAX_YEAR]
});

// Emits
const emit = defineEmits<DateTimeEmits>();

// Refs
const inputRef = ref<HTMLInputElement | null>(null);
const pickerRef = ref<HTMLDivElement | null>(null);
const showPicker = ref(false);
const showYearSelect = ref(false);
const showMonthSelect = ref(false);
const currentDate = ref(new Date());
const selectedDate = ref<Date | null>(null);
const inputValue = ref('');
const yearListStart = ref(currentDate.value.getFullYear() - YEARS_PER_PAGE / 2);
const timeValue = ref<TimeValue>({ hours: 0, minutes: 0 });

// Computed
const currentYear = computed(() => currentDate.value.getFullYear());
const currentMonth = computed(() => currentDate.value.getMonth());
const currentMonthName = computed(() => MONTHS[currentMonth.value]);

const yearList = computed(() => {
    const years: number[] = [];
    const [minYear, maxYear] = props.yearRange;

    for (let i = 0; i < YEARS_PER_PAGE; i++) {
        const year = yearListStart.value + i;
        if (year >= minYear && year <= maxYear) {
            years.push(year);
        }
    }
    return years;
});

const calendarDays = computed(() => {
    const year = currentYear.value;
    const month = currentMonth.value;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: CalendarDay[] = [];

    // Previous month days
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();

    for (let i = startingDay - 1; i >= 0; i--) {
        days.push({
            date: new Date(year, month - 1, prevMonthDays - i),
            dayNumber: prevMonthDays - i,
            currentMonth: false
        });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({
            date: new Date(year, month, i),
            dayNumber: i,
            currentMonth: true
        });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
        days.push({
            date: new Date(year, month + 1, i),
            dayNumber: i,
            currentMonth: false
        });
    }

    return days;
});

// Methods
const togglePicker = () => {
    if (!props.disabled) {
        showPicker.value = !showPicker.value;
    }
};

const toggleYearSelect = () => {
    event?.preventDefault();
    showYearSelect.value = !showYearSelect.value;
    showMonthSelect.value = false;
};

const toggleMonthSelect = () => {
    event?.preventDefault();
    showMonthSelect.value = !showMonthSelect.value;
    showYearSelect.value = false;
};

const scrollYears = (delta: number) => {
    event?.preventDefault();
    const newStart = yearListStart.value + delta;
    const [minYear, maxYear] = props.yearRange;

    if (newStart >= minYear && newStart + YEARS_PER_PAGE <= maxYear) {
        yearListStart.value = newStart;
    }
};

const selectYear = (year: number) => {
    event?.preventDefault();
    currentDate.value = new Date(year, currentMonth.value, 1);
    showYearSelect.value = false;
};

const selectMonth = (month: number) => {
    event?.preventDefault();
    currentDate.value = new Date(currentYear.value, month, 1);
    showMonthSelect.value = false;
};

const navigateMonth = (delta: number) => {
    currentDate.value = new Date(
        currentYear.value,
        currentMonth.value + delta,
        1
    );
};

const isSelectedDate = (date: Date) => {
    return selectedDate.value?.toDateString() === date.toDateString();
};

const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
};

const isDisabledDate = (date: Date) => {
    if (props.minDate && date < props.minDate) return true;
    if (props.maxDate && date > props.maxDate) return true;
    return false;
};

const selectDate = (date: Date) => {
    // Prevent default to avoid form submission
    event?.preventDefault();

    selectedDate.value = new Date(date);
    if (props.enableTime && selectedDate.value) {
        selectedDate.value.setHours(timeValue.value.hours);
        selectedDate.value.setMinutes(timeValue.value.minutes);
    }
    if (!props.enableTime) {
        confirmSelection();
    }
};

const validateTime = () => {
    if (timeValue.value.hours < 0) timeValue.value.hours = 0;
    if (timeValue.value.hours > 23) timeValue.value.hours = 23;
    if (timeValue.value.minutes < 0) timeValue.value.minutes = 0;
    if (timeValue.value.minutes > 59) timeValue.value.minutes = 59;

    if (selectedDate.value) {
        selectedDate.value.setHours(timeValue.value.hours);
        selectedDate.value.setMinutes(timeValue.value.minutes);
    }
};

const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    if (props.enableTime) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    return `${day}/${month}/${year}`;
};

const parseDate = (value: string): Date | null => {
    const parts = value.split(/[\s/:]+/);

    if (parts.length >= 3) {
        const [day, month, year, ...timeParts] = parts.map(Number);
        const date = new Date(year, month - 1, day);

        if (!isNaN(date.getTime())) {
            if (props.enableTime && timeParts.length >= 2) {
                date.setHours(timeParts[0]);
                date.setMinutes(timeParts[1]);
            }
            return date;
        }
    }

    return null;
};

const handleManualInput = () => {
    const date = parseDate(inputValue.value);

    if (date) {
        selectedDate.value = date;
        currentDate.value = new Date(date);
        if (props.enableTime) {
            timeValue.value = {
                hours: date.getHours(),
                minutes: date.getMinutes()
            };
        }
    }
};

const handleFocus = () => {
    showPicker.value = true;
};

const handleBlur = () => {
    emit('blur');
};

const confirmSelection = (event?: Event) => {
    // Prevent default to avoid form submission
    event?.preventDefault();

    if (selectedDate.value) {
        if (props.enableTime) {
            selectedDate.value.setHours(timeValue.value.hours);
            selectedDate.value.setMinutes(timeValue.value.minutes);
        }
        inputValue.value = formatDate(selectedDate.value);
        emit('update:modelValue', selectedDate.value);
        emit('change', selectedDate.value);
    }
    showPicker.value = false;
    showYearSelect.value = false;
    showMonthSelect.value = false;

    // Remove focus from input
    inputRef.value?.blur();
};


const cancelSelection = (event?: Event) => {
    // Prevent default to avoid form submission
    event?.preventDefault();

    showPicker.value = false;
    showYearSelect.value = false;
    showMonthSelect.value = false;

    // Remove focus from input
    inputRef.value?.blur();
};
// Handle click outside
const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    if (
        showPicker.value &&
        pickerRef.value &&
        inputRef.value &&
        !pickerRef.value.contains(target) &&
        !inputRef.value.contains(target)
    ) {
        showPicker.value = false;
        showYearSelect.value = false;
        showMonthSelect.value = false;
    }
};

// Watch changes
watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        const date = new Date(newValue);
        if (!isNaN(date.getTime())) {
            selectedDate.value = date;
            currentDate.value = new Date(date);
            inputValue.value = formatDate(date);
            timeValue.value = {
                hours: date.getHours(),
                minutes: date.getMinutes()
            };
        }
    } else {
        selectedDate.value = null;
        inputValue.value = '';
        timeValue.value = { hours: 0, minutes: 0 };
    }
});

// Lifecycle hooks
onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside);

    if (props.modelValue) {
        const date = new Date(props.modelValue);
        if (!isNaN(date.getTime())) {
            selectedDate.value = date;
            currentDate.value = new Date(date);
            inputValue.value = formatDate(date);
            timeValue.value = {
                hours: date.getHours(),
                minutes: date.getMinutes()
            };
        }
    }
});

onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<style scoped>
.custom-datetime-container {
    margin-bottom: 1.5rem;
    width: 100%;
}

.custom-label {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    color: #1e293b;
}

.custom-label.has-error {
    color: #dc2626;
}

.error-icon {
    margin-left: 8px;
    font-size: 1rem;
    color: #dc2626;
}

.datetime-wrapper {
    position: relative;
    width: 100%;
}

.datetime-input {
    width: 100%;
    height: 48px;
    padding: 0.75rem 1rem;
    padding-right: 2.5rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #1e293b;
    background-color: #fff;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    transition: all 0.2s ease-in-out;
}

.datetime-input:hover:not(:disabled) {
    border-color: #94a3b8;
}

.datetime-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.datetime-input:disabled {
    background-color: #f8fafc;
    cursor: not-allowed;
}

.datetime-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
    cursor: pointer;
}

.datetime-picker {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 320px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 1000;
    padding: 1rem;
}

.picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.year-month-selectors {
    display: flex;
    gap: 0.5rem;
}

.year-selector,
.month-selector {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
}

.year-selector:hover,
.month-selector:hover {
    background-color: #f1f5f9;
}

.year-list,
.month-list {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 120px;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    z-index: 1001;
}

.year-list-content {
    max-height: 200px;
    overflow-y: auto;
}

.year-list button,
.month-list button {
    width: 100%;
    padding: 0.5rem;
    text-align: left;
    border: none;
    background: none;
    cursor: pointer;
    transition: all 0.2s;
}

.year-list button:hover,
.month-list button:hover {
    background-color: #f1f5f9;
}

.year-list button.active,
.month-list button.active {
    background-color: #3b82f6;
    color: white;
}

.month-navigation {
    display: flex;
    gap: 0.25rem;
}

.nav-btn {
    padding: 0.5rem;
    border: none;
    background: none;
    cursor: pointer;
    color: #64748b;
    border-radius: 4px;
}

.nav-btn:hover {
    background-color: #f1f5f9;
    color: #1e293b;
}

.calendar {
    margin-bottom: 1rem;
}

.weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: 0.5rem;
}

.weekday {
    text-align: center;
    font-size: 0.875rem;
    color: #64748b;
    padding: 0.5rem;
}

.days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
}

.day-btn {
    aspect-ratio: 1;
    padding: 0;
    border: none;
    background: none;
    font-size: 0.875rem;
    color: #1e293b;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s;
}

.day-btn:hover:not(:disabled) {
    background-color: #f1f5f9;
}

.day-btn.other-month {
    color: #94a3b8;
}

.day-btn.selected {
    background-color: #3b82f6;
    color: white;
}

.day-btn.today {
    font-weight: bold;
    color: #3b82f6;
}

.day-btn:disabled {
    color: #cbd5e1;
    cursor: not-allowed;
}

.time-picker {
    padding-top: 1rem;
    margin-top: 1rem;
    border-top: 1px solid #e2e8f0;
}

.time-inputs {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.time-input {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.time-input input {
    width: 60px;
    height: 36px;
    padding: 0.25rem;
    text-align: center;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 1rem;
}

.time-input input:focus {
    outline: none;
    border-color: #3b82f6;
}

.time-label {
    font-size: 0.75rem;
    color: #64748b;
    margin-top: 0.25rem;
}

.time-separator {
    font-size: 1.25rem;
    color: #64748b;
    margin-top: -1rem;
}

.picker-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
}

.btn-cancel,
.btn-confirm {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-confirm {
    background-color: #3b82f6;
    color: white;
}

.btn-confirm:hover {
    background-color: #2563eb;
}

.btn-cancel {
    background-color: #e2e8f0;
    color: #1e293b;
}

.btn-cancel:hover {
    background-color: #cbd5e1;
}

.error-container {
    margin-top: 0.5rem;
    padding: 0.5rem;
    background-color: #fef2f2;
    border-radius: 4px;
}

.error-message {
    font-size: 0.875rem;
    color: #dc2626;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>