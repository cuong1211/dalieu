// views/HomeView.vue
<template>
    <div class="home-page">
        <!-- Banner section -->
        <Banner />

        <!-- Giới thiệu về hệ thống -->
        <section class="section system-intro">
            <div class="container">
                <h2 class="section-title">HỆ THỐNG TRUY XUẤT VÀ TẠO SINH<br>CHO CHUẨN ĐOÁN BỆNH LÝ VỀ DA</h2>
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
    </div>
    <section class="section development-timeline bg-light">
        <div class="container">
            <div class="section-header text-center mb-5">
                <h2 class="section-title">Quá Trình Phát Triển</h2>
                <p class="section-subtitle">
                    Hành trình xây dựng và phát triển hệ thống truy xuất và tạo sinh cho chẩn đoán bệnh lý về da
                </p>
            </div>

            <div class="timeline">
                <div v-for="(milestone, index) in developmentTimeline" :key="milestone.year" class="timeline-item">
                    <div class="timeline-left">
                        <div class="timeline-icon-wrapper">
                            <div class="timeline-icon">
                                <i :class="getTimelineIcon(index)" style="color: white; font-size: 20px;"></i>
                            </div>
                        </div>
                        <div class="timeline-connector" v-if="index < developmentTimeline.length - 1"></div>
                    </div>
                    <div class="timeline-right">
                        <div class="timeline-content-box">
                            <h3 class="timeline-title">{{ milestone.title }}</h3>
                            <p class="timeline-description">{{ milestone.description }}</p>
                            <span class="timeline-date">{{ milestone.month }}/{{ milestone.year }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
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
    month: string | number;
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
        year: 2025,
        month: '1-2',
        title: 'Khởi động dự án & Thu thập dữ liệu',
        description: 'Bắt đầu quá trình thu thập và phân loại dữ liệu hình ảnh từ các bệnh viện da liễu. Xây dựng kế hoạch chi tiết và thành lập nhóm nghiên cứu. Tiến hành gán nhãn và phân loại hình ảnh bệnh da liễu. Xây dựng hệ thống cơ sở dữ liệu chuẩn hoá cho việc huấn luyện mô hình AI.'
    },
    {
        year: 2025,
        month: '3-4',
        title: 'Nghiên cứu & Huấn luyện mô hình',
        description: 'Nghiên cứu và thử nghiệm các mô hình deep learning khác nhau (CNN, ResNet, VGG) để tìm ra mô hình phù hợp nhất cho việc nhận diện bệnh da liễu. Tiến hành huấn luyện mô hình AI với tập dữ liệu đã chuẩn bị. Thực hiện các điều chỉnh và tối ưu hoá ban đầu.'
    },
    {
        year: 2025,
        month: '5-6',
        title: 'Đánh giá & Phát triển Backend',
        description: 'Đánh giá hiệu suất mô hình, xác định các điểm yếu và thực hiện các cải tiến cần thiết. Tối ưu hoá độ chính xác trong việc nhận diện bệnh. Xây dựng hệ thống API và backend để tích hợp mô hình AI. Thiết kế cơ sở dữ liệu và các endpoint cần thiết cho ứng dụng.'
    },
    {
        year: 2025,
        month: '7-8',
        title: 'Phát triển giao diện & Thử nghiệm',
        description: 'Thiết kế và phát triển giao diện web/mobile thân thiện cho người dùng. Tích hợp các tính năng upload ảnh và hiển thị kết quả chẩn đoán. Tiến hành thử nghiệm hệ thống với dữ liệu thực tế. Thu thập phản hồi từ các bác sĩ da liễu và người dùng thử nghiệm.'
    },
    {
        year: 2025,
        month: '9-10',
        title: 'Tối ưu hoá & Triển khai',
        description: 'Cải thiện hiệu suất tổng thể của hệ thống. Tối ưu hoá tốc độ xử lý và độ chính xác. Hoàn thiện tài liệu hướng dẫn sử dụng. Triển khai hệ thống lên môi trường production. Đào tạo người dùng và bắt đầu giai đoạn vận hành thử nghiệm trong thực tế.'
    }
]);
</script>

