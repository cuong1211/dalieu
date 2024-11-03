<template>
    <div class="container my-8">
        <div v-if="loading" class="text-center py-8">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Đang tải...</span>
            </div>
        </div>
        <template v-else-if="disease">
            <div class="row">
                <!-- Main content -->
                <div class="col-lg-8">
                    <div class="card">
                        <div class="card-body p-lg-8">
                            <!-- Disease header -->
                            <div class="d-flex flex-column flex-md-row align-items-md-center mb-8">
                                <div class="d-flex align-items-center mb-4 mb-md-0">
                                    <div class="symbol symbol-100px me-4">
                                        <div class="symbol-label bg-light">
                                            <i class="bi bi-clipboard2-pulse fs-2x text-primary"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <h1 class="fs-2 fw-bolder mb-1">{{ disease.name }}</h1>
                                        <div class="text-gray-600">Mã bệnh: {{ disease.code }}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Disease sections -->
                            <div class="mb-8">
                                <h2 class="fs-3 fw-bold mb-4">Triệu chứng</h2>
                                <div class="text-gray-700" v-html="disease.symptom"></div>
                            </div>

                            <div class="mb-8">
                                <h2 class="fs-3 fw-bold mb-4">Phương pháp điều trị</h2>
                                <div class="text-gray-700" v-html="disease.treatment"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="col-lg-4">
                    <!-- Table of contents -->
                    <div class="card mb-6">
                        <div class="card-header">
                            <h3 class="card-title">Mục lục</h3>
                        </div>
                        <div class="card-body">
                            <div class="menu menu-column menu-rounded menu-sub-indention">
                                <div class="menu-item">
                                    <a href="#symptoms" class="menu-link" @click="scrollToSection($event, 'symptoms')">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">Triệu chứng</span>
                                    </a>
                                </div>
                                <div class="menu-item">
                                    <a href="#treatment" class="menu-link"
                                        @click="scrollToSection($event, 'treatment')">
                                        <span class="menu-bullet">
                                            <span class="bullet bullet-dot"></span>
                                        </span>
                                        <span class="menu-title">Phương pháp điều trị</span>
                                    </a>
                                </div>
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
import type { Disease } from '@/types/diseases';

const route = useRoute();
const diseasesStore = useDiseasesStore();
const loading = ref(true);
const disease = ref<Disease | null>(null);

const fetchDiseaseDetail = async () => {
    const id = parseInt(route.params.id as string, 10);
    if (isNaN(id)) return;

    loading.value = true;
    try {
        const data = await diseasesStore.fetchDiseaseById(id);
        disease.value = data;
    } catch (error) {
        console.error('Error fetching disease detail:', error);
    } finally {
        loading.value = false;
    }
};

const scrollToSection = (event: Event, sectionId: string) => {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};

onMounted(() => {
    fetchDiseaseDetail();
});
</script>

<style scoped>
.menu-link {
    display: flex;
    align-items: center;
    padding: 0.65rem 1rem;
    color: #181C32;
    text-decoration: none;
}

.menu-link:hover {
    background-color: #F5F8FA;
    color: #009EF7;
    transition: all 0.2s ease;
}

.bullet-dot {
    width: 4px;
    height: 4px;
    border-radius: 100%;
    background-color: #B5B5C3;
    display: inline-block;
    margin-right: 0.75rem;
}

:deep(.text-gray-700) {
    line-height: 1.8;
}

:deep(h2) {
    color: #181C32;
    margin-bottom: 1rem;
}

:deep(p) {
    margin-bottom: 1rem;
}

:deep(ul) {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
}

:deep(li) {
    margin-bottom: 0.5rem;
}

.symbol {
    display: inline-block;
    flex-shrink: 0;
    position: relative;
    border-radius: 0.475rem;
}

.symbol-label {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.475rem;
}

.menu-item {
    margin-bottom: 0.15rem;
}
</style>