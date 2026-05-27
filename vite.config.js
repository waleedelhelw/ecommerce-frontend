import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProd = mode === 'production';

  return {
    plugins: [
      react(),
      tailwindcss(),
      isProd && {
        name: 'strip-console',
        transform(code, id) {
          if (id.includes('node_modules')) return;
          return code.replace(/\bconsole\.(log|debug|error|warn)\s*\([^)]*\)\s*;?\s*/g, '');
        },
      },
      {
        name: 'inject-sw-env',
        closeBundle() {
          const swPath = path.resolve('public/firebase-messaging-sw.js');
          if (!fs.existsSync(swPath)) return;
          let sw = fs.readFileSync(swPath, 'utf-8');
          sw = sw.replace(/__VITE_(\w+)__/g, (_, name) => {
            return env[`VITE_${name}`] || '';
          });
          const outPath = path.resolve('dist/firebase-messaging-sw.js');
          fs.mkdirSync(path.dirname(outPath), { recursive: true });
          fs.writeFileSync(outPath, sw, 'utf-8');
        },
      },
    ],
    build: {
      outDir: 'dist',
    },
  };
});