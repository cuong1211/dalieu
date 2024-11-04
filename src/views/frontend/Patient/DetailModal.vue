<template>
    <div class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
            <div class="modal-content">
                <!-- Modal Header -->
                <div class="modal-header">
                    <h5 class="modal-title">Chi tiết bệnh nhân</h5>
                    <button type="button" class="btn-close" @click="handleClose"></button>
                </div>

                <!-- Modal Body -->
                <div class="modal-body">
                    <div v-if="loading" class="d-flex justify-content-center p-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Đang tải...</span>
                        </div>
                    </div>

                    <div v-else-if="error" class="alert alert-danger">
                        {{ error }}
                    </div>

                    <div v-else-if="patientDetail" class="patient-detail">
                        <!-- Patient Info Section -->
                        <div class="card mb-5">
                            <div class="card-header">
                                <h3 class="card-title">Thông tin bệnh nhân</h3>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="fw-bold">Họ và tên:</label>
                                        <span class="ms-2">{{ patientDetail.data.name }}</span>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="fw-bold">CMND/CCCD:</label>
                                        <span class="ms-2">{{ patientDetail.data.identification }}</span>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="fw-bold">Tuổi:</label>
                                        <span class="ms-2">{{ patientDetail.data.age }}</span>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="fw-bold">Giới tính:</label>
                                        <span class="ms-2 badge"
                                            :class="patientDetail.data.gender === 'Nam' ? 'badge-light-primary' : 'badge-light-success'">
                                            {{ patientDetail.data.gender }}
                                        </span>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="fw-bold">Điện thoại:</label>
                                        <span class="ms-2">{{ patientDetail.data.phone }}</span>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="fw-bold">Địa chỉ:</label>
                                        <span class="ms-2">{{ patientDetail.data.address }}</span>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="fw-bold">Ngày khám:</label>
                                        <span class="ms-2">{{ formatDate(patientDetail.data.created_at) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Symptom Section -->
                        <div class="card mb-5">
                            <div class="card-header">
                                <h3 class="card-title">Triệu chứng</h3>
                            </div>
                            <div class="card-body">
                                <p v-if="patientDetail.data.symptom">{{ patientDetail.data.symptom }}</p>
                                <p v-else class="text-muted">Không có thông tin triệu chứng</p>

                                <div v-if="patientDetail.data.file_id" class="mt-3">
                                    <h5 class="mb-3">Hình ảnh triệu chứng:</h5>
                                    <img :src="getImageUrl(patientDetail.data.file_id)" alt="Hình ảnh triệu chứng"
                                        class="img-fluid rounded shadow-sm" />
                                </div>
                            </div>
                        </div>

                        <!-- Diagnosis Result -->
                        <div class="card mb-5">
                            <div class="card-header">
                                <h3 class="card-title">Kết quả chẩn đoán</h3>
                            </div>
                            <div class="card-body">


                                {{ patientDetail.data.result }}

                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-light" @click="handleClose">
                        Đóng
                    </button>
                    <button type="button" class="btn btn-primary" @click="handlePrint">
                        <i class="bi bi-printer me-2"></i>
                        In kết quả
                    </button>
                </div>

                <!-- Hidden Print Form -->
                <div v-if="patientDetail" class="d-none">
                    <DiagnosisPrintForm ref="printFormRef" :diagnosis-result="patientDetail" />
                </div>
            </div>
        </div>
    </div>
    <div class="modal-backdrop fade show"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '@/utils/api';
import DiagnosisPrintForm from '@/views/frontend/Request/DiagnosisPrintForm.vue';
import { formatDate } from '@/utils/dateUtils';

interface Patient {
    id: number;
    identification: string;
    name: string;
    age: number;
    gender: string;
    phone: string;
    address: string;
    symptom: string | null;
    result: string;
    created_at: string;
    updated_at: string | null;
    file_id: string;
    created_by: number | null;
    updated_by: number | null;
    deleted_by: number | null;
    deleted_at: string | null;
}

interface PatientResponse {
    data: Patient;
}

const props = defineProps<{
    patientId: number;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
}>();

const loading = ref(true);
const error = ref<string | null>(null);
const patientDetail = ref<PatientResponse | null>(null);
const printFormRef = ref<InstanceType<typeof DiagnosisPrintForm> | null>(null);

const fetchPatientDetail = async () => {
    try {
        loading.value = true;
        const response = await api.get<PatientResponse>(`/patients/${props.patientId}`);
        patientDetail.value = response;
    } catch (err: any) {
        error.value = err.response?.data?.message || 'Không thể tải thông tin bệnh nhân';
    } finally {
        loading.value = false;
    }
};

const getImageUrl = (fileId: string): string => {
    return `${import.meta.env.VITE_API_URL}/files/${fileId}`;
};

const handleClose = () => {
    emit('close');
};

const handlePrint = () => {
    const content = printFormRef.value?.$el.outerHTML;
    if (!content) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Kết quả chẩn đoán</title>
            <!-- Bootstrap CSS -->
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
            <!-- Bootstrap Icons -->
            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
            <!-- Google Fonts -->
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
            <style>
                /* Print Settings */
                @page {
                    size: A4;
                    margin: 2cm;
                }

                /* Global Styles */
                body {
                    font-family: 'Roboto', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }

                /* Form Styles */
                .print-form {
                    background: white;
                    padding: 40px;
                    max-width: 1000px;
                    margin: 0 auto;
                }

                /* Header Styles */
                .form-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #e2e8f0;
                }

                .hospital-name {
                    font-size: 20px;
                    font-weight: 700;
                    color: #1e3a8a;
                    margin: 0;
                }

                /* Section Styles */
                .section-box {
                    margin-bottom: 30px;
                    padding: 20px;
                    background: #f8fafc;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    page-break-inside: avoid;
                }

                .section-title {
                    color: #1e3a8a;
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #e2e8f0;
                }

                /* Image Styles */
                .image-container {
                    max-width: 300px;
                    background: white;
                    padding: 10px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .symptom-image {
                    width: 100%;
                    height: auto;
                    border-radius: 4px;
                }

                /* Footer Styles */
                .form-footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 2px solid #e2e8f0;
                    page-break-inside: avoid;
                }

                .doctor-signature {
                    text-align: center;
                    width: 200px;
                    margin-left: auto;
                }

                .signature-space {
                    height: 80px;
                }

                /* Info Grid Styles */
                .info-grid {
                    display: grid;
                    gap: 1rem;
                }

                .info-row {
                    display: grid;
                    grid-template-columns: 120px 1fr;
                    align-items: baseline;
                }

                /* Print Specific Styles */
                @media print {
                    .print-form {
                        padding: 20px;
                    }

                    .section-box {
                        background: white;
                        border: 1px solid #ddd;
                    }

                    .image-container {
                        box-shadow: none;
                        border: 1px solid #ddd;
                    }
                }
                    .diseases-section {
    margin-top: 1.5rem;
}

.diseases-list {
    margin-top: 1rem;
}

.disease-item {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1rem;
}

.disease-name {
    color: #1e293b;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
}

.disease-name i {
    color: #3b82f6;
}

.treatment-content {
    color: #334155;
    line-height: 1.8;
}

.treatment-content :deep(h3) {
    color: #1e293b;
    font-size: 1.1rem;
    font-weight: 600;
    margin: 1.5rem 0 1rem;
}

.treatment-content :deep(p) {
    margin-bottom: 1rem;
}

.signature-section {
    text-align: center;
    margin-top: 2rem;
}

.signature-space {
    height: 80px;
}

.doctor-name {
    font-weight: 600;
}

@media print {
    .disease-item {
        background-color: white !important;
        border-color: #ddd;
    }
    
    .treatment-content {
        page-break-inside: avoid;
    }
}
            </style>
        </head>
        <body>
            ${content}
            <!-- Bootstrap JS -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js">
</body>

</html>
`);

    printWindow.document.close();
    printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
    };
};

onMounted(() => {
    fetchPatientDetail();
});
</script>

<style scoped>
.modal {
    background-color: rgba(0, 0, 0, 0.5);
}

.card {
    border: none;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

.card-header {
    background-color: transparent;
    border-bottom: 1px solid #e9ecef;
    padding: 1.5rem;
}

.card-body {
    padding: 1.5rem;
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

@media print {
    .modal {
        position: relative;
        display: block;
    }

    .modal-dialog {
        transform: none;
    }

    .modal-footer {
        display: none !important;
    }
}
</style>