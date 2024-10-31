<template>
  <form @submit.prevent="handleSubmit" class="row g-3">
    <div class="col-md-6">
      <div class="fv-row mb-7">
        <label for="name" class="form-label ">Tên</label>
        <input id="name" v-model="form.name" type="text" class="form-control form-control-solid" placeholder="Nhập tên"
          @input="handleInput('name')" />
        <span v-if="errors.name" class="text-danger">{{ errors.name }}</span>
      </div>
    </div>

    <div class="col-md-6">
      <div class="fv-row mb-7">
        <label for="username" class="form-label fw-bold">Tên đăng nhập</label>
        <input id="username" v-model="form.username" type="text" class="form-control form-control-solid"
          placeholder="Nhập tên đăng nhập" @input="handleInput('username')" />
        <span v-if="errors.username" class="text-danger">{{ errors.username }}</span>
      </div>
    </div>

    <div class="col-md-6">
      <div class="fv-row mb-7">
        <label for="email" class="form-label fw-bold">Email</label>
        <input id="email" v-model="form.email" type="email" class="form-control form-control-solid"
          placeholder="Nhập email" @input="handleInput('email')" />
        <span v-if="errors.email" class="text-danger">{{ errors.email }}</span>
      </div>
    </div>

    <div class="col-md-6">
      <div class="fv-row mb-7">
        <label for="role" class="form-label fw-bold">Vai trò</label>
        <select id="role" v-model="form.role_id" class="form-select form-select-solid" @change="handleInput('role_id')">
          <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
        </select>
        <span v-if="errors.role_id" class="text-danger">{{ errors.role_id }}</span>
      </div>
    </div>

    <div class="col-md-6">
      <div class="fv-row mb-7">
        <label for="district" class="form-label fw-bold">Huyện</label>
        <select id="district" v-model="form.district_id" class="form-select form-select-solid"
          @change="handleDistrictChange">
          <option v-for="district in districts" :key="district.id" :value="district.id">{{ district.name }}</option>
        </select>
        <span v-if="errors.district_id" class="text-danger">{{ errors.district_id }}</span>
      </div>
    </div>
    <div v-if="selectedDistrict" class="col-md-6">
      <div class="fv-row mb-7">
        <label for="commune" class="form-label fw-bold">Xã</label>
        <select id="commune" v-model="form.commune_id" class="form-select form-select-solid"
          @change="handleInput('commune_id')">
          <option v-for="commune in selectedDistrict.communes" :key="commune.commune_id" :value="commune.commune_id">{{
            commune.name }}</option>
        </select>
        <span v-if="errors.commune_id" class="text-danger">{{ errors.commune_id }}</span>
      </div>
    </div>

    <div class="col-md-6">
      <div class="fv-row mb-7">
        <label for="status" class="form-label fw-bold">Trạng thái</label>
        <select id="status" v-model="form.status" class="form-select form-select-solid">
          <option :value="true">Hoạt động</option>
          <option :value="false">Không hoạt động</option>
        </select>
      </div>
    </div>

    <div class="col-md-6">
      <div class="fv-row mb-7 d-flex align-items-center">
        <div class="form-check form-switch form-check-custom form-check-solid">
          <input v-model="form.is_super_admin" class="form-check-input h-30px w-50px" type="checkbox" id="isAdmin" />
          <label class="form-check-label fw-bold" for="isAdmin">Là Admin</label>
        </div>
      </div>
    </div>

    <div v-if="!isEditing" class="col-md-6">
      <div class="fv-row mb-7">
        <label for="password" class="form-label fw-bold">Mật khẩu</label>
        <input id="password" v-model="form.password" type="password" class="form-control form-control-solid"
          placeholder="Nhập mật khẩu" @input="handleInput('password')" />
        <span v-if="errors.password" class="text-danger">{{ errors.password }}</span>
      </div>
    </div>
    <div class="col-12 text-center pt-15">
      <button type="submit" class="btn btn-primary me-3" :disabled="loading">
        <span class="indicator-label">{{ isEditing ? 'Cập nhật' : 'Tạo mới' }}</span>
      </button>
      <router-link to="/user" class="btn btn-light">Hủy</router-link>
    </div>
  </form>
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