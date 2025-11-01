<template>
    <!-- Show Form or Chat based on state -->
    <div v-if="!showChat" class="paper-container">
        <div class="paper-content">
            <!-- Header -->
            <div class="form-header">
                <h2 class="form-title">
                    <i class="bi bi-file-medical"></i>
                    Đăng ký khám bệnh
                </h2>
                <p class="form-description">Vui lòng điền đầy đủ thông tin để được tư vấn</p>
            </div>

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
                                :rows="5" required @input="(value) => handleInput('symptom', value)" />
                        </div>

                        <div class="col-12">
                            <ImageUploader v-model="form.image" label="Hình ảnh triệu chứng" :error="errors.image"
                                required @file-changed="handleImageChanged" />
                        </div>
                    </div>
                </FormCard>

                <!-- Nút submit -->
                <div class="form-actions">
                    <button type="submit" class="submit-button" :disabled="isProcessing">
                        <template v-if="isProcessing">
                            <span class="spinner-border spinner-border-sm me-2"></span>
                            Đang xử lý...
                        </template>
                        <template v-else>
                            <i class="bi bi-send-fill me-2"></i>
                            Gửi yêu cầu khám
                        </template>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Chat Diagnosis -->
    <ChatDiagnosis
        v-else
        :session="diagnosisSession"
        :is-loading="isChatLoading"
        @send-message="handleSendMessage"
        @reset="handleReset"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { DermatologyRequestForm } from '@/types/request';
import type { DiagnosisSession, ChatMessage } from '@/types/chatDiagnosis';
import ImageUploader from '@/components/ImageUploader/ImageUploader.vue';
import FormCard from '@/components/Form/FormCard.vue';
import FormInput from '@/components/Form/FormInput.vue';
import FormTextarea from '@/components/Form/FormTextarea.vue';
import FormSelect from '@/components/Form/FormSelect.vue';
import ChatDiagnosis from './ChatDiagnosis.vue';
import { useRequestValidation } from '@/utils/validations/requestValidation';
import { useToast } from 'vue-toastification';
import chatDiagnosisService from '@/services/chatDiagnosisService';

const isProcessing = ref(false);
const toast = useToast();

// Chat states
const showChat = ref(false);
const isChatLoading = ref(false);
const diagnosisSession = ref<DiagnosisSession>({
    sessionId: '',
    finished: false,
    symptoms: [],
    messages: [],
    top5Diseases: [],
    questionsAsked: 0,
    maxQuestions: 10
});

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
    image: null,
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

// Xử lý thay đổi hình ảnh
const handleImageChanged = (file: File | null) => {
    form.value.image = file;
    handleInput('image', file);
};

// Generate unique ID for messages
const generateMessageId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

// Xử lý submit form - Bắt đầu chẩn đoán
const handleSubmit = async () => {
    if (!validateForm()) {
        toast.error('Vui lòng kiểm tra lại thông tin đã nhập');
        return;
    }

    try {
        isProcessing.value = true;

        // Call API start diagnosis
        const response = await chatDiagnosisService.startDiagnosis(
            form.value.symptom,
            form.value.image
        );

        // Initialize session
        diagnosisSession.value = {
            sessionId: response.session_id,
            finished: response.finished,
            symptoms: response.symptoms,
            messages: [
                {
                    id: generateMessageId(),
                    role: 'assistant',
                    content: response.question,
                    timestamp: new Date(),
                    metadata: {
                        symptoms: response.symptoms,
                        top_5_diseases: response.top_5_diseases
                    }
                }
            ],
            top5Diseases: response.top_5_diseases,
            questionsAsked: 1,
            maxQuestions: 10
        };

        // Switch to chat view
        showChat.value = true;
        toast.success('Bắt đầu chẩn đoán!');

    } catch (error) {
        console.error(error);
        toast.error('Không thể bắt đầu chẩn đoán. Vui lòng thử lại.');
    } finally {
        isProcessing.value = false;
    }
};