<style scoped>
.section {
    padding: 5rem 0;
}

.system-intro {
    position: relative;
}

.system-intro .section-title {
    margin-bottom: 4.5rem;
}

.section-title {
    text-align: center;
    margin-bottom: 3rem;
    color: #00447c;
    font-weight: 700;
    font-size: 2.5rem;
    line-height: 1.3;
    position: relative;
    display: inline-block;
    width: 100%;
}

.section-title::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 4px;
    background: linear-gradient(90deg, #5b9fd9 0%, #00447c 100%);
    border-radius: 2px;
}

/* System Intro Styles */
.content-box {
    padding: 0 2rem;
}

.content-box h3 {
    color: #00447c;
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    position: relative;
    padding-bottom: 1rem;
}

.content-box h3::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, #5b9fd9 0%, #00447c 100%);
    border-radius: 2px;
}

.content-box p {
    color: #64748b;
    font-size: 1.05rem;
    line-height: 1.7;
    margin-bottom: 2rem;
}

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
    padding: 1rem;
    background: #f0f7ff;
    border-radius: 8px;
    border-left: 4px solid #5b9fd9;
    transition: all 0.3s ease;
}

.feature-item:hover {
    background: #e8f0f7;
    transform: translateX(5px);
}

.feature-item i {
    font-size: 1.5rem;
    color: #5b9fd9;
    min-width: 2rem;
}

.feature-item span {
    color: #00447c;
    font-weight: 500;
    font-size: 1rem;
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
.development-timeline {
    background: white;
    padding-top: 3rem;
}

.section-header {
    max-width: 700px;
    margin: 0 auto 4rem;
    position: relative;
}

.section-subtitle {
    color: #64748b;
    font-size: 1.125rem;
    margin-top: 1.5rem;
    font-weight: 400;
    line-height: 1.6;
}

.timeline {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 3rem;
}



.timeline-item {
    position: relative;
    width: 100%;
    animation: fadeInUp 0.6s ease-out forwards;
    opacity: 0;
    display: flex;
    gap: 2rem;
    z-index: 10000;
}

.timeline-left {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    position: relative;
}

.timeline-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background: #5b9fd9;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(91, 159, 217, 0.3);
    border: 4px solid #fff;
    position: relative;
    z-index: 10;
}

.timeline-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 1.5rem;
    margin: 0!important;
}


.timeline-right {
    flex: 1;
    width: 50%;
    display: flex;
    align-items: center;
}

.timeline-content-box {
    background: #fff;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-left: 4px solid #5b9fd9;
    width: 100%;
    transition: all 0.3s ease;
}

.timeline-content-box:hover {
    box-shadow: 0 4px 16px rgba(91, 159, 217, 0.2);
    transform: translateY(-2px);
}

.timeline-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #00447c;
    margin-bottom: 0.75rem;
    line-height: 1.4;
}

