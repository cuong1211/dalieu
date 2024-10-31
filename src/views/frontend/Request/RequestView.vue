<template>
    <div class="container">
        <div class="d-flex flex-column flex-lg-row">
            <!-- Form section -->
            <div class="flex-lg-row-fluid me-lg-10 order-2 order-lg-1 mb-10 mb-lg-0">
                <div v-if="form">
                    <form class="form" @submit.prevent="handleSubmit">
                        <!-- Thông tin cá nhân -->
                        <FormCard title="Thông tin cá nhân">
                            <div class="row">
                                <div class="col-md-6">
                                    <FormInput v-model="form.fullName" label="Họ và tên" :error="errors.fullName"
                                        placeholder="Nhập họ và tên"
                                        @input="(value) => handleInput('fullName', value)" />
                                </div>
                                <div class="col-md-6">
                                    <FormInput v-model="form.dateOfBirth" label="Ngày sinh" type="date"
                                        :error="errors.dateOfBirth"
                                        @input="(value) => handleInput('dateOfBirth', value)" />
                                </div>
                            </div>

                            <div class="row mt-3">
                                <div class="col-md-6">
                                    <FormSelect v-model="form.gender" label="Giới tính" :options="genderOptions"
                                        :error="errors.gender" @input="(value) => handleInput('gender', value)" />
                                </div>
                                <div class="col-md-6">
                                    <FormInput v-model="form.phone" label="Số điện thoại" :error="errors.phone"
                                        placeholder="Nhập số điện thoại" @input="(value) => handleInput('phone', value)"
                                        type="tel" />
                                </div>
                            </div>

                            <div class="row mt-3">
                                <div class="col-md-12">
                                    <FormInput v-model="form.email" label="Email" type="email" :error="errors.email"
                                        placeholder="Nhập email" @input="(value) => handleInput('email', value)" />
                                </div>
                            </div>

                            <div class="row mt-3">
                                <div class="col-12">
                                    <FormInput v-model="form.address" label="Địa chỉ" :error="errors.address"
                                        placeholder="Nhập địa chỉ" @input="(value) => handleInput('address', value)" />
                                </div>
                            </div>
                        </FormCard>

                        <!-- Thông tin triệu chứng -->
                        <FormCard title="Thông tin triệu chứng">
                            <div class="row">
                                <div class="col-12">
                                    <FormTextarea v-model="form.symptoms" label="Mô tả triệu chứng"
                                        :error="errors.symptoms"
                                        placeholder="Mô tả chi tiết các triệu chứng bạn đang gặp phải"
                                        @input="(value) => handleInput('symptoms', value)" rows="4" />
                                </div>
                            </div>

                            <div class="row mt-3">
                                <div class="col-md-6">
                                    <FormInput v-model="form.symptomsStartDate" label="Thời điểm bắt đầu có triệu chứng"
                                        type="date" :error="errors.symptomsStartDate"
                                        @input="(value) => handleInput('symptomsStartDate', value)" />
                                </div>
                            </div>

                            <div class="row mt-3">
                                <div class="col-12">
                                    <FormTextarea v-model="form.previousTreatments" label="Điều trị trước đây (nếu có)"
                                        :error="errors.previousTreatments"
                                        placeholder="Mô tả các phương pháp điều trị đã thực hiện trước đây"
                                        @input="(value) => handleInput('previousTreatments', value)" rows="3" />
                                </div>
                            </div>

                            <div class="row mt-3">
                                <div class="col-12">
                                    <FormTextarea v-model="form.allergies" label="Dị ứng (nếu có)"
                                        :error="errors.allergies"
                                        placeholder="Liệt kê các loại thuốc, thực phẩm hoặc các chất gây dị ứng"
                                        @input="(value) => handleInput('allergies', value)" rows="2" />
                                </div>
                            </div>

                            <div class="row mt-3">
                                <div class="col-12">

                                    <ImageUploader v-model="form.images" label="Hình ảnh triệu chứng" required
                                        :error="errors.images" :maxFiles="5"
                                        :acceptedFileTypes="['image/png', 'image/jpeg']" :imageResizeTargetWidth="1080"
                                        :imageResizeTargetHeight="1080" imageCropAspectRatio="1:1" maxFileSize="5MB"
                                        helpText="Tải lên tối đa 5 ảnh, mỗi ảnh không quá 5MB"
                                        @fileAdded="handleFileAdded" @fileRemoved="handleFileRemoved"
                                        @filesUpdated="handleFilesUpdated" />

                                </div>
                            </div>
                        </FormCard>

                        <!-- Thông tin đặt lịch -->
                        <FormCard title="Thông tin đặt lịch">
                            <div class="row">
                                <div class="col-md-6">
                                    <FormInput v-model="form.preferredDateTime" label="Thời gian mong muốn"
                                        type="datetime-local" :error="errors.preferredDateTime"
                                        @input="(value) => handleInput('preferredDateTime', value)" />
                                </div>
                                <div class="col-md-6">
                                    <FormSelect v-model="form.doctorId" label="Bác sĩ" :options="doctorOptions"
                                        :error="errors.doctorId" @input="(value) => handleInput('doctorId', value)"
                                        placeholder="Chọn bác sĩ (không bắt buộc)" />
                                </div>
                            </div>
                        </FormCard>

                        <!-- Nút submit -->
                        <div class="d-flex justify-content-end mt-5">
                            <button type="submit" class="btn btn-primary">
                                <i class="bi bi-send me-2"></i>
                                Gửi yêu cầu khám
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { DermatologyRequestForm } from '@/types/request';
import ImageUploader from '@/components/ImageUploader/ImageUploader.vue';
import FormCard from '@/components/Form/FormCard.vue';
import FormInput from '@/components/Form/FormInput.vue';
import FormTextarea from '@/components/Form/FormTextarea.vue';
import FormSelect from '@/components/Form/FormSelect.vue';
import { useRequestValidation } from '@/utils/validations/requestValidation';
import { useRequestStore } from '@/stores/requestStore';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

