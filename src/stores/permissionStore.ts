import { defineStore } from 'pinia';
import { api, handleApiError } from '@/utils/api';
import type { PaginatedResponse } from '@/types/common';
import type { PaginationData } from '@/types/type';
import type { Permission } from '@/types/permission';
import { formatDate } from '@/utils/dateUtils';


interface ServerResponse {
    message: string;
    data: {
        id: number;
        name: string;
        description?: string;
        created_at: string;
        updated_at: string;
    };
}
export const usePermissionStore = defineStore('permission', {
    state: () => ({
        permissions: [] as Permission[],
        currentPermission: null as Permission | null,
        loading: false,
        error: null as string[] | null,
        pagination: null as PaginationData | null,
    }),

    actions: {
        async fetchPermissions(pageNo: number = 1, pageSize: number = 10) {
            this.loading = true;
            try {
                const response = await api.get<PaginatedResponse<Permission>>('/permissions', {
                    params: {
                        page_no: pageNo,
                        page_size: pageSize,
                    },
                });
                this.permissions = response.data.map(permission => ({
                    ...permission,
                    created_at: formatDate(permission.created_at),
                    updated_at: formatDate(permission.updated_at)
                }));
                this.pagination = response.pagination;
                return response;
            } catch (error) {
                this.error = handleApiError(error);
            } finally {
                this.loading = false;
            }
        },

        async createPermissions(permission: Omit<Permission, 'id'>) {
            this.loading = true;
            try {
                const response = await api.post<ServerResponse>('/permissions', permission);

                if (response.message === 'success' && response.data) {
                    const newPermission: Permission = {
                        id: response.data.id,
                        name: response.data.name,
                        description: response.data.description || '',
                        created_at: formatDate(response.data.created_at),
                        updated_at: formatDate(response.data.updated_at)
                    };
                    this.permissions.push(newPermission);
                    return newPermission;
                } else {
                    throw new Error('Invalid response format from server');
                }
            } catch (error) {
                this.error = handleApiError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updatePermissions(id: number, permission: Omit<Permission, 'id'>) {
            this.loading = true;
            try {
                const response = await api.put<ServerResponse>(`/permissions/${id}`, permission);

                if (response.message === 'success' && response.data) {
                    const updatedPermission: Permission = {
                        id: response.data.id,
                        name: response.data.name,
                        description: response.data.description || '',
                        created_at: formatDate(response.data.created_at),
                        updated_at: formatDate(response.data.updated_at)
                    };
                    const index = this.permissions.findIndex(p => p.id === id);
                    if (index !== -1) {
                        this.permissions[index] = updatedPermission;
                    }
                    return updatedPermission;
                } else {
                    throw new Error('Invalid response format from server');
                }
            } catch (error) {
                this.error = handleApiError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deletePermissions(id: number) {
            this.loading = true;
            try {
                await api.delete(`/permissions/${id}`);
                this.permissions = this.permissions.filter(u => u.id !== id);
            } catch (error) {
                this.error = handleApiError(error);
            } finally {
                this.loading = false;
            }
        },

        async fetchPermissionsById(id: number) {
            this.loading = true;
            try {
                const response = await api.get<Permission>(`/permissions/${id}`);
                if (this.isPermission(response)) {
                    this.currentPermission = response;
                    return response;
                } else {
                    throw new Error('Invalid response from server');
                }
            } catch (error) {
                this.error = handleApiError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // Helper method to check if a response is a valid Permission
        isPermission(obj: any): obj is Permission {
            return (
                typeof obj === 'object' &&
                obj !== null &&
                'id' in obj &&
                'name' in obj &&
                'description' in obj &&
                typeof obj.id === 'number' &&
                typeof obj.name === 'string' &&
                typeof obj.description === 'string'
            );
        }
    },
});