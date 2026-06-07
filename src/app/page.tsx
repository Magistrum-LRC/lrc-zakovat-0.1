"use client";

import { useState } from "react";
import { Send, Users, Gamepad2, Circle as HelpCircle, Trophy, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { calculateLeaderboard } from "@/lib/calculations";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatCard } from "@/components/ui/StatCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { InlineChipFilter } from "@/components/ui/InlineChipFilter";
import { DivisionBadge, StatusBadge, MedalSummary } from "@/components/ui/Badges";
import type { Team } from "@/types";

const divisionFilterOpts = [
  { value: "Все", label: "Все" },
  { value: "Премьер-лига", label: "9–11 классы" },
  { value: "Первая лига", label: "8 класс и ниже" },
];

export default function OverviewPage() {
  const { teams, tournaments, games, results, questions } = useStore();
  const [divFilter, setDivFilter] = useState(["Все"]);

  const handleDivToggle = (val: string) => {
    if (val === "Все") { setDivFilter(["Все"]); return; }
    const next = divFilter.includes(val)
      ? divFilter.filter(v => v !== val)
      : [...divFilter.filter(v => v !== "Все"), val];
    setDivFilter(next.length ? next : ["Все"]);
  };

  const leaderboard = calculateLeaderboard(teams);
  const filteredTeams = divFilter.includes("Все")
    ? leaderboard
    : leaderboard.filter(t => divFilter.includes(t.division));

  const leader = leaderboard[0];
  const nextTournament = tournaments.find(t => t.status === "Предстоит" || t.status === "Идёт");
  const upcomingGames = games.filter(g => g.status === "Предстоит" || g.status === "Идёт").slice(0, 3);
  const recentResults = results.slice(-5).reverse();

  const totalGames = results.length;
  const totalTournaments = tournaments.length;
  const totalQuestions = questions.length;

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <PageHeader
        title="Обзор"
        subtitle="Академический дашборд интеллектуальных игр Zakovat"
        actions={
          <a
            href="https://t.me/zakovat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Send className="size-4" />
            Telegram канал
          </a>
        }
      />

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
        {/* Left: Teams table */}
        <div className="space-y-4">
          <GlassCard className="p-0 overflow-hidden">
            <div className="p-4 border-b border-border/60 flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-sm font-semibold text-foreground">Команды</h2>
              <InlineChipFilter
                options={divisionFilterOpts}
                selected={divFilter}
                onToggle={handleDivToggle}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Команда</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Кубки</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Лучший результат</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Игры</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Win %</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Дивизион</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeams.map((team, i) => (
                    <tr key={team.id} className="border-b border-border/40 hover:bg-accent/30 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/teams/${team.id}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                          {team.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-semibold">{team.cups > 0 ? `🏆 ${team.cups}` : team.cups}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">{team.bestResult}</td>
                      <td className="px-4 py-3 text-center text-muted-foreground">{team.gamesPlayed}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-medium ${team.winRate >= 60 ? "text-green-600" : team.winRate >= 45 ? "text-amber-600" : "text-muted-foreground"}`}>
                          {team.winRate}%
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <DivisionBadge division={team.division} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Right: Cards */}
        <div className="space-y-4">
          {/* Leader card */}
          {leader && (
            <GlassCard className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="size-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Лидер сезона</h3>
              </div>
              <div className="font-bold text-lg text-foreground">{leader.name}</div>
              <DivisionBadge division={leader.division} className="mt-1 mb-3" />
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold text-primary">🏆 {leader.cups}</div>
                  <div className="text-xs text-muted-foreground">Кубки</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-foreground">{leader.correctAnswers}</div>
                  <div className="text-xs text-muted-foreground">Ответов</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">{leader.winRate}%</div>
                  <div className="text-xs text-muted-foreground">Win %</div>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Next tournament */}
          {nextTournament && (
            <GlassCard>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="size-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  {nextTournament.status === "Предстоит" ? "Следующий турнир" : "Текущий турнир"}
                </h3>
              </div>
              <div className="font-semibold text-sm text-foreground">{nextTournament.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{nextTournament.date}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">{nextTournament.type}</span>
                <DivisionBadge division={nextTournament.division as "Премьер-лига" | "Первая лига" | "Все"} />
                <StatusBadge status={nextTournament.status} />
              </div>
            </GlassCard>
          )}

          {/* Upcoming games */}
          {upcomingGames.length > 0 && (
            <GlassCard>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="size-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Ближайшие игры</h3>
              </div>
              <div className="space-y-2">
                {upcomingGames.map(game => (
                  <div key={game.id} className="flex items-center justify-between text-xs">
                    <span className="text-foreground font-medium truncate">{game.title}</span>
                    <span className="text-muted-foreground ml-2 flex-shrink-0">{game.date}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <StatCard title="Команды" value={teams.length} icon={Users} accent />
        <StatCard title="Сыгранные игры" value={totalGames} icon={Gamepad2} />
        <StatCard title="Вопросы" value={totalQuestions} icon={HelpCircle} />
        <StatCard title="Турниры" value={totalTournaments} icon={Trophy} />
      </div>

      {/* Recent results */}
      <GlassCard className="mt-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Последние результаты</h2>
        <div className="space-y-2">
          {recentResults.map(result => (
            <div key={result.id} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold w-6 text-center">
                  {result.place === 1 ? "🏆" : result.place === 2 ? "🥇" : result.place === 3 ? "🥈" : `${result.place}.`}
                </span>
                <div>
                  <div className="text-sm font-medium text-foreground">{result.teamName}</div>
                  <div className="text-xs text-muted-foreground">{result.date} · {result.tournamentType}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground">{result.correctAnswers} отв.</div>
                <DivisionBadge division={result.division} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
