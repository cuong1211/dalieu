<template>
  <!-- Overlay for drawer -->
  <div v-if="isDrawerOpen" class="drawer-overlay" @click="toggleDrawer"></div>

  <!-- Toggle Button -->
  <button class="drawer-toggle-btn" @click="toggleDrawer" :title="isDrawerOpen ? 'Đóng menu' : 'Mở menu'">
    <i :class="isDrawerOpen ? 'bi bi-x-lg' : 'bi bi-list'"></i>
  </button>

  <!-- Sidebar Drawer -->
  <aside class="sidebar" :class="{ 'drawer-open': isDrawerOpen, 'sidebar-collapsed': isSidebarCollapsed }">
    <!-- Logo Section -->
    <div class="sidebar-header" :class="{ 'collapsed': isSidebarCollapsed }">
      <RouterLink to="/" class="sidebar-logo" @click="isDrawerOpen = false">
        <img src="/media/logos/logo.png" alt="Logo" class="logo-img" />
        <div class="logo-text">
          <div class="text-primary">DERMARAG</div>
        </div>
      </RouterLink>
      <!-- Collapse Button (Desktop only) -->
      <button v-if="!isDrawerOpen" class="collapse-toggle-btn" @click="toggleSidebarCollapse" :title="isSidebarCollapsed ? 'Mở rộng' : 'Thu gọn'">
        <i :class="isSidebarCollapsed ? 'bi bi-chevron-right' : 'bi bi-chevron-left'"></i>
      </button>
    </div>

    <!-- Menu Items -->
    <nav class="sidebar-nav" :class="{ 'collapsed': isSidebarCollapsed }">
      <div v-for="item in menuItems" :key="item.name" class="nav-item" @click="handleNavClick(item)">
        <RouterLink :to="item.to" class="nav-link" :class="{ 'active': isActive(item.name), 'collapsed': isSidebarCollapsed }">
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label" :class="{ 'hidden': isSidebarCollapsed }">{{ item.label }}</span>
        </RouterLink>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface MenuItem {
  name: string;
  to: { name: string };
  label: string;
  icon: string;
}

const route = useRoute();
const router = useRouter();

const emit = defineEmits<{
  (e: 'collapse-change', isCollapsed: boolean): void;
}>();

const menuItems = ref<MenuItem[]>([
  { name: 'home', to: { name: 'home' }, label: 'Trang chủ', icon: '🏠' },
  { name: 'request', to: { name: 'request' }, label: 'Tạo yêu cầu', icon: '📝' },
  { name: 'search', to: { name: 'search' }, label: 'Tìm kiếm', icon: '🔍' },
  { name: 'diseases', to: { name: 'diseases' }, label: 'Từ điển bệnh', icon: '📚' },
  { name: 'contact', to: { name: 'contact' }, label: 'Khám bệnh cùng chuyên gia', icon: '👨‍⚕️' }
]);

const isDrawerOpen = ref(false);
const isSidebarCollapsed = ref(false);

// Initialize collapse state from localStorage
onMounted(() => {
  const savedCollapsedState = localStorage.getItem('sidebar-collapsed');
  if (savedCollapsedState !== null) {
    isSidebarCollapsed.value = savedCollapsedState === 'true';
    // Emit the initial collapse state to parent
    emit('collapse-change', isSidebarCollapsed.value);
  }
});

// Persist collapse state to localStorage and emit event
watch(isSidebarCollapsed, (newValue) => {
  localStorage.setItem('sidebar-collapsed', String(newValue));
  emit('collapse-change', newValue);
});

const isActive = (name: string): boolean => {
  return route.name === name;
};

const toggleDrawer = (): void => {
  isDrawerOpen.value = !isDrawerOpen.value;
};

const toggleSidebarCollapse = (): void => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const handleNavClick = (item: MenuItem): void => {
  router.push(item.to);
  // Đóng drawer sau khi chọn menu
  isDrawerOpen.value = false;
};
</script>

