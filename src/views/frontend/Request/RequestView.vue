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
                            <FormInput v-model="form.age" label="Tuổi" placeholder="Nhập tuổi" type="tel"
                                :error="errors.age" required @input="(value) => handleInput('age', value)" />
                        </div>

                        <div class="col-md-6">
                            <FormSelect v-model="form.gender" label="Giới tính" placeholder="Chọn giới tính"
                                :options="genderOptions" :error="errors.gender" required
                                @change="(value) => handleInput('gender', value)" />
                        </div>

                        <div class="col-md-6">
                            <FormInput v-model="form.identification" label="Số CCCD" placeholder="Nhập số CCCD"
                                type="text" maxlength="12" :error="errors.identification" required
                                @input="handleIdNumberChange" />
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
                            <FormTextarea v-model="form.symptom" label="Mô tả triệu chứng"
                                placeholder="Mô tả chi tiết các triệu chứng bạn đang gặp phải" :error="errors.symptom"
                                :rows="4" required @input="(value) => handleInput('symptom', value)" />
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
                    <div class="action-buttons mb-4">
                        <button @click="handlePrint" class="print-button">
                            <i class="bi bi-printer"></i>
                            In kết quả
                        </button>
                    </div>
                    <div class="diagnosis-content">
                        <!-- Kết quả chẩn đoán -->
                        <div class="result-box mb-4">
                            <h5 class="result-title">
                                <i class="bi bi-clipboard2-pulse me-2"></i>
                                Kết luận
                            </h5>
                            <p class="result-text">{{ diagnosisResult.data.result }}</p>
                        </div>

                        <!-- Danh sách bệnh chính -->
                        <div v-if="diagnosisStore.mainDiseases.length" class="diseases-box">
                            <h5 class="diseases-title">
                                <i class="bi bi-clipboard-heart me-2"></i>
                                Bệnh chính
                            </h5>
                            <div class="diseases-list">
                                <div v-for="disease in diagnosisStore.mainDiseases" :key="disease.id"
                                    class="disease-item mb-4">
                                    <div class="disease-header">
                                        <h6 class="disease-name mb-3">
                                            <i class="bi bi-journal-medical me-2"></i>
                                            {{ disease.name }}
                                        </h6>
                                        <router-link :to="{ name: 'disease.detail', params: { id: disease.id } }"
                                            class="view-detail-btn">
                                            <span>Xem chi tiết</span>
                                            <i class="bi bi-arrow-right"></i>
                                        </router-link>
                                    </div>
                                    <div class="treatment-content" v-if="disease.treatment" v-html="disease.treatment">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Danh sách bệnh liên quan -->
                        <div v-if="diagnosisStore.relatedDiseases.length" class="diseases-box">
                            <h5 class="diseases-title">
                                <i class="bi bi-link-45deg me-2"></i>
                                Bệnh liên quan
                            </h5>
                            <div class="diseases-list">
                                <div v-for="disease in diagnosisStore.relatedDiseases" :key="disease.id"
                                    class="disease-item mb-4">
                                    <div class="disease-header">
                                        <h6 class="disease-name mb-3">
                                            <i class="bi bi-journal-medical me-2"></i>
                                            {{ disease.name }}
                                        </h6>
                                        <router-link :to="{ name: 'disease.detail', params: { id: disease.id } }"
                                            class="view-detail-btn">
                                            <span>Xem chi tiết</span>
                                            <i class="bi bi-arrow-right"></i>
                                        </router-link>
                                    </div>
                                    <div class="treatment-content" v-if="disease.treatment" v-html="disease.treatment">
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </FormCard>
                <div v-if="diagnosisResult" class="d-none">
                    <DiagnosisPrintForm ref="printFormRef" :diagnosis-result="diagnosisResult" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { DermatologyRequestForm } from '@/types/request';
import ImageUploader from '@/components/ImageUploader/ImageUploader.vue';
import FormCard from '@/components/Form/FormCard.vue';
import FormInput from '@/components/Form/FormInput.vue';
import FormTextarea from '@/components/Form/FormTextarea.vue';
import FormSelect from '@/components/Form/FormSelect.vue';
import { useRequestValidation } from '@/utils/validations/requestValidation';
import { useToast } from 'vue-toastification';
import { useDiagnosisStore } from '@/stores/diagnosisStore';
import type { RequestResponse, } from '@/types/request';
import DiagnosisPrintForm from './DiagnosisPrintForm.vue';
const isProcessing = ref(false);
const diagnosisResult = ref<RequestResponse | null>(null);

