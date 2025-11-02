<template>
    <!-- Show Form or Chat based on state -->
    <div v-if="!showChat" class="request-container">

        <!-- Form Content -->
        <form class="request-form" @submit.prevent="handleSubmit" novalidate>
            <div class="form-grid">
                <!-- Left Column: Personal Information -->
                <div class="form-column">
                    <div class="form-section">
                        <h3 class="section-title">Thông tin cá nhân</h3>

                        <div class="form-row">
                            <div class="form-col-full">
                                <FormInput v-model="form.name" label="Họ và tên" placeholder="Nhập họ và tên"
                                    :error="errors.name" required @input="(value) => handleInput('name', value)" />
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-col-half">
                                <FormInput v-model="form.age" label="Tuổi" placeholder="Nhập tuổi" type="tel"
                                    :error="errors.age" required @input="(value) => handleInput('age', value)" />
                            </div>
                            <div class="form-col-half">
                                <FormSelect v-model="form.gender" label="Giới tính" placeholder="Chọn giới tính"
                                    :options="genderOptions" :error="errors.gender" required
                                    @change="(value) => handleInput('gender', value)" />
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-col-full">
                                <FormInput v-model="form.identification" label="Số CCCD" placeholder="Nhập số CCCD"
                                    type="text" maxlength="12" :error="errors.identification" required
                                    @input="handleIdNumberChange" />
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-col-full">
                                <FormInput v-model="form.phone" label="Số điện thoại" placeholder="Nhập số điện thoại"
                                    type="tel" :error="errors.phone" required
                                    @input="(value) => handleInput('phone', value)" />
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-col-full">
                                <FormInput v-model="form.email" label="Email" placeholder="Nhập địa chỉ email" type="email"
                                    :error="errors.email" @input="(value) => handleInput('email', value)" />
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-col-full">
                                <FormInput v-model="form.address" label="Địa chỉ" placeholder="Nhập địa chỉ hiện tại"
                                    :error="errors.address" required @input="(value) => handleInput('address', value)" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Symptoms & Image -->
                <div class="form-column">
                    <div class="form-section">
                        <h3 class="section-title">Thông tin triệu chứng</h3>

                        <div class="form-row">
                            <div class="form-col-full">
                                <FormTextarea v-model="form.symptom" label="Mô tả triệu chứng"
                                    placeholder="Mô tả chi tiết các triệu chứng bạn đang gặp phải" :error="errors.symptom"
                                    :rows="4" required @input="(value) => handleInput('symptom', value)" />
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-col-full">
                                <ImageUploader v-model="form.image" label="Hình ảnh triệu chứng" :error="errors.image"
                                    required @file-changed="handleImageChanged" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Submit Button -->
            <div class="form-footer">
                <button type="submit" class="submit-button" :disabled="isProcessing">
                    <template v-if="isProcessing">
                        <span class="spinner-border spinner-border-sm me-2"></span>
                        Đang xử lý...
                    </template>
                    <template v-else>
                        Gửi yêu cầu khám
                    </template>
                </button>
            </div>
        </form>
    </div>

    <!-- Chat Diagnosis -->
    <ChatDiagnosis
        v-else
        :session="diagnosisSession"
        :is-loading="isChatLoading"
        :patient-info="form"
        @send-message="handleSendMessage"
        @reset="handleReset"
        @print-report="handlePrintReport"
    />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { DermatologyRequestForm } from '@/types/request';
import type { DiagnosisSession, ChatMessage } from '@/types/chatDiagnosis';
import ImageUploader from '@/components/ImageUploader/ImageUploader.vue';
import FormInput from '@/components/Form/FormInput.vue';
import FormTextarea from '@/components/Form/FormTextarea.vue';
import FormSelect from '@/components/Form/FormSelect.vue';
import ChatDiagnosis from './ChatDiagnosis.vue';
import DiagnosisReportPrint from '@/components/DiagnosisReport/DiagnosisReportPrint.vue';
import { useRequestValidation } from '@/utils/validations/requestValidation';
import { useToast } from 'vue-toastification';
import chatDiagnosisService from '@/services/chatDiagnosisService';
import diseasesService from '@/services/diseasesService';

