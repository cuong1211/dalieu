<template>
    <div class="paper-container">
        <div class="paper-content">
            <form class="appointment-form" @submit.prevent="handleSubmit" novalidate>
                <!-- Thông tin cá nhân -->
                <FormCard title="Thông tin cá nhân">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <FormInput v-model="form.name" label="Họ và tên" placeholder="Nhập họ và tên"
                                :error="errors.name" required @input="(value) => handleInput('name', value)" />
                        </div>

                        <div class="col-md-6">
                            <FormDateTimePicker v-model="form.birthday" label="Ngày sinh"
                                placeholder="Chọn hoặc nhập ngày sinh" :error="errors.birthday"
                                :yearRange="[1900, 2024]" />
                        </div>

                        <div class="col-md-6">
                            <FormSelect v-model="form.gender" label="Giới tính" placeholder="Chọn giới tính"
                                :options="genderOptions" :error="errors.gender" required
                                @change="(value) => handleInput('gender', value)" />
                        </div>

                        <div class="col-md-6">
                            <FormInput v-model="form.id_number" label="Số CCCD" placeholder="Nhập số CCCD" type="number"
                                maxlength="12" :error="errors.id_number" required @input="handleIdentityNumberInput" />
                        </div>

                        <div class="col-md-6">
                            <FormInput v-model="form.phone" label="Số điện thoại" placeholder="Nhập số điện thoại"
                                type="tel" :error="errors.phone" required
                                @input="(value) => handleInput('phone', value)" />
                        </div>

                        <div class="col-md-6">
                            <FormInput v-model="form.email" label="Email" placeholder="Nhập địa chỉ email" type="email"
                                :error="errors.email" @input="(value) => handleInput('email', value)" />
                        </div>

                        <div class="col-12">
                            <FormInput v-model="form.address" label="Địa chỉ" placeholder="Nhập địa chỉ hiện tại"
                                :error="errors.address" required @input="(value) => handleInput('address', value)" />
                        </div>
                    </div>
                </FormCard>

                <!-- Thông tin triệu chứng -->
                <FormCard title="Thông tin triệu chứng" class="mt-4">
                    <div class="row g-4">
                        <div class="col-12">
                            <FormTextarea v-model="form.symptoms" label="Mô tả triệu chứng"
                                placeholder="Mô tả chi tiết các triệu chứng bạn đang gặp phải" :error="errors.symptoms"
                                :rows="4" required @input="(value) => handleInput('symptoms', value)" />
                        </div>

                        <div class="col-12">
                            <ImageUploader v-model="form.image" label="Hình ảnh triệu chứng" :error="errors.image"
                                required @file-changed="handleImageChanged" />
                        </div>
                    </div>
                </FormCard>

                <!-- Submit button -->
                <div class="form-actions">
                    <button type="submit" class="submit-button">
                        <i class="bi bi-send"></i>
                        Gửi yêu cầu
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { DermatologyRequestForm } from '@/types/request';
import ImageUploader from '@/components/ImageUploader/ImageUploader.vue';
import FormCard from '@/components/Form/FormCard.vue';
import FormInput from '@/components/Form/FormInput.vue';
import FormTextarea from '@/components/Form/FormTextarea.vue';
import FormSelect from '@/components/Form/FormSelect.vue';
import FormDateTimePicker from '@/components/Form/FormDateTimePicker/FormDateTimePicker.vue';
import { useRequestValidation } from '@/utils/validations/requestValidation';
import { useRequestStore } from '@/stores/requestStore';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();
const requestStore = useRequestStore();
const imageUploader = ref<InstanceType<typeof ImageUploader> | null>(null);


const initialFormData: DermatologyRequestForm = {
    id: 0,
    name: '',
    birthday: '',
    gender: 'other',
    id_number: '',
    phone: '',
    email: '',
    address: '',
    symptoms: '',
    image: null, // Khởi tạo null
};

const form = ref<DermatologyRequestForm>(initialFormData);

const genderOptions = [
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
    { value: 'other', label: 'Khác' }
];

const { errors, validateForm, handleInput } = useRequestValidation(form);

// Xử lý validate số CCCD
const handleIdentityNumberInput = (value: string | number) => {
    // Chỉ cho phép nhập số và giới hạn 12 kí tự
    const numbersOnly = String(value).replace(/\D/g, '').slice(0, 12);
    form.value.id_number = numbersOnly;
    handleInput('id_number', numbersOnly);

    // Validate số CCCD
    if (numbersOnly.length !== 12) {
        errors.value.id_number = 'Số CCCD phải đủ 12 số';
    } else {
        errors.value.id_number = '';
    }
};

const handleSubmit = async () => {
    // Validate CCCD trước khi submit
    if (form.value.id_number.length !== 12) {
        errors.value.id_number = 'Số CCCD phải đủ 12 số';
        return;
    }

    if (validateForm()) {
        try {
            const formData = new FormData();

            // Thêm các trường thông tin vào FormData
            Object.entries(form.value).forEach(([key, value]) => {
                if (key === 'image' && value instanceof File) {
                    formData.append('image', value);
                } else if (key !== 'image') {
                    formData.append(key, String(value));
                }
            });

            const response = await requestStore.createRequest(formData);
            toast.success('Đăng ký khám thành công');
            router.push({
                name: 'request-success',
                params: { id: response.data.id }
            });
        } catch (error) {
            console.error('Lỗi khi tạo yêu cầu:', error);
            toast.error('Đăng ký khám thất bại. Vui lòng thử lại.');
        }
    }
};

const handleImageChanged = (file: File | null) => {
    form.value.image = file;
    handleInput('image', file);
};

</script>

<style scoped>
.paper-container {
    padding: 2rem;
    background-color: #f8fafc;
    min-height: 100vh;
}

.paper-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    max-width: 960px;
    margin: 0 auto;
    padding: 2rem;
}

.appointment-form {
    width: 100%;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e2e8f0;
}

.submit-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.submit-button:hover {
    background-color: #2563eb;
}

.submit-button:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .paper-container {
        padding: 1rem;
    }

    .paper-content {
        padding: 1.5rem;
    }

    .form-actions {
        margin-top: 1.5rem;
    }

    .submit-button {
        width: 100%;
        justify-content: center;
    }
}
</style>