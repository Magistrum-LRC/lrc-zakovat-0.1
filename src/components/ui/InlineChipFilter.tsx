"use client";

import { cn } from "@/lib/utils";

interface ChipOption {
  value: string;
  label: string;
}

interface InlineChipFilterProps {
  label?: string;
  options: ChipOption[];
  selected: string[];
  onToggle: (value: string) => void;
  multiSelect?: boolean;
  className?: string;
}

export function InlineChipFilter({
  label,
  options,
  selected,
  onToggle,
  multiSelect = true,
  className,
}: InlineChipFilterProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {label && <span className="text-xs font-medium text-muted-foreground mr-1">{label}</span>}
      {options.map((opt) => {
        const isActive = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            onClick={() => onToggle(opt.value)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150",
              isActive
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
