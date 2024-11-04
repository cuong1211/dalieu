// views/HomeView.vue
<template>
    <div class="home-page">
        <!-- Banner section -->
        <Banner />

        <!-- Giới thiệu về hệ thống -->
        <section class="section system-intro">
            <div class="container">
                <h2 class="section-title">Hệ Thống Chẩn Đoán Da Liễu Thông Minh</h2>
                <div class="row align-items-center">
                    <div class="col-lg-6">
                        <div class="content-box">
                            <h3>Công Nghệ AI Trong Chẩn Đoán Da Liễu</h3>
                            <p>Hệ thống của chúng tôi sử dụng trí tuệ nhân tạo tiên tiến để hỗ trợ chẩn đoán các bệnh về
                                da một cách nhanh chóng và chính xác. Với độ chính xác lên đến 95%, chúng tôi tự hào
                                mang đến giải pháp hiệu quả cho việc chẩn đoán sớm các vấn đề về da.</p>
                            <div class="features-grid">
                                <div class="feature-item">
                                    <i class="bi bi-shield-check"></i>
                                    <span>Độ chính xác cao</span>
                                </div>
                                <div class="feature-item">
                                    <i class="bi bi-clock"></i>
                                    <span>Chẩn đoán nhanh chóng</span>
                                </div>
                                <div class="feature-item">
                                    <i class="bi bi-graph-up"></i>
                                    <span>Cập nhật liên tục</span>
                                </div>
                                <div class="feature-item">
                                    <i class="bi bi-hospital"></i>
                                    <span>Kết nối bệnh viện</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <img src="/media/banner/ai-system.jpg" alt="AI System" class="img-fluid rounded-4 shadow-lg">
                    </div>
                </div>
            </div>
        </section>

        <!-- Giới thiệu các trung tâm -->
    

        <!-- Giới thiệu chuyên gia -->
        <section class="section experts-intro">
            <div class="container">
                <h2 class="section-title">Đội Ngũ Chuyên Gia</h2>
                <div class="row g-4">
                    <div v-for="expert in experts" :key="expert.id" class="col-md-6 col-lg-3 ">
                        <div class="expert-card h-100">
                            <div class="expert-image">
                                <img :src="expert.image" :alt="expert.name">
                            </div>
                            <div class="expert-info">
                                <h3 class="expert-name">{{ expert.name }}</h3>
                                <p class="expert-position">{{ expert.position }}</p>
                                <p class="expert-qualification">{{ expert.qualification }}</p>
                                <div class="expert-specialties">
                                    <span v-for="specialty in expert.specialties" :key="specialty"
                                        class="badge bg-light text-primary">
                                        {{ specialty }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Quá trình phát triển -->
        <section class="section development-timeline bg-light">
            <div class="container">
                <h2 class="section-title">Quá Trình Phát Triển</h2>
                <div class="timeline">
                    <div v-for="milestone in developmentTimeline" :key="milestone.year" class="timeline-item">
                        <div class="timeline-badge">{{ milestone.year }}</div>
                        <div class="timeline-content">
                            <h3>{{ milestone.title }}</h3>
                            <p>{{ milestone.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Banner from '@/layout/frontend/banner/BannerMain.vue';

// Định nghĩa interfaces
interface MedicalCenter {
    id: number;
    name: string;
    image: string;
    address: string;
    description: string;
}

interface Expert {
    id: number;
    name: string;
    image: string;
    position: string;
    qualification: string;
    specialties: string[];
}

interface Milestone {
    year: number;
    title: string;
    description: string;
}

// Data
const medicalCenters = ref<MedicalCenter[]>([
    {
        id: 1,
        name: 'Bệnh viện Da liễu Trung ương',
        image: '/media/centers/center-1.jpg',
        address: 'Hà Nội',
        description: 'Trung tâm hàng đầu về chẩn đoán và điều trị bệnh da liễu tại Việt Nam'
    },
    // Thêm các trung tâm khác
]);

const experts = ref<Expert[]>([
    {
        id: 1,
        name: 'PGS.TS Phạm Thị Lan',
        image: '/media/images/doctor/1.jpg',
        position: 'Trưởng khoa Da liễu',
        qualification: 'Phó giáo sư Y khoa',
        specialties: ['Da liễu', 'Thẩm mỹ da']
    },
    {
        id: 2,
        name: 'PGS.TS Nguyễn Văn Thường',
        image: '/media/images/doctor/2.jpg',
        position: 'Nguyên giám độc bệnh viện Da liễu Trung ương',
        qualification: 'Phó giáo sư Y khoa',
        specialties: ['Da liễu', 'Thẩm mỹ da']
    },
    {
        id: 3,
        name: 'TS.BS Đinh Hữu Nghị',
        image: '/media/images/doctor/3.jpg',
        position: 'Trưởng khoa phẫu thuật bệnh',
        qualification: 'Tiến sĩ Y khoa',
        specialties: ['Da liễu', 'Thẩm mỹ da']
    },
    {
        id: 4,
        name: 'TS.BS Phạm Thị Minh Phương',
        image: '/media/images/doctor/4.jpg',
        position: 'Trưởng khoa Khám bệnh',
        qualification: 'Tiến sĩ Y khoa',
        specialties: ['Da liễu', 'Thẩm mỹ da']
    },
    // Thêm các chuyên gia khác
]);

const developmentTimeline = ref<Milestone[]>([
    {
        year: 2020,
        title: 'Khởi động dự án',
        description: 'Bắt đầu nghiên cứu và phát triển hệ thống AI chẩn đoán bệnh da liễu'
    },
    {
        year: 2020,
        title: 'Khởi động dự án',
        description: 'Bắt đầu nghiên cứu và phát triển hệ thống AI chẩn đoán bệnh da liễu'
    },
    {
        year: 2020,
        title: 'Khởi động dự án',
        description: 'Bắt đầu nghiên cứu và phát triển hệ thống AI chẩn đoán bệnh da liễu'
    },
    {
        year: 2020,
        title: 'Khởi động dự án',
        description: 'Bắt đầu nghiên cứu và phát triển hệ thống AI chẩn đoán bệnh da liễu'
    },
]);
</script>

<style scoped>
.section {
    padding: 5rem 0;
}

.section-title {
    text-align: center;
    margin-bottom: 3rem;
    color: #00447c;
    font-weight: 700;
}

/* System Intro Styles */
.features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-top: 2rem;
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 1rem;
}

/* Center Card Styles */
.center-card {
    background: #fff;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
}

.center-card:hover {
    transform: translateY(-5px);
}

/* Expert Card Styles */
.expert-card {
    background: #fff;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.expert-image img {
    width: 100%;
    height: 250px;
    object-fit: cover;
}

.expert-info {
    padding: 1.5rem;
}

/* Timeline Styles */
.timeline {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
}

.timeline-item {
    position: relative;
    padding: 2rem;
    border-left: 2px solid #00447c !important;
    margin-left: 3rem;
    margin-bottom: 2rem;
}

.timeline-badge {
    position: absolute;
    left: -4.5rem;
    background: #00447c;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
}

@media (max-width: 768px) {
    .features-grid {
        grid-template-columns: 1fr;
    }

    .timeline-item {
        margin-left: 2rem;
    }
}
</style>