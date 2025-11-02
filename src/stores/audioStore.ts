import { ref } from 'vue';

// Store quản lý audio đang chạy toàn cục
export interface ActiveAudio {
    instanceId: string;
    audioElement: HTMLAudioElement;
}

const activeAudio = ref<ActiveAudio | null>(null);

export const useAudioStore = () => {
    /**
     * Đặt audio đang chạy hiện tại
     * Nếu có audio khác đang chạy, sẽ dừng nó trước
     */
    const setActiveAudio = (instanceId: string, audioElement: HTMLAudioElement) => {
        // Nếu có audio khác đang chạy, dừng nó
        if (activeAudio.value && activeAudio.value.instanceId !== instanceId) {
            try {
                activeAudio.value.audioElement.pause();
                activeAudio.value.audioElement.currentTime = 0;
            } catch (error) {
                console.error('Lỗi khi dừng audio cũ:', error);
            }
        }

        // Đặt audio mới
        activeAudio.value = {
            instanceId,
            audioElement
        };
    };

    /**
     * Xoá audio đang chạy
     */
    const clearActiveAudio = (instanceId: string) => {
        if (activeAudio.value?.instanceId === instanceId) {
            activeAudio.value = null;
        }
    };

    /**
     * Kiểm tra xem audio này có đang chạy không
     */
    const isCurrentlyActive = (instanceId: string): boolean => {
        return activeAudio.value?.instanceId === instanceId;
    };

    /**
     * Dừng audio đang chạy
     */
    const stopCurrentAudio = () => {
        if (activeAudio.value) {
            try {
                activeAudio.value.audioElement.pause();
                activeAudio.value.audioElement.currentTime = 0;
            } catch (error) {
                console.error('Lỗi khi dừng audio:', error);
            }
        }
    };

    return {
        activeAudio,
        setActiveAudio,
        clearActiveAudio,
        isCurrentlyActive,
        stopCurrentAudio
    };
};
