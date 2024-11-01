import type { DropzoneFile as BaseDropzoneFile } from 'dropzone';

export interface DropzoneFile extends BaseDropzoneFile {
    uuid?: string;
    previewElement: HTMLElement;
}

export interface CropResult {
    file: Blob;
    url: string;
}

export interface CropOptions {
    width?: number;
    height?: number;
    aspectRatio?: number;
    format?: 'jpeg' | 'png' | 'webp';
    quality?: number;
}