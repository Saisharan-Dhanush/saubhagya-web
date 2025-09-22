import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
    })
  ],
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
      'moment',
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slider',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs'
    ],
    exclude: ['@vite/client', '@vite/env']
  },
  build: {
    // Enable advanced code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // UI component libraries
          'ui-vendor': [
            'antd',
            '@ant-design/icons',
            'lucide-react',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs'
          ],

          // Charts and data visualization
          'charts': ['recharts'],

          // Date/time utilities
          'date-utils': ['moment', 'date-fns'],

          // Form and utility libraries
          'utils': ['class-variance-authority', 'clsx', 'tailwind-merge', 'zustand', 'react-hook-form'],

          // Firebase
          'firebase': ['firebase']
        },

        // Optimize chunk naming for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          if (facadeModuleId) {
            const fileName = path.basename(facadeModuleId, path.extname(facadeModuleId))
            return `assets/${fileName}-[hash].js`
          }
          return 'assets/[name]-[hash].js'
        },

        // Optimize asset naming
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },

    // Optimize build performance
    target: 'esnext',
    minify: 'esbuild',

    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,

    // Enable source maps for production debugging
    sourcemap: true,

    commonjsOptions: {
      include: [/@ant-design\/icons/, /antd/, /node_modules/]
    }
  },

  // Performance optimizations
  esbuild: {
    // Enable tree shaking
    treeShaking: true,
    // Optimize for modern browsers
    target: 'esnext',
    // Drop console logs in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  },

  server: {
    port: 3006,
    host: true,
    // Enable compression
    cors: true,
    // Optimize HMR
    hmr: {
      overlay: true
    },
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

  // Environment variables
  define: {
    'process.env': {},
    // Enable production optimizations
    __DEV__: process.env.NODE_ENV !== 'production'
  },

  // CSS optimization
  css: {
    // Enable CSS code splitting
    codeSplit: true
  },

  // Preview server configuration for production builds
  preview: {
    port: 3007,
    host: true,
    cors: true
  }
})
