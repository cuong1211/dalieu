export interface RolePermission {
    permission_id: number;
    can_view: boolean;
    can_create: boolean;
    can_update: boolean;
    can_delete: boolean;
    can_export: boolean;
}

export interface Role {
    id: number;
    name: string;
    description: string;
    permissions?: RolePermission[];
    created_at: string;
    updated_at: string;
}

export interface RoleFormData {
    name: string;
    description: string;
    permissions?: string[]; // Array of permission:action strings (e.g. "1:2" for permission 1, action 2)
}
