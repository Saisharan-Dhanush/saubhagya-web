import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      'antd',
      '@ant-design/icons',
      'recharts',
      'moment'
    ]
  },
  build: {
    commonjsOptions: {
      include: [/@ant-design\/icons/, /antd/, /node_modules/]
    }
  },
  server: {
    port: 3006,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  define: {
    'process.env': {}
  }
})