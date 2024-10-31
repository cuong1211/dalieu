<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { menuItems } from '@/config/menu';
const route = useRoute();
const openStates = ref(new Map());
const isActive = (routeName: string) => {
  if (route.name === routeName) return true;
  if (route.name && routeName.includes('.')) {
    const parentRoute = routeName.split('.')[0];
    return route.name.toString().startsWith(parentRoute);
  }
  return false;
};
// Function để kiểm tra xem một menu item có nên được mở hay không
const shouldMenuBeOpen = (item: any) => {
  if (item.children) {
    return item.children.some((child: any) => isActive(child.route));
  }
  return false;
};

// Cập nhật lại hàm isOpen
const isOpen = computed(() => (item: any) => {
  const manualState = openStates.value.get(item.title);
  if (manualState !== undefined) {
    return manualState;
  }
  return shouldMenuBeOpen(item);
});

// Hàm toggle menu
const toggleMenu = (item: any) => {
  const currentState = openStates.value.get(item.title);
  if (currentState === undefined) {
    // Nếu chưa có trạng thái, set ngược lại với trạng thái mặc định
    openStates.value.set(item.title, !shouldMenuBeOpen(item));
  } else {
    // Nếu đã có trạng thái, toggle nó
    openStates.value.set(item.title, !currentState);
  }
};

// Watch route change
watch(() => route.name, () => {
  // Reset manual states
  openStates.value.clear();
  // Set initial states based on current route
  menuItems.forEach(item => {
    if (item.children && shouldMenuBeOpen(item)) {
      openStates.value.set(item.title, true);
    }
  });
});
</script>

<template>
  <div
    class="menu menu-column menu-title-gray-800 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-500"
    id="#kt_aside_menu">
    <template v-for="item in menuItems" :key="item.title">
      <div v-if="!item.children" class="menu-item">
        <RouterLink v-if="item.route" :to="{ name: item.route }" class="menu-link"
          :class="{ 'active': isActive(item.route) }">
          <span v-if="item.icon" class="menu-icon">
            <i :class="item.icon"></i>
          </span>
          <span class="menu-title">{{ item.title }}</span>
        </RouterLink>
      </div>
      <div v-else class="menu-item menu-accordion" :class="{ 'hover show': isOpen(item) }">
        <span class="menu-link" :class="{ '': isOpen(item) }" @click.prevent="toggleMenu(item)">
          <span v-if="item.icon" class="menu-icon">
            <i :class="item.icon"></i>
          </span>
          <span class="menu-title">{{ item.title }}</span>
          <span class="menu-arrow"></span>
        </span>
        <div class="menu-sub menu-sub-accordion" :class="{ 'menu-active-bg': isOpen(item) }">
          <div v-for="child in item.children" :key="child.title" class="menu-item">
            <RouterLink v-if="child.route" :to="{ name: child.route }" class="menu-link"
              :class="{ 'active': isActive(child.route) }">
              <span class="menu-bullet">
                <span class="bullet bullet-dot"></span>
              </span>
              <span class="menu-title">{{ child.title }}</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* Styles remain the same */
</style>