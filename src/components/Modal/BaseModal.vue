<template>
    <v-dialog v-model="localModelValue" max-width="1200px" id="kt_modal_add_user" persistent>
        <v-card class="modal-content">
            <v-card-title class="modal-header" id="kt_modal_add_user_header">
                <h2 class="fw-bolder" tabindex="-1">{{ title }}</h2>
                <v-btn icon @click="handleClose" class="btn btn-icon btn-sm btn-active-icon-primary"
                    :disabled="loading">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text class="modal-body scroll-y mx-5 mx-xl-15 my-7">
                <slot></slot>
            </v-card-text>

            <v-card-actions class="modal-footer">
                <slot name="footer">
                    <v-btn color="#7e8299" @click="handleClose" class="btn btn-light me-3" :disabled="loading">
                        Hủy
                    </v-btn>
                    <v-btn color="primary" @click="confirm" :loading="loading" :disabled="loading || disabled"
                        class="btn btn-primary white--text">
                        <template v-if="!loading">
                            Xác nhận
                        </template>
                        <template v-else>
                            <v-progress-circular color="white" indeterminate size="20" width="2"
                                class="me-2"></v-progress-circular>
                            Đang xử lý...
                        </template>
                    </v-btn>
                </slot>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Swal from 'sweetalert2';

const props = defineProps({
    modelValue: Boolean,
    title: {
        type: String,
        default: 'Modal'
    },
    loading: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue', 'close', 'confirm']);

const localModelValue = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
    localModelValue.value = newValue;
});

watch(localModelValue, (newValue) => {
    emit('update:modelValue', newValue);
});
onMounted(() => {
    // Cấu hình SweetAlert2 để có z-index cao hơn
    Swal.mixin({
        customClass: {
            container: 'my-swal'
        }
    });
});
const handleClose = async () => {
    if (props.loading) return;

    const result = await Swal.fire({
        title: 'Bạn có chắc chắn muốn đóng?',
        text: "Các thay đổi chưa lưu sẽ bị mất!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
        localModelValue.value = false;
        emit('close');
    }
};

const confirm = () => {
    if (!props.loading && !props.disabled) {
        emit('confirm');
    }
};
</script>

<style scoped>
.v-btn.btn-primary.white--text {
    color: white !important;
}

.v-btn.btn-primary.white--text .v-btn__content {
    color: white;
}


</style>
<style>
.swal2-container {
    z-index: 9999 !important;
}

/* Nếu cần, bạn có thể tăng z-index của modal lên một giá trị thấp hơn SweetAlert2 */
.v-dialog {
    z-index: 1100 !important;
}</style>