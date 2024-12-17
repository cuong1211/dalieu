<template>
    <div class="container my-8">
        <!-- Loading & Error states -->
        <div v-if="loading" class="text-center py-8">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Đang tải...</span>
            </div>
        </div>

        <template v-else-if="disease">
            <div class="row">
                <!-- Main Content -->
                <div class="col-lg-8">
                    <div class="content-card">
                        <!-- Header Section -->
                        <div class="disease-header">
                            <div class="d-flex align-items-center">
                                <div class="disease-icon">
                                    <div class="icon-wrapper">
                                        <i class="bi bi-clipboard-data fs-2x" style="color: #5891d1;"></i>
                                    </div>
                                </div>
                                <div>
                                    <h1 class="disease-title">{{ disease.name }}</h1>
                                    <div class="disease-code">Mã bệnh: {{ disease.code }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Content Sections -->
                        <div id="symptoms" class="content-section">
                            <h2 class="section-title">
                                <i class="bi bi-activity me-2"></i>
                                Triệu chứng
                            </h2>
                            <div class="content-text" v-html="disease.symptom"></div>
                        </div>

                        <div id="treatment" class="content-section">
                            <h2 class="section-title">
                                <i class="bi bi-bandaid me-2"></i>
                                Phương pháp điều trị
                            </h2>
                            <div class="content-text" v-html="disease.treatment"></div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="col-lg-4">
                    <div class="sidebar-card">
                        <div class="sidebar-header">
                            <i class="bi bi-list-ul me-2"></i>
                            Mục lục
                        </div>
                        <div class="sidebar-content">
                            <div class="menu-list">
                                <button class="menu-item" @click="scrollTo('symptoms')">
                                    <i class="bi bi-journal-bookmark"></i>
                                    <span>Triệu chứng</span>
                                </button>
                                <button class="menu-item" @click="scrollTo('treatment')">
                                    <i class="bi bi-journal-bookmark"></i>
                                    <span>Phương pháp điều trị</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <div v-else class="alert alert-danger">
            Không tìm thấy thông tin bệnh
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useDiseasesStore } from '@/stores/DiseasesStore';
import type { Disease } from '@/types/disease';

const route = useRoute();
const diseasesStore = useDiseasesStore();
const loading = ref(true);
const disease = ref<Disease | null>(null);

const fetchDiseaseDetail = async () => {
    const id = parseInt(route.params.id as string);
    if (isNaN(id)) return;

    loading.value = true;
    try {
        const response = await diseasesStore.fetchDiseaseById(id);
        disease.value = response;
    } catch (error) {
        console.error('Error fetching disease:', error);
    } finally {
        loading.value = false;
    }
};

const scrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};

onMounted(() => {
    fetchDiseaseDetail();
});
</script>

<style scoped>
.content-card {
    background: white;
    border-radius: 5px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
    padding: 2rem;
}

.disease-header {
    padding-bottom: 2rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid #e9ecef;
}

.disease-icon {
    width: 80px;
    height: 80px;
    margin-right: 1.5rem;
}

.icon-wrapper {
    width: 100%;
    height: 100%;
    background: #f5f8fa;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1976d2;
    border: 1px solid #f5f8fa;
}

.disease-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1a237e;
    margin-bottom: 0.5rem;
}

.disease-code {
    color: #5c6bc0;
    font-size: 1rem;
}

.content-section {
    margin-bottom: 3rem;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a237e;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e3f2fd;
    display: flex;
    align-items: center;
}

.section-title i {
    color: #1976d2;
}

.content-text {
    color: #37474f;
    line-height: 1.8;
    font-size: 1.1rem;
}

.sidebar-card {
    background: white;
    border-radius: 5px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 20px;
}

.sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e9ecef;
    font-size: 1.2rem;
    font-weight: 600;
    color: #1a237e;
    display: flex;
    align-items: center;
}

.menu-list {
    padding: 1rem;
}

.menu-item {
    width: 100%;
    padding: 1rem 1.5rem;
    border: none;
    background: none;
    display: flex;
    align-items: center;
    gap: 1rem;
    color: #37474f;
    font-size: 1.1rem;
    border-radius: 5px;
    transition: all 0.3s ease;
    margin-bottom: 0.5rem;
}

.menu-item:hover {
    background: #e3f2fd;
    color: #1976d2;
    transform: translateX(5px);
}

.menu-item i {
    color: #1976d2;
}

:deep(.content-text h3) {
    color: #1a237e;
    font-size: 1.3rem;
    margin: 1.5rem 0 1rem;
}

:deep(.content-text p) {
    margin-bottom: 1rem;
}

:deep(.content-text ul) {
    list-style-type: none;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
}

:deep(.content-text li) {
    position: relative;
    margin-bottom: 1rem;
    padding-left: 1.5rem;
}

:deep(.content-text li::before) {
    content: "•";
    color: #1976d2;
    font-weight: bold;
    position: absolute;
    left: 0;
}
</style>