import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
    '/nhl-web': {
      target: 'https://api-web.nhle.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/nhl-web/, ''),
    },
    '/nhl-stats': {
      target: 'https://api.nhle.com/stats/rest/en',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/nhl-stats/, ''),
    },
    }
  }
})
