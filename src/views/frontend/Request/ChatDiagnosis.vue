<template>
    <div class="chat-container">
        <!-- Header -->
        <div class="chat-header">
            <div class="header-content">
                <i class="bi bi-robot"></i>
                <div>
                    <h3 class="header-title">Trợ lý chẩn đoán AI</h3>
                    <p class="header-subtitle">
                        Câu hỏi {{ session.questionsAsked }}/{{ session.maxQuestions }}
                    </p>
                </div>
            </div>
            <button @click="$emit('reset')" class="reset-btn" title="Bắt đầu lại">
                <i class="bi bi-arrow-counterclockwise"></i>
            </button>
        </div>

        <!-- Sidebar - Top 5 Diseases -->
        <div class="chat-layout">
            <div class="sidebar">
                <div class="sidebar-header">
                    <i class="bi bi-heart-pulse-fill"></i>
                    <h4>Top 5 bệnh khả năng</h4>
                </div>
                <div class="disease-list">
                    <div v-for="(disease, index) in session.top5Diseases" :key="index" class="disease-item">
                        <div class="disease-rank">#{{ index + 1 }}</div>
                        <div class="disease-info">
                            <div class="disease-name">{{ disease.disease }}</div>
                            <div class="disease-probability">
                                <div class="probability-bar">
                                    <div class="probability-fill" :style="{
                                        width: (disease.probability * 100) + '%',
                                        background: getProbabilityColor(disease.probability)
                                    }"></div>
                                </div>
                                <span class="probability-text">
                                    {{ (disease.probability * 100).toFixed(1) }}%
                                </span>
                            </div>
                            <div class="disease-rationale">{{ disease.rationale }}</div>
                        </div>
                    </div>
                </div>

                <!-- Symptoms detected -->
                <div v-if="session.symptoms.length > 0" class="symptoms-section">
                    <div class="symptoms-header">
                        <i class="bi bi-clipboard2-pulse"></i>
                        <h4>Triệu chứng đã phát hiện</h4>
                    </div>
                    <div class="symptoms-tags">
                        <span v-for="symptom in session.symptoms" :key="symptom" class="symptom-tag">
                            {{ symptom }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Chat Messages Area -->
            <div class="chat-main">
                <div ref="messagesContainer" class="messages-container">
                    <div v-for="message in session.messages" :key="message.id"
                         class="message-wrapper" :class="message.role">

                        <!-- Assistant Message -->
                        <div v-if="message.role === 'assistant'" class="message assistant-message">
                            <div class="message-avatar">
                                <i class="bi bi-robot"></i>
                            </div>
                            <div class="message-content">
                                <div class="message-text" v-html="formatMessage(message.content)"></div>

                                <!-- Show new symptoms detected if any -->
                                <div v-if="message.metadata?.new_symptoms_detected?.length"
                                     class="new-symptoms-alert">
                                    <i class="bi bi-exclamation-circle-fill"></i>
                                    <span>Phát hiện thêm triệu chứng:
                                        <strong>{{ message.metadata.new_symptoms_detected.join(', ') }}</strong>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- User Message -->
                        <div v-if="message.role === 'user'" class="message user-message">
                            <div class="message-content">
                                <div class="message-text">{{ message.content }}</div>
                            </div>
                            <div class="message-avatar">
                                <i class="bi bi-person-fill"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Loading indicator -->
                    <div v-if="isLoading" class="message-wrapper assistant">
                        <div class="message assistant-message">
                            <div class="message-avatar">
                                <i class="bi bi-robot"></i>
                            </div>
                            <div class="message-content">
                                <div class="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Final Result -->
                    <div v-if="session.finished" class="final-result">
                        <div class="result-header">
                            <i class="bi bi-check-circle-fill"></i>
                            <h3>Kết quả chẩn đoán</h3>
                        </div>
                        <p class="result-message">
                            Dựa trên thông tin bạn cung cấp, dưới đây là 5 bệnh có khả năng cao nhất:
                        </p>
                        <div class="final-diseases">
                            <div v-for="(disease, index) in session.top5Diseases" :key="index"
                                 class="final-disease-card">
                                <div class="final-disease-rank">#{{ index + 1 }}</div>
                                <div class="final-disease-content">
                                    <h4 class="final-disease-name">{{ disease.disease }}</h4>
                                    <div class="final-probability">
                                        <div class="final-probability-bar">
                                            <div class="final-probability-fill"
                                                 :style="{ width: (disease.probability * 100) + '%' }">
                                            </div>
                                        </div>
                                        <span class="final-probability-text">
                                            {{ (disease.probability * 100).toFixed(1) }}%
                                        </span>
                                    </div>
                                    <p class="final-rationale">{{ disease.rationale }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="result-footer">
                            <p class="disclaimer">
                                <i class="bi bi-info-circle"></i>
                                Kết quả này chỉ mang tính chất tham khảo. Vui lòng đến gặp bác sĩ để được chẩn đoán và điều trị chính xác.
                            </p>
                            <button @click="$emit('reset')" class="restart-btn">
                                <i class="bi bi-arrow-clockwise"></i>
                                Bắt đầu chẩn đoán mới
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Input Area -->
                <div v-if="!session.finished" class="input-area">
                    <form @submit.prevent="handleSubmit" class="input-form">
                        <input
                            v-model="userInput"
                            type="text"
                            placeholder="Nhập câu trả lời của bạn..."
                            class="message-input"
                            :disabled="isLoading"
                            ref="inputRef"
                        />
                        <button
                            type="submit"
                            class="send-btn"
                            :disabled="isLoading || !userInput.trim()"
                        >
                            <i class="bi bi-send-fill"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';
import type { DiagnosisSession } from '@/types/chatDiagnosis';

interface Props {
    session: DiagnosisSession;
    isLoading: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: 'sendMessage', message: string): void;
    (e: 'reset'): void;
}>();

const userInput = ref('');
const messagesContainer = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

// Handle submit
const handleSubmit = () => {
    if (userInput.value.trim() && !props.isLoading) {
        emit('sendMessage', userInput.value.trim());
        userInput.value = '';
    }
};

// Format message with line breaks
const formatMessage = (text: string) => {
    return text.replace(/\n/g, '<br>');
};

// Get color based on probability
const getProbabilityColor = (probability: number) => {
    if (probability >= 0.7) return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    if (probability >= 0.5) return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    if (probability >= 0.3) return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
    return 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
};

// Auto scroll to bottom when new message
watch(() => props.session.messages.length, async () => {
    await nextTick();
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
});

// Focus input after loading
watch(() => props.isLoading, (newVal) => {
    if (!newVal && inputRef.value) {
        nextTick(() => {
            inputRef.value?.focus();
        });
    }
});
</script>

<style scoped>
.chat-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f8fafc;
}

