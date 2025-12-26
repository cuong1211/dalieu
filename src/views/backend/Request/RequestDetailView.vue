```vue
<template>
    <div class="detail-container">
        <!-- Header -->
        <div class="detail-header">
            <div class="header-wrapper">
                <div class="header-left">
                    <button class="back-btn" @click="router.back()">
                        <i class="bi bi-chevron-left"></i>
                    </button>
                    <div class="header-info">
                        <h2 class="header-title">Chi tiết bệnh nhân</h2>
                        <p class="header-subtitle">Thông tin khám bệnh và chẩn đoán</p>
                    </div>
                </div>
                <div class="header-actions">
                    <button class="print-btn" @click="handlePrintReport" :disabled="!patient">
                        <i class="bi bi-printer"></i>
                        <span>In phiếu</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading state -->
        <template v-if="loading">
            <div class="loading-container">
                <LoadingSpinner />
            </div>
        </template>

        <!-- Content -->
        <template v-else-if="patient">
            <div class="content-wrapper">
                <!-- Main Content Area - Two Column Layout -->
                <div class="main-content">
                    <!-- Left Column -->
                    <div class="content-column">
                        <!-- Personal Info Card -->
                        <div class="info-card">
                            <div class="card-header">
                                <div class="card-icon">
                                    <i class="bi bi-person-badge"></i>
                                </div>
                                <h3 class="card-title">Thông tin cá nhân</h3>
                            </div>
                            <div class="card-body">
                                <div class="info-row">
                                    <div class="info-field">
                                        <span class="info-label">Họ và tên</span>
                                        <span class="info-value">{{ patient.name }}</span>
                                    </div>
                                    <div class="info-field">
                                        <span class="info-label">Giới tính</span>
                                        <span class="info-value">{{ formatGender(patient.gender) }}</span>
                                    </div>
                                </div>
                                <div class="info-row">
                                    <div class="info-field">
                                        <span class="info-label">CMND/CCCD</span>
                                        <span class="info-value">{{ patient.identification }}</span>
                                    </div>
                                    <div class="info-field">
                                        <span class="info-label">Tuổi</span>
                                        <span class="info-value">{{ patient.age }} tuổi</span>
                                    </div>
                                </div>
                                <div class="info-row full-row">
                                    <div class="info-field">
                                        <span class="info-label">Số điện thoại</span>
                                        <span class="info-value">{{ patient.phone }}</span>
                                    </div>
                                </div>
                                <div class="info-row full-row">
                                    <div class="info-field">
                                        <span class="info-label">Địa chỉ</span>
                                        <span class="info-value">{{ patient.address }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Medical Info Card -->
                        <div class="info-card">
                            <div class="card-header">
                                <div class="card-icon medical">
                                    <i class="bi bi-clipboard2-pulse"></i>
                                </div>
                                <h3 class="card-title">Thông tin khám bệnh</h3>
                            </div>
                            <div class="card-body">
                                <div class="medical-field full-row">
                                    <span class="info-label">Triệu chứng</span>
                                    <span class="info-value medical-text">{{ patient.symptom }}</span>
                                </div>
                                <div class="divider"></div>
                                <div class="medical-field full-row">
                                    <span class="info-label">Kết quả chẩn đoán</span>
                                    <div v-if="patient.result" class="info-value medical-text">{{ patient.result }}</div>
                                    <div v-else class="no-result-badge">
                                        <i class="bi bi-hourglass-split"></i>
                                        <span>Chưa có kết quả</span>
                                    </div>
                                </div>
                                <div class="divider"></div>
                                <div class="medical-field full-row">
                                    <span class="info-label">Ngày khám</span>
                                    <span class="info-value">{{ formatDate(patient.created_at) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column -->
                    <div class="content-column image-column">
                        <!-- Image Card -->
                        <div v-if="patient.file_id" class="info-card sticky-card">
                            <div class="card-header">
                                <div class="card-icon image">
                                    <i class="bi bi-image"></i>
                                </div>
                                <h3 class="card-title">Hình ảnh bệnh án</h3>
                            </div>
                            <div class="card-body image-body">
                                <div class="image-container">
                                    <img :src="getImageUrl(patient.file_id)" :alt="patient.name"
                                        class="patient-image" @click="showFullImage"
                                        :class="{ 'loading': imageLoading }" @load="handleImageLoad" />
                                    <div v-if="imageLoading" class="image-loading">
                                        <div class="spinner-border text-success" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                    <div class="image-overlay" @click="showFullImage">
                                        <i class="bi bi-zoom-in"></i>
                                        <span>Xem phóng to</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- Image Modal -->
        <div class="modal fade" id="imageModal" tabindex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-xl">
                <div class="modal-content modern-modal">
                    <div class="modal-header modern-modal-header">
                        <div class="modal-title-wrapper">
                            <i class="bi bi-image me-2"></i>
                            <h5 class="modal-title" id="imageModalLabel">Hình ảnh chi tiết</h5>
                        </div>
                        <button type="button" class="btn-close-modern" data-bs-dismiss="modal" aria-label="Close">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div class="modal-body modern-modal-body">
                        <img v-if="patient?.file_id" :src="getImageUrl(patient.file_id)" :alt="patient?.name"
                            class="img-fluid modal-image" />
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

// Handle print report
const handlePrintReport = async (): Promise<void> => {
    if (!patient.value) return;

    const printWindow = window.open('', '', 'height=800,width=1000');
    if (printWindow) {
        try {
            const reportHTML = await generateReportHTML();
            printWindow.document.write(reportHTML);
            printWindow.document.close();

            setTimeout(() => {
                printWindow.print();
            }, 250);
        } catch (error) {
            console.error('Error generating report:', error);
            printWindow.close();
        }
    }
};

// Generate report HTML for printing
const generateReportHTML = async (): Promise<string> => {
    if (!patient.value) return '';

    const safeValue = (value: any): string => {
        if (value === null || value === undefined || value === '') {
            return '';
        }
        return String(value).trim();
    };

    const patientName = safeValue(patient.value.name);
    const patientAge = safeValue(patient.value.age);
    const patientGender = formatGender(patient.value.gender);
    const patientId = safeValue(patient.value.identification);
    const patientPhone = safeValue(patient.value.phone);
    const patientAddress = safeValue(patient.value.address);
    const symptomDescription = safeValue(patient.value.symptom);
    const diagnosisResult = safeValue(patient.value.result);

    const maPhieu = `BN-${patientId.substring(0, 8)}`;
    const ngayKham = formatDate(patient.value.created_at);

    // Get patient image as base64
    let patientImageBase64 = '';
    if (patient.value.file_id) {
        try {
            const imageUrl = getImageUrl(patient.value.file_id);
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            patientImageBase64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Error loading image:', error);
        }
    }

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <title>Phiếu Khám Bệnh</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Times New Roman', Times, serif;
                    line-height: 1.4;
                    color: #000;
                    padding: 20px;
                }
                .container {
                    max-width: 900px;
                    margin: 0 auto;
                }
                .header-info {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                    margin-bottom: 15px;
                    font-size: 11px;
                }
                .header-logo {
                    flex-shrink: 0;
                }
                .header-logo img {
                    width: 60px;
                    height: 60px;
                    object-fit: contain;
                }
                .header-text {
                    flex: 1;
                    text-align: center;
                }
                .header-info p {
                    margin: 3px 0;
                }
                .title {
                    text-align: center;
                    font-weight: bold;
                    font-size: 13px;
                    margin-bottom: 15px;
                }
                .meta-row {
                    margin-bottom: 10px;
                    font-size: 11px;
                }
                .section-title {
                    font-weight: bold;
                    font-size: 12px;
                    margin-top: 15px;
                    margin-bottom: 10px;
                    text-decoration: underline;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 11px;
                    margin: 10px 0;
                }
                table td {
                    border: 1px solid #000;
                    padding: 6px;
                    vertical-align: top;
                }
                .info-row {
                    margin-bottom: 5px;
                    font-size: 11px;
                }
                .patient-image {
                    max-width: 300px;
                    margin: 10px 0;
                    border: 1px solid #000;
                }
                @media print {
                    body { margin: 0; padding: 20px; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <!-- Header -->
                <div class="header-info">
                    <div class="header-logo">
                        <img src="/media/logos/logo.png" alt="Logo" />
                    </div>
                    <div class="header-text">
                        <p>HỆ THỐNG QUẢN LÝ BỆNH NHÂN</p>
                        <p>PHÒNG KHÁM DA LIỄU</p>
                    </div>
                </div>

                <div class="title">
                    PHIẾU KHÁM BỆNH
                </div>

                <div class="meta-row">
                    <strong>Mã Phiếu:</strong> ${maPhieu} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <strong>Ngày Khám:</strong> ${ngayKham}
                </div>

                <!-- PHẦN 1: THÔNG TIN BỆNH NHÂN -->
                <div class="section-title">PHẦN 1: THÔNG TIN BỆNH NHÂN</div>
                <table>
                    <tr>
                        <td style="width: 30%;">Họ và Tên:</td>
                        <td><strong>${patientName}</strong></td>
                    </tr>
                    <tr>
                        <td>Tuổi:</td>
                        <td>${patientAge} tuổi</td>
                    </tr>
                    <tr>
                        <td>Giới tính:</td>
                        <td>${patientGender}</td>
                    </tr>
                    <tr>
                        <td>CMND/CCCD:</td>
                        <td>${patientId}</td>
                    </tr>
                    <tr>
                        <td>Số điện thoại:</td>
                        <td>${patientPhone}</td>
                    </tr>
                    <tr>
                        <td>Địa chỉ:</td>
                        <td>${patientAddress}</td>
                    </tr>
                </table>

                <!-- PHẦN 2: THÔNG TIN KHÁM BỆNH -->
                <div class="section-title">PHẦN 2: THÔNG TIN KHÁM BỆNH</div>
                <table>
                    <tr>
                        <td style="width: 30%;">Triệu chứng:</td>
                        <td>${symptomDescription}</td>
                    </tr>
                    <tr>
                        <td>Kết quả chẩn đoán:</td>
                        <td>${diagnosisResult || 'Chưa có kết quả'}</td>
                    </tr>
                </table>

                <!-- HÌNH ẢNH BỆNH ÁN -->
                ${patientImageBase64 ? `
                <div class="section-title">PHẦN 3: HÌNH ẢNH BỆNH ÁN</div>
                <img src="${patientImageBase64}" alt="Hình ảnh bệnh án" class="patient-image" />
                ` : ''}

                <div class="info-row" style="margin-top: 30px; text-align: center; font-size: 10px; color: #666;">
                    <p>--- HẾT ---</p>
                    <p style="margin-top: 10px;">Phiếu được in từ Hệ thống Quản lý Bệnh nhân</p>
                </div>
            </div>
        </body>
        </html>
    `;
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
/* Container */
.detail-container {
    display: flex;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: #f5f5f7;
    min-height: 100vh;
}

