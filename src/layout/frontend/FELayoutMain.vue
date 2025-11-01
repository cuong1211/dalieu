<template>
    <div class="fe-layout">
        <Sidebar />

        <div class="fe-main-content">
            <!-- Hero Section with Banner -->
            <!-- <div class="fe-hero-section" id="home">
                <div class="hero-bg" style="background-image: url(assets/media/svg/illustrations/landing.svg)"></div>
            </div> -->

            <!-- Main Content Area -->
            <div class="fe-content-wrapper">
                <slot></slot>
            </div>

            <!-- Footer -->
            <Footer v-if="!$route.meta.hideFooter" />

            <!-- Scroll to Top Button -->
            <div id="kt_scrolltop" class="scrolltop">
                <span class="svg-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect opacity="0.5" x="13" y="6" width="13" height="2" rx="1" transform="rotate(90 13 6)"
                            fill="black" />
                        <path
                            d="M12.5657 8.56569L16.75 12.75C17.1642 13.1642 17.8358 13.1642 18.25 12.75C18.6642 12.3358 18.6642 11.6642 18.25 11.25L12.7071 5.70711C12.3166 5.31658 11.6834 5.31658 11.2929 5.70711L5.75 11.25C5.33579 11.6642 5.33579 12.3358 5.75 12.75C6.16421 13.1642 6.83579 13.1642 7.25 12.75L11.4343 8.56569C11.7467 8.25327 12.2533 8.25327 12.5657 8.56569Z"
                            fill="black" />
                    </svg>
                </span>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import Sidebar from '@/layout/frontend/sidebar/SidebarMain.vue'
import Footer from '@/layout/frontend/footer/FooterMain.vue'
import { onMounted, onUnmounted, ref, watch } from 'vue'
</script>

<style scoped>
.fe-layout {
    display: flex;
    min-height: 100vh;
    background: #ffffff;
}

.fe-main-content {
    flex: 1;
    margin-left: 280px;
    display: flex;
    flex-direction: column;
}

.fe-hero-section {
    position: relative;
    padding: 4rem 2rem;
    background: linear-gradient(135deg, #f8f9fb 0%, #ffffff 100%);
    border-bottom: 1px solid #e8eaed;
    min-height: 300px;
}

.hero-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center bottom;
    opacity: 0.5;
}

.fe-content-wrapper {
    flex: 1;
    width: 100%;
}

.scrolltop {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #5b9fd9 0%, #4a8bc2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 4px 12px rgba(91, 159, 217, 0.3);
}

.scrolltop.show {
    opacity: 1;
    visibility: visible;
}

.scrolltop:hover {
    background: linear-gradient(135deg, #4a8bc2 0%, #3a7bb0 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(91, 159, 217, 0.4);
}

.scrolltop .svg-icon {
    display: flex;
    align-items: center;
    justify-content: center;
}

.scrolltop svg {
    stroke: white;
    fill: white;
}

/* Responsive Design */
@media (max-width: 991.98px) {
    .fe-main-content {
        margin-left: 220px;
    }

    .fe-hero-section {
        padding: 3rem 1.5rem;
        min-height: 250px;
    }

    .fe-content-wrapper {
        padding: 1.5rem;
    }
}

@media (max-width: 575.98px) {
    .fe-main-content {
        margin-left: 70px;
    }

    .fe-hero-section {
        padding: 2rem 1rem;
        min-height: 200px;
    }

    .fe-content-wrapper {
        padding: 1rem;
    }

    .scrolltop {
        bottom: 1.5rem;
        right: 1.5rem;
        width: 45px;
        height: 45px;
    }
}
</style>