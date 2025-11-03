<template>
    <div class="patient-search-container">
        <!-- Header Section -->
        <div class="search-header">
            <div class="header-content">
                <h1 class="header-title">
                    <i class="bi bi-search" style="color: white;"></i>
                    Tra cứu lịch sử khám bệnh
                </h1>
                <p class="header-subtitle">Nhập số CMND/CCCD để xem lịch sử khám bệnh của bạn</p>
            </div>
        </div>

        <div class="search-wrapper">
            <!-- Search Card -->
            <div class="search-card">
                <form @submit.prevent="handleSearch">
                    <div class="search-form-group">
                        <div class="search-input-wrapper">
                            <i class="bi bi-search search-icon"></i>
                            <input
                                type="text"
                                v-model="searchQuery"
                                class="search-input"
                                placeholder="VD: 123456789"
                                pattern="[0-9]*"
                                :class="{ 'is-invalid': validationError }"
                            />
                            <div class="validation-error" v-if="validationError">
                                <i class="bi bi-exclamation-circle"></i>
                                {{ validationError }}
                            </div>
                        </div>
                        <button type="submit" class="search-button" :disabled="loading">
                            <span v-if="loading" class="button-loading">
                                <i class="bi bi-hourglass-split"></i>
                            </span>
                            <span v-else>
                                <i class="bi bi-search" style="color: white;"></i>
                            </span>
                            <span class="button-text">{{ loading ? 'Đang tìm...' : 'Tìm kiếm' }}</span>
                        </button>
                    </div>
                </form>
            </div>

            <!-- Results Section -->
            <template v-if="searched">
                <!-- Loading State -->
                <div v-if="loading" class="results-loading">
                    <div class="spinner">
                        <div class="spinner-ring"></div>
                        <p>Đang tìm kiếm...</p>
                    </div>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="error-alert">
                    <i class="bi bi-exclamation-triangle"></i>
                    <div>
                        <h4>Lỗi tìm kiếm</h4>
                        <p>{{ error }}</p>
                    </div>
                </div>

                <!-- Results -->
                <template v-else>
                    <!-- Results Header -->
                    <div v-if="patients.length > 0" class="results-header">
                        <i class="bi bi-check-circle"></i>
                        <div>
                            <h3>Kết quả tìm kiếm</h3>
                            <p>Tìm thấy <strong>{{ patients.length }}</strong> kết quả cho CMND/CCCD: <strong>{{ searchQuery }}</strong></p>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else class="empty-state">
                        <i class="bi bi-inbox"></i>
                        <h3>Không tìm thấy kết quả</h3>
                        <p>Không có thông tin bệnh nhân với CMND/CCCD đã nhập. Vui lòng kiểm tra lại.</p>
                    </div>

                    <!-- Results Table -->
                    <div v-if="patients.length > 0" class="table-wrapper">
                        <div class="table-responsive">
                            <table class="results-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Họ tên</th>
                                        <th>CMND/CCCD</th>
                                        <th>Tuổi</th>
                                        <th>Giới tính</th>
                                        <th>Điện thoại</th>
                                        <th>Triệu chứng</th>
                                        <th>Kết quả</th>
                                        <th>Ngày khám</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(patient, index) in patients" :key="patient.id">
                                        <td class="row-number">{{ index + 1 }}</td>
                                        <td class="patient-name">
                                            <strong>{{ patient.name }}</strong>
                                        </td>
                                        <td class="patient-id">{{ patient.identification }}</td>
                                        <td>{{ patient.age }}</td>
                                        <td>
                                            <span :class="patient.gender === 'Nam' ? 'gender-badge-male' : 'gender-badge-female'"
                                                class="gender-badge">
                                                {{ patient.gender}}
                                            </span>
                                        </td>
                                        <td class="phone-number">{{ patient.phone }}</td>
                                        <td class="truncate">{{ truncateText(patient.symptom, 50) }}</td>
                                        <td class="truncate">{{ truncateText(patient.result || '', 50) }}</td>
                                        <td class="date-cell">
                                            <i class="bi bi-calendar-event"></i>
                                            {{ formatDate(patient.created_at) }}
                                        </td>
                                        <td class="action-cell">
                                            <button class="view-button" @click="showDetails(patient.id)" title="Xem chi tiết">
                                                <i class="bi bi-eye"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </template>
            </template>
        </div>
    </div>

    <DetailModal v-if="showModal" :patient-id="selectedPatientId" @close="closeModal" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { api } from '@/utils/api';
