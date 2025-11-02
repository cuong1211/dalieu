// src/components/AudioPlayer/AudioPlayer.vue
<template>
    <div class="audio-player">
        <button class="player-button" @click="togglePlay" :disabled="isLoading" :class="{ 'is-playing': isPlaying }">
            <i class="bi" :class="buttonIcon"></i>
            <span>{{ buttonText }}</span>
        </button>

        <audio ref="audioPlayer" @ended="handleEnded" @error="handleError" @loadeddata="handleLoaded" class="hidden"
            preload="auto" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch, nextTick } from 'vue';
import { ttsService } from '@/stores/ttsService';
import type { TTSOptions } from '@/stores/ttsService';
import { useAudioStore } from '@/stores/audioStore';

interface Props {
    text: string;
    voice?: TTSOptions['voice'];
    speed?: number;
    autoplay?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    voice: 'female',
    speed: 0,
    autoplay: true
});
const emit = defineEmits<{
    (e: 'audioReady'): void;
    (e: 'audioError'): void;
}>();

// Tạo unique ID cho instance này
const instanceId = Math.random().toString(36).substr(2, 9);
const { setActiveAudio, clearActiveAudio, stopCurrentAudio, isCurrentlyActive } = useAudioStore();

const audioPlayer = ref<HTMLAudioElement | null>(null);
const isLoading = ref(false);
const isPlaying = ref(false);
const errorMessage = ref('');
const audioUrl = ref('');
const isAudioReady = ref(false);

// Computed properties
const buttonIcon = computed(() => {
    if (isLoading.value) return 'bi-hourglass-split';
    return isPlaying.value ? 'bi-pause-fill' : 'bi-play-fill';
});

const buttonText = computed(() => {
    if (isLoading.value) return 'Đang tải...';
    return isPlaying.value ? 'Tạm dừng' : 'Nghe đọc';
});

// Audio control functions
const cleanup = () => {
    if (audioPlayer.value) {
        audioPlayer.value.pause();
        audioPlayer.value.currentTime = 0;
        audioPlayer.value.src = '';
        audioPlayer.value.load();
    }
    isPlaying.value = false;
    isAudioReady.value = false;
    audioUrl.value = '';
    errorMessage.value = '';
};

const playAudio = async () => {
    if (!audioPlayer.value || !isAudioReady.value) return;

    try {
        // Dừng audio khác đang chạy
        stopCurrentAudio();

        // Đặt audio này là audio đang chạy
        if (audioPlayer.value) {
            setActiveAudio(instanceId, audioPlayer.value);
        }

        const playPromise = audioPlayer.value.play();
        if (playPromise !== undefined) {
            await playPromise;
            isPlaying.value = true;
        }
    } catch (error) {
        console.error('Lỗi khi phát audio:', error);
        errorMessage.value = 'Không thể phát audio. Vui lòng thử lại.';
    }
};

const pauseAudio = () => {
    if (audioPlayer.value) {
        audioPlayer.value.pause();
        isPlaying.value = false;
        clearActiveAudio(instanceId);
    }
};

const loadAndPlayAudio = async () => {
    try {
        isLoading.value = true;
        errorMessage.value = '';
        cleanup();

        const response = await ttsService.synthesize({
            text: props.text,
            voice: props.voice,
            speed: props.speed
        });

        if (!response) {
            throw new Error('Không nhận được URL audio từ server');
        }

        audioUrl.value = response;

        if (audioPlayer.value) {
            audioPlayer.value.src = audioUrl.value;

            await new Promise((resolve, reject) => {
                if (audioPlayer.value) {
                    audioPlayer.value.onloadeddata = resolve;
                    audioPlayer.value.onerror = reject;
                }
            });

            await playAudio();
            emit('audioReady'); // Emit khi audio đã sẵn sàng
        }
    } catch (error) {
        console.error('Lỗi khi tải audio:', error);
        errorMessage.value = 'Không thể tạo audio. Vui lòng thử lại sau.';
        emit('audioError'); // Emit khi có lỗi
    } finally {
        isLoading.value = false;
    }
};

const togglePlay = async () => {
    if (isPlaying.value) {
        pauseAudio();
        return;
    }

    if (!audioUrl.value || !isAudioReady.value) {
        await loadAndPlayAudio();
    } else {
        await playAudio();
    }
};

// Event handlers
const handleEnded = () => {
    isPlaying.value = false;
    clearActiveAudio(instanceId);
};

const handleError = (event: Event) => {
    const target = event.target as HTMLAudioElement;
    console.error('Lỗi phát audio:', target.error);
    errorMessage.value = 'Lỗi phát audio. Vui lòng thử lại.';
    isPlaying.value = false;
    isAudioReady.value = false;
    clearActiveAudio(instanceId);
};

const handleLoaded = () => {
    isAudioReady.value = true;
};

// Watchers and lifecycle hooks
watch(() => props.text, () => {
    if (props.text && props.autoplay) {
        nextTick(() => {
            loadAndPlayAudio();
        });
    }
}, { immediate: true });

// Watch if this audio instance is still active
// When another audio starts playing and stops this one, update UI to show play button
watch(() => isCurrentlyActive(instanceId), (isActive) => {
    if (!isActive && isPlaying.value) {
        isPlaying.value = false;
    }
});

onUnmounted(() => {
    cleanup();
    clearActiveAudio(instanceId);
});
</script>

<style scoped>
.audio-player {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.player-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, #f0fdfb 0%, #ecfdf5 100%);
    color: #1abc9c;
    border: 1.5px solid #a7f3d0;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(26, 188, 156, 0.08);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.player-button i {
    font-size: 1rem;
    transition: transform 0.3s ease;
}

.player-button:hover:not(:disabled) {
    background: linear-gradient(135deg, #d4f1e9 0%, #c6eee5 100%);
    border-color: #1abc9c;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(26, 188, 156, 0.15);
}

.player-button:hover:not(:disabled) i {
    transform: scale(1.1);
}

.player-button:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(26, 188, 156, 0.1);
}

.player-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.player-button.is-playing {
    background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
    color: white;
    border-color: #1abc9c;
    box-shadow: 0 4px 12px rgba(26, 188, 156, 0.25);
}

.player-button.is-playing:hover:not(:disabled) {
    background: linear-gradient(135deg, #16a085 0%, #0d7d6e 100%);
    box-shadow: 0 6px 16px rgba(26, 188, 156, 0.3);
}

.error-message {
    color: #dc2626;
    font-size: 0.875rem;
    padding: 0.5rem;
    background-color: #fef2f2;
    border-radius: 4px;
}

.hidden {
    display: none;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.bi-hourglass-split {
    animation: spin 1s linear infinite;
}
</style>