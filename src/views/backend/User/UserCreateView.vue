<template>
    <div class="post d-flex flex-column-fluid" id="kt_post">
      <div id="kt_content_container" class="container">
        <div class="card">
          <div class="card-header border-0 pt-6">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bolder fs-3 mb-1">Add New User</span>
            </h3>
          </div>
          <div class="card-body">
            <UserForm @save="handleSave" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/userStore';
  import UserForm from '@/components/Pages/User/UserForm.vue';
  import { useToast } from 'vue-toastification';
  import type { UserFormData } from '@/types/user';
  
  const router = useRouter();
  const userStore = useUserStore();
  const toast = useToast();
  
  const handleSave = async (userData: UserFormData) => {
    try {
      await userStore.createUser(userData);
      toast.success('User created successfully');
      router.push({ name: 'user.index' });
    } catch (error) {
      toast.error('Failed to create user');
    }
  };
  </script>