import DetailModal from './DetailModal.vue';
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
/* Main Container */
.patient-search-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #f0fdfb 100%);
}

/* Header */
.search-header {
    background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
    padding: 1.2rem 2rem;
    box-shadow: 0 4px 20px rgba(26, 188, 156, 0.15);
}

.header-content {
    max-width: 1200px;
    margin: 0 auto;
}

.header-title {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 800;
    color: white;
    display: flex;
    align-items: center;
    gap: 1rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-title i {
    font-size: 2.8rem;
}

.header-subtitle {
    margin: 0.75rem 0 0 0;
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 300;
}

/* Wrapper */
.search-wrapper {
    /* max-width: 1200px; */
    margin: 0 auto;
    padding: 3rem 2rem;
}

/* Search Card */
.search-card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 2px 12px rgba(26, 188, 156, 0.08);
    border: 1px solid #e2e8f0;
    margin-bottom: 3rem;
}

.search-form-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.search-input-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
}

.search-icon {
    position: absolute;
    left: 1.25rem;
    top: 1rem;
    font-size: 1.25rem;
    color: #1abc9c;
    pointer-events: none;
    z-index: 1;
}

.search-input {
    width: 100%;
    padding: 0.875rem 1rem 0.875rem 3.5rem;
    border: 2px solid #a7f3d0;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 500;
    outline: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: white;
    color: #1e293b;
}

.search-input::placeholder {
    color: #94a3b8;
}

.search-input:focus {
    border-color: #1abc9c;
    box-shadow: 0 0 0 3px rgba(26, 188, 156, 0.1);
    background: white;
}

.search-input.is-invalid {
    border-color: #dc2626;
}

.validation-error {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #dc2626;
    animation: slideDown 0.3s ease;
}

.validation-error i {
    font-size: 1rem;
    flex-shrink: 0;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Search Button */
.search-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    padding: 0.875rem 1.5rem;
    background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(26, 188, 156, 0.2);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.search-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(26, 188, 156, 0.3);
}

.search-button:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(26, 188, 156, 0.2);
}

.search-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.button-loading {
    display: inline-flex;
    align-items: center;
}

.button-loading i {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.button-text {
    display: inline-block;
}

/* Results Loading */
.results-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    margin-bottom: 2rem;
}

.spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
}

.spinner-ring {
    width: 48px;
    height: 48px;
    border: 4px solid #a7f3d0;
    border-top-color: #1abc9c;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.spinner p {
    color: #64748b;
    font-weight: 600;
    margin: 0;
}

/* Error Alert */
.error-alert {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 1.5rem;
    background: #fef2f2;
    border: 1.5px solid #fecaca;
    border-radius: 12px;
    margin-bottom: 2rem;
}

.error-alert i {
    font-size: 1.5rem;
    color: #dc2626;
    flex-shrink: 0;
    margin-top: 0.25rem;
}

.error-alert h4 {
    margin: 0 0 0.5rem 0;
    color: #991b1b;
    font-size: 1rem;
    font-weight: 700;
}

.error-alert p {
    margin: 0;
    color: #7f1d1d;
    font-size: 0.95rem;
}

/* Results Header */
.results-header {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #f0fdfb 0%, #ecfdf5 100%);
    border: 1.5px solid #a7f3d0;
    border-radius: 12px;
    margin-bottom: 2rem;
}

.results-header i {
    font-size: 1.8rem;
    color: #1abc9c;
    flex-shrink: 0;
}

.results-header h3 {
    margin: 0 0 0.5rem 0;
    color: #0d7d6e;
    font-size: 1.25rem;
    font-weight: 700;
}

.results-header p {
    margin: 0;
    color: #64748b;
    font-size: 0.95rem;
    line-height: 1.5;
}

/* Empty State */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
}

.empty-state i {
    font-size: 4rem;
    color: #cbd5e1;
    margin-bottom: 1.5rem;
}

.empty-state h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #475569;
    margin: 0 0 0.5rem 0;
}

.empty-state p {
    color: #94a3b8;
    font-size: 1rem;
    margin: 0;
}

