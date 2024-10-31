<template>
    <span class="badge" :class="badgeClass">
        {{ statusText }}
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    status: string;
}

const props = defineProps<Props>();

const badgeClass = computed(() => {
    switch (props.status) {
        case 'active':
            return 'badge-light-success';
        case 'inactive':
            return 'badge-light-warning';
        case 'completed':
            return 'badge-light-primary';
        default:
            return 'badge-light-secondary';
    }
});

const statusText = computed(() => {
    switch (props.status) {
        case 'active':
            return 'Đang hoạt động';
        case 'inactive':
            return 'Không hoạt động';
        case 'completed':
            return 'Đã hoàn thành';
        default:
            return props.status;
    }
});
</script>

<style scoped>
.badge {
    padding: 0.5rem 0.75rem;
    font-weight: 500;
    font-size: 0.85rem;
    border-radius: 0.475rem;
}

.badge-light-success {
    color: #50cd89;
    background-color: #e8fff3;
}

.badge-light-warning {
    color: #ffc700;
    background-color: #fff8dd;
}

.badge-light-primary {
    color: #009ef7;
    background-color: #f1faff;
}

.badge-light-secondary {
    color: #7e8299;
    background-color: #f5f8fa;
}
</style>