/* Header */
.chat-header {
    background: white;
    border-bottom: 1px solid #e2e8f0;
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.header-content>i {
    font-size: 2rem;
    color: #667eea;
}

.header-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
}

.header-subtitle {
    margin: 0;
    font-size: 0.875rem;
    color: #64748b;
}

.reset-btn {
    background: #f1f5f9;
    border: none;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: all 0.2s;
}

.reset-btn:hover {
    background: #e2e8f0;
}

.reset-btn i {
    font-size: 1.25rem;
    color: #475569;
}

/* Layout */
.chat-layout {
    display: flex;
    flex: 1;
    overflow: hidden;
}

/* Sidebar */
.sidebar {
    width: 350px;
    background: white;
    border-right: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}

.sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.sidebar-header i {
    font-size: 1.5rem;
}

.sidebar-header h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
}

.disease-list {
    flex: 1;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.disease-item {
    display: flex;
    gap: 0.75rem;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    transition: all 0.2s;
}

.disease-item:hover {
    border-color: #667eea;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
}

.disease-rank {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.875rem;
}

.disease-info {
    flex: 1;
    min-width: 0;
}

.disease-name {
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.5rem;
    font-size: 0.9375rem;
}

.disease-probability {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.probability-bar {
    flex: 1;
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
}

.probability-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease;
}

.probability-text {
    font-size: 0.875rem;
    font-weight: 600;
    color: #475569;
    min-width: 45px;
    text-align: right;
}

.disease-rationale {
    font-size: 0.8125rem;
    color: #64748b;
    line-height: 1.4;
}

/* Symptoms section */
.symptoms-section {
    padding: 1rem;
    border-top: 1px solid #e2e8f0;
    background: #f8fafc;
}

.symptoms-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
}

.symptoms-header i {
    color: #667eea;
    font-size: 1.25rem;
}

.symptoms-header h4 {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #1e293b;
}

