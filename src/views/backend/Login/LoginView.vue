<script setup lang="ts">
import { ref } from "vue";
import { useForm, Field, ErrorMessage } from "vee-validate";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import Swal from 'sweetalert2'
import * as Yup from "yup";

const authStore = useAuthStore();
const router = useRouter();

const submitButton = ref<HTMLElement | null>(null);
const isLoading = ref(false);

interface LoginCredentials {
    username: string;
    password: string;
}

const loginSchema = Yup.object().shape({
    username: Yup.string().required().label("Username"),
    password: Yup.string().required().min(4).label("Password"),
});

const { handleSubmit, errors } = useForm<LoginCredentials>({
    validationSchema: loginSchema,
});

const onSubmitLogin = handleSubmit(async (values: LoginCredentials) => {
    authStore.clearErrors();
    isLoading.value = true;

    try {
        await authStore.login(values);

        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Đăng nhập thành công",
            showConfirmButton: false,
            timer: 1500
        })
        setTimeout(() => {
            router.push({ name: "admin.home" });
        }, 50);
    } catch (error) {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: authStore.errors[0] || "Đăng nhập thất bại",
            showConfirmButton: false,
            timer: 1500
        });
    } finally {
        isLoading.value = false;
    }
});
</script>

<template>
    <div class="login-container">
        <div class="login-background"></div>

        <div class="login-content">
            <!-- Logo -->
            <div class="logo-section">
                <img src="/media/logos/logo.png" alt="DERMARAG" class="logo" />
            </div>

            <!-- Main Card -->
            <div class="login-card">
                <!-- Header -->
                <div class="card-header">
                    <h1 class="card-title">Đăng nhập</h1>
                    <p class="card-subtitle">DERMARAG</p>
                </div>

                <!-- Form -->
                <form @submit.prevent="onSubmitLogin" class="login-form">
                    <!-- Username Field -->
                    <div class="form-group">
                        <label for="username" class="form-label">
                            <i class="bi bi-person-fill"></i>
                            Tên đăng nhập
                        </label>
                        <div class="input-wrapper">
                            <Field
                                id="username"
                                name="username"
                                type="text"
                                class="form-input"
                                placeholder="Nhập tên đăng nhập"
                                autocomplete="off"
                            />
                        </div>
                        <ErrorMessage name="username" class="error-message" />
                    </div>

                    <!-- Password Field -->
                    <div class="form-group">
                        <label for="password" class="form-label">
                            <i class="bi bi-lock-fill"></i>
                            Mật khẩu
                        </label>
                        <div class="input-wrapper">
                            <Field
                                id="password"
                                name="password"
                                type="password"
                                class="form-input"
                                placeholder="Nhập mật khẩu"
                                autocomplete="off"
                            />
                        </div>
                        <ErrorMessage name="password" class="error-message" />
                    </div>

                    <!-- Submit Button -->
                    <button
                        type="submit"
                        ref="submitButton"
                        class="submit-button"
                        :disabled="isLoading"
                    >
                        <span v-if="!isLoading" class="button-text">Đăng nhập</span>
                        <span v-else class="button-loading">
                            <i class="bi bi-hourglass-split"></i>
                            Đang xử lý...
                        </span>
                    </button>
                </form>

                <!-- Footer -->
                <div class="card-footer">
                    <p class="footer-text">© 2024 DERMARAG. Tất cả quyền được bảo lưu.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #f5f5f7;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    position: relative;
    overflow: hidden;
}

.login-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(76, 175, 80, 0.02) 100%);
    pointer-events: none;
}

.login-content {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 420px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.logo-section {
    margin-bottom: 2.5rem;
    display: flex;
    justify-content: center;
}

.logo {
    height: 64px;
    width: auto;
    object-fit: contain;
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.08));
}

.login-card {
    width: 100%;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.08);
    padding: 2.5rem;
    border: 1px solid rgba(0, 0, 0, 0.04);
}

.card-header {
    text-align: center;
    margin-bottom: 2rem;
}

.card-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1d1d1f;
    letter-spacing: -0.02em;
    margin-bottom: 0.5rem;
}

.card-subtitle {
    font-size: 0.9375rem;
    color: #86868b;
    font-weight: 500;
    letter-spacing: 0.05em;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #1d1d1f;
    cursor: text;
}

.form-label i {
    font-size: 1rem;
    color: #4caf50;
    flex-shrink: 0;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.form-input {
    width: 100%;
    padding: 0.875rem 1rem;
    font-size: 1rem;
    border: 1.5px solid #e5e5ea;
    border-radius: 10px;
    background: #f9f9fb;
    color: #1d1d1f;
    font-family: inherit;
    transition: all 0.2s ease;
    outline: none;
}

.form-input::placeholder {
    color: #d5d5d7;
}

.form-input:hover {
    border-color: #d5d5d7;
    background: #ffffff;
}

.form-input:focus {
    border-color: #4caf50;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.error-message {
    font-size: 0.8125rem;
    color: #ef4444;
    margin-top: 0.25rem;
    display: block;
}

.submit-button {
    padding: 0.875rem 1rem;
    font-size: 1rem;
    font-weight: 600;
    color: #ffffff;
    background: #4caf50;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 0.5rem;
    font-family: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: 44px;
}

.submit-button:hover:not(:disabled) {
    background: #45a049;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    transform: translateY(-1px);
}

.submit-button:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
}

.submit-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.button-text {
    font-weight: 600;
}

.button-loading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.button-loading i {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.card-footer {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #f5f5f7;
    text-align: center;
}

.footer-text {
    font-size: 0.8125rem;
    color: #86868b;
    line-height: 1.5;
}

/* Responsive Design */
@media (max-width: 768px) {
    .login-content {
        padding: 1.5rem;
    }

    .login-card {
        padding: 2rem;
        border-radius: 14px;
    }

    .card-title {
        font-size: 1.5rem;
    }

    .card-subtitle {
        font-size: 0.875rem;
    }

    .logo {
        height: 56px;
    }

    .logo-section {
        margin-bottom: 2rem;
    }

    .card-header {
        margin-bottom: 1.5rem;
    }

    .login-form {
        gap: 1.25rem;
    }
}

@media (max-width: 480px) {
    .login-container {
        background: #ffffff;
    }

    .login-background {
        display: none;
    }

    .login-content {
        padding: 1rem;
    }

    .login-card {
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: none;
        border: none;
    }

    .card-title {
        font-size: 1.375rem;
    }

    .card-subtitle {
        font-size: 0.8125rem;
    }

    .form-label {
        font-size: 0.875rem;
    }

    .form-input {
        padding: 0.75rem 0.875rem;
        font-size: 1rem;
    }

    .submit-button {
        padding: 0.75rem 0.875rem;
        font-size: 0.9375rem;
    }

    .logo {
        height: 48px;
    }

    .logo-section {
        margin-bottom: 1.5rem;
    }

    .card-footer {
        margin-top: 1.5rem;
        padding-top: 1rem;
    }
}
</style>
