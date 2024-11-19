import { defineStore } from 'pinia';
import { api, handleApiError } from '@/utils/api';
import type { SystemConfig, ConfigState } from '@/types/config';

export const useConfigStore = defineStore('config', {
  state: (): ConfigState => ({
    configs: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchConfigs() {
      this.loading = true;
      try {
        const response = await api.get<SystemConfig[]>('/configs');
        this.configs = response.data;
      } catch (error) {
        this.error = handleApiError(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateConfig(key: string, value: string) {
      this.loading = true;
      try {
        const response = await api.put<SystemConfig>('/configs', { key, value });
        const index = this.configs.findIndex(config => config.key === key);
        if (index !== -1) {
          this.configs[index] = response.data;
        } else {
          this.configs.push(response.data);
        }
        return response.data;
      } catch (error) {
        this.error = handleApiError(error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  },

  getters: {
    getConfigByKey: (state) => (key: string) => {
      return state.configs.find(config => config.key === key);
    }
  }
});