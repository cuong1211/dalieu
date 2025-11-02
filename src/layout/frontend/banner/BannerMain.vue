<template>
    <div class="banner-wrapper">
        <div class="banner-content">
            <div class="banner-text-container">
                <div class="banner-main-text">
                    <h1 class="banner-title">DERMARAG</h1>
                    <p class="banner-subtitle">Hệ thống truy xuất và tạo sinh hỗ trợ chuẩn đoán và điều trị các bệnh về da liễu</p>
                </div>
                <div class="banner-cta">
                    <RouterLink :to="{ name: 'request' }" class="cta-button">Bắt Đầu Chẩn Đoán</RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.banner-wrapper {
    position: relative;
    background-image: url('/media/banner/banner.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;
}

/* Overlay to ensure text readability */
.banner-wrapper::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0) 100%);
    pointer-events: none;
}

.banner-content {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.banner-text-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 3rem;
    max-width: 600px;
    animation: slideInLeft 0.8s ease-out;
}

.banner-main-text {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.banner-title {
    font-size: 3rem;
    font-weight: 700;
    color: #fff;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
    line-height: 1.2;
    margin: 0;
}

.banner-subtitle {
    font-size: 1.2rem;
    color: #f0f0f0;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
    margin: 0;
    font-weight: 300;
    letter-spacing: 0.5px;
    font-weight: 600;
}

.banner-cta {
    display: flex;
    gap: 1rem;
}

.cta-button {
    background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
    color: white;
    border: none;
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(26, 188, 156, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.cta-button:hover {
    background: linear-gradient(135deg, #16a085 0%, #117a65 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(26, 188, 156, 0.5);
}

.cta-button:active {
    transform: translateY(0);
}

/* Animation */
@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-50px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* FHD (1920px and above) */
@media (min-width: 1920px) {
    .banner-wrapper {
        min-height: 500px;
    }

    .banner-text-container {
        padding: 4rem;
        max-width: 700px;
    }

    .banner-title {
        font-size: 3.5rem;
    }
}

/* HD (1280px - 1919px) */
@media (min-width: 1280px) and (max-width: 1919px) {
    .banner-wrapper {
        min-height: 600px;
    }

    .banner-text-container {
        padding: 3.5rem;
    }
}

/* Laptop (1025px - 1279px) */
@media (min-width: 1025px) and (max-width: 1279px) {
    .banner-wrapper {
        min-height: 550px;
    }

    .banner-title {
        font-size: 2.5rem;
    }

    .banner-subtitle {
        font-size: 1rem;
    }
}

/* Tablet (768px - 1024px) */
@media (max-width: 1024px) {
    .banner-wrapper {
        min-height: 450px;
        background-position: center;
        justify-content: center;
    }

    .banner-content {
        justify-content: center;
    }

    .banner-text-container {
        max-width: 100%;
        padding: 2.5rem;
        text-align: center;
    }

    .banner-title {
        font-size: 2rem;
    }

    .banner-subtitle {
        font-size: 1rem;
    }

    .banner-cta {
        justify-content: center;
    }
}

/* Mobile (576px - 767px) */
@media (max-width: 767px) {
    .banner-wrapper {
        min-height: 350px;
        background-position: center top;
        justify-content: center;
    }

    .banner-content {
        justify-content: center;
    }

    .banner-text-container {
        max-width: 100%;
        padding: 1.5rem;
        gap: 1.5rem;
        text-align: center;
    }

    .banner-title {
        font-size: 1.5rem;
    }

    .banner-subtitle {
        font-size: 0.95rem;
    }

    .cta-button {
        padding: 0.8rem 1.5rem;
        font-size: 0.95rem;
    }

    .banner-cta {
        justify-content: center;
    }
}

/* Small mobile (< 576px) */
@media (max-width: 575px) {
    .banner-wrapper {
        min-height: 300px;
        background-position: center top;
        justify-content: center;
    }

    .banner-content {
        justify-content: center;
    }

    .banner-text-container {
        max-width: 100%;
        padding: 1rem;
        gap: 1rem;
        text-align: center;
    }

    .banner-title {
        font-size: 1.3rem;
    }

    .banner-subtitle {
        font-size: 0.9rem;
    }

    .cta-button {
        padding: 0.7rem 1.2rem;
        font-size: 0.9rem;
    }

    .banner-cta {
        justify-content: center;
    }
}
</style>

<script setup lang="ts">
// Component chỉ dùng background image
</script>
