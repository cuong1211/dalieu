<template>
  <div class="diagnosis-report-container">
    <!-- Print Button -->
    <div v-if="!isPreview" class="print-button-section">
      <button @click="openPrintPreview" class="print-button">
        <i class="bi bi-printer"></i>
        In Phiếu Kết Quả
      </button>
    </div>

    <!-- Print Preview Modal -->
    <div v-if="isPreview" class="print-preview-modal">
      <div class="preview-header">
        <h2>Xem Trước Phiếu Kết Quả</h2>
        <button @click="closePrintPreview" class="close-btn">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Printable Document -->
      <div ref="printContent" class="report-document">
        <!-- Header with Logo -->
        <div class="report-header">
          <div class="header-logo">
            <img src="/media/logos/logo.png" alt="Logo" />
          </div>
          <div class="header-title">
            <h1>PHIẾU KẾT QUẢ CHUẨN ĐOÁN BỆNH LÝ VỀ DA</h1>
            <p class="subtitle">Hệ Thống Truy Xuất và Tạo Sinh Cho Chuẩn Đoán</p>
          </div>
        </div>

        <hr class="divider" />

        <!-- Patient Information Section -->
        <div class="section">
          <h3 class="section-title">I. THÔNG TIN BỆNH NHÂN</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Họ và Tên:</label>
              <span class="value">{{ patientInfo.name }}</span>
            </div>
            <div class="info-item">
              <label>Tuổi:</label>
              <span class="value">{{ patientInfo.age }} tuổi</span>
            </div>
            <div class="info-item">
              <label>Giới Tính:</label>
              <span class="value">{{ patientInfo.gender }}</span>
            </div>
            <div class="info-item">
              <label>Số CCCD:</label>
              <span class="value">{{ patientInfo.identification }}</span>
            </div>
            <div class="info-item">
              <label>Số Điện Thoại:</label>
              <span class="value">{{ patientInfo.phone }}</span>
            </div>
            <div class="info-item">
              <label>Email:</label>
              <span class="value">{{ patientInfo.email }}</span>
            </div>
            <div class="info-item full-width">
              <label>Địa Chỉ:</label>
              <span class="value">{{ patientInfo.address }}</span>
            </div>
          </div>
        </div>

        <!-- Symptoms Section -->
        <div class="section">
          <h3 class="section-title">II. MÔ TẢ TRIỆU CHỨNG</h3>
          <div class="symptom-box">
            {{ patientInfo.symptom }}
          </div>
          <!-- Patient Image -->
          <div v-if="hasPatientImage" class="image-section">
            <h4>Hình Ảnh Bệnh Nhân:</h4>
            <img :src="patientImageBase64" alt="Hình ảnh bệnh nhân" class="patient-image" />
          </div>
        </div>

        <!-- Diagnosis Results Section -->
        <div class="section">
          <h3 class="section-title">III. KẾT QUẢ CHUẨN ĐOÁN</h3>

          <!-- Detected Symptoms -->
          <div class="subsection">
            <h4>Triệu Chứng Ban Đầu Phát Hiện:</h4>
            <div class="symptoms-tags">
              <span v-for="symptom in diagnosisInfo.symptoms" :key="symptom" class="tag">
                {{ symptom }}
              </span>
            </div>
          </div>

          <!-- Additional Detected Symptoms -->
          <div v-if="hasAdditionalSymptoms" class="subsection">
            <h4>Triệu Chứng Bổ Sung Phát Hiện:</h4>
            <div class="symptoms-tags additional-tags">
              <span v-for="symptom in allDetectedSymptoms" :key="symptom" class="tag additional-tag">
                <i class="bi bi-plus-circle"></i> {{ symptom }}
              </span>
            </div>
          </div>

          <!-- Top 5 Diseases -->
          <div class="subsection">
            <h4>Top 5 Bệnh Khả Năng Cao Nhất:</h4>
            <table class="diseases-table">
              <thead>
                <tr>
                  <th style="width: 10%;">STT</th>
                  <th style="width: 50%;">Tên Bệnh</th>
                  <th style="width: 20%;">Xác Suất</th>
                  <th style="width: 20%;">Mô Tả</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(disease, index) in diagnosisInfo.top5Diseases" :key="index">
                  <td class="text-center">{{ index + 1 }}</td>
                  <td class="font-bold">{{ disease.disease }}</td>
                  <td class="text-center">
                    <div class="probability-display">
                      <div class="probability-bar">
                        <div class="probability-fill" :style="{ width: (disease.probability * 100) + '%' }"></div>
                      </div>
                      <span class="percentage">{{ (disease.probability * 100).toFixed(1) }}%</span>
                    </div>
                  </td>
                  <td class="text-sm">{{ disease.rationale }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Questions Asked -->
          <div class="subsection">
            <p><strong>Số Câu Hỏi Được Hỏi:</strong> {{ diagnosisInfo.questionsAsked }}/{{ diagnosisInfo.maxQuestions }}</p>
            <p><strong>Trạng Thái:</strong> {{ diagnosisInfo.finished ? 'Hoàn Thành' : 'Đang Tiến Hành' }}</p>
          </div>
        </div>

        <!-- Conversation History (Optional) -->
        <div v-if="showConversation" class="section">
          <h3 class="section-title">IV. LỊCH SỬ TRÍCH XUẤT</h3>
          <div class="conversation-box">
            <div v-for="(message, index) in diagnosisInfo.messages" :key="index" class="message-item">
              <div class="message-role" :class="message.role">
                {{ message.role === 'user' ? '👤 Bệnh Nhân' : '🤖 Trợ Lý AI' }}
              </div>
              <div class="message-text">{{ message.content }}</div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="report-footer">
          <hr />
          <p class="footer-text">
            <strong>Lưu Ý:</strong> Kết quả này chỉ mang tính chất tham khảo. Vui lòng đến gặp bác sĩ chuyên khoa để được chẩn đoán và điều trị chính xác.
          </p>
          <div class="footer-info">
            <p>Ngày In: {{ currentDate }}</p>
            <p>Hệ Thống Truy Xuất và Tạo Sinh cho Chuẩn Đoán Bệnh Lý Về Da</p>
          </div>
        </div>
      </div>

      <!-- Preview Actions -->
      <div class="preview-actions">
        <button @click="printDocument" class="action-btn primary">
          <i class="bi bi-printer"></i>
          In Phiếu
        </button>
        <button @click="downloadPDF" class="action-btn success">
          <i class="bi bi-download"></i>
          Tải Xuống PDF
        </button>
        <button @click="closePrintPreview" class="action-btn secondary">
          <i class="bi bi-x-circle"></i>
          Đóng
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DiagnosisSession } from '@/types/chatDiagnosis'
import type { DermatologyRequestForm } from '@/types/request'