const toast = useToast();
const printFormRef = ref<InstanceType<typeof DiagnosisPrintForm> | null>(null);
const diagnosisStore = useDiagnosisStore();

const initialFormData: DermatologyRequestForm = {
    id: 0,
    name: '',
    age: '',
    gender: '',
    identification: '',
    phone: '',
    email: '',
    address: '',
    symptom: '',
    image: null, // Khởi tạo null
};

const form = ref<DermatologyRequestForm>(initialFormData);

const genderOptions = [
    { value: 'Nam', label: 'Nam' },
    { value: 'Nữ', label: 'Nữ' },
    { value: 'Khác', label: 'Khác' }
];

const { errors, validateForm, handleInput, handleIdentificationInput  } = useRequestValidation(form);

// Xử lý validate số CCCD
const handleIdNumberChange = (value: string | number) => {
    handleIdentificationInput(value);
};

const handleSubmit = async () => {
    if (!validateForm()) return
    try {
        isProcessing.value = true;
        const response = await diagnosisStore.submitDiagnosis(form.value);
        diagnosisResult.value = response;
        toast.success(response.message);
    } catch (error) {
        console.error(error);
        toast.error('Gửi yêu cầu thất bại. Vui lòng thử lại.');
    } finally {
        isProcessing.value = false;
    }
}

const handleImageChanged = (file: File | null) => {
    form.value.image = file;
    handleInput('image', file);
};
const handlePrint = () => {
    const content = printFormRef.value?.$el.outerHTML;

    if (!content) return;

    // Tạo cửa sổ in mới
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Thiết lập nội dung
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

    // In sau khi tất cả tài nguyên đã load
    printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        // printWindow.close();
    };
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

.action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

.print-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background-color: #1e293b;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.print-button:hover {
    background-color: #334155;
}

.print-button i {
    font-size: 1.1rem;
}

/* Ẩn các phần không cần thiết khi in */
@media print {
    .paper-container {
        padding: 0;
    }

    .paper-content {
        box-shadow: none;
    }

    .action-buttons,
    .form-actions,
    .loading-overlay {
        display: none !important;
    }

    .disease-card {
        border: 1px solid #e2e8f0 !important;
        break-inside: avoid;
    }

    /* Đảm bảo links vẫn hiển thị màu đúng khi in */
    a {
        color: inherit !important;
        text-decoration: none !important;
    }

    /* Đảm bảo background và màu sắc hiển thị đúng khi in */
    .result-box,
    .diseases-box {
        background-color: white !important;
        border: 1px solid #e2e8f0;
    }

}

.diseases-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.disease-item {
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1.5rem;
}

.disease-name {
    color: #1e293b;
    font-size: 1.125rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    margin: 0;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e2e8f0;
}

.disease-name i {
    color: #3b82f6;
    font-size: 1.25rem;
}

.treatment-content {
    margin-top: 1rem;
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

.treatment-content :deep(strong) {
    color: #1e293b;
}

.treatment-content :deep(ul) {
    list-style: disc;
    padding-left: 1.5rem;
    margin: 1rem 0;
}

.treatment-content :deep(li) {
    margin-bottom: 0.5rem;
}

.disease-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e2e8f0;
}

.disease-name {
    color: #1e293b;
    font-size: 1.125rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    margin: 0;
}

.view-detail-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #f8fafc;
    color: #3b82f6;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease;
}

.view-detail-btn:hover {
    background-color: #eff6ff;
    border-color: #3b82f6;
    transform: translateY(-1px);
}

.view-detail-btn i {
    font-size: 1rem;
    transition: transform 0.2s ease;
}

.view-detail-btn:hover i {
    transform: translateX(2px);
}

/* Responsive */
@media (max-width: 768px) {
    .disease-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }

    .view-detail-btn {
        width: 100%;
        justify-content: center;
    }
}

/* Print styles */
@media print {
    .view-detail-btn {
        display: none;
    }

    .disease-header {
        border-bottom-color: #ddd;
    }
}
</style>