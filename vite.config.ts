import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      proxy: {
        "/nhl-stats": {
          target: env.VITE_NHL_STATS_PROXY,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/nhl-stats/, ""),
        },
        "/nhl-web": {
          target: env.VITE_NHL_WEB_PROXY,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/nhl-web/, ""),
        },
      }
    }
  };
});