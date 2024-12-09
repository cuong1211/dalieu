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

                <LoadingOverlay :show="isProcessing" title="Đang xử lý yêu cầu"
                    description="Hệ thống đang phân tích triệu chứng của bạn..." />

                <!-- Cập nhật nút submit -->
                <div class="form-actions" v-if="!isSecondDiagnosis">
                    <div class="submit-wrapper">
                        <button type="submit" class="submit-button" :disabled="isProcessing || isSubmitDisabled" :class="{
                            'is-processing': isProcessing,
                            'is-disabled': isSubmitDisabled
                        }">
                            <template v-if="isProcessing">
                                <i class="bi bi-arrow-repeat loading-icon"></i>
                                Đang xử lý...
                            </template>
                            <template v-else-if="isSubmitDisabled">
                                <i class="bi bi-clock"></i>
                                Vui lòng đợi
                            </template>
                            <template v-else>
                                <i class="bi bi-send"></i>
                                Gửi yêu cầu
                            </template>
                        </button>
                        <!-- Thông báo cooldown -->
                        <div v-if="isSubmitDisabled" class="cooldown-message">
                            Bạn có thể gửi yêu cầu mới sau {{ cooldownTimer }} giây
                        </div>
                    </div>
                </div>
            </form>
            <div v-if="diagnosisResult" class="diagnosis-section">
                <FormCard title="Kết quả chẩn đoán">
                    <!-- Action buttons -->
                    <div class="action-buttons mb-4">
                        <template v-if="!isSecondDiagnosis">
                            <div class="note-box">
                                <p class="note-text">
                                    <i class="bi bi-info-circle me-2"></i>
                                    Để có kết quả chính xác hơn, bạn có thể trả lời thêm một số câu hỏi
                                </p>
                            </div>
                            <button @click="showQuestionModal = true" class="answer-more-btn">
                                <i class="bi bi-question-circle"></i>
                                Trả lời thêm câu hỏi
                            </button>
                        </template>
                        <template v-else>
                            <button @click="handlePrint" class="print-button ">
                                <i class="bi bi-printer"></i>
                                In kết quả
                            </button>
                        </template>
                    </div>

                    <div class="diagnosis-content">
                        <!-- Kết quả chẩn đoán -->
                        <div class="result-box mb-4">
                            <p class="result-text">{{ diagnosisResult.data.result }}</p>
                        </div>

                        <!-- Hiển thị kết quả lần 1 -->
                        <template v-if="!isSecondDiagnosis">
                            <div v-if="diagnosisStore.initialMainDiseases.length" class="diseases-box">
                                <h5 class="diseases-title">
                                    <i class="bi bi-clipboard-heart me-2"></i>
                                    Bệnh chính
                                </h5>
                                <DiseaseList :diseases="diagnosisStore.initialMainDiseases" />
                            </div>

                            <div v-if="diagnosisStore.initialRelatedDiseases.length" class="diseases-box">
                                <h5 class="diseases-title">
                                    <i class="bi bi-link-45deg me-2"></i>
                                    Bệnh liên quan
                                </h5>
                                <DiseaseList :diseases="diagnosisStore.initialRelatedDiseases" />
                            </div>
                        </template>

                        <!-- Hiển thị kết quả lần 2 -->
                        <template v-else>
                            <div class="diseases-box">
                                <div class="diseases-list">
                                    <DiseaseList :diseases="diagnosisStore.diagnosedDiseases" />
                                </div>
                            </div>
                        </template>
                    </div>
                </FormCard>

                <div class="d-none">
                    <div class="d-none">
                        <DiagnosisPrintForm ref="printFormRef" :patient-info="diagnosisResult?.data"
                            :diagnosis-result="diagnosisResult?.data.result"
                            :diseases="diagnosisStore.diagnosedDiseases" />
                    </div>
                </div>
            </div>

            <QuestionModal :show="showQuestionModal" :questions="additionalQuestions" @close="showQuestionModal = false"
                @submit="handleQuestionSubmit" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, nextTick } from 'vue';
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
import LoadingOverlay from './LoadingOverlay.vue';
import QuestionModal from './QuestionModal.vue';
import type { AdditionalDiagnosisResponse } from '@/types/diagnosis';
import DiseaseList from './DiseaseList.vue';
const isProcessing = ref(false);
const diagnosisResult = ref<RequestResponse | null>(null);

