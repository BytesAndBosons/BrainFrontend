import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // latex.js uses dynamic requires against a directory containing
    // placeholder .keep files, which esbuild's dependency scanner can't
    // bundle. Skip pre-bundling it and let it load as-is.
    exclude: ['latex.js'],
  },
  server: {
    // The frontend calls the backend via relative /backend/... URLs. In dev,
    // forward those to the production backend so requests stay same-origin.
    proxy: {
      '/backend': {
        target: 'https://brain.lucschnell.ch',
        changeOrigin: true,
        cookieDomainRewrite: '',
      },
    },
  },
})
