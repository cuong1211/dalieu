<template>
    <div class="modal-overlay" @click.self="handleClose">
        <div class="modal-container">
            <!-- Modal Header -->
            <div class="modal-header">
                <div class="header-content">
                    <i class="bi bi-person-vcard"></i>
                    <h2 class="modal-title">Chi tiết bệnh nhân</h2>
                </div>
                <button class="close-btn" @click="handleClose" title="Đóng">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <!-- Modal Body -->
            <div class="modal-body">
                <!-- Loading State -->
                <div v-if="loading" class="loading-state">
                    <div class="spinner">
                        <div class="spinner-ring"></div>
                        <p>Đang tải thông tin bệnh nhân...</p>
                    </div>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="error-state">
                    <i class="bi bi-exclamation-triangle"></i>
                    <h4>Lỗi tải dữ liệu</h4>
                    <p>{{ error }}</p>
                </div>

                <!-- Patient Detail Content -->
                <div v-else-if="patientDetail" class="patient-detail-content">
                    <!-- Patient Info Section -->
                    <div class="info-section">
                        <div class="section-header">
                            <i class="bi bi-info-circle"></i>
                            <h3>Thông tin bệnh nhân</h3>
                        </div>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Họ và tên</label>
                                <p>{{ patientDetail.data.name }}</p>
                            </div>
                            <div class="info-item">
                                <label>CMND/CCCD</label>
                                <p>{{ patientDetail.data.identification }}</p>
                            </div>
                            <div class="info-item">
                                <label>Tuổi</label>
                                <p>{{ patientDetail.data.age }} tuổi</p>
                            </div>
                            <div class="info-item">
                                <label>Giới tính</label>
                                <p>
                                    <span
                                        :class="['gender-badge', patientDetail.data.gender === 'Nam' ? 'gender-male' : 'gender-female']"
                                    >
                                        {{ patientDetail.data.gender }}
                                    </span>
                                </p>
                            </div>
                            <div class="info-item">
                                <label>Điện thoại</label>
                                <p>{{ patientDetail.data.phone }}</p>
                            </div>
                            <div class="info-item">
                                <label>Địa chỉ</label>
                                <p>{{ patientDetail.data.address }}</p>
                            </div>
                            <div class="info-item">
                                <label>Ngày khám</label>
                                <p>
                                    <i class="bi bi-calendar-event"></i>
                                    {{ formatDate(patientDetail.data.created_at) }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Symptom Section -->
                    <div class="info-section">
                        <div class="section-header">
                            <i class="bi bi-clipboard-pulse"></i>
                            <h3>Triệu chứng</h3>
                        </div>
                        <div class="section-content">
                            <p v-if="patientDetail.data.symptom" class="symptom-text">
                                {{ patientDetail.data.symptom }}
                            </p>
                            <p v-else class="text-muted">Không có thông tin triệu chứng</p>

                            <!-- Symptom Image -->
                            <div v-if="patientDetail.data.file_id" class="symptom-image-wrapper">
                                <h5>Hình ảnh triệu chứng:</h5>
                                <img
                                    :src="getImageUrl(patientDetail.data.file_id)"
                                    alt="Hình ảnh triệu chứng"
                                    class="symptom-image"
                                    @error="handleImageError"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Diagnosis Result Section -->
                    <div class="info-section">
                        <div class="section-header">
                            <i class="bi bi-stethoscope"></i>
                            <h3>Kết quả chẩn đoán</h3>
                        </div>
                        <div class="section-content">
                            <p v-if="patientDetail.data.result" class="diagnosis-result">
                                {{ patientDetail.data.result }}
                            </p>
                            <p v-else class="text-muted">Chưa có kết quả chẩn đoán</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="modal-footer">
                <button class="btn-secondary" @click="handleClose">
                    <i class="bi bi-x-lg"></i>
                    Đóng
                </button>
                <button class="btn-primary" @click="handlePrint">
                    <i class="bi bi-printer"></i>
                    In kết quả
                </button>
            </div>

            <!-- Hidden Print Form -->

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '@/utils/api';
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
const isPrinting = ref(false);

const fetchPatientDetail = async () => {
    try {
        loading.value = true;
        error.value = null;
        const response = await api.get<PatientResponse>(`/patients/${props.patientId}`);
        patientDetail.value = response;
    } catch (err: any) {
        error.value = err.response?.data?.message || 'Không thể tải thông tin bệnh nhân';
        patientDetail.value = null;
    } finally {
        loading.value = false;
    }
};

const getImageUrl = (fileId: string): string => {
    return `${import.meta.env.VITE_API_URL}/files/${fileId}`;
};

const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
};

