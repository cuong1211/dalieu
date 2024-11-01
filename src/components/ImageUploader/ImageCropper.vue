<template>
    <div v-if="show" class="modal-overlay" @click="handleBackdropClick">
        <div class="modal-container" @click.stop>
            <div class="modal-header">
                <h5 class="modal-title">Chỉnh sửa ảnh</h5>
                <button type="button" class="close-button" @click="handleClose">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <div class="modal-body">
                <div class="image-container">
                    <img ref="imageRef" :src="imageUrl" @load="initCrop" crossorigin="anonymous"
                        style="max-width: 100%" />
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="handleClose">
                    Hủy
                </button>
                <button type="button" class="btn btn-primary" @click="handleCrop">
                    Cắt ảnh
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watchEffect } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

interface Props {
    show: boolean
    imageUrl: string
    aspectRatio?: number
}

const props = withDefaults(defineProps<Props>(), {
    show: false,
    aspectRatio: 1
})

const emit = defineEmits<{
    (e: 'cropped', data: { file: Blob; url: string }): void
    (e: 'update:show', value: boolean): void
}>()

const imageRef = ref<HTMLImageElement | null>(null)
let cropInstance: Cropper | null = null

const initCrop = (): void => {
    if (!imageRef.value) return

    if (cropInstance) {
        cropInstance.destroy()
    }

    cropInstance = new Cropper(imageRef.value, {
        aspectRatio: props.aspectRatio,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 1,
        restore: false,
        guides: true,
        center: true,
        highlight: false,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false
    })
}

const handleCrop = (): void => {
    if (!cropInstance) return

    const canvas = cropInstance.getCroppedCanvas({
        width: 800,
        height: 800,
        imageSmoothingQuality: 'high'
    })

    canvas.toBlob((blob: Blob | null) => {
        if (blob !== null) {
            emit('cropped', {
                file: blob,
                url: canvas.toDataURL('image/jpeg')
            })
            handleClose()
        }
    }, 'image/jpeg', 0.9)
}

const handleClose = (): void => {
    emit('update:show', false)
}

const handleBackdropClick = (): void => {
    handleClose()
}

watchEffect(() => {
    if (props.show) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
        if (cropInstance) {
            cropInstance.destroy()
            cropInstance = null
        }
    }
})

onUnmounted(() => {
    if (cropInstance) {
        cropInstance.destroy()
    }
    document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
}

.modal-container {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid #dee2e6;
}

.modal-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 500;
}

.close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    padding: 0.5rem;
    cursor: pointer;
    color: #6c757d;
}

.close-button:hover {
    color: #000;
}

.modal-body {
    padding: 1rem;
    overflow: auto;
    flex: 1;
}

.image-container {
    max-height: 60vh;
    overflow: auto;
}

.modal-footer {
    padding: 1rem;
    border-top: 1px solid #dee2e6;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}

.btn {
    padding: 0.375rem 0.75rem;
    border-radius: 0.25rem;
    font-weight: 400;
    text-align: center;
    cursor: pointer;
    border: 1px solid transparent;
}

.btn-primary {
    color: #fff;
    background-color: #0d6efd;
    border-color: #0d6efd;
}

.btn-primary:hover {
    background-color: #0b5ed7;
    border-color: #0a58ca;
}

.btn-secondary {
    color: #fff;
    background-color: #6c757d;
    border-color: #6c757d;
}

.btn-secondary:hover {
    background-color: #5c636a;
    border-color: #565e64;
}
</style>