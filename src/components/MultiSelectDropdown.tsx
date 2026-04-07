import { useState, useRef, useEffect } from "react";
import type { ShotType } from "../utils/types";

const SHOT_OPTIONS: { value: ShotType; label: string }[] = [
  { value: "wrist", label: "Wrist" },
  { value: "snap", label: "Snap" },
  { value: "slap", label: "Slap" },
  { value: "backhand", label: "Backhand" },
];

export function MultiSelectDropdown({
  selected,
  onChange,
}: {
  selected: Set<ShotType>;
  onChange: (next: Set<ShotType>) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (value: ShotType) => {
    const next = new Set(selected);
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    onChange(next);
  };

  const label =
    selected.size === 0
      ? "Select shots..."
      : selected.size === SHOT_OPTIONS.length
        ? "All shots"
        : SHOT_OPTIONS.filter((o) => selected.has(o.value))
            .map((o) => o.label)
            .join(", ");

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.375rem 0.75rem",
          border: "1px solid #ccc",
          borderRadius: "6px",
          background: "white",
          cursor: "pointer",
          minWidth: "160px",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
        <span>{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "6px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 100,
            minWidth: "160px",
            padding: "0.25rem 0",
          }}
        >
          {SHOT_OPTIONS.map(({ value, label }) => (
            <label
              key={value}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.4rem 0.75rem",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                checked={selected.has(value)}
                onChange={() => toggle(value)}
              />
              {label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
