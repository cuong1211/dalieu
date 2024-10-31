// components/ImageUploader/ImageUploader.vue
<template>
  <div class="fv-row mb-7">
    <label v-if="label" class="form-label fw-bold fs-6 mb-2">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>

    <FilePond ref="filePond" v-bind="pondOptions" :server="serverOptions" :files="files" :allowMultiple="allowMultiple"
      :maxFiles="maxFiles" :acceptedFileTypes="acceptedFileTypes" :labelIdle="labelIdle" :allowImageCrop="true"
      :imageCropAspectRatio="imageCropAspectRatio" :imageResizeTargetWidth="imageResizeTargetWidth"
      :imageResizeTargetHeight="imageResizeTargetHeight" :styleLoadIndicatorPosition="'center bottom'"
      :styleProgressIndicatorPosition="'right bottom'" :styleButtonRemoveItemPosition="'left bottom'"
      :styleButtonProcessItemPosition="'right bottom'" @init="handleInit" @addfile="handleAddFile"
      @removefile="handleRemoveFile" @updatefiles="handleUpdateFiles" @processfile="handleProcessFile" />

    <div v-if="error" class="invalid-feedback d-block">{{ error }}</div>
    <div class="form-text mt-2">
      {{ helpText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import vueFilePond from 'vue-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageValidateSize from 'filepond-plugin-image-validate-size';

// Import styles
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Create FilePond component with plugins
const FilePond = vueFilePond(
  FilePondPluginImagePreview,
  FilePondPluginImageCrop,
  FilePondPluginImageTransform,
  FilePondPluginImageResize,
  FilePondPluginFileValidateType,
  FilePondPluginImageValidateSize
);

interface Props {
  modelValue: File[];
  label?: string;
  required?: boolean;
  error?: string;
  allowMultiple?: boolean;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  imageResizeTargetWidth?: number;
  imageResizeTargetHeight?: number;
  imageCropAspectRatio?: string;
  maxFileSize?: string;
  helpText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  allowMultiple: true,
  maxFiles: 5,
  acceptedFileTypes: () => ['image/png', 'image/jpeg', 'image/jpg'],
  imageResizeTargetWidth: 1080,
  imageResizeTargetHeight: 1080,
  imageCropAspectRatio: '1:1',
  maxFileSize: '5MB',
  helpText: 'Hỗ trợ định dạng: JPG, PNG. Tối đa 5MB/ảnh'
});

const emit = defineEmits<{
  (e: 'update:modelValue', files: File[]): void;
  (e: 'fileAdded', file: File): void;
  (e: 'fileRemoved', file: File): void;
  (e: 'filesUpdated', files: File[]): void;
}>();

const filePond = ref();
const files = ref<any[]>([]);

const labelIdle = `
  <div class="filepond--label-idle">
    <i class="bi bi-cloud-upload fs-2 mb-2"></i>
    <div>Kéo thả ảnh vào đây</div>
    <span class="filepond--label-action">hoặc click để chọn ảnh</span>
  </div>
`;

const pondOptions = {
  labelFileProcessing: 'Đang xử lý',
  labelFileProcessingComplete: 'Đã xử lý xong',
  labelFileProcessingAborted: 'Đã hủy xử lý',
  labelFileProcessingError: 'Lỗi khi xử lý',
  labelFileLoadError: 'Lỗi khi tải ảnh',
  labelTapToCancel: 'nhấn để hủy',
  labelTapToRetry: 'nhấn để thử lại',
  labelTapToUndo: 'nhấn để hoàn tác',
  labelButtonRemoveItem: 'Xóa',
  labelButtonAbortItemLoad: 'Hủy',
  labelButtonRetryItemLoad: 'Thử lại',
  labelButtonAbortItemProcessing: 'Hủy',
  labelButtonUndoItemProcessing: 'Hoàn tác',
  labelButtonRetryItemProcessing: 'Thử lại',
  labelButtonProcessItem: 'Tải lên',
  labelMaxFileSizeExceeded: 'File quá lớn',
  labelMaxFileSize: 'Kích thước tối đa: {filesize}',
  labelMaxTotalFileSizeExceeded: 'Vượt quá dung lượng tối đa',
  labelMaxTotalFileSize: 'Dung lượng tối đa: {filesize}',
  labelFileTypeNotAllowed: 'File không đúng định dạng',
  fileValidateTypeLabelExpectedTypes: 'Chỉ chấp nhận file {allTypes}',

  // Image validation
  labelImageCropError: 'Lỗi khi cắt ảnh',
  labelImageResizeError: 'Lỗi khi resize ảnh',
  labelImageTransformError: 'Lỗi khi xử lý ảnh',

  // Style
  styleButtonRemoveItemPosition: 'left bottom',
  styleButtonProcessItemPosition: 'right bottom',
  styleLoadIndicatorPosition: 'center bottom',
  styleProgressIndicatorPosition: 'right bottom',

  // Image preview
  imagePreviewHeight: 200,
  imageCropAspectRatio: props.imageCropAspectRatio,
  imageResizeTargetWidth: props.imageResizeTargetWidth,
  imageResizeTargetHeight: props.imageResizeTargetHeight,

  // Validation
  acceptedFileTypes: props.acceptedFileTypes,
  maxFileSize: props.maxFileSize,

  // Custom callbacks
  beforeAddFile: (item: any) => {
    // Kiểm tra trước khi thêm file
    return true;
  },

  beforeRemoveFile: (item: any) => {
    // Kiểm tra trước khi xóa file
    return true;
  }
};

const serverOptions = {
  // Không gửi file lên server ngay, chỉ xử lý local
  process: (fieldName: string, file: File, metadata: any, load: Function, error: Function, progress: Function) => {
    // Xử lý file local và trả về
    load(file);
  },
  revert: null,
  restore: null,
  load: null,
  fetch: null
};

// Handlers
const handleInit = () => {
  console.log('FilePond đã được khởi tạo');
};

const handleAddFile = (error: any, file: any) => {
  if (error) {
    console.error('Lỗi khi thêm file:', error);
    return;
  }
  emit('fileAdded', file.file);
};

const handleRemoveFile = (error: any, file: any) => {
  if (error) {
    console.error('Lỗi khi xóa file:', error);
    return;
  }
  emit('fileRemoved', file.file);
};

const handleUpdateFiles = (fileItems: any[]) => {
  files.value = fileItems;
  const fileArray = fileItems.map(fileItem => fileItem.file);
  emit('update:modelValue', fileArray);
  emit('filesUpdated', fileArray);
};

const handleProcessFile = (error: any, file: any) => {
  if (error) {
    console.error('Lỗi khi xử lý file:', error);
    return;
  }
  // File đã được xử lý xong (crop, resize,...)
};

// Public methods
const getFiles = (): File[] => {
  return files.value.map(fileItem => fileItem.file);
};

const clearFiles = () => {
  if (filePond.value) {
    filePond.value.removeFiles();
  }
};

// Watch changes
watch(() => props.modelValue, (newValue) => {
  if (!filePond.value) return;

  if (newValue?.length === 0) {
    filePond.value.removeFiles();
  }
}, { deep: true });

// Expose public methods
defineExpose({
  getFiles,
  clearFiles,
  filePond // Expose FilePond instance for advanced usage
});
</script>

<style scoped>
/* Base styles */
.filepond--root {
  font-family: inherit;
}

/* Drop zone */
.filepond--panel-root {
  border: 2px dashed #ced4da;
  background-color: #f8f9fa;
}

.filepond--drip-blob {
  background-color: #0d6efd;
}

/* Label styles */
.filepond--drop-label {
  color: #6c757d;
}

.filepond--label-action {
  color: #0d6efd;
  text-decoration: underline;
  cursor: pointer;
}

/* Image preview */
.filepond--image-preview-wrapper {
  border-radius: 8px;
}

/* Progress indicator */
.filepond--progress-indicator {
  background: #0d6efd;
}

/* Error states */
.filepond--panel-root[data-state*='error'] {
  border-color: #dc3545;
}

.filepond--root[data-style-panel-layout~='integrated'] .filepond--panel-root {
  border-radius: 8px;
}

/* Custom label idle */
.filepond--label-idle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

/* Help text */
.form-text {
  font-size: 0.875em;
  color: #6c757d;
}

/* Invalid feedback */
.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}
</style>