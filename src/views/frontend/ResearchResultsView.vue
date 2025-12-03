<template>
    <div class="research-results-page">
        <!-- Hero Section -->
        <div class="search-header">
            <div class="header-content">
                <h1 class="header-title">
                    <i class="bi bi-clipboard-data" style="color: white;"></i>
                    Kết Quả Kiểm thử Hệ Thống
                </h1>
                <p class="header-subtitle">Đánh giá hiệu quả của hệ thống DERMARAG</p>
            </div>
        </div>

        <!-- Doctor Presentation Section -->
        <section class="section doctor-presentation">
            <div class="container">
                <div class="section-header text-center mb-5">
                    <h2 class="section-title">Đánh Giá Từ Chuyên Gia</h2>
                    <p class="section-subtitle">
                        Bác sĩ chuyên khoa đánh giá về hệ thống và kết quả nghiên cứu
                    </p>
                </div>

                <div class="row align-items-center">
                    <div class="col-lg-8 mx-auto">
                        <div class="video-wrapper">
                            <!-- Video placeholder - thay thế bằng video thực tế -->
                            <div class="video-container">
                                <video
                                    v-if="doctorVideo"
                                    :src="doctorVideo"
                                    controls
                                    class="w-100 rounded-4 shadow-lg"
                                    poster="/media/research/students-with-doctor.jpg"
                                >
                                    Trình duyệt của bạn không hỗ trợ video.
                                </video>
                                <!-- Fallback to image if no video -->
                                <img
                                    v-else
                                    src="/media/research/students-with-doctor.jpg"
                                    alt="Bác sĩ giới thiệu hệ thống"
                                    class="w-100 rounded-4 shadow-lg"
                                >
                            </div>
                        </div>
                        <div class="doctor-info-box mt-4">
                            <div class="d-flex align-items-center gap-3">
                                <div class="doctor-avatar">
                                    <i class="bi bi-person-circle"></i>
                                </div>
                                <div>
                                    <h5 class="mb-1">Th.S Bác sĩ Phạm Văn Thinh</h5>
                                    <p class="text-muted mb-0">Giám đốc - Bệnh viện Đa khoa số 2 Tỉnh Lào Cai</p>
                                </div>
                            </div>
                            <p class="mt-3 mb-0">
                                "Hệ thống AI này đã cho thấy tiềm năng lớn trong việc hỗ trợ chẩn đoán bệnh da liễu,
                                giúp các bác sĩ đưa ra quyết định nhanh chóng và chính xác hơn."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Students Using System Section -->
        <section class="section system-usage bg-light">
            <div class="container">
                <div class="section-header text-center mb-5">
                    <h2 class="section-title">Quá Trình Kiểm Thử</h2>
                    <p class="section-subtitle">
                        Học sinh và bác sĩ cùng tham gia đánh giá hệ thống
                    </p>
                </div>

                <div class="row g-4">
                    <div class="col-lg-8 mx-auto">
                        <div class="main-image-wrapper">
                            <img
                                src="/media/research/students-with-doctor.jpg"
                                alt="Học sinh sử dụng hệ thống cùng bác sĩ"
                                class="w-100 rounded-4 shadow-lg main-image"
                            >
                            <!-- <div class="image-caption">
                                <span>Học sinh và bác sĩ thực hiện thử nghiệm hệ thống chẩn đoán</span>
                            </div> -->
                        </div>
                    </div>
                </div>

                <!-- Gallery Grid -->
                <!-- <div class="row g-4 mt-4">
                    <div class="col-md-4" v-for="(image, index) in galleryImages" :key="index">
                        <div class="gallery-item">
                            <img
                                :src="image.src"
                                :alt="image.alt"
                                class="w-100 rounded-3"
                            >
                            <div class="gallery-overlay">
                                <p class="mb-0">{{ image.description }}</p>
                            </div>
                        </div>
                    </div>
                </div> -->

                <!-- Participants Info -->
                <!-- <div class="row mt-5">
                    <div class="col-lg-10 mx-auto">
                        <div class="participants-box">
                            <h4 class="mb-4"><i class="bi bi-people-fill me-2"></i>Đối Tượng Tham Gia</h4>
                            <div class="row g-4">
                                <div class="col-md-4">
                                    <div class="stat-card">
                                        <div class="stat-icon">
                                            <i class="bi bi-mortarboard-fill"></i>
                                        </div>
                                        <div class="stat-number">{{ participants.students }}</div>
                                        <div class="stat-label">Học sinh tham gia</div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="stat-card">
                                        <div class="stat-icon">
                                            <i class="bi bi-hospital-fill"></i>
                                        </div>
                                        <div class="stat-number">{{ participants.doctors }}</div>
                                        <div class="stat-label">Bác sĩ hướng dẫn</div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="stat-card">
                                        <div class="stat-icon">
                                            <i class="bi bi-clipboard-data-fill"></i>
                                        </div>
                                        <div class="stat-number">{{ participants.testCases }}</div>
                                        <div class="stat-label">Ca thử nghiệm</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> -->
            </div>
        </section>

        <!-- Evaluation Results Section -->
        <section class="section evaluation-results">
            <div class="container">
                <div class="section-header text-center mb-5">
                    <h2 class="section-title">Kết Quả Đánh Giá</h2>
                    <p class="section-subtitle">
                        Các chỉ số hiệu suất và độ chính xác của hệ thống
                    </p>
                </div>

                <!-- Performance Metrics -->
                <div class="row g-4 mb-5">
                    <div class="col-md-4 col-sm-6" v-for="metric in performanceMetrics" :key="metric.name">
                        <div class="metric-card">
                            <div class="metric-value">{{ metric.value }}</div>
                            <div class="metric-name">{{ metric.name }}</div>
                            <div class="metric-description">{{ metric.description }}</div>
                        </div>
                    </div>
                </div>

                <!-- Detailed Results -->
                <div class="row">
                    <div class="col-lg-10 mx-auto">
                        <div class="results-detail-box">
                            <h4 class="mb-4">Chi Tiết Kết Quả Thực Nghiệm</h4>

                            <!-- Accuracy by Disease Type -->
                            <div class="result-section mb-5">
                                <h5 class="result-subtitle">1. Độ Chính Xác Theo Loại Bệnh</h5>
                                <div class="table-responsive">
                                    <table class="results-table">
                                        <thead>
                                            <tr>
                                                <th>Loại bệnh</th>
                                                <th>Số ca thử nghiệm</th>
                                                <th>Độ chính xác</th>
                                                <th>Độ tin cậy</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="disease in diseaseAccuracy" :key="disease.name">
                                                <td>{{ disease.name }}</td>
                                                <td>{{ disease.cases }}</td>
                                                <td>
                                                    <div class="progress-container">
                                                        <div class="progress">
                                                            <div
                                                                class="progress-bar"
                                                                :style="{ width: disease.accuracy + '%' }"
                                                            ></div>
                                                        </div>
                                                        <span class="progress-label">{{ disease.accuracy }}%</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span class="confidence-badge" :class="getConfidenceClass(disease.confidence)">
                                                        {{ disease.confidence }}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- System Performance -->
                            <div class="result-section mb-5">
                                <h5 class="result-subtitle">2. Tổng Quan Thử Nghiệm</h5>
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <div class="performance-item">
                                            <div>
                                                <strong>Tổng số ca kiểm thử:</strong>
                                                <span class="ms-2">{{ systemPerformance.totalCases }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="performance-item">
                                            <div>
                                                <strong>Số ca đúng Top-1:</strong>
                                                <span class="ms-2">{{ systemPerformance.top1Correct }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="performance-item">
                                            <div>
                                                <strong>Số ca đúng Top-3:</strong>
                                                <span class="ms-2">{{ systemPerformance.top3Correct }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="performance-item">
                                            <div>
                                                <strong>Số ca đúng Top-5:</strong>
                                                <span class="ms-2">{{ systemPerformance.top5Correct }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="performance-item">
                                            <div>
                                                <strong>Lỗi hoặc kết quả không hợp lệ:</strong>
                                                <span class="ms-2">{{ systemPerformance.errors }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Analysis by Disease Group -->
                            <!-- <div class="result-section">
                                <h5 class="result-subtitle">3. Phân Tích Theo Nhóm Bệnh</h5>
                                <div class="feedback-grid">
                                    <div class="feedback-item" v-for="feedback in userFeedback" :key="feedback.aspect">
                                        <div class="feedback-header">
                                            <span class="feedback-aspect">{{ feedback.aspect }}</span>
                                            <span class="feedback-rating">
                                                <span v-for="star in 5" :key="star" class="star-icon"
                                                   :class="{ 'filled': star <= feedback.rating }">★</span>
                                                <span class="ms-2">({{ feedback.rating }}/5)</span>
                                            </span>
                                        </div>
                                        <p class="feedback-comment">{{ feedback.comment }}</p>
                                    </div>
                                </div>
                            </div> -->
                        </div>

                        <!-- Conclusion Box -->
                        <div class="conclusion-box mt-5">
                            <div class="conclusion-content">
                                <h4 style="color: white;">Kết Luận</h4>
                                <p>
                                    Hệ thống DERMARAG tích hợp mô hình nhận diện hình ảnh và cơ chế truy xuất tri thức
                                    dựa trên vector database đã cho thấy hiệu quả cao trong việc gợi ý bệnh da liễu dựa trên mô tả và ảnh.
                                    Kết quả thử nghiệm trên {{ systemPerformance.totalCases }} mẫu bệnh lý cho thấy:
                                </p>
                                <ul class="conclusion-highlights">
                                    <li>{{ performanceMetrics[2].value }} trường hợp bệnh thật nằm trong Top-5 bệnh được hệ thống gợi ý</li>
                                    <li>Mô hình hoạt động ổn định với các nhóm bệnh phổ biến như lang ben, nấm da, viêm da tiết bã, mày đay,
                                        viêm da tiếp xúc, đạt mức chính xác tuyệt đối 100%</li>
                                    <li>Ở nhóm bệnh ung thư hiếm và bệnh di truyền, độ chính xác giảm, do hạn chế dữ liệu hình ảnh
                                        hoặc mô tả lâm sàng chưa đủ đa dạng</li>
                                    <li>Hệ thống không phát sinh lỗi, chứng tỏ pipeline RAG và vector database hoạt động ổn định</li>
                                </ul>
                                <div class="conclusion-recommendations mt-3">
                                    <strong>Khuyến nghị cải tiến:</strong>
                                    <ul>
                                        <li>Bổ sung thêm dữ liệu hình ảnh và mô tả lâm sàng cho các bệnh ung thư và bệnh di truyền hiếm</li>
                                        <li>Tăng cường độ đa dạng của tập dữ liệu huấn luyện, đặc biệt là các ca bệnh phức tạp</li>
                                        <li>Cải thiện thuật toán truy xuất để nâng cao độ chính xác Top-1 từ 62.5% lên mức cao hơn</li>
                                        <li>Tích hợp thêm tri thức chuyên môn từ bác sĩ da liễu để tinh chỉnh mô hình</li>
                                    </ul>
                                </div>
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

// Types
interface GalleryImage {
    src: string;
    alt: string;
    description: string;
}

interface Participants {
    students: number;
    doctors: number;
    testCases: number;
}

interface PerformanceMetric {
    name: string;
    value: string;
    description: string;
}

interface DiseaseAccuracy {
    name: string;
    cases: number;
    accuracy: number;
    confidence: string;
}

interface SystemPerformance {
    totalCases: string;
    top1Correct: string;
    top3Correct: string;
    top5Correct: string;
    errors: string;
}

interface UserFeedback {
    aspect: string;
    rating: number;
    comment: string;
}

// Data
const doctorVideo = ref<string>('media/research/a.mp4'); // Để trống sẽ hiển thị ảnh thay thế

const galleryImages = ref<GalleryImage[]>([
    {
        src: '/media/research/test-session-1.jpg',
        alt: 'Phiên thử nghiệm 1',
        description: 'Học sinh thực hiện chẩn đoán với sự hướng dẫn của bác sĩ'
    },
    {
        src: '/media/research/test-session-2.jpg',
        alt: 'Phiên thử nghiệm 2',
        description: 'Bác sĩ đánh giá kết quả từ hệ thống AI'
    },
    {
        src: '/media/research/test-session-3.jpg',
        alt: 'Phiên thử nghiệm 3',
        description: 'Thảo luận về các ca chẩn đoán khó'
    }
]);

const participants = ref<Participants>({
    students: 45,
    doctors: 8,
    testCases: 150
});

const performanceMetrics = ref<PerformanceMetric[]>([
    {
        name: 'Độ chính xác Top-1',
        value: '62.5%',
        description: 'Hệ thống chọn đúng bệnh ngay đầu tiên'
    },
    {
        name: 'Độ chính xác Top-3',
        value: '79.17%',
        description: 'Khi mở rộng đến 3 kết quả'
    },
    {
        name: 'Độ chính xác Top-5',
        value: '84.52%',
        description: 'Ở mức 5 bệnh nghi ngờ'
    }
]);

const diseaseAccuracy = ref<DiseaseAccuracy[]>([
    { name: 'Lang ben', cases: 2, accuracy: 100, confidence: 'Cao' },
    { name: 'Nấm da', cases: 2, accuracy: 100, confidence: 'Cao' },
    { name: 'Ghẻ', cases: 2, accuracy: 100, confidence: 'Cao' },
    { name: 'Viêm da tiếp xúc', cases: 10, accuracy: 100, confidence: 'Cao' },
    { name: 'Thủy đậu', cases: 2, accuracy: 100, confidence: 'Cao' },
    { name: 'Zona', cases: 2, accuracy: 100, confidence: 'Cao' },
    { name: 'Vẩy nến thể thông thường', cases: 2, accuracy: 85, confidence: 'Cao' },
    { name: 'Lupus', cases: 2, accuracy: 75, confidence: 'Trung bình' },
    { name: 'Lichen phẳng', cases: 2, accuracy: 80, confidence: 'Trung bình' },
    { name: 'Bạch biến', cases: 2, accuracy: 70, confidence: 'Trung bình' },
    { name: 'Rám má', cases: 2, accuracy: 75, confidence: 'Trung bình' },
    { name: 'Ung thư tế bào hắc tố', cases: 2, accuracy: 50, confidence: 'Thấp' },
    { name: 'Ung thư tế bào vảy', cases: 2, accuracy: 60, confidence: 'Thấp' },
    { name: 'Ung thư tế bào đáy', cases: 2, accuracy: 0, confidence: 'Thấp' }
]);

const systemPerformance = ref<SystemPerformance>({
    totalCases: '174',
    top1Correct: '105',
    top3Correct: '133',
    top5Correct: '142',
    errors: '0'
});

const userFeedback = ref<UserFeedback[]>([
    {
        aspect: 'Bệnh phổ biến',
        rating: 5,
        comment: 'Mô hình hoạt động ổn định với các nhóm bệnh phổ biến như lang ben, nấm da, viêm da tiết bã, mày đay, viêm da tiếp xúc, đạt mức chính xác tuyệt đối 100%'
    },
    {
        aspect: 'Độ chính xác tổng thể',
        rating: 4.2,
        comment: '84.52% trường hợp bệnh thật nằm trong Top-5 bệnh được hệ thống gợi ý, cho thấy hiệu quả cao trong việc hỗ trợ chẩn đoán'
    },
    {
        aspect: 'Độ ổn định',
        rating: 5,
        comment: 'Hệ thống không phát sinh lỗi, chứng tỏ pipeline RAG và vector database hoạt động ổn định'
    },
    {
        aspect: 'Bệnh hiếm và ung thư',
        rating: 3,
        comment: 'Ở nhóm bệnh ung thư hiếm và bệnh di truyền, độ chính xác giảm do hạn chế dữ liệu hình ảnh hoặc mô tả lâm sàng chưa đủ đa dạng'
    }
]);

// Methods
const getConfidenceClass = (confidence: string): string => {
    switch (confidence) {
        case 'Cao':
            return 'confidence-high';
        case 'Trung bình':
            return 'confidence-medium';
        case 'Thấp':
            return 'confidence-low';
        default:
            return '';
    }
};
</script>

<style scoped>
/* Header */
.search-header {
    background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
    padding: 1.2rem 2rem;
    box-shadow: 0 4px 20px rgba(26, 188, 156, 0.15);
}

.header-content {
    max-width: 1200px;
    margin: 0 auto;
}

.header-title {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 800;
    color: white;
    display: flex;
    align-items: center;
    gap: 1rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-title i {
    font-size: 2.8rem;
}

.header-subtitle {
    margin: 0.75rem 0 0 0;
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 300;
}

/* Section Styles */
.section {
    padding: 5rem 0;
}

.section-header {
    max-width: 700px;
    margin: 0 auto 4rem;
}

.section-title {
    color: #0d7d6e;
    font-weight: 700;
    font-size: 2.2rem;
    margin-bottom: 1rem;
    position: relative;
    display: inline-block;
    width: 100%;
}

.section-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #1abc9c 0%, #0d7d6e 100%);
    border-radius: 2px;
}

.section-subtitle {
    color: #64748b;
    font-size: 1.1rem;
    line-height: 1.6;
}

/* Doctor Presentation */
.video-wrapper {
    position: relative;
}

.video-container {
    position: relative;
    background: #f8f9fa;
    border-radius: 1rem;
    overflow: hidden;
}

.video-container video,
.video-container img {
    display: block;
    width: 100%;
    height: auto;
}

.doctor-info-box {
    background: white;
    padding: 1.5rem;
    border-radius: 1rem;
    border-left: 4px solid #1abc9c;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.doctor-avatar i {
    font-size: 3rem;
    color: #1abc9c;
}

/* Gallery */
.main-image-wrapper {
    position: relative;
}

.main-image {
    object-fit: cover;
    max-height: 500px;
}

.image-caption {
    background: white;
    padding: 1rem 1.5rem;
    margin-top: 1rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.gallery-item {
    position: relative;
    overflow: hidden;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.gallery-item:hover {
    transform: translateY(-5px);
}

.gallery-item img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    display: block;
}

.gallery-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    color: white;
    padding: 1.5rem 1rem 1rem;
    font-size: 0.9rem;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.gallery-item:hover .gallery-overlay {
    opacity: 1;
}

/* Participants Box */
.participants-box {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.stat-card {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 2rem 1.5rem;
    border-radius: 1rem;
    text-align: center;
    transition: transform 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
}

.stat-icon {
    font-size: 2.5rem;
    color: #1abc9c;
    margin-bottom: 1rem;
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: #0d7d6e;
    margin-bottom: 0.5rem;
}

.stat-label {
    color: #64748b;
    font-size: 0.95rem;
}

/* Metric Cards */
.metric-card {
    background: white;
    padding: 2rem 1.5rem;
    border-radius: 1rem;
    text-align: center;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.metric-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.metric-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: #0d7d6e;
    margin-bottom: 0.75rem;
}

.metric-name {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
}

.metric-description {
    font-size: 0.9rem;
    color: #64748b;
    line-height: 1.5;
}

/* Results Detail Box */
.results-detail-box {
    background: white;
    padding: 2.5rem;
    border-radius: 1rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.result-subtitle {
    color: #0d7d6e;
    font-weight: 600;
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #e9ecef;
}

/* Table Styles */
.results-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
}

.results-table thead th {
    background: #f8f9fa;
    color: #0d7d6e;
    font-weight: 600;
    padding: 1rem;
    text-align: left;
    border-bottom: 2px solid #1abc9c;
}

.results-table tbody td {
    padding: 1rem;
    border-bottom: 1px solid #e9ecef;
}

.progress-container {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.progress {
    flex: 1;
    height: 8px;
    background: #e9ecef;
    border-radius: 10px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #1abc9c 0%, #0d7d6e 100%);
    transition: width 0.3s ease;
}

.progress-label {
    font-weight: 600;
    color: #0d7d6e;
    min-width: 50px;
}

.confidence-badge {
    padding: 0.35rem 0.75rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
}

.confidence-high {
    background: #d4f1e9;
    color: #0d7d6e;
}

.confidence-medium {
    background: #fff3cd;
    color: #856404;
}

.confidence-low {
    background: #f8d7da;
    color: #721c24;
}

/* Performance Items */
.performance-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    background: #f8f9fa;
    border-radius: 0.5rem;
    border-left: 3px solid #1abc9c;
}

/* Feedback Grid */
.feedback-grid {
    display: grid;
    gap: 1.5rem;
}

.feedback-item {
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 0.75rem;
    border-left: 4px solid #1abc9c;
}

.feedback-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
}

.feedback-aspect {
    font-weight: 600;
    color: #0d7d6e;
    font-size: 1.05rem;
}

.feedback-rating {
    color: #f39c12;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.star-icon {
    font-size: 1.1rem;
    color: #ddd;
}

.star-icon.filled {
    color: #f39c12;
}

.feedback-comment {
    color: #64748b;
    margin: 0;
    line-height: 1.6;
}

/* Conclusion Box */
.conclusion-box {
    background: linear-gradient(135deg, #0d7d6e 0%, #1abc9c 100%);
    color: white;
    padding: 2.5rem;
    border-radius: 1rem;
}

.conclusion-content h4 {
    font-weight: 700;
    margin-bottom: 1rem;
    font-size: 1.5rem;
}

.conclusion-content p {
    line-height: 1.7;
    opacity: 0.95;
    margin-bottom: 1.5rem;
}

.conclusion-highlights {
    margin: 1.5rem 0;
    padding-left: 1.5rem;
    list-style-type: disc;
}

.conclusion-highlights li {
    margin-bottom: 0.75rem;
    line-height: 1.7;
    opacity: 0.95;
}

.conclusion-recommendations {
    background: rgba(255, 255, 255, 0.1);
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin-top: 1.5rem;
}

.conclusion-recommendations strong {
    font-size: 1.05rem;
}

.conclusion-recommendations ul {
    margin: 0.75rem 0 0 0;
    padding-left: 1.5rem;
}

.conclusion-recommendations li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
    .search-header {
        padding: 1rem 1.5rem;
    }

    .header-title {
        font-size: 1.75rem;
        gap: 0.75rem;
    }

    .header-title i {
        font-size: 2rem;
    }

    .header-subtitle {
        font-size: 0.95rem;
    }

    .section {
        padding: 3rem 0;
    }

    .section-title {
        font-size: 1.75rem;
    }

    .results-detail-box {
        padding: 1.5rem;
    }

    .results-table {
        font-size: 0.85rem;
    }

    .results-table thead th,
    .results-table tbody td {
        padding: 0.75rem 0.5rem;
    }

    .conclusion-box {
        padding: 2rem;
    }

    .stat-number {
        font-size: 2rem;
    }

    .metric-value {
        font-size: 1.5rem;
    }

    .gallery-item img {
        height: 200px;
    }
}
</style>