interface Props {
  patientInfo: DermatologyRequestForm
  diagnosisInfo: DiagnosisSession
  showConversation?: boolean
  patientImageBase64?: string
}

const props = withDefaults(defineProps<Props>(), {
  showConversation: false,
  patientImageBase64: ''
})

const isPreview = ref(false)
const printContent = ref<HTMLElement | null>(null)

const currentDate = computed(() => {
  const today = new Date()
  return today.toLocaleDateString('vi-VN')
})

const hasPatientImage = computed(() => {
  return !!props.patientImageBase64
})

const hasAdditionalSymptoms = computed(() => {
  return allDetectedSymptoms.value.length > 0
})

// Get all additional symptoms from messages
const allDetectedSymptoms = computed(() => {
  const symptoms = new Set<string>()
  props.diagnosisInfo.messages.forEach(message => {
    if (message.metadata?.new_symptoms_detected) {
      message.metadata.new_symptoms_detected.forEach(symptom => {
        symptoms.add(symptom)
      })
    }
  })
  return Array.from(symptoms)
})

const openPrintPreview = () => {
  isPreview.value = true
  // Scroll to preview after it renders
  setTimeout(() => {
    const modal = document.querySelector('.print-preview-modal')
    if (modal) {
      modal.scrollIntoView({ behavior: 'smooth' })
    }
  }, 100)
}

const closePrintPreview = () => {
  isPreview.value = false
}

const printDocument = () => {
  if (!printContent.value) return

  // Get the document content
  const content = printContent.value.innerHTML
  const printWindow = window.open('', '', 'height=600,width=800')

  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Phiếu Kết Quả Chuẩn Đoán</title>
        <style>
          ${getStyles()}
        </style>
      </head>
      <body>
        <div style="padding: 20px;">
          ${content}
        </div>
      </body>
      </html>
    `)
    printWindow.document.close()

    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }
}

const downloadPDF = () => {
  if (!printContent.value) return

  try {
    // Use browser's print-to-PDF feature
    const content = printContent.value.innerHTML
    const printWindow = window.open('', '', 'height=600,width=800')

    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <title>Phiếu Kết Quả Chẩn Đoán</title>
          <style>
            ${getStyles()}
          </style>
        </head>
        <body>
          <div style="padding: 20px;">
            ${content}
          </div>
        </body>
        </html>
      `)
      printWindow.document.close()

      // Wait for content to load, then print to PDF
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
  } catch (error) {
    console.error('Error downloading PDF:', error)
    alert('Lỗi khi tải xuống PDF. Vui lòng thử lại.')
  }
}

