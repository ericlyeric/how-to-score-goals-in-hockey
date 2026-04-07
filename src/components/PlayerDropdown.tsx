import type { GetPlayersRequestFromApi } from "../api/nhlApiClient";
import { useGetPlayers } from "../hooks/useGetPlayers";
import type { Player } from "../utils/types";

interface PlayerDropdownProps extends GetPlayersRequestFromApi {
  onPlayerSelect: (player: Player) => void;
}

export function PlayerDropdown({
  season,
  gameTypeId,
  position,
  shotHand,
  onPlayerSelect,
}: PlayerDropdownProps) {
  const { players, loading, error } = useGetPlayers({
    season,
    gameTypeId,
    position,
    shotHand,
  });

  if (loading)
    return (
      <select disabled>
        <option>Loading players…</option>
      </select>
    );
  if (error)
    return (
      <select disabled>
        <option>{error}</option>
      </select>
    );

  return (
    <select
      defaultValue=""
      onChange={(e) => {
        const player = players.find((p) => p.id === Number(e.target.value));
        if (player) onPlayerSelect(player);
      }}
    >
      <option value="" disabled>
        Select a player
      </option>
      {players.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name} - {p.position} - {p.goals}G
        </option>
      ))}
    </select>
  );
}
