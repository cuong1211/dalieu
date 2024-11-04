// stores/diagnosisStore.ts
import { defineStore } from 'pinia';
import { api } from '@/utils/api';

// Types & Interfaces
interface Disease {
  id: number;
  name: string;
  treatment?: string;
}

interface DiagnosisInfo {
  main?: Disease[][];  // Optional vì có thể không tồn tại
  sub?: Disease[][];   // Optional vì có thể không tồn tại
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

export const useDiagnosisStore = defineStore('diagnosis', {
  state: (): DiagnosisState => ({
    currentDiagnosis: null,
    loading: false,
    error: null
  }),

  actions: {
    async submitDiagnosis(formData: DiagnosisForm): Promise<DiagnosisResponse> {
      this.loading = true;
      this.error = null;

      try {
        const form = new FormData();
        
        // Append form fields
        Object.entries(formData).forEach(([key, value]) => {
          if (key === 'image' && value instanceof File) {
            form.append('image', value);
          } else if (value !== null) {
            form.append(key, String(value));
          }
        });

        const response = await api.post<DiagnosisResponse>('/patients', form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
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

    clearDiagnosis(): void {
      this.currentDiagnosis = null;
      this.error = null;
    }
  },

  getters: {
    // Lấy bệnh chính (từ main)
    mainDiseases: (state): Disease[] => {
      if (!state.currentDiagnosis?.info.main) return [];
      return state.currentDiagnosis.info.main.flat();
    },

    // Lấy bệnh phụ (từ sub)
    relatedDiseases: (state): Disease[] => {
      if (!state.currentDiagnosis?.info.sub) return [];
      return state.currentDiagnosis.info.sub.flat();
    },

    // Lấy tất cả bệnh (cả main và sub)
    allDiseases: (state): Disease[] => {
      const diseases: Disease[] = [];
      
      // Thêm bệnh chính nếu có
      if (state.currentDiagnosis?.info.main) {
        diseases.push(...state.currentDiagnosis.info.main.flat());
      }
      
      // Thêm bệnh phụ nếu có
      if (state.currentDiagnosis?.info.sub) {
        diseases.push(...state.currentDiagnosis.info.sub.flat());
      }

      return diseases;
    },

    // Kiểm tra có bệnh chính không
    hasMainDiseases: (state): boolean => {
      return !!state.currentDiagnosis?.info.main && 
             state.currentDiagnosis.info.main.flat().length > 0;
    },

    // Kiểm tra có bệnh phụ không 
    hasRelatedDiseases: (state): boolean => {
      return !!state.currentDiagnosis?.info.sub &&
             state.currentDiagnosis.info.sub.flat().length > 0;
    },

    // Lấy thông tin chi tiết của một bệnh
    getDiseaseById: (state) => (id: number): Disease | undefined => {
      const allDiseases = [...(state.currentDiagnosis?.info.main || []).flat(),
                          ...(state.currentDiagnosis?.info.sub || []).flat()];
      return allDiseases.find(disease => disease.id === id);
    },

    // Các getters tiện ích khác
    isLoading: (state): boolean => state.loading,
    getError: (state): string | null => state.error,
    hasDiagnosis: (state): boolean => state.currentDiagnosis !== null
  }
});