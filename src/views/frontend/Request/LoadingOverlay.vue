<template>
    <div class="loading-overlay" v-if="show">
        <div class="loading-content">
            <div class="loading-animation">
                <svg class="circular" viewBox="25 25 50 50">
                    <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="3" stroke-miterlimit="10" />
                </svg>
            </div>
            <h3 class="loading-title">{{ title }}</h3>
            <p class="loading-description">{{ description }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
interface LoadingOverlayProps {
    show: boolean;
    title?: string;
    description?: string;
}

withDefaults(defineProps<LoadingOverlayProps>(), {
    title: 'Đang xử lý',
    description: 'Vui lòng đợi trong giây lát...'
});
</script>

<style scoped>
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.loading-content {
    text-align: center;
    padding: 2rem;
}

.loading-animation {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
}

.circular {
    animation: rotate 2s linear infinite;
    height: 100%;
    transform-origin: center center;
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
}

.path {
    stroke: #3b82f6;
    stroke-dasharray: 89, 200;
    stroke-dashoffset: 0;
    animation: dash 1.5s ease-in-out infinite;
    stroke-linecap: round;
}

.loading-title {
    color: #1e293b;
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
}

.loading-description {
    color: #64748b;
    font-size: 1rem;
    margin: 0;
}

@keyframes rotate {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }

    50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35px;
    }

    100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124px;
    }
}
</style>