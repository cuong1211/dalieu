<script setup lang="ts">
import AsideMenu from './AsideMenu.vue';
import User from './AsideUser.vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps(['isOpen']);
const emit = defineEmits(['close']);

const closeAside = () => {
    emit('close');
};
</script>

<template>
    <div id="kt_aside" class="aside" :class="{ 'aside-minimize': !isOpen }">
        <div class="aside-toolbar flex-column-auto">
            <User />
        </div>
        <div class="aside-menu flex-column-fluid">
            <div class="hover-scroll-overlay-y px-2 my-5 my-lg-5" id="kt_aside_menu_wrapper">
                <AsideMenu />
            </div>
        </div>
    </div>
    <div v-if="!isOpen" class="drawer-overlay" @click="closeAside"></div>
</template>

<style scoped>
.aside {
    position: fixed;
    z-index: 1001;
    transition: all 0.3s ease;
    background-color: #ffffff;
}

.aside-minimize {
    width: 0px;
}

.aside-minimize .aside-toolbar,
.aside-minimize .aside-menu {
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.06) !important;
}

.drawer-overlay {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 1000;
    display: none;
}

@media (max-width: 991.98px) {
    .aside {
        left: -295px;
        display: block !important;
        height: 100%;
    }

    .aside-minimize {
        left: 0;
        width: 295px;
    }

    .drawer-overlay {
        display: block;
    }
}
</style>