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
                <div class="form-actions" v-if="!diagnosisResult">
                    <button type="submit" class="submit-button" :disabled="isProcessing">
                        <template v-if="isProcessing">
                            <i class="bi bi-arrow-repeat loading-icon"></i>
                            Đang xử lý...
                        </template>
                        <template v-else>
                            <i class="bi bi-send"></i>
                            Gửi yêu cầu
                        </template>
                    </button>
                </div>
            </form>
            <div v-if="diagnosisResult" class="diagnosis-section">
                <FormCard title="Kết quả chẩn đoán">
                    <div class="diagnosis-content">
                        <!-- Kết quả chẩn đoán -->
                        <div class="result-box mb-4">
                            <h5 class="result-title">
                                <i class="bi bi-clipboard2-pulse me-2"></i>
                                Kết luận
                            </h5>
                            <p class="result-text">{{ diagnosisResult.data.result }}</p>
                        </div>

                        <!-- Danh sách bệnh liên quan -->
                        <div class="diseases-box">
                            <h5 class="diseases-title">
                                <i class="bi bi-link-45deg me-2"></i>
                                Bệnh liên quan
                            </h5>
                            <div class="diseases-grid">
                                <router-link v-for="disease in relatedDiseases" :key="disease.id"
                                    :to="{ name: 'disease.detail', params: { id: disease.id } }" class="disease-card">
                                    <div class="disease-icon">
                                        <i class="bi bi-journal-medical"></i>
                                    </div>
                                    <div class="disease-info">
                                        <h6 class="disease-name">{{ disease.name }}</h6>
                                        <span class="view-detail">
                                            Xem chi tiết
                                            <i class="bi bi-arrow-right ms-1"></i>
                                        </span>
                                    </div>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </FormCard>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
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
import { mockApiService } from '@/stores/mockApi';
import type { RequestResponse, DiseaseInfo } from '@/types/request';
const isProcessing = ref(false);
const diagnosisResult = ref<RequestResponse | null>(null);

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

const relatedDiseases = computed(() => {
    if (!diagnosisResult.value?.data.info.sub) return [];
    return diagnosisResult.value.data.info.sub.flat();
});

const handleSubmit = async () => {
    if (form.value.id_number.length !== 12) {
        errors.value.id_number = 'Số CCCD phải đủ 12 số';
        return;
    }

    if (validateForm()) {
        try {
            isProcessing.value = true;

            // Gọi mock API service
            const response = await mockApiService.submitRequest(form.value);

            // Lưu kết quả
            diagnosisResult.value = response;

            toast.success(response.message);
        } catch (error) {
            console.error('Lỗi khi tạo yêu cầu:', error);
            toast.error('Đăng ký khám thất bại. Vui lòng thử lại.');
        } finally {
            isProcessing.value = false;
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

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.loading-content {
    text-align: center;
    padding: 2rem;
}

.loading-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #e2e8f0;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.loading-text {
    font-size: 1.125rem;
    color: #1e293b;
    margin: 0;
}

.loading-subtext {
    font-size: 0.875rem;
    color: #64748b;
}

.loading-icon {
    animation: spin 1s linear infinite;
}

.diagnosis-section {
    margin-top: 2rem;
    animation: fadeIn 0.5s ease-out;
}

.result-box,
.diseases-box {
    background-color: #f8fafc;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
}

.result-title,
.diseases-title {
    display: flex;
    align-items: center;
    font-size: 1.125rem;
    color: #1e293b;
    margin-bottom: 1rem;
}

.result-text {
    color: #334155;
    line-height: 1.6;
    margin: 0;
}

.diseases-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
}

.disease-card {
    display: flex;
    align-items: center;
    padding: 1rem;
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.2s ease;
}

.disease-card:hover {
    border-color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.disease-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #eff6ff;
    color: #3b82f6;
    border-radius: 8px;
    margin-right: 1rem;
}

.disease-info {
    flex: 1;
}

.disease-name {
    margin: 0;
    color: #1e293b;
    font-size: 1rem;
}

.view-detail {
    font-size: 0.875rem;
    color: #3b82f6;
    display: flex;
    align-items: center;
    margin-top: 0.25rem;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.submit-button:disabled {
    background-color: #94a3b8;
    cursor: not-allowed;
}
</style>