const toast = useToast();
const printFormRef = ref<InstanceType<typeof DiagnosisPrintForm> | null>(null);
const diagnosisStore = useDiagnosisStore();
const isSecondDiagnosis = ref(false);
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

const { errors, validateForm, handleInput, handleIdentificationInput } = useRequestValidation(form);

// Xử lý validate số CCCD
const handleIdNumberChange = (value: string | number) => {
    handleIdentificationInput(value);
};

const COOLDOWN_TIME = 2; // Thời gian chờ (giây)
const isSubmitDisabled = ref(false);
const cooldownTimer = ref(COOLDOWN_TIME);
let timerInterval: NodeJS.Timer | null = null;

// Hàm đếm ngược
const startCooldownTimer = () => {
    isSubmitDisabled.value = true;
    cooldownTimer.value = COOLDOWN_TIME;

    timerInterval = setInterval(() => {
        cooldownTimer.value--;
        if (cooldownTimer.value <= 0) {
            clearInterval(timerInterval as NodeJS.Timer);
            isSubmitDisabled.value = false;
            cooldownTimer.value = COOLDOWN_TIME;
        }
    }, 1000);
};


// Thêm vào phần script setup
const showQuestionModal = ref(false);

const additionalQuestions = [
    {
        text: "Vùng da bị tổn thương có ngứa không?",
        answers: [
            { id: 1, text: "Có" },
            { id: 2, text: "Không" }
        ]
    },
    {
        text: "Vùng da của bạn có bị đỏ lên so với vùng da bình thường không?",
        answers: [
            { id: 1, text: "Có" },
            { id: 2, text: "Không" }
        ]
    },
    {
        text: "Bạn có thấy vùng da bị tổn thương có dấu hiệu sưng nề không?",
        answers: [
            { id: 1, text: "Có" },
            { id: 2, text: "Không" }
        ]
    },
    {
        text: "Bạn có nhận thấy xuất hiện các nốt hoặc mảng phát ban trên da không?",
        answers: [
            { id: 1, text: "Có" },
            { id: 2, text: "Không" }
        ]
    },
    {
        text: "Có mụn nước nhỏ chứa dịch trong nổi lên trên vùng da bị tổn thương không?",
        answers: [
            { id: 1, text: "Có" },
            { id: 2, text: "Không" }
        ]
    },
    {
        text: "Vùng da của bạn có bị loét hoặc có vết thương hở không?",
        answers: [
            { id: 1, text: "Có" },
            { id: 2, text: "Không" }
        ]
    },
    {
        text: "Bạn có thấy vùng da bị tổn thương có dấu hiệu tróc vảy hoặc bong vảy không?",
        answers: [
            { id: 1, text: "Có" },
            { id: 2, text: "Không" }
        ]
    },
    {
        text: "Vùng da bị tổn thương có cảm giác đau hoặc rát không?",
        answers: [
            { id: 1, text: "Có" },
            { id: 2, text: "Không" }
        ]
    },
    {
        text: "Bạn có thấy vùng tổn thương bị chảy mủ, có mùi hôi hoặc xuất hiện các dấu hiệu nhiễm trùng không?",
        answers: [
            { id: 1, text: "Có" },
            { id: 2, text: "Không" }
        ]
    },
    {
        text: "Các tổn thương trên da có xuất hiện đều và đối xứng ở cả hai bên cơ thể không (ví dụ như hai tay, hai chân)?",
        answers: [
            { id: 1, text: "Có" },
            { id: 2, text: "Không" }
        ]
    }
];

// Xóa interval khi component unmount
onUnmounted(() => {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
});

// Cập nhật hàm handleSubmit
const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
        isProcessing.value = true;
        const response = await diagnosisStore.submitDiagnosis(form.value);
        diagnosisResult.value = response;
        diagnosisStore.setCurrentDiagnosisId(response.data.id);
        toast.success(response.message);
        startCooldownTimer();
    } catch (error) {
        console.error(error);
        toast.error('Gửi yêu cầu thất bại. Vui lòng thử lại.');
    } finally {
        isProcessing.value = false;
    }
};

