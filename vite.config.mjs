import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development every request to /backend/* is forwarded to the real API
// (this avoids CORS problems while developing).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/backend': {
        target: 'https://el-hirfawy-backend.vercel.app',
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/backend/, ''),
      },
    },
  },
});
