<template>
  <aside class="sidebar">
    <!-- Logo Section -->
    <div class="sidebar-header">
      <RouterLink to="/" class="sidebar-logo">
        <img src="/media/logos/logo.png" alt="Logo" class="logo-img" />
        <div class="logo-text">
          <div class="text-primary">DERMARAG</div>
        </div>
      </RouterLink>
    </div>

    <!-- Menu Items -->
    <nav class="sidebar-nav">
      <div v-for="item in menuItems" :key="item.name" class="nav-item" @click="navigateTo(item)">
        <RouterLink :to="item.to" class="nav-link" :class="{ 'active': isActive(item.name) }">
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </RouterLink>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface MenuItem {
  name: string;
  to: { name: string };
  label: string;
  icon: string;
}

const route = useRoute();
const router = useRouter();

const menuItems = ref<MenuItem[]>([
  { name: 'home', to: { name: 'home' }, label: 'Trang chủ', icon: '🏠' },
  { name: 'request', to: { name: 'request' }, label: 'Tạo yêu cầu', icon: '📝' },
  { name: 'search', to: { name: 'search' }, label: 'Tìm kiếm', icon: '🔍' },
  { name: 'diseases', to: { name: 'diseases' }, label: 'Từ điển bệnh', icon: '📚' },
  { name: 'contact', to: { name: 'contact' }, label: 'Khám bệnh cùng chuyên gia', icon: '👨‍⚕️' }
]);

const isActive = (name: string): boolean => {
  return route.name === name;
};

const navigateTo = (item: MenuItem) => {
  router.push(item.to);
};
</script>

<style scoped>
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
}

.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid #e8eaed;
  background: #fff;
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

/* Responsive */
@media (max-width: 991.98px) {
  .sidebar {
    width: 220px;
  }

  .nav-label {
    display: none;
  }

  .sidebar-logo {
    justify-content: center;
  }

  .logo-text {
    display: none;
  }

  .sidebar-logo .logo-img {
    height: 40px;
    width: 40px;
  }
}

@media (max-width: 575.98px) {
  .sidebar {
    width: 70px;
    padding: 0;
  }

  .sidebar-header {
    padding: 1rem 0.5rem;
  }

  .sidebar-footer {
    display: none;
  }

  .nav-item {
    padding: 0;
  }

  .nav-link {
    justify-content: center;
    padding: 1rem 0.5rem;
    border-radius: 0;
  }

  .nav-icon {
    font-size: 1.5rem;
    min-width: auto;
  }
}
</style>
