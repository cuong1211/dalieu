import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      css: {
        additionalData: `@import "@/assets/styles/index.css";`
      }
    }
  },

  // Thêm cấu hình này để Vite biết nơi tìm các file assets
  publicDir: path.resolve(__dirname, './src/assets'),

  // Proxy configuration để bypass CORS
  server: {
    proxy: {
      '/api/diagnosis': {
        target: 'http://14.225.211.5:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/diagnosis/, '/diagnosis'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  }
})
