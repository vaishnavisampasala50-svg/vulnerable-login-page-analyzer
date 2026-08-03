import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  // Absolute base path matching the GitHub Pages project-site URL:
  // https://vaishnavisampasala50-svg.github.io/vulnerable-login-page-analyzer/
  // An absolute base guarantees assets resolve regardless of trailing slashes
  // or nested routes, which a relative base ('./') cannot.
  base: '/vulnerable-login-page-analyzer/',
  // Build into docs/ so the repo can deploy from main branch /docs folder
  // via GitHub Pages "Deploy from a branch" — no Actions workflow required.
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
