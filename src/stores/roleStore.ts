import { defineStore } from 'pinia';
import { api, handleApiError } from '@/utils/api';
import type { PaginatedResponse } from '@/types/common';
import type { Role, RolePermission } from '@/types/role';
import type { PaginationData } from '@/types/type';
import { formatDate } from '@/utils/dateUtils';
interface ServerResponse {
    message: string;
    data: {
        id: number;
        name: string;
        description: string;
        permissions?: RolePermission[];
        created_at: string;
        updated_at: string;
    };
}
export const useRoleStore = defineStore('role', {
    state: () => ({
        roles: [] as Role[],
        currentRole: null as Role | null,
        loading: false,
        error: null as string[] | null,
        pagination: null as PaginationData | null,
    }),

    actions: {
        async fetchRoles(pageNo: number = 1, pageSize: number = 30) {
            this.loading = true;
            try {
                const response = await api.get<PaginatedResponse<Role>>('/roles', {
                    params: {
                        page_no: pageNo,
                        page_size: pageSize,
                    },
                });
                this.roles = response.data.map(role => ({
                    ...role,
                    created_at: formatDate(role.created_at),
                    updated_at: formatDate(role.updated_at)
                }));
                this.pagination = response.pagination;
            } catch (error) {
                this.error = handleApiError(error);
            } finally {
                this.loading = false;
            }
        },

        async createRoles(role: Omit<Role, 'id'>): Promise<ServerResponse> {
            this.loading = true;
            try {
                const response = await api.post<ServerResponse>('/role_permissions', role);

                this.roles.push(response.data);
                return response;

            } catch (error) {
                this.error = handleApiError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateRoles(id: number, role: Omit<Role, 'id'>): Promise<ServerResponse> {
            this.loading = true;
            try {
                const response = await api.put<ServerResponse>(`/role_permissions/${id}`, role);

                const index = this.roles.findIndex(u => u.id === id);
                if (index !== -1) {
                    this.roles[index] = response.data;
                }
                return response;

            } catch (error) {
                this.error = handleApiError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteRoles(id: number) {
            this.loading = true;
            try {
                await api.delete(`/role_permissions/${id}`);
                this.roles = this.roles.filter(u => u.id !== id);
            } catch (error) {
                this.error = handleApiError(error);
            } finally {
                this.loading = false;
            }
        },

        async fetchRolesById(id: number) {
            this.loading = true;
            try {
                const response = await api.get<Role>(`/roles/${id}`);
                this.currentRole = response;
                return response;
            } catch (error) {
                this.error = handleApiError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async fetchRolesIfNeeded() {
            if (this.roles.length === 0 && !this.loading) {
                this.loading = true;
                try {
                    const response = await api.get<PaginatedResponse<Role>>('/roles');
                    this.roles = response.data;
                    this.pagination = response.pagination;
                } catch (error) {
                    this.error = handleApiError(error);
                } finally {
                    this.loading = false;
                }
            }
            return this.roles;
        },
    },
    getters: {
        getRoleById: (state) => (id: number | string) => {
            const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
            return state.roles.find(role => role.id === numericId);
        },
    },
});