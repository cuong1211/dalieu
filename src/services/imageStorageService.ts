/**
 * Service để xử lý lưu trữ ảnh từ form vào localStorage
 * Lưu trữ ảnh dưới dạng base64 trong localStorage
 */
class ImageStorageService {
    private readonly IMAGE_STORAGE_KEY = 'diagnosis_image_data';
    private readonly IMAGE_PATH_KEY = 'diagnosis_image_path';

    /**
     * Lưu ảnh vào localStorage dưới dạng base64
     * @param file - File ảnh
     * @returns Object chứa imagePath (dùng để hiển thị) và mã base64
     */
    async saveImageToStorage(file: File | null): Promise<{
        path: string;
        base64?: string;
        fileName?: string;
    }> {
        if (!file) {
            return { path: '' };
        }

        try {
            const base64 = await this.fileToBase64(file);
            const timestamp = Date.now();
            const fileName = `diagnosis_${timestamp}_${file.name}`;
            const imagePath = `/uploads/diagnosis/${fileName}`;

            // Lưu vào localStorage
            const imageData = {
                base64,
                fileName,
                path: imagePath,
                timestamp,
                size: file.size,
                type: file.type,
                originalName: file.name
            };

            localStorage.setItem(this.IMAGE_STORAGE_KEY, JSON.stringify(imageData));
            localStorage.setItem(this.IMAGE_PATH_KEY, imagePath);

            return {
                path: imagePath,
                base64,
                fileName
            };
        } catch (error) {
            console.error('Error saving image to storage:', error);
            throw new Error('Không thể lưu ảnh. Vui lòng thử lại.');
        }
    }

    /**
     * Lấy dữ liệu ảnh từ localStorage
     */
    getImageFromStorage(): {
        base64?: string;
        path?: string;
        fileName?: string;
        originalName?: string;
    } {
        try {
            const imageDataStr = localStorage.getItem(this.IMAGE_STORAGE_KEY);
            if (!imageDataStr) {
                return {};
            }

            return JSON.parse(imageDataStr);
        } catch (error) {
            console.error('Error retrieving image from storage:', error);
            return {};
        }
    }

    /**
     * Lấy đường dẫn ảnh từ localStorage
     */
    getImagePath(): string {
        try {
            return localStorage.getItem(this.IMAGE_PATH_KEY) || '';
        } catch (error) {
            console.error('Error retrieving image path:', error);
            return '';
        }
    }

    /**
     * Xóa ảnh khỏi localStorage
     */
    clearImage(): void {
        try {
            localStorage.removeItem(this.IMAGE_STORAGE_KEY);
            localStorage.removeItem(this.IMAGE_PATH_KEY);
        } catch (error) {
            console.error('Error clearing image:', error);
        }
    }

    /**
     * Convert File thành base64 string
     * @param file - File cần convert
     * @returns Base64 string của file (toàn bộ, kèm data URL header)
     */
    private fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                } else {
                    reject(new Error('Failed to convert file to base64'));
                }
            };

            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };

            reader.readAsDataURL(file);
        });
    }

    /**
     * Convert File thành base64 string (phần dữ liệu thuần)
     * Bỏ đi phần "data:image/...;base64,"
     */
    async fileToBase64Pure(file: File): Promise<string> {
        const base64Full = await this.fileToBase64(file);
        return base64Full.split(',')[1];
    }

    /**
     * Lấy ảnh dưới dạng Blob từ base64
     */
    base64ToBlob(base64: string, mimeType: string = 'image/jpeg'): Blob {
        const bstr = atob(base64.split(',')[1] || base64);
        const n = bstr.length;
        const u8arr = new Uint8Array(n);
        for (let i = 0; i < n; i++) {
            u8arr[i] = bstr.charCodeAt(i);
        }
        return new Blob([u8arr], { type: mimeType });
    }
}

export default new ImageStorageService();
