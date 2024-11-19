// components/Header.vue
<template>
    <header class="main-header">
        <div class="top-header">
            <div class="container">
                <div class="d-flex align-items-center justify-content-between">
                    <!-- Logo -->
                    <RouterLink to="/" class="header-logo">
                        <img src="/media/logos/logo.png" alt="" class="logo-img" />
                        <div class="logo-text">
                            <div class="text-primary">DA LIỄU HÀ VINH</div>
                            <div class="text-secondary">Trường THPT số 1 huyện Bảo Thắng</div>
                        </div>
                    </RouterLink>

                </div>
            </div>
        </div>

        <!-- Main navigation -->
        <nav class="main-nav">
            <div class="container">
                <div class="d-flex justify-content-between align-items-center">
                    <!-- Menu items -->
                    <div class="nav-menu">
                        <div v-for="item in menuItems" :key="item.name" class="nav-item">
                            <RouterLink :to="item.to" class="nav-link" :class="{ 'active': isActive(item.name) }">
                                {{ item.label }}
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

interface MenuItem {
    name: string;
    to: { name: string };
    label: string;
}

const route = useRoute();

const menuItems = ref<MenuItem[]>([
    { name: 'home', to: { name: 'home' }, label: 'Trang chủ' },
    { name: 'request', to: { name: 'request' }, label: 'Tạo yêu cầu' },
    { name: 'search', to: { name: 'search' }, label: 'Tìm kiếm' },
    { name: 'diseases', to: { name: 'diseases' }, label: 'Từ điển bệnh' },
    // { name: 'contact', to: { name: 'contact' }, label: 'Liên hệ' }
]);
const isActive = (name: string): boolean => {
    return route.name === name;
};
</script>

<style scoped>
.main-header {
    background: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.top-header {
    padding: 1rem 0;
    border-bottom: 1px solid #eee;
}

.header-logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    gap: 1rem;
}

.logo-img {
    height: 60px;
}

.logo-text {
    display: flex;
    flex-direction: column;
}

.logo-text .text-primary {
    font-size: 1.2rem;
    font-weight: 700;
    color: #009ef7;
}

.logo-text .text-secondary {
    font-size: 1.3rem;
    color: #000000 !important;
}

.btn-search {
    background: none;
    border: none;
    font-size: 1.2rem;
    color: #009ef7;
    cursor: pointer;
}

.main-nav {
    background: #009ef7;
    padding: 0.5rem 0;
}

.nav-menu {
    display: flex;
    gap: 1rem;
}

.nav-link {
    color: #fff;
    text-decoration: none;
    padding: 0.5rem 1rem;
    font-weight: 500;
    transition: all 0.2s;
}

.nav-link:hover,
.nav-link.active {
    color: #ffd700;
}

@media (max-width: 991.98px) {
    .nav-menu {
        flex-direction: column;
        width: 100%;
    }

    .logo-text {
        font-size: 0.9rem;
    }

    .logo-img {
        height: 40px;
    }
}
</style>