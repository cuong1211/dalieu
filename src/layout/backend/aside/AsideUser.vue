<template>
    <div class="aside-user d-flex align-items-sm-center justify-content-center py-5">
        <div class="symbol symbol-50px">
            <img :src="userAvatar" :alt="userName" />
        </div>
        <div class="aside-user-info flex-row-fluid flex-wrap ms-5">
            <div class="d-flex">
                <div class="flex-grow-1 me-2">
                    <a href="#" class="text-white text-hover-primary fs-6 fw-bold">{{ userName }}</a>
                    <span class="text-gray-600 fw-bold d-block fs-8 mb-1">{{ userEmail }}</span>
                    <div class="d-flex align-items-center text-success fs-9">
                        <span class="bullet bullet-dot bg-success me-1"></span>online
                    </div>
                </div>
                <AsideUserMenu />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AsideUserMenu from './AsideUserMenu.vue';
import { useLocalStorage } from '@/composables/useLocalStorage';

const userInfo = useLocalStorage('user', null);
const userName = computed(() => userInfo.value?.user.name || 'Người dùng');
const userEmail = computed(() => userInfo.value?.user.email || 'Chưa có email');
const userAvatar = computed(() => userInfo.value?.user.avatar || '/media/avatars/blank.png');
</script>