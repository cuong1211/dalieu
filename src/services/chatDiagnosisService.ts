import axios from 'axios';
import type {
    DiagnosisStartRequest,
    DiagnosisStartResponse,
    DiagnosisRespondRequest,
    DiagnosisRespondResponse
} from '@/types/chatDiagnosis';

// Sử dụng proxy path để bypass CORS
// Development: /api/diagnosis sẽ được proxy tới http://14.225.211.5:8080/diagnosis
// Production: Cần cấu hình nginx/server để proxy hoặc backend phải enable CORS
const API_BASE_URL = import.meta.env.VITE_API_CHAT ? '/api/diagnosis' : 'http://14.225.211.5:8080/diagnosis';

/**
 * Service để xử lý API chat diagnosis
 */
class ChatDiagnosisService {
    /**
     * Bắt đầu phiên chẩn đoán mới
     * @param description - Mô tả triệu chứng từ form
     * @param imageFile - File ảnh từ form
     * @param patientInfo - Thông tin bệnh nhân (tùy chọn)
     * @returns Response chứa session_id và câu hỏi đầu tiên
     */
    async startDiagnosis(
        description: string,
        imageFile: File | null,
        patientInfo?: {
            name?: string;
            age?: string;
            gender?: string;
            identification?: string;
            phone?: string;
            email?: string;
            address?: string;
        }
    ): Promise<DiagnosisStartResponse> {
        try {
            // Convert image to base64
            let imageBase64 = '';
            if (imageFile) {
                imageBase64 = await this.fileToBase64(imageFile);
            }

            const payload: DiagnosisStartRequest = {
                description,
                ...(imageBase64 && { image: imageBase64 }),
                ...(patientInfo && {
                    patient_info: {
                        name: patientInfo.name,
                        age: patientInfo.age,
                        gender: patientInfo.gender,
                        identification: patientInfo.identification,
                        phone: patientInfo.phone,
                        email: patientInfo.email,
                        address: patientInfo.address
                    }
                })
            };

            const response = await axios.post<DiagnosisStartResponse>(
                `${API_BASE_URL}/start`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error starting diagnosis:', error);
            throw new Error('Không thể bắt đầu chẩn đoán. Vui lòng thử lại.');
        }
    }

    /**
     * Gửi câu trả lời cho câu hỏi chẩn đoán
     * @param sessionId - ID phiên chẩn đoán
     * @param answer - Câu trả lời của người dùng
     * @param currentSymptoms - Danh sách triệu chứng hiện tại
     * @returns Response chứa câu hỏi tiếp theo hoặc kết quả cuối cùng
     */
    async respondToQuestion(
        sessionId: string,
        answer: string,
        currentSymptoms: string[]
    ): Promise<DiagnosisRespondResponse> {
        try {
            const payload: DiagnosisRespondRequest = {
                session_id: sessionId,
                answer,
                new_symptoms: currentSymptoms
            };

            const response = await axios.post<DiagnosisRespondResponse>(
                `${API_BASE_URL}/respond`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error responding to question:', error);
            throw new Error('Không thể gửi câu trả lời. Vui lòng thử lại.');
        }
    }

    /**
     * Convert File thành base64 string
     * @param file - File cần convert
     * @returns Base64 string của file
     */
    private fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    // Lấy phần base64 thuần (bỏ phần "data:image/...;base64,")
                    const base64String = reader.result.split(',')[1];
                    resolve(base64String);
                } else {
                    reject(new Error('Failed to convert file to base64'));
                }
            };

            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };

            reader.readAsDataURL(file);
        });
    }
}

export default new ChatDiagnosisService();
