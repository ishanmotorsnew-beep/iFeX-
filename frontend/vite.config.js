import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router-dom')
            ) {
              return 'vendor';
            }
            if (id.includes('framer-motion')) {
              return 'motion';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
          }
        },
      },
    },
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  server: {
    port: 5173,
    proxy: {
      // Forwards /api requests to the Express backend during local dev
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      // Forwards uploaded portfolio images to the Express backend
      '/uploads': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
