import { useState, useRef, useEffect } from "react";
import type { ShotType } from "../utils/types";
import { SHOT_OPTIONS } from "../utils/options";
import { Caret } from "./Select";

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
    <div ref={ref} className="relative inline-block w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative w-full px-3 py-2 min-h-10 border border-border rounded-md bg-background text-foreground text-left focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <span className="block overflow-hidden text-ellipsis whitespace-nowrap pr-8">
          {label}
        </span>
        <Caret />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-md shadow-lg z-10 w-full py-1">
          {SHOT_OPTIONS.map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center gap-2 px-3 py-1 cursor-pointer select-none hover:bg-muted"
            >
              <input
                type="checkbox"
                checked={selected.has(value)}
                onChange={() => toggle(value)}
                className="rounded border-border"
              />
              {label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