.symptoms-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.symptom-tag {
    background: white;
    border: 1px solid #e2e8f0;
    padding: 0.375rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8125rem;
    color: #475569;
    font-weight: 500;
}

/* Chat Main */
.chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: white;
}

.messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.message-wrapper {
    display: flex;
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.message {
    display: flex;
    gap: 1rem;
    max-width: 80%;
}

.assistant-message {
    align-self: flex-start;
}

.user-message {
    align-self: flex-end;
}

.message-avatar {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
}

.assistant-message .message-avatar {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.user-message .message-avatar {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
}

.message-content {
    flex: 1;
}

.assistant-message .message-content {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1rem 1.25rem;
}

.user-message .message-content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px;
    padding: 1rem 1.25rem;
}

.message-text {
    line-height: 1.6;
    word-wrap: break-word;
}

.new-symptoms-alert {
    margin-top: 0.75rem;
    padding: 0.75rem;
    background: #fef3c7;
    border-left: 3px solid #f59e0b;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #92400e;
}

.new-symptoms-alert i {
    font-size: 1rem;
    color: #f59e0b;
}

/* Typing indicator */
.typing-indicator {
    display: flex;
    gap: 0.375rem;
    padding: 0.5rem 0;
}

.typing-indicator span {
    width: 8px;
    height: 8px;
    background: #94a3b8;
    border-radius: 50%;
    animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typing {

    0%,
    60%,
    100% {
        transform: translateY(0);
        opacity: 0.7;
    }

    30% {
        transform: translateY(-10px);
        opacity: 1;
    }
}

/* Final Result */
.final-result {
    background: white;
    border: 2px solid #667eea;
    border-radius: 16px;
    padding: 2rem;
    margin-top: 1rem;
    animation: slideIn 0.5s ease-out;
}

.result-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.result-header i {
    font-size: 2.5rem;
    color: #22c55e;
}

.result-header h3 {
    margin: 0;
    font-size: 1.5rem;
    color: #1e293b;
}

.result-message {
    color: #475569;
    margin-bottom: 1.5rem;
    line-height: 1.6;
}

.final-diseases {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.final-disease-card {
    display: flex;
    gap: 1rem;
    padding: 1.25rem;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-radius: 12px;
    border: 1px solid #cbd5e1;
}

.final-disease-rank {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.25rem;
}

.final-disease-content {
    flex: 1;
}

.final-disease-name {
    margin: 0 0 0.75rem 0;
    font-size: 1.125rem;
    color: #1e293b;
}

.final-probability {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.75rem;
}

.final-probability-bar {
    flex: 1;
    height: 12px;
    background: white;
    border-radius: 6px;
    overflow: hidden;
}

.final-probability-fill {
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 6px;
    transition: width 0.5s ease;
}

.final-probability-text {
    font-size: 1rem;
    font-weight: 700;
    color: #475569;
    min-width: 60px;
    text-align: right;
}

.final-rationale {
    margin: 0;
    font-size: 0.9375rem;
    color: #64748b;
    line-height: 1.5;
}

.result-footer {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e2e8f0;
}

.disclaimer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: #fef3c7;
    border-radius: 8px;
    margin-bottom: 1rem;
    color: #92400e;
    font-size: 0.9375rem;
    line-height: 1.5;
}

.disclaimer i {
    font-size: 1.25rem;
    color: #f59e0b;
}

.restart-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.restart-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Input Area */
.input-area {
    padding: 1.5rem;
    border-top: 1px solid #e2e8f0;
    background: white;
}

.input-form {
    display: flex;
    gap: 1rem;
    max-width: 900px;
    margin: 0 auto;
}

.message-input {
    flex: 1;
    padding: 0.875rem 1.25rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1rem;
    outline: none;
    transition: all 0.2s;
}

.message-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.message-input:disabled {
    background: #f8fafc;
    cursor: not-allowed;
}

.send-btn {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.send-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.send-btn:disabled {
    background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
    cursor: not-allowed;
    opacity: 0.5;
}

.send-btn i {
    font-size: 1.25rem;
}

/* Responsive */
@media (max-width: 1024px) {
    .sidebar {
        width: 300px;
    }
}

@media (max-width: 768px) {
    .chat-layout {
        flex-direction: column;
    }

    .sidebar {
        width: 100%;
        max-height: 40vh;
        border-right: none;
        border-bottom: 1px solid #e2e8f0;
    }

    .message {
        max-width: 90%;
    }
}
</style>
