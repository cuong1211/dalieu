<template>
    <div>
        <div class="card mb-5 mb-xl-10">
            <div class="card-header cursor-pointer">
                <div class="card-title m-0">
                    <h3 class="fw-bolder m-0">Chỉnh sửa bệnh</h3>
                </div>
            </div>
            <div class="card-body">
                <LoadingOverlay v-if="pageLoading" />
                <template v-else>
                    <div v-if="!currentDisease && !loading" class="alert alert-danger">
                        Không tìm thấy thông tin bệnh
                    </div>
                    <DiseasesForm 
                        v-else
                        :initial-data="formData"
                        :loading="loading"
                        :errors="errors"
                        @submit="handleSubmit"
                    />
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { storeToRefs } from 'pinia';
import { useDiseasesStore } from '@/stores/DiseasesStore';
import type { DiseaseFormData } from '@/types/diseases';
import DiseasesForm from '@/components/Pages/Diseases/DiseasesForm.vue';
import LoadingOverlay from '@/components/Form/LoadingOverlay.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const diseasesStore = useDiseasesStore();
const { currentDisease } = storeToRefs(diseasesStore);

const loading = ref(false);
const pageLoading = ref(true);
const errors = ref<Record<string, string> | null>(null);

const diseaseId = computed(() => {
    const id = route.params.id;
    return typeof id === 'string' ? parseInt(id, 10) : null;
});

const formData = computed<DiseaseFormData>(() => {
    if (!currentDisease.value) return {
        code: '',
        name: '',
        symptom: '',
        treatment: ''
    };

    return {
        code: currentDisease.value.code,
        name: currentDisease.value.name,
        symptom: currentDisease.value.symptom,
        treatment: currentDisease.value.treatment
    };
});

onMounted(async () => {
    if (diseaseId.value) {
        try {
            await diseasesStore.fetchDiseaseById(diseaseId.value);
        } catch (error) {
            toast.error('Không thể tải thông tin bệnh. Vui lòng thử lại.');
        } finally {
            pageLoading.value = false;
        }
    }
});

const handleSubmit = async (formData: DiseaseFormData) => {
    if (!diseaseId.value) return;

    loading.value = true;
    errors.value = null;
    
    try {
        await diseasesStore.updateDisease(diseaseId.value, formData);
        toast.success('Cập nhật bệnh thành công');
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