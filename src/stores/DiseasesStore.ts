import { defineStore } from 'pinia';
import { api, handleApiError } from '@/utils/api';
import type { Disease, DiseasesState, DiseaseFormData } from '@/types/diseases';
import type { PaginatedResponse } from '@/types/common';

export const useDiseasesStore = defineStore('diseases', {
    state: (): DiseasesState => ({
        diseases: [],
        currentDisease: null,
        loading: false,
        error: null,
        pagination: null
    }),

    actions: {
        async fetchDiseases(pageNo: number = 1, pageSize: number = 10) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.get<PaginatedResponse<Disease>>('/diseases', {
                    params: { 'page-no': pageNo, 'page-size': pageSize }
                });
                this.diseases = response.data;
                this.pagination = response.pagination;
            } catch (error) {
                this.error = handleApiError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async createDisease(diseaseData: DiseaseFormData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post<Disease>('/diseases', diseaseData);
                this.diseases.push(response);
                return response;
            } catch (error) {
                this.error = handleApiError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateDisease(id: number, diseaseData: DiseaseFormData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.put<Disease>(`/diseases/${id}`, diseaseData);
                const index = this.diseases.findIndex(disease => disease.id === id);
                if (index !== -1) {
                    this.diseases[index] = response;
                }
                return response;
            } catch (error) {
                this.error = handleApiError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteDisease(id: number) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.delete(`/diseases/${id}`);
                this.diseases = this.diseases.filter(d => d.id !== id);
                return response;
            } catch (error) {
                this.error = handleApiError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchDiseaseById(id: number) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.get<Disease>(`/diseases/${id}`);
                this.currentDisease = response;
                return this.currentDisease;
            } catch (error) {
                this.error = handleApiError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        }
    }
});