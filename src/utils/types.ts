export type ShotHand = "L" | "R";
export type Position = "C" | "L" | "R" | "D";
export type ShotType = "wrist" | "snap" | "slap" | "backhand";
export type GameType = 2 | 3; // 2 (regular), 3 (playoffs)

export interface Player {
  id: number;
  name: string;
  position: Position;
  goals: number;
  hand: ShotHand;
}

export type GameId = number;
export type GameIds = GameId[]

export interface GoalLocation {
  x: number;
  y: number;
  shotType: ShotType;
}
