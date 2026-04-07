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

  console.log(goal);
  return (
    <div
      title={`${goal.shotType ?? "unknown"}`}
      style={{
        position: "absolute",
        top: `${top}%`,
        left: `${left}%`,
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "#E24B4A",
        border: "1.5px solid white",
        transform: "translate(-50%, -50%)",
        opacity: 0.5, // low opacity = stacking shows density
        cursor: "pointer",
      }}
    />
  );
}
