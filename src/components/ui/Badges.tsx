import { cn } from "@/lib/utils";
import type { Division, TournamentStatus, QuestionTopic } from "@/types";

export function DivisionBadge({ division, className }: { division: Division | "Все"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        division === "Премьер-лига"
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : division === "Первая лига"
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-muted text-muted-foreground border-border",
        className
      )}
    >
      {division}
    </span>
  );
}

export function StatusBadge({ status, className }: { status: TournamentStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        status === "Завершён"
          ? "bg-slate-50 text-slate-600 border-slate-200"
          : status === "Идёт"
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-amber-50 text-amber-700 border-amber-200",
        className
      )}
    >
      {status}
    </span>
  );
}

const topicColors: Partial<Record<QuestionTopic, string>> = {
  "История": "bg-amber-50 text-amber-700 border-amber-200",
  "Математика": "bg-blue-50 text-blue-700 border-blue-200",
  "Философия": "bg-purple-50 text-purple-700 border-purple-200",
  "Химия": "bg-green-50 text-green-700 border-green-200",
  "Литература": "bg-rose-50 text-rose-700 border-rose-200",
  "Технологии": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Игры": "bg-orange-50 text-orange-700 border-orange-200",
  "Другое": "bg-slate-50 text-slate-600 border-slate-200",
};

export function TopicBadge({ topic, className }: { topic: QuestionTopic; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        topicColors[topic] || "bg-slate-50 text-slate-600 border-slate-200",
        className
      )}
    >
      {topic}
    </span>
  );
}

export function MedalSummary({ cups, gold, silver, bronze, size = "default" }: {
  cups: number;
  gold: number;
  silver: number;
  bronze: number;
  size?: "sm" | "default" | "lg";
}) {
  const textClass = size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm";
  const spacing = size === "sm" ? "gap-2" : "gap-3";
  return (
    <div className={`flex items-center ${spacing}`}>
      <span className={textClass}>🏆 {cups}</span>
      <span className={textClass}>🥇 {gold}</span>
      <span className={textClass}>🥈 {silver}</span>
      <span className={textClass}>🥉 {bronze}</span>
    </div>
  );
}