/* Header */
.detail-header {
    background: #ffffff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-wrapper {
    padding: 0.75rem 1.5rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.header-actions {
    display: flex;
    gap: 0.75rem;
}

.print-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.9375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
}

.print-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
}

.print-btn:active:not(:disabled) {
    transform: translateY(0);
}

.print-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: linear-gradient(135deg, #9e9e9e 0%, #757575 100%);
}

.print-btn i {
    font-size: 1rem;
}

.back-btn {
    background: none;
    border: none;
    cursor: pointer;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1d1d1f;
    font-size: 1.25rem;
    border-radius: 8px;
    transition: all 0.15s ease;
}

.back-btn:hover {
    background: rgba(76, 175, 80, 0.1);
    color: #4caf50;
}

.back-btn:active {
    transform: scale(0.95);
}

.header-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.header-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1d1d1f;
    margin: 0;
    letter-spacing: -0.01em;
}

.header-subtitle {
    font-size: 0.8125rem;
    color: #86868b;
    margin: 0;
    font-weight: 400;
}

/* Loading */
.loading-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
}

/* Content Wrapper */
.content-wrapper {
    flex: 1;
    padding: 1.5rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
}

.main-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    align-items: start;
}

.content-column {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.content-column.image-column {
    position: relative;
}

.sticky-card {
    position: sticky;
    top: 100px;
}

/* Card */
.info-card {
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    overflow: hidden;
    transition: all 0.15s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.info-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border-color: rgba(76, 175, 80, 0.2);
}

.card-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    background: #fafafa;
}

