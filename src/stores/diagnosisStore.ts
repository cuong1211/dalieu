import { defineStore } from 'pinia';
import { api } from '@/utils/api';

// Types & Interfaces
interface Disease {
  id: number;
  code: number;
  name: string;
  symptom: string;
  treatment: string;
  created_at: string;
  updated_at: string;
}

interface DiagnosisInfo {
  main?: Disease[][];
  sub?: Disease[][];
}

interface PatientDiagnosis {
  name: string;
  age: string;
  gender: string;
  phone: string;
  address: string;
  symptom: string;
  info: DiagnosisInfo;
  result: string;
  image: string;
}

interface DiagnosisResponse {
  message: string;
  data: PatientDiagnosis;
}

interface DiagnosisState {
  currentDiagnosis: PatientDiagnosis | null;
  loading: boolean;
  error: string | null;
  currentDiagnosisId: number | null;
  diagnosedDiseases: Disease[]; // Chỉ dùng một mảng để lưu kết quả sau khi trả lời câu hỏi
}

interface DiagnosisForm {
  id: number;
  name: string;
  birthday: string;
  gender: string;
  id_number: string;
  phone: string;
  email: string;
  address: string;
  symptoms: string;
  image: File | null;
}

interface AdditionalDiagnosisResponse {
  status: boolean;
  data: Disease[];
}

export const useDiagnosisStore = defineStore('diagnosis', {
  state: (): DiagnosisState => ({
    currentDiagnosis: null,
    loading: false,
    error: null,
    currentDiagnosisId: null,
    diagnosedDiseases: [],
  }),

  getters: {
    // Lấy các bệnh từ kết quả chẩn đoán ban đầu
    initialMainDiseases(): Disease[] {
      if (!this.currentDiagnosis?.info.main) return [];
      return this.currentDiagnosis.info.main.flat();
    },

    initialRelatedDiseases(): Disease[] {
      if (!this.currentDiagnosis?.info.sub) return [];
      return this.currentDiagnosis.info.sub.flat();
    },

    // Lấy tất cả các ID bệnh từ kết quả chẩn đoán ban đầu
    allDiseaseIds(): number[] {
      const mainDiseases = this.initialMainDiseases;
      const relatedDiseases = this.initialRelatedDiseases;
      return [...mainDiseases, ...relatedDiseases]
        .map(disease => Number(disease.code)) // Chuyển code sang số
        .filter(code => !isNaN(code)); // Loại bỏ các giá trị không hợp lệ
    },


    hasInitialDiagnosis(): boolean {
      return this.currentDiagnosis !== null;
    },

    // Kiểm tra có kết quả chẩn đoán bổ sung không
    hasAdditionalDiagnosis(): boolean {
      return this.diagnosedDiseases.length > 0;
    }
  },

  actions: {
    // Chẩn đoán ban đầu
    async submitDiagnosis(formData: DiagnosisForm): Promise<DiagnosisResponse> {
      this.loading = true;
      this.error = null;

      try {
        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (key === 'image' && value instanceof File) {
            form.append('image', value);
          } else if (value !== null) {
            form.append(key, String(value));
          }
        });

        const response = await api.post<DiagnosisResponse>('/patients', form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        this.currentDiagnosis = response.data;
        return response;

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Không thể gửi yêu cầu chẩn đoán';
        this.error = errorMessage;
        throw new Error(errorMessage);
      } finally {
        this.loading = false;
      }
    },

    // Tạo kết luận dựa trên số lượng bệnh được chẩn đoán
    generateDiagnosisResult(diseases: Disease[]): string {
      if (diseases.length === 0) {
        return 'Không thể xác định chính xác bệnh từ các triệu chứng đã cung cấp.';
      }

      if (diseases.length === 1) {
        return `Dựa trên các triệu chứng bổ sung, có thể xác định bạn đang mắc bệnh ${diseases[0].name}.`;
      }

      const diseaseNames = diseases.map(d => d.name).join(', ');
      return `Dựa trên các triệu chứng bổ sung, bạn có thể liên quan đến các bệnh sau: ${diseaseNames}.`;
    },

    // Chẩn đoán bổ sung sau khi trả lời câu hỏi
    async submitAdditionalDiagnosis(payload: { diseases: number[]; symptoms: { id: number; answer: boolean; }[] }) {
      if (!this.currentDiagnosisId) {
        throw new Error('Không tìm thấy ID chẩn đoán');
      }

      try {
        const response = await api.post<AdditionalDiagnosisResponse>(
          `/diagnose/${this.currentDiagnosisId}`,
          payload
        );

        this.diagnosedDiseases = response.data;

        return {
          status: response.status,
          data: response.data,
          result: this.generateDiagnosisResult(response.data)
        };
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu chẩn đoán bổ sung:', error);
        throw error;
      }
    },

    setCurrentDiagnosisId(id: number): void {
      this.currentDiagnosisId = id;
    },

    clearDiagnosis(): void {
      this.currentDiagnosis = null;
      this.error = null;
      this.currentDiagnosisId = null;
      this.diagnosedDiseases = [];
    }
  }
});