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

  console.log(goalLocations);
  const loading = gameLogLoading || goalLocationsLoading;
  const error = gameLogError || goalLocationError;

  if (loading) return <p>Loading goal locations…</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ position: "relative", width: "624px", height: "448px" }}>
      <img src="/half-hockey-rink-2.png" alt="Hockey rink" />
      {goalLocations.map((goal, i) => (
        <GoalDot key={i} goal={goal} />
      ))}
    </div>
  );
}