const isProcessing = ref(false);
const toast = useToast();

// LocalStorage keys
const CHAT_STATE_KEY = 'diagnosis_chat_state';
const SHOW_CHAT_KEY = 'show_diagnosis_chat';
const FORM_DATA_KEY = 'diagnosis_form_data';

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

// Save chat state to localStorage
const saveChatState = () => {
    try {
        const state = {
            showChat: showChat.value,
            diagnosisSession: diagnosisSession.value
        };
        localStorage.setItem(CHAT_STATE_KEY, JSON.stringify(state));
        localStorage.setItem(SHOW_CHAT_KEY, showChat.value.toString());
    } catch (error) {
        console.error('Error saving chat state:', error);
    }
};

// Load chat state from localStorage
const loadChatState = () => {
    try {
        const savedShowChat = localStorage.getItem(SHOW_CHAT_KEY);
        if (savedShowChat === 'true') {
            const savedState = localStorage.getItem(CHAT_STATE_KEY);
            if (savedState) {
                const state = JSON.parse(savedState);
                // Convert timestamp strings back to Date objects
                if (state.diagnosisSession.messages) {
                    state.diagnosisSession.messages = state.diagnosisSession.messages.map((msg: ChatMessage) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp)
                    }));
                }
                diagnosisSession.value = state.diagnosisSession;
                showChat.value = true;
            }
        }
    } catch (error) {
        console.error('Error loading chat state:', error);
    }
};

// Clear chat state from localStorage
const clearChatState = () => {
    try {
        localStorage.removeItem(CHAT_STATE_KEY);
        localStorage.removeItem(SHOW_CHAT_KEY);
    } catch (error) {
        console.error('Error clearing chat state:', error);
    }
};

// Save form data to localStorage (exclude image file)
const saveFormData = () => {
    try {
        const formDataToSave = {
            name: form.value.name,
            age: form.value.age,
            gender: form.value.gender,
            identification: form.value.identification,
            phone: form.value.phone,
            email: form.value.email,
            address: form.value.address,
            symptom: form.value.symptom
        };
        localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formDataToSave));
    } catch (error) {
        console.error('Error saving form data:', error);
    }
};

// Load form data from localStorage
const loadFormData = () => {
    try {
        const savedFormData = localStorage.getItem(FORM_DATA_KEY);
        if (savedFormData) {
            const formData = JSON.parse(savedFormData);
            form.value = { ...form.value, ...formData };
        }
    } catch (error) {
        console.error('Error loading form data:', error);
    }
};

// Watch for changes and save to localStorage
watch(
    [showChat, diagnosisSession],
    () => {
        if (showChat.value) {
            saveChatState();
        }
    },
    { deep: true }
);

