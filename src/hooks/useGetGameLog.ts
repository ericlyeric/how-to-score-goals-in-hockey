import { useEffect, useState } from "react";
import { nhlApi, type GetGameLogRequestFromApi } from "../api/nhlApiClient";
import type { GameIds } from "../utils/types";

type UseGetGameLogRequest = GetGameLogRequestFromApi;
interface UseGetGameLogResponse {
  gameIds: GameIds;
  loading: boolean;
  error: string | null;
}

export function useGetGameLog({playerId, season, gameType}: UseGetGameLogRequest): UseGetGameLogResponse {
  const [gameIds, setGameIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    
    async function fetchGameLog() {
      setLoading(true);
      setError(null);
      try {
        const response = await nhlApi.getGameLog({ playerId, season, gameType });
        if (!cancelled) setGameIds(response);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        if (!cancelled) setError('Failed to load game logs');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchGameLog();
    return () => { cancelled = true; };
  }, [gameType, playerId, season]);

  return { gameIds, loading, error };
}