import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  build: { 
    sourcemap: false,
  },
  
  server: {
  
    proxy: {
      '/attendance': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/adminuser': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/admin': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },

}});