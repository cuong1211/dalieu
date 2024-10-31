<template>
    <div class="card card-flush pt-1 mb-5 mb-lg-1">
        <div class="card-header" v-if="title">
            <div class="card-title">
                <h4 class="fw-bolder">{{ title }}</h4>
            </div>
        </div>
        <div class="card-body pt-0">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title?: string;
}>();
</script>