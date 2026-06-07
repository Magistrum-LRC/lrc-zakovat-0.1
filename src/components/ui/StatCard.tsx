import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  subtitle?: string;
  className?: string;
  accent?: boolean;
}

export function StatCard({ title, value, icon: Icon, subtitle, className, accent = false }: StatCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-xl p-5 flex flex-col gap-2",
        accent && "border-primary/30 bg-primary/5",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
        {Icon && (
          <div className={cn("p-1.5 rounded-md", accent ? "bg-primary/10" : "bg-muted")}>
            <Icon className={cn("size-3.5", accent ? "text-primary" : "text-muted-foreground")} />
          </div>
        )}
      </div>
      <p className={cn("text-2xl font-bold tracking-tight", accent ? "text-primary" : "text-foreground")}>
        {value}
      </p>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
