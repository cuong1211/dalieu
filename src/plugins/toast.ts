import { useToast } from "vue-toastification";

export function showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    const toast = useToast();
    toast[type](message);
}