const handleQuestionSubmit = (response) => {
    isSecondDiagnosis.value = true;
    if (diagnosisResult.value) {
        diagnosisResult.value = {
            ...diagnosisResult.value,
            data: {
                ...diagnosisResult.value.data,
                result: response.result,
            }
        };
    }
};
const handleImageChanged = (file: File | null) => {
    form.value.image = file;
    handleInput('image', file);
};
const handlePrint = () => {
    if (!diagnosisResult.value || !isSecondDiagnosis.value) return;

    const printFormContent = {
        patientInfo: {
            id: diagnosisResult.value.data.id,
            name: diagnosisResult.value.data.name,
            age: diagnosisResult.value.data.age,
            gender: diagnosisResult.value.data.gender,
            phone: diagnosisResult.value.data.phone,
            address: diagnosisResult.value.data.address,
            symptom: diagnosisResult.value.data.symptom,
            image: diagnosisResult.value.data.image,
            created_at: diagnosisResult.value.data.created_at
        },
        diagnosisResult: diagnosisResult.value.data.result,
        diseases: diagnosisStore.diagnosedDiseases
    };

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Tạo nội dung in
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
  /* Đảm bảo mỗi phần chính bắt đầu trên trang mới */
  .diagnosis-section {
    page-break-before: always;
  }

  /* Ngăn các phần bị cắt giữa các trang */
  .result-box,
  .diseases-box,
  .disease-item {
    page-break-inside: avoid;
  }

  /* Reset các margin và padding */
  .paper-container {
    padding: 0 !important;
    margin: 0 !important;
  }

  .paper-content {
    margin: 0 !important;
    padding: 1cm !important;
    box-shadow: none !important;
  }

  /* Đảm bảo nội dung luôn hiển thị đầy đủ */
  * {
    overflow: visible !important;
  }

  /* Điều chỉnh khoảng cách giữa các phần */
  .section-box {
    margin-bottom: 20px !important;
  }

  /* Fix vấn đề với flexbox khi in */
  .form-header,
  .disease-header {
    display: block !important;
  }

  /* Ẩn các phần không cần thiết khi in */
  .action-buttons,
  .form-actions,
  .submit-wrapper,
  .cooldown-message {
    display: none !important;
  }
}
            </style>
        </head>
        <body>
           ${printFormRef.value?.$el.outerHTML}
            <!-- Bootstrap JS -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js">
</body>

</html>
`);
    const prepareForPrint = () => {
        // Đảm bảo tất cả nội dung đã load
        nextTick(() => {
            // Tính toán và điều chỉnh chiều cao các phần
            const sections = document.querySelectorAll('.section-box');
            sections.forEach(section => {
                const height = (section as HTMLElement).offsetHeight;
                if (height > 900) { // Khoảng 80% chiều cao A4
                    (section as HTMLElement).style.pageBreakAfter = 'always';
                }
            });
        });
    };
    printWindow.document.close();

    // In sau khi tất cả tài nguyên đã load
    printWindow.onload = () => {
        printWindow.focus();
        prepareForPrint();
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
    gap: 8rem;
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

.submit-button {
    position: relative;
    overflow: hidden;
}

.submit-button:disabled {
    background-color: #94a3b8;
    cursor: not-allowed;
    opacity: 0.8;
}

.submit-button i {
    transition: all 0.3s ease;
}

.submit-button i.hidden {
    opacity: 0;
    transform: translateY(20px);
}

.submit-button i.show {
    opacity: 1;
}

.submit-button i.spin {
    animation: spin 1s linear infinite;
}

.submit-button.is-processing {
    background-color: #4b5563;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* Hiệu ứng ripple khi click */
.submit-button::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
    background-repeat: no-repeat;
    background-position: 50%;
    transform: scale(10, 10);
    opacity: 0;
    transition: transform .5s, opacity 1s;
}

.submit-button:active::after {
    transform: scale(0, 0);
    opacity: .3;
    transition: 0s;
}

/* Thêm hiệu ứng hover */
.submit-button:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgb(59 130 246 / 0.3);
}

.submit-button:not(:disabled):active {
    transform: translateY(0px);
}

.note-box {
    background-color: #f8fafc;
    border-left: 4px solid #3b82f6;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
}

.note-text {
    color: #334155;
    margin: 0;
    display: flex;
    align-items: center;
}

.answer-more-btn {
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
    height: fit-content;
}

.answer-more-btn:hover {
    background-color: #2563eb;
    transform: translateY(-1px);
}

.answer-more-btn i {
    font-size: 1.1rem;
}
</style>