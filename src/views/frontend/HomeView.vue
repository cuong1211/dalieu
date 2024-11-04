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
        <!-- Quá trình phát triển -->
        <section class="section development-timeline bg-light">
            <div class="container">
                <div class="section-header text-center mb-5">
                    <h2 class="section-title">Quá Trình Phát Triển</h2>
                    <p class="section-subtitle">
                        Hành trình xây dựng và phát triển hệ thống chẩn đoán da liễu thông minh
                    </p>
                </div>

                <div class="timeline">
                    <div v-for="(milestone, index) in developmentTimeline" :key="milestone.year" class="timeline-item"
                        :class="{ 'timeline-item-left': index % 2 === 0 }">
                        <div class="timeline-badge">
                            <span class="badge-month">{{ milestone.month }}</span>
                            <span class="badge-year">{{ milestone.year }}</span>
                        </div>
                        <div class="timeline-content">
                            <div class="timeline-icon">
                                <i :class="getTimelineIcon(index)"></i>
                            </div>
                            <div class="timeline-body">
                                <h3 class="timeline-title">{{ milestone.title }}</h3>
                                <p class="timeline-description">{{ milestone.description }}</p>
                            </div>
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
    month: number;
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

const getTimelineIcon = (index: number): string => {
    const icons = [
        'bi bi-list-stars',      // Khởi động
        'bi bi-box',            // Cơ sở dữ liệu
        'bi bi-cpu',                 // Nghiên cứu AI
        'bi bi-gear',                // Huấn luyện
        'bi bi-graph-up',            // Đánh giá
        'bi bi-code-square',         // Backend
        'bi bi-window',              // Frontend
        'bi bi-bug',                 // Testing
        'bi bi-lightning-charge',    // Tối ưu
        'bi bi-check-circle'         // Triển khai
    ];
    return icons[index] || 'bi bi-circle';
};
const developmentTimeline = ref<Milestone[]>([
    {
        year: 2024,
        month: 1,
        title: 'Khởi động dự án & Thu thập dữ liệu',
        description: 'Bắt đầu quá trình thu thập và phân loại dữ liệu hình ảnh từ các bệnh viện da liễu. Xây dựng kế hoạch chi tiết và thành lập nhóm nghiên cứu.'
    },
    {
        year: 2024,
        month: 2,
        title: 'Xây dựng cơ sở dữ liệu',
        description: 'Tiến hành gán nhãn và phân loại hình ảnh bệnh da liễu. Xây dựng hệ thống cơ sở dữ liệu chuẩn hoá cho việc huấn luyện mô hình AI.'
    },
    {
        year: 2024,
        month: 3,
        title: 'Nghiên cứu & Lựa chọn mô hình',
        description: 'Nghiên cứu và thử nghiệm các mô hình deep learning khác nhau (CNN, ResNet, VGG) để tìm ra mô hình phù hợp nhất cho việc nhận diện bệnh da liễu.'
    },
    {
        year: 2024,
        month: 4,
        title: 'Huấn luyện mô hình ban đầu',
        description: 'Tiến hành huấn luyện mô hình AI với tập dữ liệu đã chuẩn bị. Thực hiện các điều chỉnh và tối ưu hoá ban đầu.'
    },
    {
        year: 2024,
        month: 5,
        title: 'Đánh giá & Cải thiện mô hình',
        description: 'Đánh giá hiệu suất mô hình, xác định các điểm yếu và thực hiện các cải tiến cần thiết. Tối ưu hoá độ chính xác trong việc nhận diện bệnh.'
    },
    {
        year: 2024,
        month: 6,
        title: 'Phát triển API & Backend',
        description: 'Xây dựng hệ thống API và backend để tích hợp mô hình AI. Thiết kế cơ sở dữ liệu và các endpoint cần thiết cho ứng dụng.'
    },
    {
        year: 2024,
        month: 7,
        title: 'Phát triển giao diện người dùng',
        description: 'Thiết kế và phát triển giao diện web/mobile thân thiện cho người dùng. Tích hợp các tính năng upload ảnh và hiển thị kết quả chẩn đoán.'
    },
    {
        year: 2024,
        month: 8,
        title: 'Thử nghiệm & Kiểm thử',
        description: 'Tiến hành thử nghiệm hệ thống với dữ liệu thực tế. Thu thập phản hồi từ các bác sĩ da liễu và người dùng thử nghiệm.'
    },
    {
        year: 2024,
        month: 9,
        title: 'Tối ưu hoá & Hoàn thiện',
        description: 'Cải thiện hiệu suất tổng thể của hệ thống. Tối ưu hoá tốc độ xử lý và độ chính xác. Hoàn thiện tài liệu hướng dẫn sử dụng.'
    },
    {
        year: 2024,
        month: 10,
        title: 'Triển khai & Vận hành',
        description: 'Triển khai hệ thống lên môi trường production. Đào tạo người dùng và bắt đầu giai đoạn vận hành thử nghiệm trong thực tế.'
    }
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

.section-header {
    max-width: 700px;
    margin: 0 auto 4rem;
}

.section-subtitle {
    color: #64748b;
    font-size: 1.125rem;
    margin-top: 1rem;
}

.timeline {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 0;
}

.timeline::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 100%;
    background: linear-gradient(to bottom,
            rgba(0, 68, 124, 0) 0%,
            rgba(0, 68, 124, 1) 10%,
            rgba(0, 68, 124, 1) 90%,
            rgba(0, 68, 124, 0) 100%);
    transform: translateX(-50%);
}

.timeline-item {
    position: relative;
    width: 50%;
    padding: 2rem;
    margin-bottom: 2rem;
}

.timeline-item-left {
    left: 0;
    padding-right: 3rem;
}

.timeline-item:not(.timeline-item-left) {
    left: 50%;
    padding-left: 3rem;
}

.timeline-badge {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #00447c;
    color: #fff;
    padding: 0.75rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.timeline-item-left .timeline-badge {
    right: -1.5rem;
}

.timeline-item:not(.timeline-item-left) .timeline-badge {
    left: -1.5rem;
}

.badge-month {
    font-size: 1.25rem;
    font-weight: 700;
}

.badge-year {
    font-size: 0.875rem;
    opacity: 0.8;
}

.timeline-content {
    background: #fff;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    position: relative;
    transition: transform 0.3s ease;
}

.timeline-content:hover {
    transform: translateY(-5px);
}

.timeline-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    background: #eff6ff;
    color: #00447c;
    border-radius: 50%;
    margin-bottom: 1rem;
    font-size: 1.25rem;
}

.timeline-title {
    color: #00447c;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
}

.timeline-description {
    color: #64748b;
    line-height: 1.6;
    margin: 0;
}

/* Animation */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.timeline-item {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;
}

.timeline-item:nth-child(1) {
    animation-delay: 0.1s;
}

.timeline-item:nth-child(2) {
    animation-delay: 0.2s;
}

.timeline-item:nth-child(3) {
    animation-delay: 0.3s;
}

.timeline-item:nth-child(4) {
    animation-delay: 0.4s;
}

.timeline-item:nth-child(5) {
    animation-delay: 0.5s;
}

.timeline-item:nth-child(6) {
    animation-delay: 0.6s;
}

.timeline-item:nth-child(7) {
    animation-delay: 0.7s;
}

.timeline-item:nth-child(8) {
    animation-delay: 0.8s;
}

.timeline-item:nth-child(9) {
    animation-delay: 0.9s;
}

.timeline-item:nth-child(10) {
    animation-delay: 1s;
}

/* Responsive */
@media (max-width: 768px) {
    .timeline::before {
        left: 2rem;
    }

    .timeline-item {
        width: 100%;
        left: 0 !important;
        padding: 1rem 1rem 1rem 4rem !important;
    }

    .timeline-badge {
        left: 0 !important;
    }

    .timeline-content {
        padding: 1rem;
    }
}
</style>