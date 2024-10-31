import { defineStore } from 'pinia';
import { api, handleApiError } from '@/utils/api';
import type { PaginatedResponse } from '@/types/common';
import type { Request, RequestFormData } from '@/types/request';
import type { PaginationData } from '@/types/type';
interface District {
    id: number;
    name: string;
    communes: { commune_id: number; name: string }[];
}

export const useRequestStore = defineStore('request', {
    state: () => ({
        requests: [] as Request[],
        currentObject: null as Request | null,
        districts: [] as District[],
        loading: false,
        error: null as string[] | null,
        districtLoading: false,
        pagination: null as PaginationData | null,
    }),

    actions: {
        async fetchRequest(pageNo: number = 1, pageSize: number = 10) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.get<PaginatedResponse<Request>>('/request_rescues', {
                    params: { 'page-no': pageNo, 'page-size': pageSize },
                });
                this.requests = response.data;
                this.pagination = response.pagination;
            } catch (error) {
                this.error = handleApiError(error);
            } finally {
                this.loading = false;
            }
        },

        async createRequest(RequestsData: FormData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post<Request>('/request_rescues', RequestsData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                this.requests.push(response);
                return response;
            } catch (error) {
                this.error = handleApiError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateRequest(id: number, requestData: FormData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post<Request>(`/request_rescues/${id}`, requestData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                const index = this.requests.findIndex(request => request.id === id);
                if (index !== -1) {
                    this.requests[index] = response;
                }
                return response;
            } catch (error) {
                this.error = handleApiError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteRequest(id: number) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post(`/request_rescues/${id}`);
                this.requests = this.requests.filter(u => u.id !== id);
                return response;
            } catch (error) {
                this.error = handleApiError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },
        getUserById(id: number): Request | undefined {
            return this.requests.find(request => request.id === id);
        },
        async fetchRequestById(id: number) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.get<Request>(`/request_rescues/${id}`);
                this.currentObject = response.data;
                return this.currentObject;
            } catch (error) {
                this.error = handleApiError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },

    getters: {
        getDistrictById: (state) => (id: number | string) => {
            const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
            return state.districts.find(district => district.id === numericId);
        },
        getCommuneById: (state) => (id: number | string) => {
            const stringId = id.toString();
            for (const district of state.districts) {
                const commune = district.communes.find(c => c.commune_id.toString() === stringId);
                if (commune) return commune;
            }
            return null;
        },
    },
});