import { useCallback, useState } from "react";
import { PlayerDropdown } from "./PlayerDropdown";
import type { Player, Position, ShotHand, ShotType } from "../utils/types";
import { GoalMap } from "./GoalMap";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import {
  POSITION_OPTIONS,
  SEASON_OPTIONS,
  SHOT_HAND_OPTIONS,
} from "../utils/options";
import { Select } from "./Select";

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
  }, []);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6 text-center">
          How to Score Goals in Hockey
        </h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Select
            label="Season"
            value={season}
            onChange={setSeason}
            options={SEASON_OPTIONS}
          />
          <Select
            label="Position"
            value={position ?? ""}
            onChange={(value) => setPosition((value as Position) || undefined)}
            options={POSITION_OPTIONS}
          />
          <Select
            label="Shot Hand"
            value={shotHand ?? ""}
            onChange={(value) => setShotHand((value as ShotHand) || undefined)}
            options={SHOT_HAND_OPTIONS}
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Shot Types
            </label>
            <MultiSelectDropdown
              selected={selectedShots}
              onChange={setSelectedShots}
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-1">
            Player
          </label>
          <PlayerDropdown
            season={season}
            gameTypeId={2}
            position={position}
            shotHand={shotHand}
            onPlayerSelect={handlePlayerSelect}
          />
        </div>

        {selectedPlayer && (
          <div className="flex justify-center">
            <GoalMap
              playerId={selectedPlayer.id}
              season={season}
              gameType={2}
              shotTypes={selectedShots}
            />
          </div>
        )}
      </div>
    </div>
  );
}
