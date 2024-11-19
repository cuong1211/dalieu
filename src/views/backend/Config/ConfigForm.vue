<template>
    <FormCard title="Cấu hình hệ thống">
        <div class="row g-4">
            <div class="col-md-6">
                <FormInput v-model="form.key" label="Khóa cấu hình" placeholder="Nhập khóa cấu hình" :error="errors.key"
                    @input="validateKey" />
            </div>
            <div class="col-md-6">
                <FormInput v-model="form.value" label="Giá trị" placeholder="Nhập giá trị cấu hình"
                    :error="errors.value" @input="validateValue" />
            </div>
        </div>
        <div class="d-flex justify-content-end mt-4">
            <button class="btn btn-primary" @click="handleSubmit" :disabled="loading">
                {{ loading ? 'Đang lưu...' : 'Lưu cấu hình' }}
            </button>
        </div>
    </FormCard>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useConfigStore } from '@/stores/configStore';
import type { SystemConfig } from '@/types/config';
import FormCard from '@/components/Form/FormCard.vue';
import FormInput from '@/components/Form/FormInput.vue';
import { useToast } from 'vue-toastification';

interface ConfigForm {
    key: string;
    value: string;
}

interface FormErrors {
    key: string;
    value: string;
}

const configStore = useConfigStore();
const toast = useToast();
const loading = ref(false);

const form = reactive<ConfigForm>({
    key: 'server-detect',
    value: ''
});

const errors = reactive<FormErrors>({
    key: '',
    value: ''
});

const validateKey = () => {
    errors.key = !form.key ? 'Vui lòng nhập khóa cấu hình' : '';
};

const validateValue = () => {
    errors.value = !form.value ? 'Vui lòng nhập giá trị cấu hình' : '';
};

const validateForm = (): boolean => {
    validateKey();
    validateValue();
    return !errors.key && !errors.value;
};

const handleSubmit = async () => {
    if (!validateForm()) return;

    loading.value = true;
    try {
        await configStore.updateConfig(form.key, form.value);
        toast.success('Cập nhật cấu hình thành công');
        form.key = 'server-detect';
        form.value = '';
    } catch (error) {
        toast.error('Cập nhật cấu hình thất bại');
    } finally {
        loading.value = false;
    }
};
</script>