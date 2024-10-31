<script setup lang="ts">
import { computed, onMounted, markRaw } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import BackendLayout from '@/layout/backend/BELayoutMain.vue'
import PublicLayout from '@/layout/frontend/FELayoutMain.vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const route = useRoute()

const isLoggedIn = computed(() => authStore.isLoggedIn)

onMounted(() => {
  authStore.checkAuth()
})

const isAdminRoute = computed(() => {
  return route.matched.some(record => record.path.startsWith('/admin'))
})

const currentLayout = computed(() => {
  if (isAdminRoute.value && route.name !== 'admin.login') {
    return markRaw(BackendLayout)
  }
  return markRaw(PublicLayout)
})

const showLayout = computed(() => {
  if (route.name === 'admin.login') {
    return false
  }
  if (isAdminRoute.value) {
    return isLoggedIn.value
  }
  return true
})
</script>

<template>
  <v-app>
    <component :is="currentLayout" v-if="showLayout">
      <RouterView />
    </component>
    <RouterView v-else />
  </v-app>
</template>

<style scoped></style>