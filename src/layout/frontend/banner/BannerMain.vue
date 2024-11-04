<template>
    <div class="banner-wrapper">
        <!-- Background image overlay -->
        <div class="banner-overlay"></div>

        <!-- Main content -->
        <div class="d-flex flex-column flex-center w-100 min-h-350px min-h-lg-500px px-9 position-relative">
            <!-- Heading -->
            <div class="text-center mb-5 mb-lg-10 py-10 py-lg-20">
                <!-- Title -->
                <h1 class="text-white lh-base fw-bolder fs-2x fs-lg-3x mb-15">
                    Chẩn Đoán Bệnh Da Liễu
                    <br />
                    Với
                    <span class="gradient-text">
                        Công Nghệ AI Tiên Tiến
                    </span>
                </h1>

                <!-- Subtitle -->
                <p class="text-white fs-lg-lead mb-10 opacity-75">
                    Giải pháp chẩn đoán nhanh chóng, chính xác với độ tin cậy cao
                </p>

                <!-- Action buttons -->
                <div class="d-flex justify-content-center gap-3">
                    <RouterLink :to="{ name: 'request' }" class="btn btn-primary btn-lg">
                        <i class="bi bi-search me-2"></i>
                        Chẩn Đoán Ngay
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.banner-wrapper {
    position: relative;
    background-image: url('/src/assets/media/banner/banner.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
}

.banner-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5));
    z-index: 1;
}

.position-relative {
    z-index: 2;
}

.gradient-text {
    background: linear-gradient(to right, #4CAF50 0%, #2196F3 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    padding: 0 5px;
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
    .min-h-350px {
        min-height: 350px;
    }
}

@media (min-width: 992px) {
    .min-h-lg-500px {
        min-height: 500px;
    }
}

.btn-lg {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    transition: all 0.3s ease;
}

.btn-primary {
    background: linear-gradient(to right, #4CAF50, #2196F3);
    border: none;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.btn-light {
    background: rgba(255, 255, 255, 0.9);
    color: #333;
}

.btn-light:hover {
    background: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
}

.gap-3 {
    gap: 1rem;
}

.fs-lg-lead {
    font-size: 1.25rem;
    line-height: 1.8;
}

.opacity-75 {
    opacity: 0.75;
}
</style>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

// Có thể thêm các logic xử lý nếu cần
</script>