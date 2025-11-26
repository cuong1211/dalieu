<template>
    <div class="apple-search-container">
        <div class="search-icon">
            <i class="bi bi-search"></i>
        </div>
        <input
            type="text"
            v-model="searchValue"
            class="apple-search-input"
            placeholder="Tìm kiếm..."
            @input="handleSearchInput"
            @keyup.enter="handleSearch"
        />
        <button
            v-if="searchValue"
            class="clear-btn"
            @click="clearSearch"
            type="button"
        >
            <i class="bi bi-x-circle-fill"></i>
        </button>
    </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import { debounce } from 'lodash';

interface SearchEmits {
  (event: 'search', value: string): void;
}

const emit = defineEmits<SearchEmits>();

const searchValue = ref<string>('');

// Debounce search để tránh gọi API quá nhiều
const debouncedSearch = debounce((value: string) => {
    emit('search', value);
}, 500);

// Xử lý input
const handleSearchInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    searchValue.value = input.value;
    debouncedSearch(searchValue.value);
};

// Xử lý khi nhấn Enter
const handleSearch = (): void => {
    emit('search', searchValue.value);
};

// Xóa tìm kiếm
const clearSearch = (): void => {
    searchValue.value = '';
    emit('search', '');
};

// Hủy debounce khi component unmount
onUnmounted(() => {
    debouncedSearch.cancel();
});
</script>

<style scoped>
/* Apple-style Search Container */
.apple-search-container {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 380px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

/* Search Icon */
.search-icon {
    position: absolute;
    left: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #86868b;
    font-size: 16px;
    pointer-events: none;
    z-index: 2;
}

/* Search Input */
.apple-search-input {
    width: 100%;
    height: 40px;
    padding: 0 40px 0 40px;
    background: #ffffff;
    border: 1.5px solid #d5d5d7;
    border-radius: 10px;
    font-size: 14px;
    color: #1d1d1f;
    font-weight: 400;
    outline: none;
    transition: all 0.2s ease;
    -webkit-appearance: none;
}

.apple-search-input::placeholder {
    color: #86868b;
    font-weight: 400;
}

.apple-search-input:hover {
    background: #ffffff;
    border-color: #b0b0b5;
}

.apple-search-input:focus {
    background: #ffffff;
    border-color: #4caf50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

/* Clear Button */
.clear-btn {
    position: absolute;
    right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    background: transparent;
    border: none;
    color: #d5d5d7;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.15s ease;
    z-index: 2;
}

.clear-btn:hover {
    color: #4caf50;
    transform: scale(1.15);
}

.clear-btn:active {
    transform: scale(1);
}

/* Responsive */
@media (max-width: 768px) {
    .apple-search-container {
        width: 100%;
        max-width: 280px;
    }
}

@media (max-width: 480px) {
    .apple-search-container {
        max-width: 100%;
    }

    .apple-search-input {
        font-size: 16px; /* Prevent zoom on iOS */
    }
}
</style>