// Initialize on component mount
onMounted(() => {
    loadChatState();
    loadFormData();
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

// Watch form changes and save to localStorage
watch(
    form,
    () => {
        saveFormData();
    },
    { deep: true }
);

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

        // Call API start diagnosis with patient info
        const response = await chatDiagnosisService.startDiagnosis(
            form.value.symptom,
            form.value.image,
            {
                name: form.value.name,
                age: form.value.age,
                gender: form.value.gender,
                identification: form.value.identification,
                phone: form.value.phone,
                email: form.value.email,
                address: form.value.address
            }
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
    clearChatState();
    // Clear form data from localStorage
    try {
        localStorage.removeItem(FORM_DATA_KEY);
    } catch (error) {
        console.error('Error clearing form data:', error);
    }
    toast.info('Đã đặt lại form');
};

// Handle print report
const handlePrintReport = async () => {
    // Create a new window to display the report print component
    const printWindow = window.open('', '', 'height=800,width=1000');
    if (printWindow) {
        try {
            // Get the HTML content for the report (now async)
            const reportHTML = await generateReportHTML();
            printWindow.document.write(reportHTML);
            printWindow.document.close();

            // Wait for content to load, then print
            setTimeout(() => {
                printWindow.print();
            }, 250);
        } catch (error) {
            console.error('Error generating report:', error);
            toast.error('Lỗi khi tạo báo cáo');
            printWindow.close();
        }
    }
};

// Generate report HTML matching Word template exactly
const generateReportHTML = async () => {
    const top5Diseases = diagnosisSession.value.top5Diseases || [];
    const primaryDisease = top5Diseases[0];
    const otherDiseases = top5Diseases.slice(1);

    // Safe value getter - returns value or empty string
    const safeValue = (value: any) => {
        if (value === null || value === undefined || value === '') {
            return '';
        }
        return String(value).trim();
    };

    // Get patient data from form
    const patientName = form.value.name ? safeValue(form.value.name) : '';
    const patientAge = form.value.age ? safeValue(form.value.age) : '';
    const patientGender = form.value.gender ? safeValue(form.value.gender) : '';
    const patientId = form.value.identification ? safeValue(form.value.identification) : '';
    const symptomDescription = form.value.symptom ? safeValue(form.value.symptom) : '';

    // Generate Mã Phiếu from sessionId
    const maPhieu = `AI-[${safeValue(diagnosisSession.value.sessionId).substring(0, 8)}]`;
    let today;
    let ngayThuTuc = '';

    try {
        today = new Date();
        ngayThuTuc = today.toLocaleDateString('vi-VN');
    } catch (error) {
        console.error('Date error:', error);
        ngayThuTuc = new Date().toLocaleDateString('vi-VN');
    }

    // Generate other diseases list (name + percentage only)
    const otherDiseasesList = otherDiseases.map(disease =>
        `- ${disease.disease || ''} (${(disease.probability * 100).toFixed(1)}%)`
    ).join('<br/>');

    // Fetch disease details for treatment and prevention
    let treatmentContent = '';
    let preventionContent = '';

    if (primaryDisease && (primaryDisease as any).id) {
        try {
            const diseaseDetail = await diseasesService.getDiseaseByCode((primaryDisease as any).id);
            if (diseaseDetail) {
                if (diseaseDetail.treatment) {
                    treatmentContent = diseasesService.extractTreatmentContent(diseaseDetail.treatment);
                }
                // Note: prevention field is added in the API response based on your spec
                if ((diseaseDetail as any).prevention) {
                    preventionContent = diseasesService.extractPreventionContent((diseaseDetail as any).prevention);
                }
            }
        } catch (error) {
            console.error('Error fetching disease details:', error);
        }
    }

    // Format treatment content to HTML
    const treatmentHTML = treatmentContent
        ? treatmentContent
            .split('\n')
            .filter(line => line.trim().length > 0)
            .map(line => `<div class="info-row" style="margin-left: 20px;">${line.trim()}</div>`)
            .join('')
        : '<div class="info-row" style="margin-left: 20px;">Chưa có dữ liệu</div>';

    // Format prevention content to HTML
    const preventionHTML = preventionContent
        ? preventionContent
            .split('\n')
            .filter(line => line.trim().length > 0)
            .map(line => `<div class="info-row" style="margin-left: 20px;">${line.trim()}</div>`)
            .join('')
        : '<div class="info-row" style="margin-left: 20px;">Chưa có dữ liệu</div>';

    return `
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
                .dotted-line {
                    border-bottom: 1px dotted #000;
                    margin: 0;
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
                        <td>${patientName ? patientName : '[Điền Họ và Tên bệnh nhân]'}</td>
                    </tr>
                    <tr>
                        <td>Ngày Sinh/Tuổi:</td>
                        <td>${patientAge ? patientAge : '[Điền Ngày sinh/Tuổi]'}</td>
                    </tr>
                    <tr>
                        <td>Giới tính:</td>
                        <td>${patientGender ? patientGender : '[Nam/Nữ/Khác]'}</td>
                    </tr>
                    <tr>
                        <td>Số CCCD</td>
                        <td>${patientId ?patientId : '[Mã số bệnh nhân (nếu có)] - Số CCCD'}</td>
                    </tr>
                    <tr>
                        <td>Tính trạng bệnh sư tóm tắt hiện tại:</td>
                        <td>${symptomDescription ? symptomDescription : '[Các triệu chứng/vấn đề chính mà bệnh nhân khai báo]'}</td>
                    </tr>
                </table>

                <!-- PHẦN 2: KẾT QUẢ PHÂN TÍCH VÀ CHẨN ĐOÁN BỆNH LÝ -->
                <div class="section-title">PHẦN 2: KẾT QUẢ PHÂN TÍCH VÀ CHẨN ĐOÁN BỆNH LÝ</div>

                <div class="info-row">
                    <strong>2.1. Kết quả chẩn đoán Chính (Primary Diagnosis):</strong>
                </div>
                ${primaryDisease ? `
                <div class="info-row" style="margin-left: 20px;">
                    <strong>Bệnh:</strong> ${primaryDisease.disease || ''}<br/>
                    <strong>Xác suất:</strong> ${(primaryDisease.probability * 100).toFixed(1)}%<br/>
                </div>
                ` : `
                <div class="info-row" style="margin-left: 20px;">
                    [Tên bệnh da chỉ tiết nhất theo AI - Vi dụ: Viêm da cơ địa, Mụn trứng cá pops độ III, Vay nến màng.]
                </div>
                `}

                <div class="info-row" style="margin-top: 10px;">
                    <strong>2.2. Xác suất các bệnh khác có thể (Differential Diagnosis):</strong>
                </div>
                ${otherDiseases.length > 0 ? `
                <div class="info-row" style="margin-left: 20px;">
                    ${otherDiseasesList}
                </div>
                ` : `
                <div class="info-row" style="margin-left: 20px;">
                    [Các bệnh khác có triệu chứng tương tự, được AI liệt kê theo xác suất thấp hơn.] (Ví dụ: Nấm da (15%), Viêm nang lông (5%))
                </div>
                `}

                <!-- PHẦN 3: ĐỀ XUẤT PHƯƠNG PHÁP ĐIỀU TRỊ -->
                <div class="section-title">PHẦN 3: ĐỀ XUẤT PHƯƠNG PHÁP ĐIỀU TRỊ</div>

                <div class="info-row">
                    <strong>3.1. Đề xuất điều trị cụ thể</strong>
                </div>
                ${treatmentHTML || '<div class="info-row" style="margin-left: 20px;">Chưa có dữ liệu</div>'}

                <div class="info-row">
                    <strong>3.2. Phòng bệnh</strong>
                </div>
                ${preventionHTML || '<div class="info-row" style="margin-left: 20px;">Chưa có dữ liệu</div>'}

                <!-- Footer Note -->
                <div class="footer-note">
                    <strong>Trên đây là kết quả chẩn đoán và đề xuất phương pháp điều trị về bệnh  ${primaryDisease.disease} mà chúng tôi đã chuẩn đoán và đề xuất gửi tới bạn tham khảo. Bạn cần tham vấn và thăm khám thêm từ các Bác sỹ về Da liễu.</strong>
                </div>

                <div style="text-align: center; margin-top: 20px; font-size: 11px;">
                    <p>═══════════════════════════════════════</p>
                    <p>Ngày In: ${ngayThuTuc} - Hệ Thống Truy Xuất và Tạo Sinh cho Chuẩn Đoán Bệnh Lý Về Da</p>
                </div>
            </div>
        </body>
        </html>
    `;
};
</script>

<style scoped>
/* ============================================
   CONTAINER & LAYOUT
   ============================================ */
.request-container {
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 280px);
    background: #ffffff;
}

/* ============================================
   HEADER
   ============================================ */
.request-header {
    padding: 2rem;
    background: linear-gradient(135deg, #f8f9fb 0%, #ffffff 100%);
    border-bottom: 1px solid #e8eaed;
    flex-shrink: 0;
}

.header-content {
    max-width: 1200px;
    margin: 0 auto;
}

.header-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
}

.header-description {
    font-size: 0.95rem;
    color: #64748b;
    margin: 0;
}

/* ============================================
   FORM CONTENT
   ============================================ */
.request-form {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
}

.form-grid {
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}

.form-column {
    display: flex;
    flex-direction: column;
    gap: 0;
}

/* ============================================
   FORM SECTIONS
   ============================================ */
.form-section {
    background: #ffffff;
    border: 1px solid #e8eaed;
    border-radius: 10px;
    padding: 1.5rem;
    transition: all 0.3s ease;
}

.form-section:hover {
    border-color: #1abc9c;
    box-shadow: 0 2px 8px rgba(91, 159, 217, 0.08);
}

.section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 1.25rem 0;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #1abc9c;
    display: inline-block;
}

