<template>
    <div>
        <div class="card mb-5 mb-xl-10">
            <div class="card-body">
                <LoadingOverlay v-if="loading" />
                <DiseasesForm 
                    :loading="loading"
                    :errors="errors"
                    @submit="handleSubmit"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useDiseasesStore } from '@/stores/DiseasesStore';
import type { DiseaseFormData } from '@/types/diseases';
import DiseasesForm from '@/components/Pages/Diseases/DiseasesForm.vue';
import LoadingOverlay from '@/components/Form/LoadingOverlay.vue';

const router = useRouter();
const toast = useToast();
const diseasesStore = useDiseasesStore();
const loading = ref(false);
const errors = ref<Record<string, string> | null>(null);

const handleSubmit = async (formData: DiseaseFormData) => {
    loading.value = true;
    errors.value = null;
    
    try {
        await diseasesStore.createDisease(formData);
        toast.success('Thêm mới bệnh thành công');
        router.push({ name: 'diseases.index' });
    } catch (error: any) {
        if (error.response?.data?.errors) {
            errors.value = error.response.data.errors;
        } else {
            toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    } finally {
        loading.value = false;
    }
};
</script>