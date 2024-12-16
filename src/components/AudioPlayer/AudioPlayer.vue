// src/components/AudioPlayer/AudioPlayer.vue
<template>
    <div class="audio-player">
        <button class="player-button" @click="togglePlay" :disabled="isLoading" :class="{ 'is-playing': isPlaying }">
            <i class="bi" :class="buttonIcon" style="color: gray;"></i>
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
};

const handleError = (event: Event) => {
    const target = event.target as HTMLAudioElement;
    console.error('Lỗi phát audio:', target.error);
    errorMessage.value = 'Lỗi phát audio. Vui lòng thử lại.';
    isPlaying.value = false;
    isAudioReady.value = false;
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

onUnmounted(() => {
    cleanup();
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
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #f8fafc;
    color: #3b82f6;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.player-button:hover:not(:disabled) {
    background-color: #eff6ff;
    border-color: #3b82f6;
    transform: translateY(-1px);
}

.player-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.player-button.is-playing {
    background-color: #3b82f6;
    color: white;
    border-color: #3b82f6;
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
</style>y