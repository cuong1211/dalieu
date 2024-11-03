<template>
    <form @submit.prevent="handleSubmit">
        <FormCard>
            <div class="row">
                <div class="col-md-6">
                    <FormInput v-model="formData.code" label="Mã bệnh" :error="errors?.code" />
                </div>
                <div class="col-md-6">
                    <FormInput v-model="formData.name" label="Tên bệnh" :error="errors?.name" />
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label">Triệu chứng</label>
                <TinyMCEEditor v-model="formData.symptom" :error="errors?.symptom" />
            </div>

            <div class="mb-3">
                <label class="form-label">Phương pháp điều trị</label>
                <TinyMCEEditor v-model="formData.treatment" :error="errors?.treatment" />
            </div>

            <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-light" @click="$router.back()">
                    Hủy
                </button>
                <button type="submit" class="btn btn-primary" :disabled="loading">
                    {{ isEdit ? 'Cập nhật' : 'Thêm mới' }}
                </button>
            </div>
        </FormCard>
    </form>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import type { DiseaseFormData } from '@/types/diseases';
import FormCard from '@/components/Form/FormCard.vue';
import FormInput from '@/components/Form/FormInput.vue';
import TinyMCEEditor from '@/components/Editor/TinyMCEEditor.vue';

interface Props {
    initialData?: DiseaseFormData;
    loading?: boolean;
    errors?: Record<string, string>;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false
});

const emit = defineEmits<{
    (e: 'submit', data: DiseaseFormData): void;
}>();

const route = useRoute();
const isEdit = computed(() => !!route.params.id);

const formData = ref<DiseaseFormData>({
    code: '',
    name: '',
    symptom: '',
    treatment: ''
});

onMounted(() => {
    if (props.initialData) {
        formData.value = { ...props.initialData };
    }
});

const handleSubmit = () => {
    emit('submit', formData.value);
};
</script>