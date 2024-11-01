<template>
  <div class="fv-row mb-7">
    <label v-if="label" class="form-label fw-bold fs-6 mb-2">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>

    <div class="image-upload-container">
      <!-- Preview khu vực ảnh -->
      <div v-if="preview" class="preview-container">
        <div class="image-wrapper">
          <img :src="preview" class="preview-image" alt="Preview" @load="handleImageLoad" />
          <div class="overlay">
            <button type="button" class="edit-button" @click="handleEdit">
              <i class="bi bi-pencil-square fs-3"></i>
            </button>
            <button type="button" class="remove-button" @click="handleRemove">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Khu vực upload -->
      <div v-else class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
        <i class="bi bi-cloud-upload fs-3 text-primary mb-3"></i>
        <p class="fs-5 text-gray-600">Kéo thả hoặc click để tải ảnh lên</p>
        <p class="fs-7 text-gray-400">Chỉ chấp nhận file .jpg, .png, .jpeg (Tối đa 5MB)</p>
      </div>
    </div>

    <input ref="fileInput" type="file" class="hidden" accept="image/jpeg,image/png,image/jpg"
      @change="handleFileChange" />

    <div v-if="error" class="invalid-feedback d-block">{{ error }}</div>

    <!-- Modal crop ảnh -->
    <ImageCropper v-model:show="showCropper" :image-url="preview" @cropped="handleCroppedImage" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ImageCropper from './ImageCropper.vue'

interface Props {
  modelValue: File | null
  label?: string
  required?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  label: '',
  required: false,
  error: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: File | null): void
  (e: 'file-changed', file: File | null): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const preview = ref<string>('')
const showCropper = ref(false)
const selectedFile = ref<File | null>(null)
const imageHeight = ref<number>(200) // Chiều cao mặc định

const triggerFileInput = (): void => {
  fileInput.value?.click()
}
const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  const aspectRatio = img.naturalWidth / img.naturalHeight

  // Tính toán chiều cao phù hợp dựa trên tỷ lệ khung hình
  if (aspectRatio > 1) {
    // Ảnh ngang
    imageHeight.value = 400
  } else if (aspectRatio < 1) {
    // Ảnh dọc
    imageHeight.value = 600
  } else {
    // Ảnh vuông
    imageHeight.value = 400
  }
}
const validateFile = (file: File): boolean => {
  // Kiểm tra định dạng file
  if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
    emit('update:modelValue', null)
    return false
  }

  // Kiểm tra kích thước file (5MB)
  if (file.size > 5 * 1024 * 1024) {
    emit('update:modelValue', null)
    return false
  }

  return true
}

const handleFileChange = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file && validateFile(file)) {
    selectedFile.value = file
    preview.value = URL.createObjectURL(file)
    emit('update:modelValue', file)
    emit('file-changed', file)
  }
}

const handleDrop = (event: DragEvent): void => {
  const file = event.dataTransfer?.files[0]

  if (file && validateFile(file)) {
    selectedFile.value = file
    preview.value = URL.createObjectURL(file)
    emit('update:modelValue', file)
    emit('file-changed', file)
  }
}

const handleRemove = (): void => {
  preview.value = ''
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  emit('update:modelValue', null)
  emit('file-changed', null)
}

const handleCroppedImage = ({ file, url }: { file: Blob; url: string }): void => {
  preview.value = url
  const newFile = new File([file], selectedFile.value?.name || 'cropped-image.jpg', {
    type: 'image/jpeg'
  })
  selectedFile.value = newFile
  emit('update:modelValue', newFile)
  emit('file-changed', newFile)
  showCropper.value = false
}

const handleEdit = (): void => {
  showCropper.value = true
}
</script>

<style scoped>
.image-upload-container {
  width: 100%;
  min-height: 200px;
  border: 2px dashed #e4e6ef;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f8f9fa;
}

.upload-area {
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 20px;
}

.preview-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.image-wrapper {
  position: relative;
  max-width: 100%;
  width: auto;
  height: v-bind(imageHeight + 'px');
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: 4px;
}

.preview-container:hover .overlay {
  opacity: 1;
}

.edit-button,
.remove-button {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  margin: 0 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.edit-button {
  color: #009ef7;
}

.remove-button {
  color: #dc3545;
}

.edit-button:hover,
.remove-button:hover {
  transform: scale(1.1);
}

.edit-button:hover {
  background: #009ef7;
  color: white;
}

.remove-button:hover {
  background: #dc3545;
  color: white;
}

.hidden {
  display: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .image-wrapper {
    height: auto !important;
    /* Override dynamic height on mobile */
    max-height: 500px;
  }

  .preview-image {
    max-height: 500px;
  }

  .edit-button,
  .remove-button {
    width: 35px;
    height: 35px;
  }
}
</style>