/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_API_MAP_KEY: string
    readonly VITE_API_TINYMCE_KEY: string
    // Thêm các biến môi trường khác ở đây nếu cần
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }