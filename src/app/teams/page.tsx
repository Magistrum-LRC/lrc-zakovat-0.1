"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { calculateLeaderboard } from "@/lib/calculations";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { InlineChipFilter } from "@/components/ui/InlineChipFilter";
import { DivisionBadge, MedalSummary } from "@/components/ui/Badges";
import type { LeaderboardEntry } from "@/types";

const divOpts = [
  { value: "Все", label: "Все" },
  { value: "Премьер-лига", label: "Премьер-лига" },
  { value: "Первая лига", label: "Первая лига" },
];
const sortOpts = [
  { value: "cups", label: "Кубки" },
  { value: "name", label: "Название" },
  { value: "games", label: "Игры" },
  { value: "correct", label: "Правильные ответы" },
  { value: "best", label: "Лучший результат" },
  { value: "winrate", label: "Win %" },
];

function TeamPreviewCard({ team, onClose }: { team: LeaderboardEntry; onClose?: () => void }) {
  return (
    <div className="w-72 bg-white/95 backdrop-blur-xl rounded-xl border border-border/60 shadow-glass-lg p-4">
      {onClose && (
        <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
          <X className="size-4" />
        </button>
      )}
      {/* Photo placeholder */}
      <div className="w-full h-32 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center mb-3 overflow-hidden">
        <span className="text-4xl font-bold text-primary/40">{team.name[0]}</span>
      </div>

      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-foreground text-sm">{team.name}</span>
        <DivisionBadge division={team.division} />
      </div>

      <p className="text-xs text-muted-foreground mb-2">
        Капитан: <span className="text-foreground font-medium">{team.captain}</span>
      </p>

      <div className="grid grid-cols-4 gap-1.5 mb-3 text-center">
        <div className="bg-muted/50 rounded-lg p-1.5">
          <div className="text-sm font-bold text-primary">🏆{team.cups}</div>
          <div className="text-[9px] text-muted-foreground">Кубки</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-1.5">
          <div className="text-sm font-bold">{team.gamesPlayed}</div>
          <div className="text-[9px] text-muted-foreground">Игры</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-1.5">
          <div className="text-sm font-bold">{team.correctAnswers}</div>
          <div className="text-[9px] text-muted-foreground">Ответы</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-1.5">
          <div className={`text-sm font-bold ${team.winRate >= 60 ? "text-green-600" : "text-amber-600"}`}>{team.winRate}%</div>
          <div className="text-[9px] text-muted-foreground">Win%</div>
        </div>
      </div>

      <MedalSummary cups={team.cups} gold={team.gold} silver={team.silver} bronze={team.bronze} size="sm" />

      <p className="text-xs text-muted-foreground mt-2 mb-1">Состав ({team.players.length}):</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {team.players.map(p => (
          <span key={p} className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">{p}</span>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground mb-2">Лучший результат: <span className="text-foreground">{team.bestResult}</span></p>

      <Link
        href={`/teams/${team.id}`}
        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
      >
        <ExternalLink className="size-3" />
        Открыть профиль
      </Link>
    </div>
  );
}

export default function TeamsPage() {
  const { teams } = useStore();
  const [divFilter, setDivFilter] = useState(["Все"]);
  const [sortBy, setSortBy] = useState(["cups"]);
  const [hoveredTeam, setHoveredTeam] = useState<LeaderboardEntry | null>(null);
  const [mobileSelectedTeam, setMobileSelectedTeam] = useState<LeaderboardEntry | null>(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0, right: false });
  const tableRef = useRef<HTMLDivElement>(null);

  const handleDivToggle = (val: string) => {
    if (val === "Все") { setDivFilter(["Все"]); return; }
    const next = divFilter.includes(val) ? divFilter.filter(v => v !== val) : [...divFilter.filter(v => v !== "Все"), val];
    setDivFilter(next.length ? next : ["Все"]);
  };

  const leaderboard = calculateLeaderboard(teams);
  const filtered = leaderboard.filter(t => divFilter.includes("Все") || divFilter.includes(t.division));

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy[0]) {
      case "name": return a.name.localeCompare(b.name);
      case "games": return b.gamesPlayed - a.gamesPlayed;
      case "correct": return b.correctAnswers - a.correctAnswers;
      case "winrate": return b.winRate - a.winRate;
      default: return a.rank - b.rank;
    }
  });

  const handleRowHover = (team: LeaderboardEntry, e: React.MouseEvent) => {
    const row = e.currentTarget as HTMLElement;
    const rect = row.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const popoverWidth = 288;

    let left = rect.right + 8;
    let right = false;
    if (left + popoverWidth > windowWidth - 16) {
      left = rect.left - popoverWidth - 8;
      right = true;
    }

    setPopoverPos({ top: rect.top + window.scrollY, left, right });
    setHoveredTeam(team);
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <PageHeader
        title="Команды"
        subtitle="Каталог команд. Наведите курсор на строку для просмотра."
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <InlineChipFilter options={divOpts} selected={divFilter} onToggle={handleDivToggle} />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Сортировка:</span>
          <InlineChipFilter
            options={sortOpts}
            selected={sortBy}
            onToggle={(v) => setSortBy([v])}
          />
        </div>
      </div>

      <div ref={tableRef}>
        <GlassCard className="p-0 overflow-visible">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/20">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Команда</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Дивизион</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Игры</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Кубки</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Прав. ответы</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Win %</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Лучший результат</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(team => (
                  <tr
                    key={team.id}
                    className="border-b border-border/40 hover:bg-accent/20 transition-colors cursor-pointer relative"
                    onMouseEnter={(e) => handleRowHover(team, e)}
                    onMouseLeave={() => setHoveredTeam(null)}
                    onClick={() => setMobileSelectedTeam(team === mobileSelectedTeam ? null : team)}
                  >
                    <td className="px-5 py-3.5 font-semibold text-foreground">
                      <Link
                        href={`/teams/${team.id}`}
                        className="hover:text-primary transition-colors"
                        onClick={e => e.stopPropagation()}
                      >
                        {team.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <DivisionBadge division={team.division} />
                    </td>
                    <td className="px-5 py-3.5 text-center text-muted-foreground">{team.gamesPlayed}</td>
                    <td className="px-5 py-3.5 text-center font-semibold">{team.cups > 0 ? `🏆 ${team.cups}` : team.cups}</td>
                    <td className="px-5 py-3.5 text-right text-muted-foreground hidden sm:table-cell">{team.correctAnswers}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`font-semibold ${team.winRate >= 60 ? "text-green-600" : team.winRate >= 45 ? "text-amber-600" : "text-muted-foreground"}`}>
                        {team.winRate}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground hidden lg:table-cell">{team.bestResult}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* Desktop hover popover */}
      {hoveredTeam && (
        <div
          className="fixed z-50 hidden md:block"
          style={{ top: popoverPos.top, left: popoverPos.left }}
          onMouseEnter={() => setHoveredTeam(hoveredTeam)}
          onMouseLeave={() => setHoveredTeam(null)}
        >
          <TeamPreviewCard team={hoveredTeam} />
        </div>
      )}

      {/* Mobile modal */}
      {mobileSelectedTeam && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center md:hidden bg-black/30 backdrop-blur-sm p-4"
          onClick={() => setMobileSelectedTeam(null)}
        >
          <div onClick={e => e.stopPropagation()} className="relative w-full max-w-sm">
            <TeamPreviewCard team={mobileSelectedTeam} onClose={() => setMobileSelectedTeam(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