const getPrintPatientInfo = () => {
    if (!patientDetail.value) {
        return {
            id: 0,
            name: '',
            age: '',
            gender: '',
            phone: '',
            address: '',
            symptom: '',
            image: '',
            created_at: ''
        };
    }

    const patient = patientDetail.value.data;
    return {
        id: patient.id,
        name: patient.name,
        age: String(patient.age),
        gender: patient.gender,
        phone: patient.phone,
        address: patient.address,
        symptom: patient.symptom || '',
        image: patient.file_id || '',
        created_at: patient.created_at
    };
};

const handleClose = () => {
    emit('close');
};

const handlePrint = async () => {
    try {
        isPrinting.value = true;

        // Fetch latest patient data from API
        const response = await api.get<PatientResponse>(`/patients/${props.patientId}`);
        const patientData = response.data;

        if (!patientData) {
            console.error('Không thể lấy dữ liệu bệnh nhân');
            return;
        }

        const patient = patientData;
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        // Format date
        const today = new Date();
        const ngayThuTuc = today.toLocaleDateString('vi-VN');

        // Generate Mã Phiếu
        const maPhieu = `CD${String(patient.id).padStart(6, '0')}`;

        // Safe value getter
        const safeValue = (value: any) => {
            if (value === null || value === undefined || value === '') {
                return '';
            }
            return String(value).trim();
        };

        const patientName = safeValue(patient.name);
        const patientAge = safeValue(patient.age);
        const patientGender = safeValue(patient.gender);
        const patientId = safeValue(patient.identification);
        const symptomDescription = safeValue(patient.symptom);
        const diagnosisResult = safeValue(patient.result);

        const printHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8" />
                <title>Phiếu Kết Quả Chẩn Đoán & Đề Xuất Điều Trị</title>
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
                    table th {
                        border: 1px solid #000;
                        padding: 6px;
                        text-align: left;
                        font-weight: bold;
                        background: #f0f0f0;
                    }
                    .info-row {
                        margin-bottom: 5px;
                        font-size: 11px;
                    }
                    .footer-note {
                        margin-top: 20px;
                        padding: 10px;
                        background: #ffffcc;
                        border: 1px solid #cccccc;
                        font-size: 10px;
                        line-height: 1.4;
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
                            <p>HỆ THỐNG TRUY XUẤT VÀ TẠO SINH</p>
                            <p>CHO CHUẨN ĐOÁN BỆNH LÝ VỀ DA</p>
                        </div>
                    </div>

                    <div class="title">
                        PHIẾU KẾT QUẢ CHẨN ĐOÁN & ĐỀ XUẤT ĐIỀU TRỊ
                    </div>

                    <div class="meta-row">
                        <strong>Mã Phiếu:</strong> ${maPhieu} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <strong>Ngày Chẩn Đoán:</strong> ${ngayThuTuc}
                    </div>

                    <!-- PHẦN 1: THÔNG TIN BỆNH NHÂN -->
                    <div class="section-title">PHẦN 1: THÔNG TIN BỆNH NHÂN</div>

                    <table>
                        <tr>
                            <td style="width: 30%;"><strong>Mục</strong></td>
                            <td style="width: 70%;"><strong>Thông tin</strong></td>
                        </tr>
                        <tr>
                            <td>Họ và Tên:</td>
                            <td>${patientName || '[Điền Họ và Tên bệnh nhân]'}</td>
                        </tr>
                        <tr>
                            <td>Ngày Sinh/Tuổi:</td>
                            <td>${patientAge || '[Điền Ngày sinh/Tuổi]'}</td>
                        </tr>
                        <tr>
                            <td>Giới tính:</td>
                            <td>${patientGender || '[Nam/Nữ/Khác]'}</td>
                        </tr>
                        <tr>
                            <td>Số CCCD</td>
                            <td>${patientId || '[Mã số bệnh nhân (nếu có)] - Số CCCD'}</td>
                        </tr>
                        <tr>
                            <td>Tính trạng bệnh sư tóm tắt hiện tại:</td>
                            <td>${symptomDescription || '[Các triệu chứng/vấn đề chính mà bệnh nhân khai báo]'}</td>
                        </tr>
                    </table>

                    <!-- PHẦN 2: KẾT QUẢ PHÂN TÍCH VÀ CHẨN ĐOÁN BỆNH LÝ -->
                    <div class="section-title">PHẦN 2: KẾT QUẢ PHÂN TÍCH VÀ CHẨN ĐOÁN BỆNH LÝ</div>

                    <div class="info-row">
                        <strong>2.1. Kết quả chẩn đoán Chính (Primary Diagnosis):</strong>
                    </div>
                    <div class="info-row" style="margin-left: 20px;">
                        <strong>Kết quả:</strong> ${diagnosisResult || '[Chưa có kết quả chẩn đoán]'}<br/>
                    </div>

                    <div class="info-row" style="margin-top: 10px;">
                        <strong>2.2. Ghi chú bổ sung:</strong>
                    </div>
                    <div class="info-row" style="margin-left: 20px;">
                        [Các thông tin bổ sung hoặc khuyến nghị khác từ hệ thống chẩn đoán]
                    </div>

                    <!-- Footer Note -->
                    <div class="footer-note">
                        <strong>Trên đây là kết quả chẩn đoán mà chúng tôi đã chuẩn đoán và đề xuất gửi tới bạn tham khảo. Bạn cần tham vấn và thăm khám thêm từ các Bác sỹ về Da liễu để có kết quả chẩn đoán chính xác nhất.</strong>
                    </div>

                    <div style="text-align: center; margin-top: 20px; font-size: 11px;">
                        <p>═══════════════════════════════════════</p>
                        <p>Ngày In: ${ngayThuTuc} - Hệ Thống Truy Xuất và Tạo Sinh cho Chuẩn Đoán Bệnh Lý Về Da</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(printHTML);
        printWindow.document.close();

        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
        }, 500);
    } catch (err) {
        console.error('Lỗi khi in:', err);
        alert('Lỗi khi lấy dữ liệu hoặc in tài liệu. Vui lòng thử lại.');
    } finally {
        isPrinting.value = false;
    }
};

