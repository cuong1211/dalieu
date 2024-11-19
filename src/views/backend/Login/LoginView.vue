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

    if (submitButton.value) {
        submitButton.value.setAttribute("data-kt-indicator", "on");
    }

    try {
        await authStore.login(values);

        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Đang nhập thành công",
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
        submitButton.value?.removeAttribute("data-kt-indicator");
    }
});
</script>


<template>
    <div class="d-flex flex-column flex-root">
        <!--begin::Authentication - Sign-in -->
        <div class="d-flex flex-column flex-root">
            <div
                class="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed">
                <div class="d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20">
                    <!--begin::Logo-->
                    <a href="/" class="mb-12">
                        <img src="/media/logos/logo.png" alt="" class="logo-img w-60px"/>
                    </a>
                    <!--end::Logo-->
                    <!--begin::Wrapper-->
                    <div class="w-lg-500px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto">
                        <!--begin::Form-->
                        <form class="form w-100" @submit.prevent="onSubmitLogin" id="kt_sign_in_form">
                            <!--begin::Heading-->
                            <div class="text-center mb-10">
                                <!--begin::Title-->
                                <h1 class="text-dark mb-3">Đăng nhập <br> Da liễu Hà Vinh</h1>
                                
                                <!--end::Title-->
                            </div>
                            <!--begin::Heading-->
                            <!--begin::Input group-->
                            <div class="fv-row mb-10">
                                <!--begin::Label-->
                                <label class="form-label fs-6 fw-bolder text-dark">Tên đăng nhập</label>
                                <!--end::Label-->
                                <!--begin::Input-->
                                <Field name="username" type="text" class="form-control form-control-lg form-control-solid"
                                    autocomplete="off" />
                                <!--end::Input-->
                                <ErrorMessage name="username" class="text-danger" />
                            </div>
                            <!--end::Input group-->
                            <!--begin::Input group-->
                            <div class="fv-row mb-10">
                                <!--begin::Wrapper-->
                                <div class="d-flex flex-stack mb-2">
                                    <!--begin::Label-->
                                    <label class="form-label fw-bolder text-dark fs-6 mb-0">Mật khẩu</label>
                                    <!--end::Label-->
                                </div>
                                <!--end::Wrapper-->
                                <!--begin::Input-->
                                <Field name="password" type="password"
                                    class="form-control form-control-lg form-control-solid" autocomplete="off" />
                                <!--end::Input-->
                                <ErrorMessage name="password" class="text-danger" />
                            </div>
                            <!--end::Input group-->
                            <!--begin::Actions-->
                            <div class="text-center">
                                <!--begin::Submit button-->
                                <button type="submit" ref="submitButton" id="kt_sign_in_submit"
                                    class="btn btn-lg btn-primary w-100 mb-5">
                                    <span class="indicator-label">Đăng nhập</span>
                                    <span class="indicator-progress">Vui lòng đợi...
                                        <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
                                </button>
                                <!--end::Submit button-->
                            </div>
                            <!--end::Actions-->
                        </form>
                        <!--end::Form-->
                    </div>
                    <!--end::Wrapper-->
                </div>
            </div>
        </div>
    </div>
</template>