import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';  // ✅ جديد

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // ✅ جديد
  ],
  build: {
    outDir: 'dist',
  },
});