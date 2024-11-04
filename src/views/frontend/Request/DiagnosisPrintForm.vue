<template>
    <div class="print-form">
        <div class="print-container">
            <!-- Header with Logo -->
            <div class="form-header">
                <div class="header-left">
                    <img src="/media/logos/logo.png" alt="Logo" class="logo" style="width: 100px;" />
                    <div class="hospital-info">
                        <h3 class="hospital-name">DA LIỄU HÀ VINH</h3>
                    </div>
                </div>
                <div class="header-right">
                    <div class="document-info">
                        <p class="document-id">Mã phiếu: {{ formatRefNumber(data.id) }}</p>
                        <p class="document-date">Ngày khám: {{ formatDate(data.created_at) }}</p>
                    </div>
                </div>
            </div>

            <!-- Title -->
            <div class="form-title">
                <h2>PHIẾU KẾT QUẢ CHẨN ĐOÁN</h2>
            </div>

            <!-- Content Sections -->
            <div class="content-section">
                <!-- Patient Info -->
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

                <!-- Symptoms -->
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
                                <img :src="getImageUrl(data.image)" alt="Triệu chứng" class="symptom-image">
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

                        <!-- Bệnh chính -->
                        <div v-if="mainDiseases.length" class="diseases-section">
                            <h5 class="sub-title">
                                <i class="bi bi-clipboard-heart me-2"></i>
                                Bệnh chính:
                            </h5>
                            <div class="diseases-list">
                                <div v-for="disease in mainDiseases" :key="disease.id" class="disease-item">
                                    <h6 class="disease-name">
                                        <i class="bi bi-journal-medical me-2"></i>
                                        {{ disease.name }}
                                    </h6>
                                    <div v-if="disease.treatment" class="treatment-content" v-html="disease.treatment">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Bệnh liên quan -->
                        <div v-if="relatedDiseases.length" class="diseases-section">
                            <h5 class="sub-title">
                                <i class="bi bi-link-45deg me-2"></i>
                                Bệnh liên quan:
                            </h5>
                            <div class="diseases-list">
                                <div v-for="disease in relatedDiseases" :key="disease.id" class="disease-item">
                                    <h6 class="disease-name">
                                        <i class="bi bi-journal-medical me-2"></i>
                                        {{ disease.name }}
                                    </h6>
                                    <div v-if="disease.treatment" class="treatment-content" v-html="disease.treatment">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="form-footer">
                <div class="footer-text">
                    <p class="note">Lưu ý: Trên đây là hệ thống chẩn đoán và định hướng điều trị cho bạn từ những thông
                        tin mô tả và hình ảnh mà bạn cung cấp. .</p>
                    <p class="recommend">Nhằm đảm bảo chính xác hơn cho sức khoẻ làn da của bạn, hãy liên hệ với bác sỹ
                        chuyên khoa da liễu gần nhất để được tư vấn và điều trị cụ thể. .</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { RequestResponse } from '@/types/request';

const props = defineProps<{
    diagnosisResult: RequestResponse;
    isPrinting?: boolean;
}>();

const data = computed(() => props.diagnosisResult.data);

const mainDiseases = computed(() => {
    if (!data.value.info?.main) return [];
    return data.value.info.main.flat();
});

const relatedDiseases = computed(() => {
    if (!data.value.info?.sub) return [];
    return data.value.info.sub.flat();
});
const formatRefNumber = (id: number): string => {
    return `CD${String(id).padStart(6, '0')}`;
};

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatCurrentDate = (): string => {
    return new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

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

const handlePrint = () => {
    window.print();
};
</script>

```