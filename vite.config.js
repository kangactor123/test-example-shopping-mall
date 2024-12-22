import path from 'path';

import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint({ exclude: ['/virtual:/**', 'node_modules/**'] })],
  test: {
    globals: true, // vitest에서 제공하는 api를 import 할 필요없이 사용이 가능하게 해줌
    environment: 'jsdom',
    setupFiles: './src/utils/test/setupTests.js',
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
});