onMounted(() => {
    fetchPatientDetail();
});
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(2px);
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

/* Modal Container */
.modal-container {
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(26, 188, 156, 0.15);
    width: 90%;
    max-width: 900px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* Modal Header */
.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 2rem;
    border-bottom: 2px solid #f1f5f9;
    background: linear-gradient(135deg, #f0fdfb 0%, #ecfdf5 100%);
}

.header-content {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.header-content i {
    font-size: 1.75rem;
    color: #1abc9c;
}

.modal-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #0d7d6e;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #64748b;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.close-btn:hover {
    color: #1abc9c;
    transform: scale(1.1);
}

/* Modal Body */
.modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
    background: white;
}

/* Loading State */
.loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
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

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.spinner p {
    color: #64748b;
    font-weight: 600;
}

/* Error State */
.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    text-align: center;
    padding: 2rem;
}

.error-state i {
    font-size: 3rem;
    color: #dc2626;
    margin-bottom: 1rem;
}

.error-state h4 {
    color: #991b1b;
    margin-bottom: 0.5rem;
}

.error-state p {
    color: #7f1d1d;
}

/* Patient Detail Content */
.patient-detail-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

/* Info Section */
.info-section {
    background: linear-gradient(135deg, #f0fdfb 0%, #ecfdf5 100%);
    border: 1.5px solid #a7f3d0;
    border-radius: 12px;
    overflow: hidden;
}

.section-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: white;
    border-bottom: 2px solid #a7f3d0;
}