.card-icon {
    width: 36px;
    height: 36px;
    background: rgba(76, 175, 80, 0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.125rem;
    color: #4caf50;
    flex-shrink: 0;
}

.card-icon.medical {
    background: rgba(76, 175, 80, 0.1);
}

.card-icon.image {
    background: rgba(76, 175, 80, 0.1);
}

.card-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1d1d1f;
    margin: 0;
}

.card-body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.card-body.image-body {
    padding: 1rem;
    display: flex;
    justify-content: center;
}

/* Info Rows */
.info-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}

.info-row.full-row {
    grid-template-columns: 1fr;
}

.info-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.info-label {
    color: #86868b;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.info-value {
    color: #1d1d1f;
    font-size: 0.9375rem;
    font-weight: 500;
    word-break: break-word;
}

.medical-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.medical-field.full-row {
    width: 100%;
}

.medical-text {
    font-size: 0.9375rem;
    line-height: 1.5;
    color: #1d1d1f;
}

.divider {
    height: 1px;
    background: rgba(0, 0, 0, 0.04);
    margin: 0.5rem 0;
}

.no-result-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: rgba(255, 152, 0, 0.08);
    color: #f57c00;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    width: fit-content;
}

.no-result-badge i {
    font-size: 1rem;
}

/* Image Container */
.image-container {
    position: relative;
    max-width: 500px;
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.08);
    transition: all 0.2s ease;
}

