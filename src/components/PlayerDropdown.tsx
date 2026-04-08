import type { GetPlayersRequestFromApi } from "../api/nhlApiClient";
import { useGetPlayers } from "../hooks/useGetPlayers";
import type { Player } from "../utils/types";
import { Caret } from "./Select";

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
      <div className="group relative">
        <select
          disabled
          className="w-full px-3 py-2 pr-8 appearance-none border border-border rounded-md bg-muted text-muted-foreground"
        >
          <option>Loading players…</option>
        </select>
        <Caret />
      </div>
    );
  if (error)
    return (
      <div className="group relative">
        <select
          disabled
          className="w-full px-3 py-2 pr-8 appearance-none border border-border rounded-md bg-muted text-muted-foreground"
        >
          <option>{error}</option>
        </select>
        <Caret />
      </div>
    );

  return (
    <div className="group relative">
      <select
        defaultValue=""
        onChange={(e) => {
          const player = players.find((p) => p.id === Number(e.target.value));
          if (player) onPlayerSelect(player);
        }}
        className="w-full px-3 py-2 pr-8 appearance-none border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="" disabled>
          Select a player
        </option>
        {players.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} - {p.position} - {p.hand === "L" ? "LH" : "RH"} - {p.goals}
            G
          </option>
        ))}
      </select>
      <Caret />
    </div>
  );
}
