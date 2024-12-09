<template>
    <div v-if="show" class="modal-overlay">
        <div class="modal-content">
            <!-- Header cố định -->
            <div class="modal-header">
                <h5 class="modal-title">
                    <i class="bi bi-clipboard-pulse me-2"></i>
                    Câu hỏi thêm về triệu chứng
                </h5>
                <button class="close-button" @click="close">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <!-- Body có thể scroll -->
            <div class="modal-body">
                <p class="modal-description">
                    Vui lòng trả lời các câu hỏi sau để có kết quả chẩn đoán chính xác hơn
                </p>
                <div class="questions-list">
                    <div v-for="(question, index) in questions" :key="index" class="question-item">
                        <div class="question-header">
                            <span class="question-number">{{ index + 1 }}</span>
                            <p class="question-text">{{ question.text }}</p>
                        </div>
                        <div class="answers-group">
                            <label v-for="answer in question.answers" :key="answer.id" class="answer-label"
                                :class="{ 'selected': selectedAnswers[index] === answer.id }">
                                <input type="radio" :name="`question-${index}`"
                                    :checked="selectedAnswers[index] === answer.id"
                                    @change="selectAnswer(index, answer.id)" class="answer-radio">
                                <span class="answer-text">{{ answer.text }}</span>
                                <span class="radio-checkmark"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer cố định -->
            <div class="modal-footer">
                <button class="cancel-button" @click="close">
                    <i class="bi bi-x-circle me-1"></i>
                    Hủy bỏ
                </button>
                <button class="submit-button" @click="submitAnswers" :disabled="!isAllAnswered">
                    <i class="bi bi-check-circle me-1" style="color: white;"></i>
                    Hoàn thành
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Question {
    text: string;
    answers: Array<{
        id: number;
        text: string;
    }>;
}

interface Props {
    show: boolean;
    questions: Question[];
}

const props = defineProps<Props>();
const emit = defineEmits(['close', 'submit']);

const selectedAnswers = ref<Record<number, number>>({});

const isAllAnswered = computed(() => {
    return props.questions.every((_, index) => selectedAnswers.value[index] !== undefined);
});

const selectAnswer = (questionIndex: number, answerId: number) => {
    selectedAnswers.value[questionIndex] = answerId;
};

const submitAnswers = () => {
    if (isAllAnswered.value) {
        emit('submit', selectedAnswers.value);
        close();
    }
};

const close = () => {
    emit('close');
    selectedAnswers.value = {};
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 1rem;
}

.modal-content {
    background: white;
    border-radius: 16px;
    width: 90%;
    max-width: 600px;
    height: 90vh; /* Chiều cao cố định */
    display: flex;
    flex-direction: column; /* Sắp xếp các phần tử theo chiều dọc */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.modal-header {
    padding: 1.25rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f8fafc;
    border-radius: 16px 16px 0 0;
    flex-shrink: 0; /* Không co lại */
}

.modal-body {
    padding: 1.5rem;
    overflow-y: auto; /* Chỉ phần content có scroll */
    flex-grow: 1; /* Chiếm phần không gian còn lại */
}

.modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    background-color: #f8fafc;
    border-radius: 0 0 16px 16px;
    flex-shrink: 0; /* Không co lại */
}

.modal-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    display: flex;
    align-items: center;
}

.modal-description {
    color: #64748b;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
}

.questions-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.question-item {
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 2rem;
}

.question-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.question-header {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}

.question-number {
    background-color: #3b82f6;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 600;
    flex-shrink: 0;
}

.question-text {
    font-weight: 500;
    color: #1e293b;
    margin: 0;
    font-size: 1rem;
    line-height: 1.5;
}

.answers-group {
    display: flex;
    gap: 1rem;
    padding-left: 2.5rem;
}

.answer-label {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    flex: 1;
    user-select: none;
}

.answer-label:hover {
    border-color: #3b82f6;
    background-color: #f8fafc;
}

.answer-label.selected {
    border-color: #3b82f6;
    background-color: #eff6ff;
}

.answer-radio {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}

.answer-text {
    font-weight: 500;
    color: #1e293b;
    margin-left: 0.5rem;
}

.radio-checkmark {
    position: absolute;
    right: 1rem;
    width: 20px;
    height: 20px;
    border: 2px solid #e2e8f0;
    border-radius: 50%;
}

.answer-label.selected .radio-checkmark {
    border-color: #3b82f6;
    background-color: #3b82f6;
}

.answer-label.selected .radio-checkmark::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: white;
}

.submit-button,
.cancel-button {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
}

.submit-button {
    background-color: #3b82f6;
    color: white;
    border: none;
}

.submit-button:not(:disabled):hover {
    background-color: #2563eb;
    transform: translateY(-1px);
}

.submit-button:disabled {
    background-color: #94a3b8;
    cursor: not-allowed;
}

.cancel-button {
    background-color: white;
    color: #64748b;
    border: 1px solid #e2e8f0;
}

.cancel-button:hover {
    background-color: #f1f5f9;
    color: #1e293b;
}

@media (max-width: 640px) {
    .answers-group {
        flex-direction: column;
        padding-left: 0;
    }

    .modal-content {
        width: 100%;
        height: 100%;
        max-height: 100%;
        border-radius: 0;
    }

    .modal-header,
    .modal-footer {
        border-radius: 0;
    }
}
</style>