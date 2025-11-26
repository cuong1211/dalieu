<template>
  <div class="apple-user-form-container">

    <!-- Form Content -->
    <form @submit.prevent="handleSubmit" class="form-content">
      <!-- Account Info Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="section-icon">
            <i class="bi bi-person-fill"></i>
          </div>
          <h3 class="section-title">Thông tin tài khoản</h3>
        </div>

        <div class="form-group-grid">
          <div class="form-group">
            <label class="form-label">Tên <span class="required">*</span></label>
            <input v-model="form.name" type="text" class="form-input" placeholder="Nhập tên"
              :class="{ 'form-input-error': errors.name }" @input="handleInput('name')" />
            <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">Tên đăng nhập <span class="required">*</span></label>
            <input v-model="form.username" type="text" class="form-input" placeholder="Nhập tên đăng nhập"
              :class="{ 'form-input-error': errors.username }" @input="handleInput('username')" />
            <span v-if="errors.username" class="error-text">{{ errors.username }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">Email <span class="required">*</span></label>
            <input v-model="form.email" type="email" class="form-input" placeholder="Nhập email"
              :class="{ 'form-input-error': errors.email }" @input="handleInput('email')" />
            <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
          </div>

          <div v-if="!isEditing" class="form-group">
            <label class="form-label">Mật khẩu <span class="required">*</span></label>
            <input v-model="form.password" type="password" class="form-input" placeholder="Nhập mật khẩu"
              :class="{ 'form-input-error': errors.password }" @input="handleInput('password')" />
            <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
          </div>
        </div>
      </div>

      <!-- Settings Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="section-icon settings">
            <i class="bi bi-gear"></i>
          </div>
          <h3 class="section-title">Cài đặt</h3>
        </div>

        <div class="form-group-grid">
          <div class="form-group">
            <label class="form-label">Trạng thái</label>
            <select v-model="form.status" class="form-input form-select">
              <option :value="true">Hoạt động</option>
              <option :value="false">Không hoạt động</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Quyền Admin</label>
            <div class="checkbox-wrapper">
              <input v-model="form.is_super_admin" type="checkbox" id="isAdmin" class="form-checkbox" />
              <label for="isAdmin" class="checkbox-label">Là Admin của hệ thống</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <router-link to="/user" class="btn-cancel">
          <i class="bi bi-x-lg"></i>
          <span>Hủy</span>
        </router-link>
        <button type="submit" class="btn-submit" :disabled="loading">
          <span v-if="loading" class="spinner-small"></span>
          <i v-else class="bi bi-check-lg"></i>
          <span>{{ isEditing ? 'Cập nhật' : 'Tạo mới' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRoleStore } from '@/stores/roleStore';
import { useValidation } from '@/utils/validation';
import type { UserFormData } from '@/types/user';
import type { Role } from '@/types/role';

const props = defineProps<{
  initialData?: UserFormData;
}>();

const emit = defineEmits<{
  (e: 'save', data: UserFormData): void;
}>();

const userStore = useUserStore();
const roleStore = useRoleStore();

const form = ref<UserFormData>({
  id: undefined,
  name: '',
  username: '',
  email: '',
  password: '',
  role_id: 0,
  district_id: 0,
  commune_id: 0,
  is_super_admin: false,
  image: null,
  status: true,
});

const newPassword = ref('');

const isEditing = computed(() => !!props.initialData);

const { errors, validateForm: baseValidateForm, validateField, handleInput } = useValidation(form);

const validateForm = () => {
  return baseValidateForm();
};

const loading = computed(() => userStore.loading || roleStore.loading);
const districts = computed(() => userStore.districts);
const roles = computed(() => roleStore.roles);

const selectedDistrict = computed(() =>
  userStore.getDistrictById(form.value.district_id)
);

onMounted(async () => {
  try {
    await Promise.all([
      userStore.fetchDistrictsIfNeeded(),
      roleStore.fetchRolesIfNeeded()
    ]);
    if (props.initialData) {
      form.value = { ...form.value, ...props.initialData };
    }
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error);
  }
});

const handleDistrictChange = () => {
  form.value.commune_id = 0;
  validateField('district_id');
  errors.value.commune_id = '';
};

const handleSubmit = () => {
  if (validateForm()) {
    const dataToSubmit = { ...form.value };
    if (isEditing.value) {
      delete dataToSubmit.password;
    }
    emit('save', dataToSubmit);
  }
};


watch(() => props.initialData, (newValue) => {
  if (newValue) {
    form.value = { ...form.value, ...newValue };
  }
}, { immediate: true, deep: true });
</script>

<style scoped>
/* Container */
.apple-user-form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

/* Header */
.form-header {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #4caf50;
}

.header-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
  letter-spacing: -0.02em;
}

.header-subtitle {
  font-size: 0.875rem;
  color: #86868b;
  margin: 0.25rem 0 0 0;
  font-weight: 400;
}

/* Form Content */
.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Form Section */
.form-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.section-icon {
  width: 36px;
  height: 36px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  color: #4caf50;
}

.section-icon.location {
  background: rgba(33, 150, 243, 0.1);
  color: #1976d2;
}

.section-icon.settings {
  background: rgba(156, 39, 176, 0.1);
  color: #7b1fa2;
}

.section-title {
  color: #1d1d1f;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.01em;
}

/* Form Groups */
.form-group-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1d1d1f;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.required {
  color: #ef4444;
  font-weight: 600;
}

/* Form Input */
.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  border: 1.5px solid #d5d5d7;
  border-radius: 8px;
  background: #ffffff;
  color: #1d1d1f;
  font-family: inherit;
  transition: all 0.2s ease;
  outline: none;
}

.form-input:hover,
.form-select:hover {
  border-color: #b0b0b5;
}

.form-input:focus,
.form-select:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.form-input-error,
.form-select.form-input-error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.02);
}

.form-input-error:focus,
.form-select.form-input-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-input::placeholder {
  color: #86868b;
}

/* Checkbox */
.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #f5f5f7;
  border-radius: 8px;
}

.form-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4caf50;
}

.checkbox-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1d1d1f;
  cursor: pointer;
}

/* Error Text */
.error-text {
  font-size: 0.8125rem;
  color: #ef4444;
  font-weight: 500;
  margin-top: 0.25rem;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.btn-cancel,
.btn-submit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
  text-decoration: none;
}

.btn-cancel {
  background: rgba(0, 0, 0, 0.04);
  color: #1d1d1f;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.btn-cancel:hover {
  background: rgba(0, 0, 0, 0.08);
}

.btn-cancel:active {
  transform: scale(0.98);
}

.btn-submit {
  background: #4caf50;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-submit i,
.btn-cancel i {
  font-size: 1rem;
}

/* Loading Spinner */
.spinner-small {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .apple-user-form-container {
    gap: 1.25rem;
  }

  .form-header,
  .form-section {
    padding: 1.25rem;
  }

  .header-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .header-subtitle {
    font-size: 0.8125rem;
  }

  .form-group-grid {
    grid-template-columns: 1fr;
    gap: 0.875rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .apple-user-form-container {
    gap: 1rem;
  }

  .form-header,
  .form-section {
    padding: 1rem;
  }

  .header-title {
    font-size: 1.25rem;
  }

  .section-title {
    font-size: 1rem;
  }

  .form-label {
    font-size: 0.8125rem;
  }

  .form-input,
  .form-select {
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
  }

  .btn-cancel,
  .btn-submit {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
  }
}
</style>