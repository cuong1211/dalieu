import { defineStore } from 'pinia';
import { api, handleApiError } from '@/utils/api';
import type { PaginatedResponse } from '@/types/common';
import type { Request } from '@/types/request';
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
                const response = await api.get<PaginatedResponse<Request>>('/patients', {
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
        async fetchRequestById(id: number) {
            try {
                const response = await api.get<Request>(`/patients/${id}`);
                return response.data;
            } catch (error) {
                this.error = handleApiError(error);
                throw error;
            }
        },
    },
});