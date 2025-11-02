<template>
    <div class="contact-page">
        <div class="contact-container">
            <!-- Form Section -->
            <div class="contact-form-section">
                <div class="form-header">
                    <h2>Khám Bệnh Cùng Chuyên Gia</h2>
                    <p>Hãy để lại thông tin, chúng tôi sẽ liên hệ với bạn sớm nhất</p>
                </div>

                <form @submit.prevent="handleSubmit" class="contact-form">
                    <div class="form-row">
                        <div class="form-group">
                            <FormInput v-model="form.name" label="Họ và tên" placeholder="Nhập họ và tên của bạn"
                                :error="errors.name" required @input="(value) => handleInput('name', value)" />
                        </div>
                        <div class="form-group">
                            <FormInput v-model="form.phone" label="Số điện thoại"
                                placeholder="Nhập số điện thoại của bạn" type="tel" :error="errors.phone" required
                                @input="(value) => handleInput('phone', value)" />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <FormInput v-model="form.email" label="Email" placeholder="Nhập địa chỉ email của bạn"
                                type="email" :error="errors.email" @input="(value) => handleInput('email', value)" />
                        </div>
                        <div class="form-group">
                            <FormInput v-model="form.address" label="Địa chỉ" placeholder="Nhập địa chỉ của bạn"
                                :error="errors.address" required @input="(value) => handleInput('address', value)" />
                        </div>
                    </div>

                    <div class="form-group">
                        <FormTextarea v-model="form.message" label="Nội dung câu hỏi"
                            placeholder="Nhập nội dung câu hỏi của bạn" :error="errors.message" :rows="5" required
                            @input="(value) => handleInput('message', value)" />
                    </div>

                    <button type="submit" class="submit-button" :disabled="isSubmitting">
                        <span v-if="isSubmitting">
                            <i class="bi bi-arrow-repeat loading-icon"></i>
                            Đang gửi...
                        </span>
                        <span v-else>
                            Gửi tin nhắn
                        </span>
                    </button>
                </form>
            </div>

            <!-- Info Section -->
           
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import FormInput from '@/components/Form/FormInput.vue';
import FormTextarea from '@/components/Form/FormTextarea.vue';

interface ContactForm {
    name: string;
    phone: string;
    email: string;
    address: string;
    message: string;
}

const toast = useToast();
const isSubmitting = ref(false);

const form = ref<ContactForm>({
    name: '',
    phone: '',
    email: '',
    address: '',
    message: ''
});

const errors = ref<Partial<Record<keyof ContactForm, string>>>({});

const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ContactForm, string>> = {};

    if (!form.value.name.trim()) {
        newErrors.name = 'Vui lòng nhập họ tên';
    }

    if (!form.value.phone.trim()) {
        newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10}$/.test(form.value.phone)) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (form.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        newErrors.email = 'Email không hợp lệ';
    }

    if (!form.value.address.trim()) {
        newErrors.address = 'Vui lòng nhập địa chỉ';
    }

    if (!form.value.message.trim()) {
        newErrors.message = 'Vui lòng nhập nội dung câu hỏi';
    }

    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
};

const handleInput = (field: keyof ContactForm, value: string) => {
    form.value[field] = value;
    if (errors.value[field]) {
        errors.value[field] = '';
    }
};

const handleSubmit = async () => {
    if (!validateForm()) {
        toast.error('Vui lòng kiểm tra lại thông tin nhập');
        return;
    }

    try {
        isSubmitting.value = true;
        // Call API to submit form here
        // await api.post('/contact', form.value);

        toast.success('Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
        // Reset form
        form.value = {
            name: '',
            phone: '',
            email: '',
            address: '',
            message: ''
        };
    } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<style scoped>
.contact-page {
    min-height: 100vh;
    background-color: #f8f9fa;
    padding: 3rem 1rem;
}

.contact-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;

    gap: 2rem;
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.contact-form-section {
    padding: 3rem;
}

.form-header {
    margin-bottom: 2.5rem;
    text-align: center;
}

.form-header h2 {
    font-size: 2rem;
    font-weight: 600;
    color: #1abc9c;
    margin-bottom: 0.5rem;
}

.form-header p {
    color: #64748b;
    font-size: 1rem;
}

.contact-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}

.submit-button {
    background: #1abc9c;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 10px;
    font-weight: 500;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.submit-button:hover {
    background: #16a085;
    transform: translateY(-1px);
}

.submit-button:disabled {
    background: #94a3b8;
    cursor: not-allowed;
}

.loading-icon {
    animation: spin 1s linear infinite;
}

.contact-info-section {
    background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
    padding: 3rem;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.info-box {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.info-box:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(5px);
}

.info-icon {
    font-size: 1.5rem;
    color: white;
}

.info-content h4 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.info-content p {
    font-size: 0.9rem;
    opacity: 0.9;
    line-height: 1.6;
    margin: 0;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 992px) {
    .contact-container {
        grid-template-columns: 1fr;
    }

    .contact-form-section,
    .contact-info-section {
        padding: 2rem;
    }
}

@media (max-width: 768px) {
    .form-row {
        grid-template-columns: 1fr;
    }

    .contact-form-section {
        padding: 1.5rem;
    }
}
</style>