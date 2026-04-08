import type { ShotType } from "./types";

export const SHOT_OPTIONS: { value: ShotType; label: string }[] = [
  { value: "wrist", label: "Wrist" },
  { value: "snap", label: "Snap" },
  { value: "slap", label: "Slap" },
  { value: "backhand", label: "Backhand" },
];

export const SEASON_OPTIONS: { value: string; label: string }[] = [
  { value: "20252026", label: "2025-2026" },
  { value: "20242025", label: "2024-2025" },
  { value: "20232024", label: "2023-2024" },
  { value: "20222023", label: "2022-2023" },
  { value: "20212022", label: "2021-2022" },
];

export const POSITION_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All positions" },
  { value: "C", label: "(C) Center" },
  { value: "L", label: "(LW) Left Wing" },
  { value: "R", label: "(RW) Right Wing" },
  { value: "D", label: "(D) Defence" },
];

export const SHOT_HAND_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Either hand" },
  { value: "L", label: "(LH) Left hand" },
  { value: "R", label: "(RH) Right hand" },
];