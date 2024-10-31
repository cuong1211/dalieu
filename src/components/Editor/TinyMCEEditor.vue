<template>
    <div>
        <editor :api-key="apiKey" :init="editorConfig" v-model="internalValue" @blur="handleBlur" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import Editor from '@tinymce/tinymce-vue';
import axios from 'axios';
interface Props {
    modelValue: string;
    height: number | string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    height: 500,
});
const apiKey = import.meta.env.VITE_API_TINYMCE_KEY;
const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'blur', event: any): void;
}>();

const internalValue = ref(props.modelValue);

const handleFileUpload = async (file: File, editor: any) => {
    const formData = new FormData();
    formData.append('attachment', file);

    try {
        const response = await axios.post('/admin/tinymce/attachment', formData);
        const data = response.data;
        editor.insertContent(`<a class="text-blue-700 hover:underline" href="${data.attachment_url}" download="${file.name}">${file.name}</a>`);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};

const editorConfig = computed(() => ({
    height: props.height,
    language: 'vi_VN',
    setup: (editor: any) => {
        editor.ui.registry.addButton('attachment', {
            tooltip: 'Attach/upload a File',
            icon: 'upload',
            onAction: () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '*/*';
                input.onchange = (event) => {
                    const file = (event.target as HTMLInputElement).files?.[0];
                    if (file) {
                        handleFileUpload(file, editor);
                    }
                };
                input.click();
            }
        });
    },
    images_file_types: 'jpg,svg,webp',
    file_picker_types: 'file image media',
    plugins: 'image code table lists link media fullscreen emoticons',
    toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright alignjustify | indent outdent | bullist numlist | code | table | link image attachment',
    image_title: true,
    automatic_uploads: true,
    image_advtab: true,
    image_caption: true,
    content_css: [],
    image_dimensions: false,
    image_class_list: [{ title: 'Responsive', value: 'md:w-2/3 m-auto w-full' }],
    file_picker_callback: (cb: (url: string, meta?: { title?: string }) => void) => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');

        input.addEventListener('change', (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.addEventListener('load', () => {
                const id = 'blobid' + (new Date()).getTime();
                const blobCache = (window as any).tinymce.activeEditor?.editorUpload?.blobCache;
                if (!blobCache) {
                    console.error('Blob cache is not available.');
                    return;
                }
                const base64 = (reader.result as string).split(',')[1];
                const blobInfo = blobCache.create(id, file, base64);
                blobCache.add(blobInfo);

                cb(blobInfo.blobUri(), { title: file.name });
            });
            reader.readAsDataURL(file);
        });

        input.click();
    },
}));

watch(() => props.modelValue, (newVal) => {
    if (newVal !== internalValue.value) {
        internalValue.value = newVal;
    }
});

watch(internalValue, (newVal) => {
    emit('update:modelValue', newVal);
});

const handleBlur = (e: any) => {
    emit('blur', e);
};
</script>