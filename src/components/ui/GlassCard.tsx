import { cn } from "@/lib/utils";

interface GlassCardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}

export function GlassCard({ className, children, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-xl p-6",
        hover && "transition-all duration-200 hover:shadow-glass-lg hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </div>
  );
}
