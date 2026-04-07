import { useState, useEffect } from 'react';
import { nhlApi, type PlayFromApi } from '../api/nhlApiClient';
import type { GoalLocation, ShotType } from '../utils/types';
import { handleMirroringCoordinates } from '../api/utils';

interface UseGetGoalLocationsRequest {
  gameIds: number[];
  playerId: number;
  shotTypes?: Set<ShotType>;
}

interface UseGetGoalLocationsResponse {
  goalLocations: GoalLocation[];
  loading: boolean;
  error: string | null;
}

export function useGetGoalLocations({
  gameIds,
  playerId,
  shotTypes,
}: UseGetGoalLocationsRequest): UseGetGoalLocationsResponse {
  const [goalLocations, setGoalLocations] = useState<GoalLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!playerId || gameIds.length === 0) {
      setGoalLocations([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    function shouldIncludeShotType(shotType: ShotType | undefined) {
      return shotType !== undefined && (!shotTypes || shotTypes.has(shotType));
    }

    async function fetchGoalLocations() {
      setLoading(true);
      setError(null);

      try {
        const results = await Promise.allSettled(
          gameIds.map(id => nhlApi.getPlayByPlay({ gameId: id, playerId }))
        );

        const goals: GoalLocation[] = [];

        results.forEach(result => {
          if (result.status !== 'fulfilled') return;

          result.value.forEach((p: PlayFromApi) => {
            if (!p.details || p.details.xCoord === undefined || p.details.yCoord === undefined) {
              return;
            }

            const { shotType } = p.details;
            if (!shouldIncludeShotType(shotType)) return;

            const mirrored = handleMirroringCoordinates(p.details);
            goals.push({
              x: mirrored.xCoord,
              y: mirrored.yCoord,
              shotType,
            });
          });
        });

        if (!cancelled) {
          setGoalLocations(goals);
        }
      } catch (e) {
        if (!cancelled) {
          setError('Failed to load goal locations');
        }
        console.error(e);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchGoalLocations();
    return () => {
      cancelled = true;
    };
  }, [gameIds, playerId, shotTypes]);

  return { goalLocations, loading, error };
}