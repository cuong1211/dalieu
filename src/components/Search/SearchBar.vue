<template>
    <div class="d-flex align-items-center position-relative my-1">
        <span class="svg-icon svg-icon-1 position-absolute ms-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height="2" rx="1"
                    transform="rotate(45 17.0365 15.1223)" fill="black" />
                <path
                    d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z"
                    fill="black" />
            </svg>
        </span>
        <input 
            type="text" 
            v-model="searchValue"
            class="form-control form-control-solid w-250px ps-14"
            placeholder="Tìm kiếm..."
            @input="handleSearchInput"
            @keyup.enter="handleSearch"
        />
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

// Hủy debounce khi component unmount
onUnmounted(() => {
    debouncedSearch.cancel();
});
</script>

<style scoped>
.svg-icon {
    line-height: 1;
}

.form-control-solid {
    background-color: #f5f8fa;
    border-color: #f5f8fa;
    color: #5e6278;
    transition: color 0.2s ease;
}

.form-control-solid:focus {
    background-color: #eef3f7;
    border-color: #eef3f7;
}

.ps-14 {
    padding-left: 3.5rem !important;
}

.w-250px {
    width: 250px !important;
}
</style>