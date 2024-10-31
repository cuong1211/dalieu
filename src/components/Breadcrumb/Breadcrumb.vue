<!-- src/components/Breadcrumb.vue -->
<template>
  <ul class="breadcrumb breadcrumb-separatorless fw-bold fs-7 pt-1">
    <li v-for="(item, index) in breadcrumbItems" :key="index" class="breadcrumb-item">
      <span class="bullet bg-gray-200 w-5px h-2px"></span>
      <template v-if="index === breadcrumbItems.length - 1">
        <span class="text-dark">{{ item.name }}</span>
      </template>
      <template v-else>
        <router-link :to="item.path" class="text-muted text-hover-primary">{{ item.name }}</router-link>
      </template>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const breadcrumbItems = computed(() => {
  const paths = route.path.split('/').filter(Boolean)
  return paths.map((path, index) => {
    const fullPath = '/' + paths.slice(0, index + 1).join('/')
    const matchedRoute = router.resolve(fullPath)
    return {
      name: matchedRoute.meta.breadcrumb || path.charAt(0).toUpperCase() + path.slice(1),
      path: fullPath
    }
  })
})
</script>