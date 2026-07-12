import path from 'node:path';

import vue from '@vitejs/plugin-vue';
import type { UserConfig } from 'vite';

export default {
  build: {
    sourcemap: true,
    target: 'esnext',
  },
  esbuild: {
    target: 'esnext',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.join(import.meta.dirname, 'src'),
    },
  },
} as const satisfies UserConfig;
