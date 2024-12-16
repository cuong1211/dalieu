// src/services/ttsService.ts
import axios from 'axios';

export interface TTSOptions {
    text: string;
    voice?: 'female' | 'male' | 'children' | 'südVietnam' | 'northernVietnam';
    speed?: number; // -3 đến 3
}

export class TTSService {
    private readonly API_URL = 'https://api.fpt.ai/hmi/tts/v5';
    private readonly API_KEY: string;

    constructor() {
        this.API_KEY = import.meta.env.VITE_FPT_AI_KEY || '';
    }

    async synthesize(options: TTSOptions): Promise<string> {
        try {
            const response = await axios({
                method: 'POST',
                url: this.API_URL,
                headers: {
                    'api-key': this.API_KEY,
                    'voice': options.voice || 'female',
                    'speed': options.speed || 0,
                    'Content-Type': 'application/x-www-form-urlencoded' // Thêm Content-Type
                },
                data: options.text
            });

            if (response.data.error === 0) {
                return response.data.async;
            }

            throw new Error(response.data.message || 'TTS request failed');
        } catch (error) {
            console.error('FPT TTS Error:', error);
            throw error;
        }
    }
}

export const ttsService = new TTSService();