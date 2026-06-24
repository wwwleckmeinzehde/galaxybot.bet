import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // In dev the SPA runs on Vite; proxy API calls to the Express server.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
