<template>
    <div class="apple-diseases-form-container">

        <!-- Form Content -->
        <form @submit.prevent="handleSubmit" class="form-content">
            <!-- Basic Info Section -->
            <div class="form-section">
                <div class="section-header">
                    <div class="section-icon">
                        <i class="bi bi-info-circle"></i>
                    </div>
                    <h3 class="section-title">Thông tin cơ bản</h3>
                </div>

                <div class="form-group-grid">
                    <div class="form-group">
                        <label class="form-label">Mã bệnh <span class="required"></span></label>
                        <input
                            v-model="formData.code"
                            type="text"
                            class="form-input"
                            placeholder="Nhập mã bệnh"
                            :class="{ 'form-input-error': errors?.code }"
                        />
                        <span v-if="errors?.code" class="error-text">{{ errors.code }}</span>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Tên bệnh <span class="required"></span></label>
                        <input
                            v-model="formData.name"
                            type="text"
                            class="form-input"
                            placeholder="Nhập tên bệnh"
                            :class="{ 'form-input-error': errors?.name }"
                        />
                        <span v-if="errors?.name" class="error-text">{{ errors.name }}</span>
                    </div>
                </div>
            </div>

            <!-- Medical Info Section -->
            <div class="form-section">
                <div class="section-header">
                    <div class="section-icon medical">
                        <i class="bi bi-heart-pulse"></i>
                    </div>
                    <h3 class="section-title">Thông tin y tế</h3>
                </div>

                <div class="form-group full-width">
                    <label class="form-label">Triệu chứng <span class="required"></span></label>
                    <TinyMCEEditor v-model="formData.symptom" height="300" />
                    <span v-if="errors?.symptom" class="error-text">{{ errors.symptom }}</span>
                </div>

                <div class="form-group full-width">
                    <label class="form-label">Phương pháp điều trị <span class="required"></span></label>
                    <TinyMCEEditor v-model="formData.treatment" height="300" />
                    <span v-if="errors?.treatment" class="error-text">{{ errors.treatment }}</span>
                </div>
            </div>

            <!-- Actions -->
            <div class="form-actions">
                <button type="button" class="btn-cancel" @click="$router.back()">
                    <i class="bi bi-x-lg"></i>
                    <span>Hủy</span>
                </button>
                <button type="submit" class="btn-submit" :disabled="loading">
                    <span v-if="loading" class="spinner-small"></span>
                    <i v-else class="bi bi-check-lg"></i>
                    <span>{{ isEdit ? 'Cập nhật' : 'Thêm mới' }}</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import type { DiseaseFormData } from '@/types/diseases';
import TinyMCEEditor from '@/components/Editor/TinyMCEEditor.vue';

interface Props {
    initialData?: DiseaseFormData;
    loading?: boolean;
    errors?: Record<string, string>;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false
});

const emit = defineEmits<{
    (e: 'submit', data: DiseaseFormData): void;
}>();

const route = useRoute();
const isEdit = computed(() => !!route.params.id);

const formData = ref<DiseaseFormData>({
    code: '',
    name: '',
    symptom: '',
    treatment: ''
});

onMounted(() => {
    if (props.initialData) {
        formData.value = { ...props.initialData };
    }
});

const handleSubmit = () => {
    emit('submit', formData.value);
};
</script>

<style scoped>
/* Container */
.apple-diseases-form-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

/* Header */
.form-header {
    background: #ffffff;
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.header-icon {
    width: 48px;
    height: 48px;
    background: rgba(76, 175, 80, 0.1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: #4caf50;
}

.header-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: #1d1d1f;
    margin: 0;
    letter-spacing: -0.02em;
}

.header-subtitle {
    font-size: 0.875rem;
    color: #86868b;
    margin: 0.25rem 0 0 0;
    font-weight: 400;
}

/* Form Content */
.form-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

/* Form Section */
.form-section {
    background: #ffffff;
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.section-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.section-icon {
    width: 36px;
    height: 36px;
    background: rgba(76, 175, 80, 0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.125rem;
    color: #4caf50;
}

.section-icon.medical {
    background: rgba(76, 175, 80, 0.1);
    color: #4caf50;
}

.section-title {
    color: #1d1d1f;
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
    letter-spacing: -0.01em;
}

/* Form Groups */
.form-group-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group.full-width {
    grid-column: 1 / -1;
}

.form-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1d1d1f;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.required {
    color: #ef4444;
    font-weight: 600;
}

/* Form Input */
.form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 0.9375rem;
    border: 1.5px solid #d5d5d7;
    border-radius: 8px;
    background: #ffffff;
    color: #1d1d1f;
    font-family: inherit;
    transition: all 0.2s ease;
    outline: none;
}

.form-input:hover {
    border-color: #b0b0b5;
}

.form-input:focus {
    border-color: #4caf50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.form-input-error {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.02);
}

.form-input-error:focus {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-input::placeholder {
    color: #86868b;
}

/* Error Text */
.error-text {
    font-size: 0.8125rem;
    color: #ef4444;
    font-weight: 500;
    margin-top: 0.25rem;
}

/* Form Actions */
.form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    padding-top: 1rem;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.btn-cancel,
.btn-submit {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: inherit;
}

.btn-cancel {
    background: rgba(0, 0, 0, 0.04);
    color: #1d1d1f;
    border: 1px solid rgba(0, 0, 0, 0.06);
}

.btn-cancel:hover {
    background: rgba(0, 0, 0, 0.08);
}

.btn-cancel:active {
    transform: scale(0.98);
}

.btn-submit {
    background: #4caf50;
    color: white;
}

.btn-submit:hover:not(:disabled) {
    background: #45a049;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.btn-submit:active:not(:disabled) {
    transform: translateY(0);
}

.btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-submit i,
.btn-cancel i {
    font-size: 1rem;
}

/* Loading Spinner */
.spinner-small {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Responsive */
@media (max-width: 768px) {
    .apple-diseases-form-container {
        gap: 1.25rem;
    }

    .form-header,
    .form-section {
        padding: 1.25rem;
    }

    .header-icon {
        width: 40px;
        height: 40px;
        font-size: 1.25rem;
    }

    .header-title {
        font-size: 1.5rem;
    }

    .header-subtitle {
        font-size: 0.8125rem;
    }

    .form-group-grid {
        grid-template-columns: 1fr;
        gap: 0.875rem;
    }

    .form-actions {
        flex-direction: column;
    }

    .btn-cancel,
    .btn-submit {
        width: 100%;
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .apple-diseases-form-container {
        gap: 1rem;
    }

    .form-header,
    .form-section {
        padding: 1rem;
    }

    .header-title {
        font-size: 1.25rem;
    }

    .section-title {
        font-size: 1rem;
    }

    .form-label {
        font-size: 0.8125rem;
    }

    .form-input {
        padding: 0.625rem 0.875rem;
        font-size: 0.875rem;
    }

    .btn-cancel,
    .btn-submit {
        padding: 0.5rem 1rem;
        font-size: 0.8125rem;
    }
}
</style>