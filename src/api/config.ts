export const API_CONFIG = {
  statsBase: import.meta.env.DEV
    ? "/nhl-stats"
    : import.meta.env.VITE_NHL_STATS_PROXY,
  webBase: import.meta.env.DEV
    ? "/nhl-web"
    : import.meta.env.VITE_NHL_WEB_PROXY,
};
