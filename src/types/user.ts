export interface UserFormData {
    id?: number;
    name: string;
    username: string;
    email: string;
    password?: string;
    role_id: number;
    district_id: number;
    commune_id: number;
    is_super_admin: boolean;
    image: File | null;
    status: boolean;
}

export interface User extends Omit<UserFormData, 'password'> {
    id: number;
    created_at: string;
    updated_at: string;
}
