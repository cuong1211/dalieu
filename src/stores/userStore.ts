import { defineStore } from 'pinia';
import { api, handleApiError } from '@/utils/api';
import type { PaginatedResponse } from '@/types/common';
import type { User, UserFormData } from '@/types/user';
import type { PaginationData } from '@/types/type';
interface District {
    id: number;
    name: string;
    communes: { commune_id: number; name: string }[];
}
interface DistrictResponse {
    data: District[];
}
export const useUserStore = defineStore('user', {
    state: () => ({
        users: [] as User[],
        districts: [] as District[],
        currentUser: null as User | null,
        loading: false,
        error: null as string[] | null,
        districtLoading: false,
        pagination: null as PaginationData | null,
    }),

    actions: {
        async fetchUsers(pageNo: number = 1, pageSize: number = 10) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.get<PaginatedResponse<User>>('/users', {
                    params: { page_no: pageNo, page_size: pageSize },
                });
                this.users = response.data;
                this.pagination = response.pagination;
            } catch (error) {
                this.error = handleApiError(error);
            } finally {
                this.loading = false;
            }
        },

        async createUser(userData: UserFormData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post<User>('/users', userData);
                this.users.push(response);
                return response;
            } catch (error) {
                this.error = handleApiError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateUser(id: number, userData: Partial<UserFormData>) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.put<User>(`/users/${id}`, userData);
                const index = this.users.findIndex(u => u.id === id);
                if (index !== -1) {
                    this.users[index] = response;
                }
                return response;
            } catch (error) {
                this.error = handleApiError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteUser(id: number) {
            this.loading = true;
            this.error = null;
            try {
                await api.delete(`/users/${id}`);
                this.users = this.users.filter(u => u.id !== id);
            } catch (error) {
                this.error = handleApiError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },
        getUserById(id: number): User | undefined {
            return this.users.find(user => user.id === id);
        },
        async fetchUserById(id: number) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.get<User>(`/users/${id}`);
                this.currentUser = response;
                return response;
            } catch (error) {
                this.error = handleApiError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async fetchDistrictsIfNeeded() {
            if (this.districts?.length === 0 && !this.districtLoading) {
                this.districtLoading = true;
                this.error = null;
                try {
                    const response = await api.get<DistrictResponse>('/districts');
                    this.districts = response.data;
                } catch (error) {
                    this.error = handleApiError(error);
                } finally {
                    this.districtLoading = false;
                }
            }
            return this.districts;
        },
        async resetPassword(userId: number) {
            this.loading = true;
            this.error = null;
            try {
                await api.post(`/users/reset_password/${userId}`);
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
        isDistrictsLoaded: (state) => state.districts.length > 0,
    },
});