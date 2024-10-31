import { ref, onMounted } from 'vue'

export function useLocalStorage(key: string, defaultValue: any) {
    const value = ref(defaultValue)

    onMounted(() => {
        const storedValue = localStorage.getItem(key)
        if (storedValue) {
            try {
                value.value = JSON.parse(storedValue)
            } catch (e) {
                console.error('Error parsing localStorage value:', e)
                value.value = defaultValue
            }
        }
    })

    return value
}