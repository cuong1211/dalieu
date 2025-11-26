<template>
  <nav class="breadcrumb-container" aria-label="Breadcrumb">
    <ol class="breadcrumb-list">
      <li v-for="(item, index) in breadcrumbItems" :key="index" class="breadcrumb-item">
        <template v-if="index === breadcrumbItems.length - 1">
          <span class="breadcrumb-current">{{ item.name }}</span>
        </template>
        <template v-else>
          <router-link :to="item.path" class="breadcrumb-link">{{ item.name }}</router-link>
        </template>
      </li>
    </ol>
  </nav>
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

<style scoped>
.breadcrumb-container {
  display: block;
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  list-style: none;
  padding: 0.75rem 0;
  margin: 0;
  flex-wrap: wrap;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #86868b;
}

.breadcrumb-separator {
  display: inline-block;
  width: 4px;
  height: 4px;
  background-color: #d5d5d7;
  border-radius: 50%;
  flex-shrink: 0;
  margin: 0 0.25rem;
}

.breadcrumb-link {
  color: #4caf50;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.15s ease;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  margin: -0.25rem -0.5rem;
}

.breadcrumb-link:hover {
  color: #45a049;
  background-color: rgba(76, 175, 80, 0.08);
}

.breadcrumb-link:active {
  color: #3d8b3f;
}

.breadcrumb-current {
  color: #1d1d1f;
  font-weight: 600;
}

@media (max-width: 768px) {
  .breadcrumb-list {
    gap: 0.5rem;
    padding: 0.5rem 0;
  }

  .breadcrumb-item {
    font-size: 0.8125rem;
  }

  .breadcrumb-link {
    padding: 0.25rem 0.375rem;
    margin: -0.25rem -0.375rem;
  }
}

@media (max-width: 480px) {
  .breadcrumb-list {
    gap: 0.375rem;
  }

  .breadcrumb-separator {
    width: 3px;
    height: 3px;
  }

  .breadcrumb-item {
    font-size: 0.75rem;
  }
}
</style>