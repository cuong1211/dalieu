<template>
    <div class="landing-header">
        <div class="container">
            <div class="d-flex align-items-center justify-content-between">
                <!-- Left section with logo and mobile menu -->
                <div class="d-flex align-items-center flex-equal">
                    <button class="btn btn-icon btn-active-color-primary me-3 d-flex d-lg-none"
                        id="kt_landing_menu_toggle">
                        <span class="svg-icon svg-icon-2hx">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none">
                                <path
                                    d="M21 7H3C2.4 7 2 6.6 2 6V4C2 3.4 2.4 3 3 3H21C21.6 3 22 3.4 22 4V6C22 6.6 21.6 7 21 7Z"
                                    fill="black" />
                                <path opacity="0.3"
                                    d="M21 14H3C2.4 14 2 13.6 2 13V11C2 10.4 2.4 10 3 10H21C21.6 10 22 10.4 22 11V13C22 13.6 21.6 14 21 14ZM22 20V18C22 17.4 21.6 17 21 17H3C2.4 17 2 17.4 2 18V20C2 20.6 2.4 21 3 21H21C21.6 21 22 20.6 22 20Z"
                                    fill="black" />
                            </svg>
                        </span>
                    </button>
                    <RouterLink to="/" class="d-flex align-items-center">
                        <div class="logo-container">
                            <img alt="Logo" src="/media/icons/map/rescue.svg" class="h-50px h-lg-50px" />
                            <h1 class="logo-text">CUUHO</h1>
                        </div>
                    </RouterLink>
                </div>

                <!-- Center section with menu items -->
                <div class="d-lg-block" id="kt_header_nav_wrapper">
                    <div class="d-lg-block p-5 p-lg-0">
                        <div class="menu menu-column flex-nowrap menu-rounded menu-lg-row menu-title-light menu-state-title-primary nav nav-flush fs-5 fw-bold"
                            id="kt_landing_menu">
                            <!-- Regular menu items -->
                            <div v-for="item in menuItems" :key="item.name" class="menu-item">
                                <RouterLink :to="item.to" class="menu-link nav-link py-3 px-4 px-xxl-6"
                                    :class="{ 'active': isActive(item.name) }">
                                    {{ item.label }}
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right section with admin button -->
                <div class="flex-equal text-end ms-1">
                    <RouterLink :to="{ name: 'admin.home' }" class="btn btn-success">
                        Quản lý
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

interface MenuItem {
    name: string;
    to: { name: string };
    label: string;
}

const route = useRoute();

const menuItems = ref<MenuItem[]>([
    { name: 'request', to: { name: 'request' }, label: 'Tạo yêu cầu' },
    { name: 'search', to: { name: 'search' }, label: 'Tìm kiếm' },
    { name: 'diseases', to: { name: 'diseases' }, label: 'Từ điển bệnh' },
    // { name: 'contact', to: { name: 'contact' }, label: 'Liên hệ' }
]);

const isActive = computed(() => (name: string) => {
    if (name === 'diseases') {
        return route.name === 'diseases' || route.name === 'disease.detail';
    }
    return route.name === name;
});
</script>

<style scoped>
.logo-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

.logo-text {
    font-size: 1.5rem;
    font-weight: bold;
    color: #181C32;
    margin: 0;
}

.menu-link {
    cursor: pointer;
    color: #181C32;
    transition: all 0.2s ease;
    font-weight: 500;
    text-decoration: none;
}

.menu-link.active {
    color: #009EF7;
    font-weight: 600;
}

.menu-link:hover {
    color: #009EF7;
}

@media (max-width: 991.98px) {
    #kt_header_nav_wrapper {
        display: none;
    }

    #kt_header_nav_wrapper.active {
        display: block;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        padding: 1rem;
        box-shadow: 0 10px 30px 0 rgb(82 63 105 / 5%);
    }
}
</style>