.image-container:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.patient-image {
    width: 100%;
    height: auto;
    display: block;
    transition: all 0.2s ease;
    cursor: pointer;
}

.patient-image.loading {
    opacity: 0.5;
    filter: blur(2px);
}

.image-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    opacity: 0;
    transition: all 0.2s ease;
    cursor: pointer;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
}

.image-overlay i {
    font-size: 2rem;
}

.image-container:hover .image-overlay {
    opacity: 1;
}

/* Modal */
.modern-modal {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.modern-modal-header {
    background: #ffffff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    padding: 1.25rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-title-wrapper {
    display: flex;
    align-items: center;
    color: #1d1d1f;
    font-weight: 600;
    font-size: 1.125rem;
    gap: 0.5rem;
}

.modal-title-wrapper i {
    color: #4caf50;
}

.btn-close-modern {
    background: rgba(0, 0, 0, 0.04);
    border: none;
    color: #1d1d1f;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
    font-size: 0.875rem;
}

.btn-close-modern:hover {
    background: rgba(0, 0, 0, 0.08);
}

.btn-close-modern:active {
    transform: scale(0.95);
}

.modern-modal-body {
    padding: 1.5rem;
    background: #fafafa;
}

.modal-image {
    max-height: 80vh;
    object-fit: contain;
    border-radius: 8px;
}

/* Responsive */
@media (max-width: 1200px) {
    .main-content {
        grid-template-columns: 1fr;
        gap: 1.25rem;
    }

    .sticky-card {
        position: static;
    }

    .content-wrapper {
        padding: 1.25rem;
    }

    .card-body {
        padding: 1.25rem;
    }

    .info-row {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
}

@media (max-width: 1024px) {
    .content-wrapper {
        padding: 1.25rem;
    }

    .main-content {
        gap: 1.25rem;
    }

    .card-body {
        padding: 1.25rem;
    }

    .info-row {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
}

@media (max-width: 768px) {
    .detail-header {
        padding: 0.75rem 0;
    }

    .header-wrapper {
        padding: 0.5rem 1rem;
    }

    .header-title {
        font-size: 1.125rem;
    }

    .header-subtitle {
        font-size: 0.75rem;
    }

    .content-wrapper {
        padding: 1rem;
    }

    .main-content {
        gap: 1rem;
    }

    .card-header {
        padding: 1rem 1.25rem;
    }

    .card-title {
        font-size: 0.95rem;
    }

    .card-body {
        padding: 1.25rem;
        gap: 0.875rem;
    }

    .info-row {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .info-label {
        font-size: 0.7rem;
    }

    .info-value {
        font-size: 0.875rem;
    }

    .image-container {
        max-width: 100%;
    }

    :deep(.modal-dialog) {
        margin: 0.5rem;
    }

    .modern-modal-header {
        padding: 1rem 1.25rem;
    }

    .modern-modal-body {
        padding: 1.25rem;
    }
}

@media (max-width: 480px) {
    .detail-header {
        padding: 0.5rem 0;
    }

    .header-wrapper {
        padding: 0.5rem 0.75rem;
    }

    .header-left {
        gap: 0.5rem;
    }

    .back-btn {
        width: 32px;
        height: 32px;
        font-size: 1.125rem;
    }

    .header-title {
        font-size: 1rem;
    }

    .header-subtitle {
        font-size: 0.7rem;
    }

    .content-wrapper {
        padding: 0.75rem;
    }

    .card-header {
        padding: 1rem;
    }

    .card-icon {
        width: 32px;
        height: 32px;
        font-size: 1rem;
    }

    .card-title {
        font-size: 0.9375rem;
    }

    .card-body {
        padding: 1rem;
        gap: 0.75rem;
    }

    .card-body.image-body {
        padding: 0.75rem;
    }

    .info-row {
        gap: 0.75rem;
    }

    .info-label {
        font-size: 0.65rem;
    }

    .info-value {
        font-size: 0.8125rem;
    }

    .divider {
        margin: 0.375rem 0;
    }

    .no-result-badge {
        font-size: 0.8rem;
        padding: 0.375rem 0.625rem;
    }

    .medical-text {
        font-size: 0.8125rem;
    }
}
</style>
```