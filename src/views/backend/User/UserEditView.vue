<template>
  <div class="post d-flex flex-column-fluid" id="kt_post">
    <div id="kt_content_container" class="container">
      <div class="card">
        <div class="card-header border-0 pt-6">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bolder fs-3 mb-1">Edit User</span>
          </h3>
        </div>
        <div class="card-body">
          <UserForm 
            v-if="userFormData" 
            :initialData="userFormData" 
            @save="handleSave" 
          />
          <div v-else class="d-flex justify-content-center align-items-center" style="height: 200px;">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import UserForm from '@/components/Pages/User/UserForm.vue';
import { useToast } from 'vue-toastification';
import type { User, UserFormData } from '@/types/user';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const toast = useToast();

const userId = computed(() => parseInt(route.params.id as string));
const user = computed(() => userStore.getUserById(userId.value));

const userFormData = computed<UserFormData | null>(() => {
  if (!user.value) return null;
  
  return {
    name: user.value.name,
    username: user.value.username,
    email: user.value.email,
    role_id: user.value.role_id || 0, // Assuming role_id exists in the User type
    district_id: user.value.district_id,
    commune_id: user.value.commune_id,
    is_super_admin: user.value.is_super_admin,
    image: user.value.image,
    status: user.value.status
  };
});

onMounted(() => {
  if (!user.value) {
    toast.error('User not found');
    router.push({ name: 'user.index' });
  }
});

const handleSave = async (userData: UserFormData) => {
  if (!user.value) return;
  
  try {
    await userStore.updateUser(user.value.id, userData);
    toast.success('User updated successfully');
    router.push({ name: 'user.index' });
  } catch (error) {
    console.error('Error updating user:', error);
    toast.error('Failed to update user');
  }
};
</script>