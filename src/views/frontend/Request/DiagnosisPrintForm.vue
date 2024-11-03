<template>
    <div class="print-form">
        <!-- Action buttons - Chỉ hiển thị khi không phải chế độ in -->

        <div class="print-container">
            <!-- Patient Info -->
            <div class="content-section">
                <div class="section-box patient-info">
                    <h4 class="section-title">
                        <i class="bi bi-person-vcard me-2"></i>
                        THÔNG TIN BỆNH NHÂN
                    </h4>
                    <div class="info-grid">
                        <div class="info-row">
                            <span class="info-label">Họ và tên:</span>
                            <span class="info-value fw-bold">{{ data.name }}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Giới tính:</span>
                            <span class="info-value">{{ formatGender(data.gender) }}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Tuổi:</span>
                            <span class="info-value">{{ data.age }}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Điện thoại:</span>
                            <span class="info-value">{{ data.phone }}</span>
                        </div>
                        <div class="info-row full">
                            <span class="info-label">Địa chỉ:</span>
                            <span class="info-value">{{ data.address }}</span>
                        </div>
                    </div>
                </div>

                <!-- Symptoms with Image -->
                <div class="section-box symptoms-section">
                    <h4 class="section-title">
                        <i class="bi bi-clipboard2-pulse me-2"></i>
                        TRIỆU CHỨNG
                    </h4>
                    <div class="symptoms-content">
                        <div class="symptom-text">{{ data.symptom }}</div>

                        <div v-if="data.image" class="symptom-image-section">
                            <h5 class="image-title">Hình ảnh triệu chứng:</h5>
                            <div class="image-container">
                                <img :src="`/uploads/${data.image}`" alt="Triệu chứng" class="symptom-image">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Diagnosis Result -->
                <div class="section-box diagnosis-section">
                    <h4 class="section-title">
                        <i class="bi bi-file-medical me-2"></i>
                        KẾT QUẢ CHẨN ĐOÁN
                    </h4>
                    <div class="diagnosis-content">
                        <p class="diagnosis-text">{{ data.result }}</p>

                        <div class="related-diseases">
                            <h5 class="sub-title">Bệnh liên quan:</h5>
                            <div class="diseases-grid">
                                <div v-for="disease in relatedDiseases" :key="disease.id" class="disease-item">
                                    <i class="bi bi-journal-medical me-2"></i>
                                    {{ disease.name }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { RequestResponse } from '@/types/request';

const props = defineProps<{
    diagnosisResult: RequestResponse;
    isPrinting?: boolean;
}>();

const data = computed(() => props.diagnosisResult.data);
const relatedDiseases = computed(() => {
    if (!data.value.info.sub) return [];
    return data.value.info.sub.flat();
});

// Helper functions
const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};

const formatGender = (gender: string): string => {
    const genderMap: Record<string, string> = {
        'male': 'Nam',
        'female': 'Nữ',
        'other': 'Khác'
    };
    return genderMap[gender] || gender;
};

const handlePrint = () => {
    window.print();
};
</script>

<style scoped>
.print-form {
    background: white;
    padding: 20px;
}

.action-buttons {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
}

.print-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background-color: #0ea5e9;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.print-button:hover {
    background-color: #0284c7;
}

.content-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.section-box {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1.5rem;
    background-color: #fff;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    text-transform: uppercase;
}

.info-grid {
    display: grid;
    gap: 1rem;
}

.info-row {
    display: grid;
    grid-template-columns: 120px 1fr;
    align-items: baseline;
}

.info-label {
    font-weight: 500;
    color: #64748b;
}

.info-value {
    color: #0f172a;
}

.symptoms-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.symptom-text {
    color: #334155;
    line-height: 1.6;
}

.symptom-image-section {
    margin-top: 1rem;
}

.image-title {
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    margin-bottom: 1rem;
}

.image-container {
    max-width: 300px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
}

.symptom-image {
    width: 100%;
    height: auto;
    object-fit: cover;
}

.diagnosis-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.diagnosis-text {
    color: #334155;
    line-height: 1.6;
    margin: 0;
}

.sub-title {
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
    margin-bottom: 1rem;
}

.diseases-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
}

.disease-item {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    background-color: #f8fafc;
    border-radius: 6px;
    color: #0f172a;
    font-size: 14px;
}

@media print {
    .print-form {
        padding: 0;
    }

    .action-buttons {
        display: none;
    }

    .section-box {
        break-inside: avoid;
        border: none;
        padding: 1rem 0;
    }

    .image-container {
        break-inside: avoid;
        max-width: 200px;
    }
}
</style>