import { useCallback, useState } from "react";
import { PlayerDropdown } from "./PlayerDropdown";
import type { Player, Position, ShotHand, ShotType } from "../utils/types";
import { GoalMap } from "./GoalMap";
import { MultiSelectDropdown } from "./MultiSelectDropdown";

export function RinkMap() {
  const [season, setSeason] = useState<string>("20252026");
  const [position, setPosition] = useState<Position | undefined>();
  const [shotHand, setShotHand] = useState<ShotHand | undefined>();
  const [selectedShots, setSelectedShots] = useState<Set<ShotType>>(
    new Set(["wrist", "snap"]),
  );
  const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>();

  const handlePlayerSelect = useCallback((player: Player) => {
    setSelectedPlayer(player);
    console.log("Selected player:", player);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <select
        value={season ?? ""}
        onChange={(e) => setSeason(e.target.value || "")}
      >
        <option value="20252026">2025-2026</option>
        <option value="20242025">2024-2025</option>
        <option value="20232024">2023-2024</option>
        <option value="20222023">2022-2023</option>
        <option value="20212022">2021-2022</option>
      </select>

      <select
        value={position ?? ""}
        onChange={(e) => setPosition((e.target.value as Position) || undefined)}
      >
        <option value="">All positions</option>
        <option value="C">Centre</option>
        <option value="L">Left wing</option>
        <option value="R">Right wing</option>
        <option value="D">Defence</option>
      </select>

      <select
        value={shotHand ?? ""}
        onChange={(e) => setShotHand((e.target.value as ShotHand) || undefined)}
      >
        <option value="">Either hand</option>
        <option value="L">Left</option>
        <option value="R">Right</option>
      </select>

      <MultiSelectDropdown
        selected={selectedShots}
        onChange={setSelectedShots}
      />

      <PlayerDropdown
        season={season}
        gameTypeId={2}
        position={position}
        shotHand={shotHand}
        onPlayerSelect={handlePlayerSelect}
      />

      {selectedPlayer && (
        <GoalMap
          playerId={selectedPlayer.id}
          season={season}
          gameType={2}
          shotTypes={selectedShots}
        />
      )}
    </div>
  );
}