/* Table Wrapper */
.table-wrapper {
    background: white;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(26, 188, 156, 0.08);
    border: 1px solid #e2e8f0;
    overflow: hidden;
}

.table-responsive {
    overflow-x: auto;
    max-height: 700px;
    overflow-y: auto;
}

/* Results Table */
.results-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
}

.results-table thead {
    background: linear-gradient(135deg, #f0fdfb 0%, #ecfdf5 100%);
    border-bottom: 2px solid #a7f3d0;
    position: sticky;
    top: 0;
    z-index: 10;
}

.results-table th {
    padding: 1rem;
    text-align: left;
    font-weight: 700;
    color: #0d7d6e;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
}

.results-table tbody tr {
    border-bottom: 1px solid #f1f5f9;
    transition: all 0.2s ease;
}

.results-table tbody tr:hover {
    background: linear-gradient(135deg, #f0fdfb 0%, #ecfdf5 100%);
}

.results-table td {
    padding: 1rem;
    color: #1e293b;
}

.row-number {
    font-weight: 600;
    color: #64748b;
    min-width: 40px;
}

.patient-name {
    min-width: 150px;
    font-weight: 600;
    color: #0d7d6e;
}

.patient-id {
    min-width: 120px;
    color: #1abc9c;
    font-weight: 600;
}

.gender-badge {
    display: inline-block;
    padding: 0.35rem 0.75rem;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    min-width: 70px;
    text-align: center;
}

.gender-badge-male {
    background: linear-gradient(135deg, #f0fdfb 0%, #ecfdf5 100%);
    color: #1abc9c;
    border: 1px solid #a7f3d0;
}

.gender-badge-female {
    background: #fef3f2;
    color: #c4220e;
    border: 1px solid #fdccc9;
}

.phone-number {
    min-width: 120px;
    color: #1abc9c;
    font-weight: 500;
}

.truncate {
    min-width: 150px;
    max-width: 200px;
    color: #64748b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.date-cell {
    min-width: 140px;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    white-space: nowrap;
}

.date-cell i {
    color: #1abc9c;
    font-size: 1rem;
}

.action-cell {
    min-width: 80px;
    text-align: center;
    padding: 1rem !important;
}

.view-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #f0fdfb 0%, #ecfdf5 100%);
    border: 1.5px solid #a7f3d0;
    border-radius: 8px;
    color: #1abc9c;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 1px 3px rgba(26, 188, 156, 0.08);
}

.view-button:hover {
    background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
    border-color: #1abc9c;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(26, 188, 156, 0.2);
}

.view-button:active {
    transform: translateY(0);
}

/* Scrollbar */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb {
    background: #a7f3d0;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: #1abc9c;
}

/* Responsive */
@media (max-width: 768px) {
    .search-header {
        padding: 2rem 1.5rem;
    }

    .header-title {
        font-size: 1.875rem;
    }

    .header-title i {
        font-size: 2rem;
    }

    .search-wrapper {
        padding: 2rem 1.5rem;
    }

    .search-card {
        padding: 1.5rem;
    }

    .search-form-group {
        flex-direction: column;
    }

    .search-button {
        width: 100%;
    }

    .results-table th,
    .results-table td {
        padding: 0.75rem;
        font-size: 0.85rem;
    }

    .results-table th {
        font-size: 0.75rem;
    }
}

@media (max-width: 576px) {
    .search-header {
        padding: 1.5rem 1rem;
    }

    .header-title {
        font-size: 1.5rem;
        gap: 0.75rem;
    }

    .header-title i {
        font-size: 1.75rem;
    }

    .header-subtitle {
        font-size: 0.95rem;
    }

    .search-wrapper {
        padding: 1.5rem 1rem;
    }

    .results-header {
        flex-direction: column;
        gap: 1rem;
    }

    .results-header i {
        font-size: 1.5rem;
    }

    .results-table {
        font-size: 0.8rem;
    }

    .results-table th,
    .results-table td {
        padding: 0.5rem;
    }

    .patient-name,
    .patient-id,
    .truncate,
    .date-cell {
        min-width: auto;
        max-width: 100px;
    }

    .results-header h3 {
        font-size: 1.1rem;
    }

    .results-header p {
        font-size: 0.85rem;
    }
}
</style>