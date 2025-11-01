<template>
    <div class="banner-wrapper"></div>
</template>

<style scoped>
.banner-wrapper {
    position: relative;
    background-image: url('/media/banner/banner.jpg');
    background-size: cover;
    background-position: top;
    background-repeat: no-repeat;
    /* background-attachment: fixed; */
    width: 100%;
    min-height: 700px;
}

/* FHD (1920px and above) */
@media (min-width: 1920px) {
    .banner-wrapper {
        min-height: 900px;
    }
}

/* HD (1280px - 1919px) */
@media (min-width: 1280px) and (max-width: 1919px) {
    .banner-wrapper {
        min-height: 600px;
    }
}

/* Laptop (1025px - 1279px) */
@media (min-width: 1025px) and (max-width: 1279px) {
    .banner-wrapper {
        min-height: 550px;
    }
}

/* Tablet (768px - 1024px) */
@media (max-width: 1024px) {
    .banner-wrapper {
        min-height: 450px;
    }
}

/* Mobile (576px - 767px) */
@media (max-width: 767px) {
    .banner-wrapper {
        min-height: 350px;
        background-position: center top;
    }
}

/* Small mobile (< 576px) */
@media (max-width: 575px) {
    .banner-wrapper {
        min-height: 300px;
        background-position: center top;
    }
}
</style>

<script setup lang="ts">
// Component chỉ dùng background image
</script>
