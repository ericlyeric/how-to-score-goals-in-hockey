import type { GoalLocation } from "../utils/types";

const IMAGE_WIDTH = 624;
const IMAGE_HEIGHT = 448;

const ICE_BOUNDS = {
  top: 6, // px from top where back boards are
  bottom: 444, // px from top where blue line is
  left: 5, // px from left where left board is
  right: 616, // px from left where right board is
};

function nhlToPercent(x: number, y: number) {
  const ax = Math.abs(x);

  // NHL x=100 (back boards) → 6px from top
  // NHL x=25  (blue line)   → 444px from top
  const imgY =
    ICE_BOUNDS.bottom - ((ax - 25) / 79) * (ICE_BOUNDS.bottom - ICE_BOUNDS.top);

  // NHL y=-42.5 (left board)  → 5px from left
  // NHL y=42.5  (right board) → 616px from left
  const imgX =
    ((y + 42.5) / 85) * (ICE_BOUNDS.right - ICE_BOUNDS.left) + ICE_BOUNDS.left;

  return {
    top: (imgY / IMAGE_HEIGHT) * 100,
    left: (imgX / IMAGE_WIDTH) * 100,
  };
}

interface GoalDotProps {
  goal: GoalLocation;
}

export function GoalDot({ goal }: GoalDotProps) {
  const ax = Math.abs(goal.x);
  if (ax < 25) return null;

  const { top, left } = nhlToPercent(goal.x, goal.y);

  return (
    <div
      title={`${goal.shotType ?? "unknown"}`}
      className="absolute w-6 h-6 sm:w-12 sm:h-12 bg-red-500 border-2 border-white rounded-full opacity-50 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
      style={{
        top: `${top}%`,
        left: `${left}%`,
      }}
    />
  );
}
