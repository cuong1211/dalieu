<template>
  <div class="user-menu-dropdown" ref="dropdownRef">
    <button @click="toggleMenu" class="menu-trigger">
      <i class="bi bi-gear"></i>
    </button>
    <div v-if="isOpen" class="menu-content">
      <div class="menu-user-section">
        <img :src="userAvatar" :alt="userName" class="user-avatar" />
        <div class="user-details">
          <div class="user-name">{{ userName }}</div>
          <span v-if="isSuperAdmin" class="badge-admin">Super Admin</span>
        </div>
      </div>
      <div class="separator"></div>
      <div class="menu-item">
        <i class="bi bi-person-fill"></i>
        <span>Tài khoản</span>
      </div>
      <div class="menu-item">
        <i class="bi bi-sliders"></i>
        <span>Cài đặt</span>
      </div>
      <div class="separator"></div>
      <div class="menu-item menu-item-danger" @click="signOut">
        <i class="bi bi-box-arrow-right"></i>
        <span>Đăng xuất</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLocalStorage } from '@/composables/useLocalStorage'

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const authStore = useAuthStore()
const router = useRouter()
const userInfo = useLocalStorage('user', null)

const userName = computed(() => 'Người dùng')
const userEmail = computed(() => 'Chưa có email')
const userAvatar = computed(() =>  '/media/avatars/blank.png')
const isSuperAdmin = computed(() => localStorage.getItem('is_super_admin') === 'true')

const toggleMenu = () => {
    isOpen.value = !isOpen.value
}

const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        isOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

const signOut = async () => {
    try {
        await authStore.logout()
        isOpen.value = false
        router.push({ name: 'admin.login' })
    } catch (error) {
        console.error('Đăng xuất thất bại:', error)
    }
}
</script>

<style scoped>
.user-menu-dropdown {
  position: relative;
  display: inline-block;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.menu-trigger {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  color: #1d1d1f;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  border-radius: 8px;
}

.menu-trigger:hover {
  color: #4caf50;
  background-color: rgba(76, 175, 80, 0.08);
}

.menu-trigger:active {
  transform: scale(0.95);
}

.menu-content {
  position: fixed;
  background-color: #ffffff;
  min-width: 280px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 0.75rem 0;
  z-index: 9999;
}

.menu-user-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid rgba(76, 175, 80, 0.1);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1d1d1f;
  line-height: 1.2;
}

.user-email {
  font-size: 0.8125rem;
  color: #86868b;
  text-decoration: none;
  transition: color 0.15s ease;
  line-height: 1.2;
}

.user-email:hover {
  color: #4caf50;
}

.badge-admin {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
  border-radius: 4px;
  font-weight: 600;
  margin-top: 0.25rem;
  width: fit-content;
}

.separator {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.06);
  margin: 0.5rem 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #1d1d1f;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.menu-item i {
  font-size: 1rem;
  width: 1.25rem;
  text-align: center;
  color: #4caf50;
}

.menu-item:hover {
  background-color: #f0f8f4;
  color: #1d1d1f;
}

.menu-item:active {
  background-color: #e8f5e9;
}

.menu-item-danger {
  color: #ef4444;
}

.menu-item-danger i {
  color: #ef4444;
}

.menu-item-danger:hover {
  background-color: rgba(239, 68, 68, 0.08);
}

.menu-item-danger:active {
  background-color: rgba(239, 68, 68, 0.12);
}
</style>