// Import styles cho FilePond
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

const router = useRouter();
const toast = useToast();
const requestStore = useRequestStore();
const imageUploader = ref<InstanceType<typeof ImageUploader> | null>(null);

const initialFormData: DermatologyRequestForm = {
    id: 0,
    fullName: '',
    dateOfBirth: '',
    gender: 'other',
    phone: '',
    email: '',
    address: '',
    symptoms: '',
    symptomsStartDate: '',
    previousTreatments: '',
    allergies: '',
    images: [],
    preferredDateTime: '',
    doctorId: null,
    departmentId: 1, // ID khoa da liễu
};

const form = ref<DermatologyRequestForm>(initialFormData);

const genderOptions = [
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
    { value: 'other', label: 'Khác' }
];

const doctorOptions = ref([
    { value: 1, label: 'BS. Nguyễn Văn A' },
    { value: 2, label: 'BS. Trần Thị B' },
    // Thêm các bác sĩ khác
]);

const { errors, validateForm, handleInput } = useRequestValidation(form);

const handleSubmit = async () => {
    if (validateForm()) {
        try {
            const formData = new FormData();

            // Thêm các trường thông tin vào FormData
            Object.entries(form.value).forEach(([key, value]) => {
                if (key !== 'images') {
                    formData.append(key, String(value));
                }
            });

            // Lấy files từ FilePond và thêm vào FormData
            const imageFiles = imageUploader.value?.getFiles();
            if (imageFiles && imageFiles.length > 0) {
                imageFiles.forEach((file, index) => {
                    formData.append(`images[${index}]`, file);
                });
            }

            const response = await requestStore.createRequest(formData);
            toast.success('Đăng ký khám thành công');
            router.push({
                name: 'request-success',
                params: { id: response.data.id }
            });
        } catch (error) {
            console.error('Lỗi khi tạo yêu cầu:', error);
            toast.error('Đăng ký khám thất bại. Vui lòng thử lại.');
        }
    }
};
</script>
<style>
/* Tùy chỉnh style cho FilePond nếu cần */
.filepond--panel-root {
    background-color: #f8f9fa;
    border: 2px dashed #ced4da;
}

.filepond--drop-label {
    color: #6c757d;
}

.filepond--label-action {
    color: #0d6efd;
    text-decoration: underline;
}
</style>