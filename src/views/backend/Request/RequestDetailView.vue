```vue
<template>
    <div class="card">
        <!-- Header -->
        <div class="card-header border-0 pt-6">
            <div class="card-title">
                <h3 class="fw-bolder">Chi tiết bệnh nhân</h3>
            </div>
            <div class="card-toolbar">
                <button class="btn btn-light-primary" @click="router.back()">
                    <i class="bi bi-arrow-left me-2"></i>
                    Quay lại
                </button>
            </div>
        </div>

        <!-- Loading state -->
        <template v-if="loading">
            <div class="card-body">
                <LoadingSpinner />
            </div>
        </template>

        <!-- Content -->
        <template v-else-if="patient">
            <div class="card-body">
                <!-- Thông tin cá nhân -->
                <div class="mb-8">
                    <h4 class="fw-bold text-gray-800 mb-5">Thông tin cá nhân</h4>
                    <div class="row g-5">
                        <div class="col-md-6">
                            <div class="fw-semibold text-gray-600 mb-2">Họ và tên</div>
                            <div class="fw-bold fs-5">{{ patient.name }}</div>
                        </div>
                        <div class="col-md-6">
                            <div class="fw-semibold text-gray-600 mb-2">CMND/CCCD</div>
                            <div class="fw-bold fs-5">{{ patient.identification }}</div>
                        </div>
                        <div class="col-md-6">
                            <div class="fw-semibold text-gray-600 mb-2">Tuổi</div>
                            <div class="fw-bold fs-5">{{ patient.age }}</div>
                        </div>
                        <div class="col-md-6">
                            <div class="fw-semibold text-gray-600 mb-2">Giới tính</div>
                            <div class="fw-bold fs-5">{{ formatGender(patient.gender) }}</div>
                        </div>
                        <div class="col-md-6">
                            <div class="fw-semibold text-gray-600 mb-2">Số điện thoại</div>
                            <div class="fw-bold fs-5">{{ patient.phone }}</div>
                        </div>
                        <div class="col-md-6">
                            <div class="fw-semibold text-gray-600 mb-2">Địa chỉ</div>
                            <div class="fw-bold fs-5">{{ patient.address }}</div>
                        </div>
                    </div>
                </div>

                <!-- Thông tin khám bệnh -->
                <div class="mb-8">
                    <h4 class="fw-bold text-gray-800 mb-5">Thông tin khám bệnh</h4>
                    <div class="row g-5">
                        <div class="col-12">
                            <div class="fw-semibold text-gray-600 mb-2">Triệu chứng</div>
                            <div class="fw-bold fs-5">{{ patient.symptom }}</div>
                        </div>
                        <div class="col-12">
                            <div class="fw-semibold text-gray-600 mb-2">Kết quả chẩn đoán</div>
                            <div class="fw-bold fs-5" v-if="patient.result">{{ patient.result }}</div>
                            <div class="text-muted fs-6" v-else>Chưa có kết quả chẩn đoán</div>
                        </div>
                        <div class="col-md-6">
                            <div class="fw-semibold text-gray-600 mb-2">Ngày khám</div>
                            <div class="fw-bold fs-5">{{ formatDate(patient.created_at) }}</div>
                        </div>
                    </div>
                </div>

                <!-- Hình ảnh -->
                <div v-if="patient.file_id" class="mb-8">
                    <h4 class="fw-bold text-gray-800 mb-5">Hình ảnh</h4>
                    <div class="text-center position-relative image-container">
                        <img :src="getImageUrl(patient.file_id)" :alt="patient.name"
                            class="img-fluid rounded cursor-pointer hover-overlay" @click="showFullImage"
                            :class="{ 'loading': imageLoading }" @load="handleImageLoad" />
                        <div v-if="imageLoading" class="image-loading">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- Image Modal -->
        <div class="modal fade" id="imageModal" tabindex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="imageModalLabel">Hình ảnh chi tiết</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center p-0">
                        <img v-if="patient?.file_id" :src="getImageUrl(patient.file_id)" :alt="patient?.name"
                            class="img-fluid" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRequestStore } from '@/stores/requestStore';
import { Modal } from 'bootstrap';
import LoadingSpinner from '@/components/Form/LoadingSpinner.vue';
import { formatDate } from '@/utils/dateUtils';
interface Patient {
    id: number;
    identification: string;
    name: string;
    age: number;
    gender: string;
    phone: string;
    address: string;
    symptom: string;
    result: string | null;
    created_at: string;
    updated_at: string | null;
    file_id: string;
}

const route = useRoute();
const router = useRouter();
const store = useRequestStore();

const patient = ref<Patient | null>(null);
const loading = ref(true);
const imageLoading = ref(true);
let imageModal: Modal | null = null;

const formatGender = (gender: string): string => {
    const genderMap: Record<string, string> = {
        'male': 'Nam',
        'female': 'Nữ',
        'other': 'Khác'
    };
    return genderMap[gender] || gender;
};

const getImageUrl = (fileId: string): string => {
    return `${import.meta.env.VITE_API_URL}/files/${fileId}`;
};

const showFullImage = (): void => {
    imageModal?.show();
};

const handleImageLoad = (): void => {
    imageLoading.value = false;
};

const initializeModal = (): void => {
    const modalElement = document.getElementById('imageModal');
    if (modalElement) {
        imageModal = new Modal(modalElement, {
            keyboard: true,
            focus: true
        });
    }
};

onMounted(async () => {
    try {
        const id = parseInt(route.params.id as string);
        patient.value = await store.fetchRequestById(id);
        initializeModal();
    } catch (error) {
        console.error('Error fetching patient:', error);
    } finally {
        loading.value = false;
    }
});

onUnmounted(() => {
    imageModal?.dispose();
});
</script>

<style scoped>
.image-container {
    max-width: 400px;
    margin: 0 auto;
    min-height: 200px;
}

.hover-overlay {
    transition: all 0.3s ease;
}

.hover-overlay:hover {
    opacity: 0.8;
    transform: scale(1.02);
}

.loading {
    opacity: 0.6;
}

.cursor-pointer {
    cursor: pointer;
}

.image-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* Modal styling */
:deep(.modal-content) {
    background-color: transparent;
    border: none;
}

:deep(.modal-header) {
    background-color: white;
    border-bottom: 1px dashed #e4e6ef;
    border-top-left-radius: 0.75rem;
    border-top-right-radius: 0.75rem;
}

:deep(.modal-body) {
    background-color: white;
    border-bottom-left-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
}

:deep(.modal-body img) {
    max-height: 80vh;
    object-fit: contain;
    border-radius: 0.5rem;
}

:deep(.btn-close) {
    background-color: #f1f1f4;
    padding: 0.5rem;
    margin: 0.5rem;
    border-radius: 0.475rem;
}

:deep(.btn-close:hover) {
    background-color: #d9d9e0;
}

/* Responsive */
@media (max-width: 768px) {
    .image-container {
        max-width: 100%;
    }

    :deep(.modal-dialog) {
        margin: 0.5rem;
    }
}
</style>
```