<template>
    <v-btn  size="large" color="primary" @click="emitAdd">
        <template v-slot:prepend>
            <v-icon>
                <i class="bi bi-plus-lg"></i>
            </v-icon>
        </template>
        Thêm
    </v-btn>
</template>

<script setup lang="ts">
const emit = defineEmits(['add']);

const emitAdd = () => {
    emit('add');
};
</script>

<style scoped>

</style>