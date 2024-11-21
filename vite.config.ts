import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'


// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],

  build: {
    target: 'esnext',
  },


  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },

  css: {
    preprocessorOptions: {
      scss: {
        // Note: we're using the same '@' prefix here
        additionalData: '@use "@/assets/style/global.scss" as global;'
      },
    }
  },
})