.timeline-description {
    display: block;
    font-size: 0.8rem;
    color: #64748b;
    line-height: 1.5;
    text-align: justify;
    flex: 1;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.timeline-date {
    font-size: 0.85rem;
    color: #5b9fd9;
    font-weight: 600;
}

/* Animation */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Animation delays */
.timeline-item:nth-child(1) { animation-delay: 0.1s; }
.timeline-item:nth-child(2) { animation-delay: 0.2s; }
.timeline-item:nth-child(3) { animation-delay: 0.3s; }
.timeline-item:nth-child(4) { animation-delay: 0.4s; }
.timeline-item:nth-child(5) { animation-delay: 0.5s; }

/* Responsive */

/* Full HD (1920px and above) */
@media (min-width: 1920px) {
    .timeline {
        max-width: 900px;
        padding: 3rem;
        gap: 4rem;
    }

    .timeline-icon-wrapper {
        width: 70px;
        height: 70px;
    }

    .timeline-icon {
        font-size: 1.75rem;
    }

    .timeline-title {
        font-size: 1.25rem;
    }

    .timeline-description {
        font-size: 1rem;
    }

    .timeline-date {
        font-size: 0.9rem;
    }

    .timeline-content-box {
        padding: 2rem;
    }
}

/* HD (1280px - 1919px) */
@media (min-width: 1280px) and (max-width: 1919px) {
    .timeline {
        max-width: 850px;
        padding: 2.5rem;
        gap: 3.5rem;
    }

    .timeline-icon-wrapper {
        width: 65px;
        height: 65px;
    }

    .timeline-icon {
        font-size: 1.6rem;
    }

    .timeline-title {
        font-size: 1.15rem;
    }

    .timeline-description {
        font-size: 0.95rem;
    }

    .timeline-content-box {
        padding: 1.75rem;
    }
}

/* Laptop (1025px - 1279px) */
@media (min-width: 1025px) and (max-width: 1279px) {
    .timeline {
        max-width: 800px;
        padding: 2rem;
        gap: 3rem;
    }

    .timeline-icon-wrapper {
        width: 60px;
        height: 60px;
    }

    .timeline-icon {
        font-size: 1.4rem;
    }

    .timeline-title {
        font-size: 1.05rem;
    }

    .timeline-description {
        font-size: 0.9rem;
    }

    .timeline-content-box {
        padding: 1.5rem;
    }
}

/* Tablet (768px - 1024px) */
@media (max-width: 1024px) {
    .timeline {
        max-width: 100%;
        padding: 2rem 1.5rem;
        gap: 2.5rem;
    }

    .timeline-icon-wrapper {
        width: 55px;
        height: 55px;
    }

    .timeline-icon {
        font-size: 1.3rem;
    }

    .timeline-left,
    .timeline-right {
        width: 100%;
    }

    .timeline-item {
        flex-direction: column;
    }

    .timeline-title {
        font-size: 1rem;
    }

    .timeline-description {
        font-size: 0.85rem;
    }

    .timeline-content-box {
        padding: 1.25rem;
    }
}

/* Mobile (max-width 768px) */
@media (max-width: 768px) {
    .section-title {
        font-size: 1.75rem;
    }

    .content-box {
        padding: 0 1rem;
    }

    .content-box h3 {
        font-size: 1.5rem;
    }

    .features-grid {
        grid-template-columns: 1fr;
    }

    .timeline {
        max-width: 100%;
        padding: 2rem 1rem;
        gap: 2rem;
    }

    .timeline::before {
        left: 30px;
        width: 2px;
    }

    .timeline-item {
        flex-direction: row;
        gap: 1.5rem;
        padding-left: 2rem;
    }

    .timeline-left {
        width: auto;
        align-items: center;
        position: relative;
        min-width: 60px;
        margin-left: -2rem;
    }

    .timeline-icon-wrapper {
        width: 50px;
        height: 50px;
    }

    .timeline-icon {
        font-size: 1.2rem;
    }

    .timeline-connector {
        display: none;
    }

    .timeline-right {
        width: auto;
        flex: 1;
    }

    .timeline-title {
        font-size: 0.95rem;
    }

    .timeline-description {
        font-size: 0.8rem;
        -webkit-line-clamp: 2;
        line-clamp: 2;
    }

    .timeline-date {
        font-size: 0.8rem;
    }

    .timeline-content-box {
        padding: 1rem;
        border-left-width: 3px;
    }
}

/* Small Mobile (max-width 576px) */
@media (max-width: 576px) {
    .timeline {
        padding: 1.5rem 0.5rem;
        gap: 1.5rem;
    }

    .timeline::before {
        left: 25px;
        width: 2px;
    }

    .timeline-item {
        padding-left: 1.5rem;
    }

    .timeline-left {
        min-width: 50px;
        margin-left: -1.5rem;
    }

    .timeline-icon-wrapper {
        width: 45px;
        height: 45px;
    }

    .timeline-icon {
        font-size: 1rem;
    }

    .timeline-title {
        font-size: 0.9rem;
    }

    .timeline-description {
        font-size: 0.75rem;
        -webkit-line-clamp: 2;
        line-clamp: 2;
    }

    .timeline-date {
        font-size: 0.75rem;
    }

    .timeline-content-box {
        padding: 0.75rem;
    }
}
</style>