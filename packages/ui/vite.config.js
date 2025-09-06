import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.jsx',
      name: 'UI',
      fileName: 'ui',
      formats: ['es']
    },
    rollupOptions: {
      external: ['react']
    }
  }
});