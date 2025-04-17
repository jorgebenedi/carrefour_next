import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecation: ['import', 'global-builtin'],
      }
    }
  },
  plugins: [react()],
})
