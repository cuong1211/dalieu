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
  <div class="apple-menu-container">
    <template v-for="item in menuItems" :key="item.title">
      <!-- Simple Menu Item (no children) -->
      <div v-if="!item.children" class="menu-item">
        <RouterLink v-if="item.route" :to="{ name: item.route }" class="menu-link" :class="{ 'link-active': isActive(item.route) }">
          <span v-if="item.icon" class="menu-icon">
            <i :class="item.icon" style="color: black;"></i>
          </span>
          <span class="menu-title">{{ item.title }}</span>
        </RouterLink>
      </div>

      <!-- Accordion Menu Item (with children) -->
      <div v-else class="menu-item menu-accordion">
        <button class="menu-link menu-accordion-trigger" :class="{ 'accordion-open': isOpen(item) }" @click.prevent="toggleMenu(item)">
          <span v-if="item.icon" class="menu-icon">
            <i :class="item.icon" style="color: black;"></i>
          </span>
          <span class="menu-title">{{ item.title }}</span>
          <span class="menu-arrow">
            <i class="bi bi-chevron-down"></i>
          </span>
        </button>

        <!-- Submenu -->
        <div v-show="isOpen(item)" class="menu-sub">
          <div v-for="child in item.children" :key="child.title" class="menu-item menu-sub-item">
            <RouterLink v-if="child.route" :to="{ name: child.route }" class="menu-link" :class="{ 'link-active': isActive(child.route) }">
              <span class="menu-bullet"></span>
              <span class="menu-title">{{ child.title }}</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* Menu Container */
.apple-menu-container {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.25rem !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
  padding: 0 !important;
  border-radius: 0 !important;
}

/* Menu Item */
.menu-item {
  display: flex;
  flex-direction: column;
}

/* Menu Link Base */
.menu-link {
  display: flex !important;
  align-items: center !important;
  gap: 0.75rem !important;
  padding: 0.75rem 1rem !important;
  color: #1d1d1f !important;
  text-decoration: none !important;
  font-size: 0.9375rem !important;
  font-weight: 500 !important;
  transition: all 0.15s ease !important;
  border-radius: 8px !important;
  cursor: pointer !important;
  border: none !important;
  background: transparent !important;
  font-family: inherit !important;
}

.menu-link:hover {
  background-color: #f0f8f4 !important;
  color: #4caf50 !important;
}

.menu-link.link-active {
  background-color: rgba(76, 175, 80, 0.1) !important;
  color: #4caf50 !important;
  font-weight: 600 !important;
}

.menu-link.link-active .menu-icon {
  color: #4caf50 !important;
}

/* Menu Icon */
.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  font-size: 1.125rem;
  color: #86868b;
  flex-shrink: 0;
  transition: color 0.15s ease;
}

.menu-link:hover .menu-icon {
  color: #4caf50;
}

/* Menu Title */
.menu-title {
  flex: 1;
  display: flex;
  align-items: center;
}

/* Menu Accordion Trigger */
.menu-accordion-trigger {
  position: relative;
  padding-right: 1.5rem;
}

.menu-accordion-trigger .menu-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  position: absolute;
  right: 0.75rem;
  color: #86868b;
  font-size: 0.875rem;
  transition: transform 0.2s ease;
}

.menu-accordion-trigger.accordion-open .menu-arrow {
  transform: rotate(-180deg);
  color: #4caf50;
}

/* Submenu */
.menu-sub {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-left: 0.5rem;
  border-left: 2px solid rgba(76, 175, 80, 0.2);
  margin-left: 0.625rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

/* Submenu Item */
.menu-sub-item .menu-link {
  padding-left: 0.75rem;
  font-size: 0.875rem;
}

.menu-sub-item .menu-icon {
  display: none;
}

/* Menu Bullet */
.menu-bullet {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
}

.menu-bullet::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #d5d5d7;
  transition: all 0.15s ease;
}

.menu-sub-item .menu-link:hover .menu-bullet::before {
  background-color: #4caf50;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
}

.menu-sub-item .menu-link.link-active .menu-bullet::before {
  width: 8px;
  height: 8px;
  background-color: #4caf50;
  box-shadow: 0 0 12px rgba(76, 175, 80, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .apple-menu-container {
    gap: 0.125rem;
  }

  .menu-link {
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
  }

  .menu-icon {
    width: 1.375rem;
    height: 1.375rem;
    font-size: 1rem;
  }

  .menu-sub {
    padding-left: 0.375rem;
  }

  .menu-sub-item .menu-link {
    padding-left: 0.5rem;
  }
}

@media (max-width: 480px) {
  .menu-link {
    padding: 0.625rem 0.5rem;
  }

  .menu-title {
    font-size: 0.8125rem;
  }

  .menu-sub-item .menu-link {
    padding-left: 0.375rem;
  }
}
</style>