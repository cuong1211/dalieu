// src/services/ttsService.ts
import axios from 'axios';

export interface TTSOptions {
    text: string;
    voice?: 'south_female_1' | 'north_female_1' | 'south_male' | 'north_male' | 'north_female_2' | 'south_female_2';
    speed?: number; // 0.8 đến 1.2
}

interface ZaloTTSResponse {
    error_code: number;
    error_message: string;
    data: {
        url: string;
    };
}

export class TTSService {
    private readonly ZALO_API_URL = 'https://api.zalo.ai/v1/tts/synthesize';
    private readonly ZALO_API_KEY = import.meta.env.VITE_ZALO_AI_API_KEY || '';

    // Zalo AI Speaker IDs
    private readonly SPEAKER_MAP = {
        'south_female_1': 1,  // Giọng nữ miền Nam 1 (mặc định)
        'north_female_1': 2,  // Giọng nữ miền Bắc 1
        'south_male': 3,       // Giọng nam miền Nam
        'north_male': 4,       // Giọng nam miền Bắc
        'north_female_2': 5,   // Giọng nữ miền Bắc 2
        'south_female_2': 6,   // Giọng nữ miền Nam 2
    };

    /**
     * Synthesize text to speech using Zalo AI directly from frontend
     * Returns audio URL that can be played directly
     */
    async synthesize(options: TTSOptions): Promise<string> {
        try {
            if (!this.ZALO_API_KEY) {
                throw new Error('VITE_ZALO_AI_API_KEY chưa được cấu hình');
            }

            const voice = options.voice || 'south_female_1';
            const speed = options.speed || 1.0;
            const speakerId = this.SPEAKER_MAP[voice];

            console.log('[TTSService] Calling Zalo AI TTS with options:', {
                text_length: options.text.length,
                voice,
                speaker_id: speakerId,
                speed
            });

            // Validate text length
            if (options.text.length > 2000) {
                throw new Error('Text quá dài. Zalo AI chỉ hỗ trợ tối đa 2000 ký tự.');
            }

            // Create form data
            const formData = new FormData();
            formData.append('input', options.text);
            formData.append('speaker_id', speakerId.toString());
            formData.append('speed', speed.toString());
            formData.append('encode_type', '1'); // 1 = MP3

            // Call Zalo AI API
            const response = await axios.post<ZaloTTSResponse>(
                this.ZALO_API_URL,
                formData,
                {
                    headers: {
                        'apikey': this.ZALO_API_KEY,
                    }
                }
            );

            console.log('[TTSService] Zalo AI response:', response.data);

            // Check for errors
            if (response.data.error_code !== 0) {
                const errorMsg = this.getErrorMessage(response.data.error_code, response.data.error_message);
                throw new Error(errorMsg);
            }

            // Get audio URL
            if (!response.data.data?.url) {
                throw new Error('Zalo AI không trả về URL audio');
            }

            const audioUrl = response.data.data.url;
            console.log('[TTSService] Audio URL:', audioUrl);

            return audioUrl;

        } catch (error: any) {
            console.error('[TTSService] Error:', error);

            if (error.response) {
                const errorData = error.response.data;
                const errorMsg = this.getErrorMessage(
                    errorData.error_code,
                    errorData.error_message || error.message
                );
                throw new Error(errorMsg);
            }

            throw error;
        }
    }

    /**
     * Get user-friendly error message based on Zalo AI error code
     */
    private getErrorMessage(errorCode: number, defaultMessage: string): string {
        const errorMessages: Record<number, string> = {
            150: 'Thông số không hợp lệ',
            155: 'Text quá dài (giới hạn 2000 ký tự)',
            400: 'Yêu cầu không đúng định dạng',
            401: 'API key không hợp lệ',
            413: 'Đã xảy ra lỗi khi tạo audio',
            500: 'Lỗi server của Zalo AI'
        };

        return errorMessages[errorCode] || defaultMessage || 'Không thể tạo audio';
    }
}

export const ttsService = new TTSService();
