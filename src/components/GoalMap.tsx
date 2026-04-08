import { useGetGameLog } from "../hooks/useGetGameLog";
import { useGetGoalLocations } from "../hooks/useGetGoalCoordinates";
import type { GameType, ShotType } from "../utils/types";
import { GoalDot } from "./GoalDot";

interface GoalMapProps {
  playerId: number;
  season: string;
  gameType: GameType;
  shotTypes?: Set<ShotType>;
}

// NHL coordinate system treats the rink as horizontal
export function GoalMap({
  playerId,
  season,
  gameType,
  shotTypes,
}: GoalMapProps) {
  const {
    gameIds,
    loading: gameLogLoading,
    error: gameLogError,
  } = useGetGameLog({
    playerId,
    season,
    gameType,
  });
  const {
    goalLocations,
    loading: goalLocationsLoading,
    error: goalLocationError,
  } = useGetGoalLocations({ gameIds, playerId, shotTypes });

  const loading = gameLogLoading || goalLocationsLoading;
  const error = gameLogError || goalLocationError;

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <img
        src="/half-hockey-rink-2.png"
        alt="Hockey rink"
        className="w-full h-auto object-contain"
      />

      {goalLocations.map((goal, i) => (
        <GoalDot key={i} goal={goal} />
      ))}

      {(loading || error) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-center text-white px-4">
          <div className="flex flex-col items-center gap-3">
            {loading && (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full border-4 border-white/30 border-t-white animate-spin" />
                <span className="text-lg font-semibold">
                  Loading goal locations…
                </span>
              </div>
            )}
            {error && (
              <div className="rounded-xl border border-white/30 bg-black/70 px-4 py-3">
                <p className="text-lg font-semibold">{error}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