const getStyles = () => {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: white;
    }

    .report-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin-bottom: 20px;
      text-align: center;
    }

    .header-logo img {
      width: 60px;
      height: 60px;
      object-fit: contain;
    }

    .header-title h1 {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 5px;
    }

    .subtitle {
      font-size: 12px;
      color: #64748b;
    }

    .divider {
      border: none;
      border-top: 2px solid #5b9fd9;
      margin: 15px 0;
    }

    .section {
      margin-bottom: 20px;
    }

    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 10px;
      padding-bottom: 5px;
      border-bottom: 2px solid #5b9fd9;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }

    .info-item {
      padding: 8px;
      background: #f8fafc;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    .info-item.full-width {
      grid-column: 1 / -1;
    }

    .info-item label {
      font-weight: 600;
      color: #475569;
      font-size: 11px;
      display: block;
      margin-bottom: 3px;
    }

    .info-item .value {
      color: #1e293b;
      font-size: 12px;
      word-break: break-word;
    }

    .symptom-box {
      padding: 10px;
      background: #f0f9ff;
      border-left: 3px solid #5b9fd9;
      border-radius: 4px;
      line-height: 1.6;
      font-size: 12px;
      color: #1e293b;
    }

    .subsection {
      margin-bottom: 15px;
    }

    .subsection h4 {
      font-size: 12px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 8px;
    }

    .symptoms-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 10px;
    }

    .tag {
      display: inline-block;
      padding: 4px 8px;
      background: #e0f2fe;
      color: #0369a1;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
    }

    .tag.additional-tag {
      background: #dbeafe;
      color: #1e40af;
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }

    .tag.additional-tag i {
      font-size: 9px;
    }

    .image-section {
      margin-top: 8px;
      padding: 8px;
      background: #f0f9ff;
      border-radius: 4px;
      border-left: 3px solid #5b9fd9;
    }

    .image-section h4 {
      font-size: 11px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 6px;
      margin-top: 0;
    }

    .patient-image {
      max-width: 100%;
      height: auto;
      max-height: 250px;
      border-radius: 4px;
      margin-top: 6px;
    }

    .diseases-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      margin-top: 8px;
    }

    .diseases-table thead {
      background: #5b9fd9;
      color: white;
    }

    .diseases-table th {
      padding: 8px;
      text-align: left;
      font-weight: 600;
    }

    .diseases-table td {
      padding: 8px;
      border: 1px solid #e2e8f0;
    }

    .diseases-table tbody tr:nth-child(even) {
      background: #f8fafc;
    }

    .text-center {
      text-align: center;
    }

    .text-sm {
      font-size: 10px;
      line-height: 1.4;
    }

    .font-bold {
      font-weight: 600;
      color: #1e293b;
    }

    .probability-bar {
      width: 100%;
      height: 12px;
      background: #e2e8f0;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 2px;
    }

    .probability-fill {
      height: 100%;
      background: linear-gradient(90deg, #5b9fd9 0%, #4a8bc2 100%);
    }

    .percentage {
      font-weight: 600;
      color: #1e293b;
    }

    .conversation-box {
      max-height: 400px;
      overflow-y: auto;
      padding: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
    }

    .message-item {
      margin-bottom: 10px;
      padding: 8px;
      background: white;
      border-radius: 4px;
      border-left: 3px solid #5b9fd9;
    }

    .message-role {
      font-weight: 600;
      font-size: 11px;
      margin-bottom: 3px;
    }

    .message-role.user {
      color: #0369a1;
    }

    .message-role.assistant {
      color: #5b9fd9;
    }

    .message-text {
      font-size: 11px;
      color: #475569;
      line-height: 1.4;
      word-break: break-word;
    }

    .report-footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 2px solid #e2e8f0;
    }

    .footer-text {
      font-size: 11px;
      color: #f59e0b;
      background: #fef3c7;
      padding: 8px;
      border-radius: 4px;
      margin-bottom: 10px;
    }

    .footer-info {
      text-align: center;
      font-size: 10px;
      color: #64748b;
    }

    .footer-info p {
      margin: 2px 0;
    }

    @media print {
      body {
        margin: 0;
        padding: 20px;
      }

      .no-print {
        display: none;
      }

      .report-document {
        page-break-inside: avoid;
      }

      .section {
        page-break-inside: avoid;
      }
    }
  `
}
</script>

<style scoped>
.diagnosis-report-container {
  width: 100%;
}

.print-button-section {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.print-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 2.5rem;
  background: linear-gradient(135deg, #5b9fd9 0%, #4a8bc2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(91, 159, 217, 0.2);
}

.print-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(91, 159, 217, 0.3);
}

.print-button i {
  font-size: 1.1rem;
}

/* Print Preview Modal */
.print-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  z-index: 2000;
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.preview-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #1e293b;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #1e293b;
}

/* Document Content */
.report-document {
  flex: 1;
  overflow-y: auto;
  background: white;
  padding: 2rem;
  margin: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.report-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.header-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
}

.header-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.header-title h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  font-size: 0.9rem;
  color: #64748b;
}

.divider {
  border: none;
  border-top: 2px solid #5b9fd9;
  margin: 1.5rem 0;
}

.section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #5b9fd9;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.info-item {
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-item label {
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  color: #475569;
  margin-bottom: 0.25rem;
}

.info-item .value {
  font-size: 0.9rem;
  color: #1e293b;
  word-break: break-word;
}

.symptom-box {
  padding: 1rem;
  background: #f0f9ff;
  border-left: 4px solid #5b9fd9;
  border-radius: 4px;
  line-height: 1.6;
  color: #1e293b;
}

.subsection {
  margin-bottom: 1.25rem;
}

.subsection h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.subsection p {
  font-size: 0.9rem;
  color: #475569;
  margin: 0.25rem 0;
}

.symptoms-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  background: #e0f2fe;
  color: #0369a1;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.tag.additional-tag {
  background: #dbeafe;
  color: #1e40af;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.tag.additional-tag i {
  font-size: 0.7rem;
}

.image-section {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #f0f9ff;
  border-radius: 4px;
  border-left: 4px solid #5b9fd9;
}

.image-section h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.75rem;
  margin-top: 0;
}

.patient-image {
  max-width: 100%;
  height: auto;
  max-height: 300px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.diseases-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.75rem;
  font-size: 0.85rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.diseases-table thead {
  background: #5b9fd9;
  color: white;
}

.diseases-table th {
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
}

.diseases-table td {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
}

.diseases-table tbody tr:nth-child(even) {
  background: #f8fafc;
}

.text-center {
  text-align: center;
}

.font-bold {
  font-weight: 600;
}

.probability-display {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.probability-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.probability-fill {
  height: 100%;
  background: linear-gradient(90deg, #5b9fd9 0%, #4a8bc2 100%);
}

.percentage {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e293b;
}

.conversation-box {
  max-height: 300px;
  overflow-y: auto;
  padding: 0.75rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.85rem;
}

.message-item {
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 4px;
  border-left: 3px solid #5b9fd9;
}

.message-role {
  font-weight: 600;
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.message-role.user {
  color: #0369a1;
}

.message-role.assistant {
  color: #5b9fd9;
}

.message-text {
  font-size: 0.85rem;
  color: #475569;
  line-height: 1.4;
  word-break: break-word;
}

.report-footer {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.footer-text {
  padding: 0.75rem;
  background: #fef3c7;
  color: #92400e;
  border-radius: 4px;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.footer-info {
  text-align: center;
  color: #64748b;
  font-size: 0.8rem;
}

/* Preview Actions */
.preview-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background: white;
  border-top: 1px solid #e2e8f0;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn i {
  font-size: 1rem;
}

.action-btn.primary {
  background: linear-gradient(135deg, #5b9fd9 0%, #4a8bc2 100%);
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(91, 159, 217, 0.3);
}

.action-btn.success {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
}

.action-btn.success:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.action-btn.secondary {
  background: #e2e8f0;
  color: #475569;
}

.action-btn.secondary:hover {
  background: #cbd5e0;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .print-preview-modal {
    flex-direction: column;
  }

  .report-document {
    padding: 1rem;
    margin: 0.5rem;
  }

  .preview-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .diseases-table {
    font-size: 0.75rem;
  }

  .diseases-table th,
  .diseases-table td {
    padding: 0.5rem;
  }
}

@media print {
  .print-button-section,
  .preview-header,
  .preview-actions,
  .close-btn {
    display: none !important;
  }

  .report-document {
    all: unset;
  }
}
</style>
