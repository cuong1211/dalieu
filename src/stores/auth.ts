import { defineStore } from 'pinia'
import axios from 'axios'
interface User {
    id: number;
    email: string;
    name: string;
    isAdmin: boolean;
    // Thêm các trường khác nếu cần
}
interface Resource{
    district_id: number;
    commune_id: number;
    construction_ids: number[];

}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        isAdmin: false,
        token: null as string | null,
        isAuthenticated: false,
        errors: [] as string[]
    }),
    getters: {
        isLoggedIn: (state) => state.isAuthenticated
    },
    actions: {
        async login(credentials: { username: string; password: string }) {
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, credentials);

                this.setUserAndToken(response.data.user, response.data.token, response.data.role, response.data.is_super_admin, response.data.resource);
                return response.data;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        // Lỗi từ server với status code
                        if (typeof error.response.data === 'string') {
                            this.errors = [error.response.data];
                        } else if (error.response.data.message) {
                            this.errors = [error.response.data.message];
                        } else if (error.response.data.error) {
                            this.errors = [error.response.data.error];
                        } else {
                            this.errors = ['An unexpected error occurred'];
                        }
                    } else if (error.request) {
                        // Yêu cầu được gửi nhưng không nhận được phản hồi
                        this.errors = ['No response received from server'];
                    } else {
                        // Có lỗi khi thiết lập request
                        this.errors = [error.message || 'An error occurred while sending the request'];
                    }
                } else {
                    // Lỗi không phải từ Axios
                    this.errors = ['An unexpected error occurred'];
                }
                throw error;
            }
        },
        logout() {
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;
            this.errors = [];
            localStorage.removeItem('token');
            localStorage.removeItem('user')
        },
        setUserAndToken(user: User, token: string, role: string, is_super_admin: boolean, resource: Resource) {

            this.user = user;
            this.token = token;
            this.isAuthenticated = true;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({user, role, is_super_admin, resource}));
        },
        clearErrors() {
            this.errors = [];
        },
        checkAuth() {
            const token = localStorage.getItem('token');
            if (token) {
                this.token = token;
                this.isAuthenticated = true;
                // Ở đây bạn có thể thêm logic để fetch thông tin user nếu cần
            }
        }
    }
})