<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/layout/backend/header/HeaderMain.vue'
import Aside from '@/layout/backend/aside/AsideMain.vue'

const router = useRouter()
const isAsideOpen = ref(true)
const isMobile = ref(window.innerWidth < 992)

const toggleAside = () => {
    if (isMobile.value) {
        isAsideOpen.value = !isAsideOpen.value
    } else {
        isAsideOpen.value = !isAsideOpen.value
    }
}

const closeAside = () => {
    if (isMobile.value) {
        isAsideOpen.value = true
    }
}



// Theo dõi thay đổi kích thước màn hình
const handleResize = () => {
    isMobile.value = window.innerWidth < 992
    if (!isMobile.value) {
        isAsideOpen.value = true
    }
}

// Theo dõi thay đổi route
watch(() => router.currentRoute.value, () => {
    if (isMobile.value) {
        isAsideOpen.value = true
    }
}, { deep: true })

// Thêm và xóa event listener
onMounted(() => {
    window.addEventListener('resize', handleResize)
    handleResize() // Gọi lần đầu để set giá trị ban đầu
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})
</script>

<template>
    <Aside :isOpen="isAsideOpen" @close="closeAside" />
    <div :class="{ 'aside-minimize': !isAsideOpen || isMobile }" style="width: 100%; height: 100%;">
        <div class="wrapper d-flex flex-column flex-row-fluid" id="kt_wrapper">
            <Header @toggle-aside="toggleAside" :is-aside-minimized="!isAsideOpen" />
            <div class="content d-flex flex-column flex-column-fluid" id="kt_content">
                <div class="post d-flex flex-column-fluid" id="kt_post">
                    <div id="kt_content_container" class="container" style="max-width:none">
                        <slot></slot>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.content {
    background-color: #f2f4f7;
}

.wrapper {
    transition: padding-left 0.3s ease;
    padding-left: 295px;
    height: inherit ;
}

.aside-minimize .wrapper {
    padding-left: 0px;
}

@media (max-width: 991.98px) {
    .wrapper {
        padding-left: 0 !important;
    }
}

body.aside-overlay-on {
    overflow: hidden;
}
</style>