<style scoped>
/* Drawer Overlay */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

/* Toggle Button */
.drawer-toggle-btn {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
  width: 40px;
  height: 40px;
  border: none;
  background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* Mặc định ẩn trên desktop */
  display: none;
}

.drawer-toggle-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(26, 188, 156, 0.3);
}

.drawer-toggle-btn:active {
  transform: scale(0.95);
}

/* Sidebar Drawer */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 280px;
  background: #f8f9fb;
  border-right: 1px solid #e8eaed;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  z-index: 1000;
  /* Desktop: hiển thị cố định */
  transform: translateX(0);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar.sidebar-collapsed {
  width: 80px;
}

/* Drawer Open State */
.sidebar.drawer-open {
  transform: translateX(0);
}

.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid #e8eaed;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: padding 0.3s ease;
}

.sidebar-header.collapsed {
  padding: 1.5rem 0.75rem;
}

.collapse-toggle-btn {
  background: none;
  border: none;
  color: #5a6c7d;
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.collapse-toggle-btn:hover {
  background: #e8f0f7;
  color: #5b9fd9;
  transform: scale(1.05);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.sidebar-logo:hover {
  transform: translateX(2px);
}

.sidebar-logo .logo-img {
  height: 50px;
  width: 50px;
  object-fit: contain;
  flex-shrink: 0;
}

.logo-text {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  flex-shrink: 0;
}

.logo-text .text-primary {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1abc9c!important;
  line-height: 1;
  letter-spacing: -0.5px;
}

.logo-text .text-secondary {
  font-size: 0.85rem;
  font-weight: 500;
  color: #7a8b9a;
  line-height: 1.2;
}

.sidebar.sidebar-collapsed .logo-text {
  display: none;
}

.sidebar.sidebar-collapsed .logo-img {
  height: 40px;
  width: 40px;
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0;
  overflow-y: auto;
}

.nav-item {
  margin-bottom: 0.5rem;
  padding: 0 0.75rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  color: #5a6c7d;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.25s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-link:hover {
  background: #e8f0f7;
  color: #5b9fd9;
  transform: translateX(4px);
}

.nav-link.active {
  background: linear-gradient(90deg, #1abc9c 0%, #0d7d6e 100%);
  color: #fff;
  box-shadow: 0 2px 8px rgba(91, 159, 217, 0.3);
}

.nav-link.collapsed {
  justify-content: center;
  padding: 0.875rem 0.5rem;
}

.nav-label.hidden {
  display: none;
}

.nav-icon {
  font-size: 1.25rem;
  min-width: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-footer {
  padding: 1.25rem 1rem;
  text-align: center;
}

.footer-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: block;
}

.school-info {
  margin: 0;
}

.school-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #5b9fd9;
  margin: 0 0 0.35rem 0;
  line-height: 1.3;
}

.school-subtitle {
  font-size: 0.8rem;
  color: #7a8b9a;
  margin: 0;
  line-height: 1.3;
  font-weight: 400;
}

/* Scrollbar styling */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 991.98px) {
  .drawer-toggle-btn {
    display: flex;
  }

  .sidebar {
    width: 280px;
    /* Drawer mặc định ẩn */
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sidebar.drawer-open {
    transform: translateX(0);
  }

  .nav-label {
    display: block;
  }

  .logo-text {
    display: block;
  }
}

@media (max-width: 575.98px) {
  .drawer-toggle-btn {
    top: 0.5rem;
    left: 0.5rem;
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
  }

  .sidebar {
    width: 75%;
    max-width: 280px;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sidebar.drawer-open {
    transform: translateX(0);
  }

  .sidebar-header {
    padding: 1.5rem;
  }

  .sidebar-footer {
    display: none;
  }

  .nav-item {
    padding: 0 0.75rem;
  }

  .nav-link {
    padding: 0.875rem 1rem;
  }

  .nav-icon {
    font-size: 1.25rem;
    min-width: 1.5rem;
  }

  .nav-label {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