.section-header i {
    font-size: 1.5rem;
    color: #1abc9c;
}

.section-header h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: #0d7d6e;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.section-content {
    padding: 1.5rem;
}

/* Info Grid */
.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.info-item {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

.info-item label {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    margin-bottom: 0.5rem;
}

.info-item p {
    margin: 0;
    font-size: 1rem;
    color: #1e293b;
    font-weight: 500;
}

.info-item i {
    color: #1abc9c;
    margin-right: 0.5rem;
}

/* Gender Badge */
.gender-badge {
    display: inline-block;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    text-align: center;
}

.gender-male {
    background: linear-gradient(135deg, #f0fdfb 0%, #ecfdf5 100%);
    color: #1abc9c;
    border: 1px solid #a7f3d0;
}

.gender-female {
    background: #fef3f2;
    color: #c4220e;
    border: 1px solid #fdccc9;
}

/* Symptom Text */
.symptom-text {
    margin: 0 0 1.5rem 0;
    line-height: 1.8;
    color: #334155;
}

.symptom-image-wrapper {
    margin-top: 1.5rem;
}

.symptom-image-wrapper h5 {
    margin: 0 0 1rem 0;
    color: #0d7d6e;
    font-weight: 600;
}

.symptom-image {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(26, 188, 156, 0.1);
}

/* Diagnosis Result */
.diagnosis-result {
    margin: 0;
    line-height: 1.8;
    color: #334155;
}

/* Text Utilities */
.text-muted {
    color: #94a3b8;
}

/* Modal Footer */
.modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1.5rem 2rem;
    border-top: 1px solid #f1f5f9;
    background: white;
}

/* Buttons */
.btn-primary,
.btn-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.btn-primary {
    background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(26, 188, 156, 0.2);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(26, 188, 156, 0.3);
}

.btn-primary:active {
    transform: translateY(0);
}

.btn-secondary {
    background: #f1f5f9;
    color: #475569;
    border: 1.5px solid #e2e8f0;
}

.btn-secondary:hover {
    background: white;
    color: #1abc9c;
    border-color: #a7f3d0;
    box-shadow: 0 2px 8px rgba(26, 188, 156, 0.1);
}

/* Hidden Print */
.hidden-print {
    display: none;
}

/* Scrollbar */
.modal-body::-webkit-scrollbar {
    width: 6px;
}

.modal-body::-webkit-scrollbar-track {
    background: #f1f5f9;
}

.modal-body::-webkit-scrollbar-thumb {
    background: #a7f3d0;
    border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
    background: #1abc9c;
}

/* Responsive */
@media (max-width: 768px) {
    .modal-container {
        width: 95%;
        max-height: 95vh;
    }

    .modal-header {
        padding: 1rem 1.5rem;
    }

    .modal-body {
        padding: 1.5rem;
    }

    .modal-footer {
        padding: 1rem 1.5rem;
        flex-direction: column;
    }

    .btn-primary,
    .btn-secondary {
        width: 100%;
    }

    .info-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .header-content {
        gap: 0.75rem;
    }

    .modal-title {
        font-size: 1.25rem;
    }

    .section-header {
        padding: 1rem 1.5rem;
    }

    .section-content {
        padding: 1.5rem;
    }
}

@media (max-width: 576px) {
    .modal-container {
        width: 100%;
        max-height: 100vh;
        border-radius: 12px 12px 0 0;
    }

    .modal-header {
        padding: 1rem;
    }

    .modal-body {
        padding: 1rem;
    }

    .modal-footer {
        padding: 1rem;
    }

    .modal-title {
        font-size: 1rem;
    }

    .header-content i {
        font-size: 1.5rem;
    }

    .section-header {
        gap: 0.5rem;
        padding: 1rem;
    }

    .section-header h3 {
        font-size: 1rem;
    }

    .info-grid {
        grid-template-columns: 1fr;
    }

    .info-item {
        padding: 0.75rem;
    }
}
</style>