// Xử lý gửi tin nhắn trong chat
const handleSendMessage = async (message: string) => {
    if (!message.trim() || diagnosisSession.value.finished) return;

    try {
        // Add user message to chat
        const userMessage: ChatMessage = {
            id: generateMessageId(),
            role: 'user',
            content: message,
            timestamp: new Date()
        };
        diagnosisSession.value.messages.push(userMessage);

        // Check if max questions reached
        if (diagnosisSession.value.questionsAsked >= diagnosisSession.value.maxQuestions) {
            diagnosisSession.value.finished = true;

            const finalMessage: ChatMessage = {
                id: generateMessageId(),
                role: 'assistant',
                content: 'Đã đạt số câu hỏi tối đa (10 câu). Dưới đây là kết quả chẩn đoán cuối cùng.',
                timestamp: new Date()
            };
            diagnosisSession.value.messages.push(finalMessage);
            toast.info('Đã kết thúc chẩn đoán');
            return;
        }

        isChatLoading.value = true;

        // Call API respond
        const response = await chatDiagnosisService.respondToQuestion(
            diagnosisSession.value.sessionId,
            message,
            diagnosisSession.value.symptoms
        );

        // Update session with response
        diagnosisSession.value.finished = response.finished;
        diagnosisSession.value.symptoms = response.symptoms;
        diagnosisSession.value.top5Diseases = response.top_5_diseases;
        diagnosisSession.value.questionsAsked = response.questions_asked;

        // Add assistant response
        const assistantMessage: ChatMessage = {
            id: generateMessageId(),
            role: 'assistant',
            content: response.finished
                ? 'Cảm ơn bạn đã cung cấp thông tin. Dưới đây là kết quả chẩn đoán:'
                : response.question,
            timestamp: new Date(),
            metadata: {
                symptoms: response.symptoms,
                new_symptoms_detected: response.new_symptoms_detected,
                top_5_diseases: response.top_5_diseases,
                questions_asked: response.questions_asked
            }
        };
        diagnosisSession.value.messages.push(assistantMessage);

        // Show notification if finished
        if (response.finished) {
            toast.success('Chẩn đoán hoàn tất!');
        }

    } catch (error) {
        console.error(error);
        toast.error('Không thể gửi tin nhắn. Vui lòng thử lại.');
    } finally {
        isChatLoading.value = false;
    }
};

// Reset về form ban đầu
const handleReset = () => {
    showChat.value = false;
    form.value = { ...initialFormData };
    diagnosisSession.value = {
        sessionId: '',
        finished: false,
        symptoms: [],
        messages: [],
        top5Diseases: [],
        questionsAsked: 0,
        maxQuestions: 10
    };
    toast.info('Đã đặt lại form');
};
</script>

<style scoped>
/* Container và Layout chính */
.paper-container {
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

.paper-content {
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    max-width: 900px;
    margin: 0 auto;
    padding: 3rem;
    animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Header của form */
.form-header {
    text-align: center;
    margin-bottom: 2.5rem;
    padding-bottom: 2rem;
    border-bottom: 2px solid #f1f5f9;
}

.form-title {
    color: #1e293b;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
}

.form-title i {
    color: #3b82f6;
    font-size: 2.2rem;
}

.form-description {
    color: #64748b;
    font-size: 1rem;
    margin: 0;
}

/* Form chính */
.appointment-form {
    width: 100%;
}

/* Actions của form */
.form-actions {
    display: flex;
    justify-content: center;
    margin-top: 2.5rem;
    padding-top: 2rem;
    border-top: 2px solid #f1f5f9;
}

/* Nút submit */
.submit-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1rem 3rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    position: relative;
    overflow: hidden;
}

.submit-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
}

.submit-button:hover::before {
    left: 100%;
}

.submit-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.submit-button:active {
    transform: translateY(0);
}

.submit-button:disabled {
    background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
    box-shadow: none;
}

.submit-button i {
    font-size: 1.2rem;
}

/* Spinner animation */
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .paper-container {
        padding: 1rem;
    }

    .paper-content {
        padding: 2rem 1.5rem;
        border-radius: 15px;
    }

    .form-header {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
    }

    .form-title {
        font-size: 1.5rem;
    }

    .form-title i {
        font-size: 1.7rem;
    }

    .form-description {
        font-size: 0.9rem;
    }

    .form-actions {
        margin-top: 2rem;
    }

    .submit-button {
        width: 100%;
        padding: 0.875rem 2rem;
        font-size: 1rem;
    }
}

@media (max-width: 480px) {
    .paper-content {
        padding: 1.5rem 1rem;
    }

    .form-title {
        font-size: 1.3rem;
        flex-direction: column;
        gap: 0.5rem;
    }
}
</style>