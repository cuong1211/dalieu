<template>
    <div class="container my-8 w-100">
        <div class="row justify-content-center">
            <div class="col-lg-12">
                <!-- Search Card -->
                <div class="card mb-6">
                    <div class="card-body py-8 px-lg-10">
                        <div class="text-center mb-8">
                            <h2 class="fs-2hx fw-bold mb-3">Tra cứu lịch sử khám bệnh</h2>
                            <p class="text-gray-400 fs-6">
                                Nhập số CMND/CCCD để xem lịch sử khám bệnh của bạn
                            </p>
                        </div>
                        <form @submit.prevent="handleSearch">
                            <div class="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-4">
                                <div class="position-relative flex-grow-1">
                                    <span class="position-absolute top-50 translate-middle-y ms-4">
                                        <i class="bi bi-search fs-2 text-gray-500"></i>
                                    </span>
                                    <input type="text" v-model="searchQuery"
                                        class="form-control form-control-lg form-control-solid ps-14"
                                        placeholder="VD: 123456789" pattern="[0-9]*"
                                        :class="{ 'is-invalid': validationError }" />
                                    <div class="invalid-feedback" v-if="validationError">
                                        {{ validationError }}
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-lg btn-primary min-w-150px" :disabled="loading">
                                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"
                                        role="status"></span>
                                    <span>
                                        <i class="bi bi-search me-2"></i>
                                        Tìm kiếm
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Results Table -->
                <template v-if="searched">
                    <div v-if="loading" class="d-flex justify-content-center py-10">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Đang tải...</span>
                        </div>
                    </div>

                    <div v-else-if="error" class="alert alert-danger d-flex align-items-center p-5">
                        <i class="bi bi-exclamation-circle fs-2 me-4"></i>
                        <div class="d-flex flex-column">
                            <span>{{ error }}</span>
                        </div>
                    </div>

                    <template v-else>
                        <!-- Patient Info Card -->
                        <div v-if="patients.length > 0" class="card">
                            <div class="card-header border-0 pt-6">
                                <div class="card-title">
                                    <div class="d-flex align-items-center position-relative">
                                        <i class="bi bi-journal-medical fs-1 text-primary me-4"></i>
                                        <div>
                                            <h3 class="fw-bold m-0">Lịch sử khám bệnh</h3>
                                            <span class="text-gray-400 mt-1">
                                                Tìm thấy {{ patients.length }} kết quả cho CMND/CCCD: {{ searchQuery }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div v-else class="alert alert-info d-flex align-items-center p-5">
                            <i class="bi bi-info-circle fs-2 me-4"></i>
                            <div class="d-flex flex-column">
                                <span>Không tìm thấy thông tin bệnh nhân với CMND/CCCD đã nhập</span>
                            </div>
                        </div>
                    </template>
                </template>

            </div>

        </div>
    </div>
    <div v-if="patients.length > 0" class="card-body py-0">
        <div class="table-responsive w-100">
            <table class="table table-hover table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                <thead>
                    <tr class="fw-bold text-muted bg-light">
                        <th class="ps-4 min-w-25px">#</th>
                        <th class="min-w-150px">Họ tên</th>
                        <th class="min-w-125px">CMND/CCCD</th>
                        <th class="min-w-50px">Tuổi</th>
                        <th class="min-w-100px">Giới tính</th>
                        <th class="min-w-125px">Điện thoại</th>
                        <th class="min-w-200px">Triệu chứng</th>
                        <th class="min-w-200px">Kết quả</th>
                        <th class="min-w-150px">Ngày khám</th>
                        <th class="min-w-100px text-end pe-4">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(patient, index) in patients" :key="patient.id">
                        <td class="ps-4">
                            <span class="text-dark fw-semibold">{{ index + 1 }}</span>
                        </td>
                        <td>
                            <span class="text-dark fw-semibold">{{ patient.name }}</span>
                        </td>
                        <td>
                            <span>{{ patient.identification }}</span>
                        </td>
                        <td>{{ patient.age }}</td>
                        <td>
                            <span :class="patient.gender === 'male' ? 'badge-light-primary' : 'badge-light-success'"
                                class="badge">
                                {{ patient.gender === 'male' ? 'Nam' : 'Nữ' }}
                            </span>
                        </td>
                        <td>
                            <span class="text-primary">{{ patient.phone }}</span>
                        </td>
                        <td>
                            <span>{{ truncateText(patient.symptom, 50) }}</span>
                        </td>
                        <td>
                            <span>{{ truncateText(patient.result, 50) }}</span>
                        </td>
                        <td>
                            <div class="d-flex align-items-center text-gray-600">
                                <i class="bi bi-calendar-event me-2"></i>
                                {{ formatDate(patient.created_at) }}
                            </div>
                        </td>
                        <td class="text-end pe-4">
                            <button class="btn btn-icon btn-light-primary btn-sm" @click="showDetails(patient.id)">
                                <i class="bi bi-eye"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <DetailModal v-if="showModal" :patient-id="selectedPatientId" @close="closeModal" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { api } from '@/utils/api';
import DetailModal from './DetailModal.vue';
import DiagnosisPrintForm from '../Request/DiagnosisPrintForm.vue';
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
const showModal = ref(false);
const selectedPatientId = ref<number | null>(null);

const showDetails = (patientId: number) => {
    selectedPatientId.value = patientId;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    selectedPatientId.value = null;
};
const searchQuery = ref('');
const loading = ref(false);
const error = ref<string | null>(null);
const patients = ref<Patient[]>([]);
const searched = ref(false);
const validationError = ref<string | null>(null);

const handleSearch = async () => {
    validationError.value = null;
    error.value = null;

    if (!searchQuery.value) {
        validationError.value = 'Vui lòng nhập số CMND/CCCD';
        return;
    }

    loading.value = true;
    searched.value = true;

    try {
        const response = await api.get<Patient[]>(`/patients`, {
            params: { search: searchQuery.value }
        });
        patients.value = response.data;
    } catch (err: any) {
        error.value = err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại';
        patients.value = [];
    } finally {
        loading.value = false;
    }
};

const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const truncateText = (text: string, length: number): string => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
};
</script>

<style scoped>
.min-w-150px {
    min-width: 150px;
}

.min-w-125px {
    min-width: 125px;
}

.min-w-100px {
    min-width: 100px;
}

.min-w-50px {
    min-width: 50px;
}

.min-w-25px {
    min-width: 25px;
}

.min-w-200px {
    min-width: 200px;
}

.ps-14 {
    padding-left: 3.5rem !important;
}

.form-control.is-invalid {
    background-image: none;
}

.badge {
    padding: 0.5em 0.85em;
    font-weight: 500;
}

.badge-light-primary {
    color: #009ef7;
    background-color: #f1faff;
}

.badge-light-success {
    color: #50cd89;
    background-color: #e8fff3;
}

.table> :not(caption)>*>* {
    padding: 1rem;
}

.table-responsive {
    max-height: 600px;
    overflow-y: auto;
}

::-webkit-scrollbar {
    width: 5px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>