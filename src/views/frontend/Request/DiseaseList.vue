<template>
    <div class="diseases-list">
        <div v-for="disease in diseases" :key="disease.id" class="disease-item mb-4">
            <div class="disease-card">
                <div class="disease-header">
                    <h6 class="disease-name">
                        <i class="bi bi-journal-medical me-2"></i>
                        {{ disease.name }}
                    </h6>
                    <router-link :to="{ name: 'disease.detail', params: { id: disease.id } }" class="view-detail-btn"
                        target="_blank" rel="noopener noreferrer">
                        <span>Xem chi tiết</span>
                        <i class="bi bi-arrow-right"></i>
                    </router-link>
                </div>
                <div class="treatment-symptom" v-if="disease.symptom" v-html="disease.symptom">
                </div>
                <div class="treatment-content" v-if="disease.treatment" v-html="disease.treatment">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Disease } from '@/types/diagnosis';

defineProps<{
    diseases: Disease[];
}>();
</script>

<style scoped>
.diseases-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.disease-card {
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 1.5rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.disease-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 1rem;
}

.disease-name {
    color: #1e293b;
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
}

.disease-name i {
    color: #3b82f6;
}

.view-detail-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    color: #3b82f6;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    text-decoration: none;
    transition: all 0.2s;
}

.view-detail-btn:hover {
    background-color: #eff6ff;
    border-color: #3b82f6;
    transform: translateY(-1px);
}

.treatment-content {
    color: #334155;
    line-height: 1.8;
}

.treatment-content :deep(p) {
    margin-bottom: 1rem;
}

.treatment-content :deep(strong) {
    color: #1e293b;
    font-weight: 600;
}

.treatment-content :deep(ul) {
    padding-left: 1.5rem;
    margin-bottom: 1rem;
}

.treatment-content :deep(li) {
    margin-bottom: 0.5rem;
}
</style>