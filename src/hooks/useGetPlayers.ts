import { useState, useEffect } from 'react';
import { nhlApi, type GetPlayersRequestFromApi } from '../api/nhlApiClient';
import type { Player } from '../utils/types';

type UseGetPlayersRequest = GetPlayersRequestFromApi;

interface UseGetPlayersResponse {
  players: Player[];
  loading: boolean;
  error: string | null;
}

export function useGetPlayers({
  season,
  gameTypeId,
  position,
  shotHand,
}: UseGetPlayersRequest): UseGetPlayersResponse {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchPlayers() {
      setLoading(true);
      setError(null);
      try {
        const response = await nhlApi.getPlayers({ season, gameTypeId, position, shotHand });
        if (!cancelled) setPlayers(response);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        if (!cancelled) setError('Failed to load players');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPlayers();
    return () => { cancelled = true; };
  }, [season, gameTypeId, position, shotHand]);

  return { players, loading, error };
}