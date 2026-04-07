export const API_CONFIG = {
  statsBase: import.meta.env.DEV
    ? import.meta.env.VITE_NHL_STATS_PROXY
    : `/api/proxy?url=${encodeURIComponent(import.meta.env.VITE_NHL_STATS_PROXY)}`,
  webBase: import.meta.env.DEV
    ? import.meta.env.VITE_NHL_WEB_PROXY
    : `/api/proxy?url=${encodeURIComponent(import.meta.env.VITE_NHL_WEB_PROXY)}`,
};