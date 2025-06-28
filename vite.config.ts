import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { codeInspectorPlugin } from 'code-inspector-plugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    codeInspectorPlugin({
      bundler: 'vite',
    }),
    tailwindcss(),
    react(),
  ],
  assetsInclude: ['**/*.xwm', '**/*.wav'],
  server: {
    fs: {
      allow: ['..']
    }
  },
  base: '/fallout_cv_app/'
})