/* ============================================
   FORM ROWS & COLUMNS
   ============================================ */
.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 0.5rem;
}

.form-row:last-child {
    margin-bottom: 0;
}

.form-col-half {
    grid-column: span 1;
}

.form-col-full {
    grid-column: 1 / -1;
}

/* ============================================
   FORM FOOTER & BUTTONS
   ============================================ */
.form-footer {
    padding: 2rem;
    background: #f8f9fb;
    border-top: 1px solid #e8eaed;
    display: flex;
    justify-content: center;
    flex-shrink: 0;
    margin-top: auto;
}

.submit-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.875rem 2.5rem;
    background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 2px 8px rgba(91, 159, 217, 0.2);
    position: relative;
    overflow: hidden;
}

.submit-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(91, 159, 217, 0.3);
    background: linear-gradient(135deg, #16a085 0%, #3a7bb0 100%);
}

.submit-button:active:not(:disabled) {
    transform: translateY(0);
}

.submit-button:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
    opacity: 0.7;
    box-shadow: none;
}

.submit-button i {
    font-size: 1.1rem;
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */
@media (max-width: 1199.98px) {
    .form-grid {
        grid-template-columns: 1fr;
        max-width: 1000px;
    }

    .form-section {
        padding: 1.25rem;
    }
}

@media (max-width: 991.98px) {
    .request-container {
        min-height: calc(100vh - 220px);
    }

    .request-header {
        padding: 1.5rem;
    }

    .header-title {
        font-size: 1.5rem;
    }

    .header-description {
        font-size: 0.9rem;
    }

    .request-form {
        padding: 1.5rem;
    }

    .form-grid {
        gap: 1.5rem;
    }

    .form-section {
        padding: 1.25rem;
    }

    .section-title {
        font-size: 1rem;
        margin-bottom: 1rem;
    }

    .form-row {
        gap: 1.25rem;
        margin-bottom: 1.25rem;
    }

    .form-footer {
        padding: 1.5rem;
    }

    .submit-button {
        padding: 0.75rem 2rem;
        font-size: 0.95rem;
    }
}

@media (max-width: 768px) {
    .request-container {
        min-height: calc(100vh - 220px);
    }

    .request-header {
        padding: 1.25rem;
    }

    .header-title {
        font-size: 1.35rem;
    }

    .header-description {
        font-size: 0.85rem;
    }

    .request-form {
        padding: 1.25rem;
    }

    .form-row {
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .form-col-half {
        grid-column: 1 / -1;
    }

    .form-section {
        padding: 1rem;
        border-radius: 8px;
    }

    .section-title {
        font-size: 0.95rem;
        margin-bottom: 0.875rem;
    }

    .form-footer {
        padding: 1.25rem;
    }

    .submit-button {
        width: 100%;
        padding: 0.75rem 1.5rem;
        font-size: 0.95rem;
    }
}

@media (max-width: 575.98px) {
    .request-container {
        min-height: calc(100vh - 70px);
    }

    .request-header {
        padding: 1rem;
    }

    .header-title {
        font-size: 1.2rem;
    }

    .header-description {
        font-size: 0.8rem;
    }

    .request-form {
        padding: 1rem;
    }

    .form-grid {
        gap: 1rem;
    }

    .form-row {
        grid-template-columns: 1fr;
        gap: 0.875rem;
        margin-bottom: 0.875rem;
    }

    .form-section {
        padding: 0.875rem;
        border-radius: 6px;
    }

    .section-title {
        font-size: 0.9rem;
        margin-bottom: 0.75rem;
    }

    .form-footer {
        padding: 1rem;
    }

    .submit-button {
        width: 100%;
        padding: 0.7rem 1.25rem;
        font-size: 0.9rem;
    }

    .submit-button i {
        font-size: 1rem;
    }
}
</style>