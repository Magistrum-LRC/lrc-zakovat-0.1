"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { calculateLeaderboard, filterByDivision } from "@/lib/calculations";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { InlineChipFilter } from "@/components/ui/InlineChipFilter";
import { DivisionBadge } from "@/components/ui/Badges";
import type { Division } from "@/types";

const seasonOpts = [
  { value: "Текущий сезон", label: "Текущий сезон" },
  { value: "Все", label: "Все" },
  { value: "2026", label: "2026" },
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
];

const typeOpts = [
  { value: "Все", label: "Все" },
  { value: "Zakovat", label: "Zakovat" },
  { value: "Своя игра", label: "Своя игра" },
  { value: "Брейн-ринг", label: "Брейн-ринг" },
  { value: "Школьная лига", label: "Школьная лига" },
  { value: "Суперкубок", label: "Суперкубок" },
];

const divisionOpts = [
  { value: "Все", label: "Все" },
  { value: "Премьер-лига", label: "Премьер-лига" },
  { value: "Первая лига", label: "Первая лига" },
];

const sortOpts = [
  { value: "rank", label: "Кубки" },
  { value: "name", label: "Название" },
  { value: "games", label: "Игры" },
  { value: "correct", label: "Правильные ответы" },
  { value: "winrate", label: "Win %" },
];

export default function RatingPage() {
  const { teams } = useStore();
  const [seasons, setSeasons] = useState(["Текущий сезон"]);
  const [types, setTypes] = useState(["Все"]);
  const [divs, setDivs] = useState(["Все"]);
  const [sort, setSort] = useState(["rank"]);

  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>, all: string) =>
    (val: string) => {
      setter(prev => {
        if (val === all) return [all];
        const next = prev.includes(val)
          ? prev.filter(v => v !== val)
          : [...prev.filter(v => v !== all), val];
        return next.length ? next : [all];
      });
    };

  const leaderboard = useMemo(() => {
    let lbs = calculateLeaderboard(teams);
    if (!divs.includes("Все")) lbs = lbs.filter(t => divs.includes(t.division));
    return lbs;
  }, [teams, divs]);

  const premierTeams = leaderboard.filter(t => t.division === "Премьер-лига");
  const firstTeams = leaderboard.filter(t => t.division === "Первая лига");

  const RatingTable = ({ teams, title }: { teams: typeof leaderboard; title: string }) => (
    <GlassCard className="p-0 overflow-hidden">
      <div className="px-5 py-3 border-b border-border/60 bg-muted/20">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-muted/10">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-12">Ранг</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Команда</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Дивизион</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Игры</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">🏆</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">🥇</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">🥈</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">🥉</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Прав. ответы</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Win %</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, i) => (
              <tr
                key={team.id}
                className={`border-b border-border/40 hover:bg-accent/20 transition-colors ${i < 3 ? "bg-gradient-to-r from-amber-50/30 to-transparent" : ""}`}
              >
                <td className="px-4 py-3 text-center">
                  <span className={`font-bold text-sm ${i === 0 ? "text-amber-600" : i === 1 ? "text-slate-500" : i === 2 ? "text-orange-500" : "text-muted-foreground"}`}>
                    {i < 3 ? ["🥇", "🥈", "🥉"][i] : team.rank}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-foreground">{team.name}</td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <DivisionBadge division={team.division} />
                </td>
                <td className="px-4 py-3 text-center text-muted-foreground">{team.gamesPlayed}</td>
                <td className="px-4 py-3 text-center font-semibold">{team.cups}</td>
                <td className="px-4 py-3 text-center text-amber-600 font-medium">{team.gold}</td>
                <td className="px-4 py-3 text-center text-slate-500 font-medium">{team.silver}</td>
                <td className="px-4 py-3 text-center text-orange-500 font-medium">{team.bronze}</td>
                <td className="px-4 py-3 text-right text-muted-foreground hidden sm:table-cell">{team.correctAnswers}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-semibold ${team.winRate >= 60 ? "text-green-600" : team.winRate >= 45 ? "text-amber-600" : "text-muted-foreground"}`}>
                    {team.winRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <PageHeader
        title="Рейтинг"
        subtitle="Автоматический расчёт по кубкам, медалям и правильным ответам."
      />

      {/* Formula card */}
      <GlassCard className="mb-6 py-3 px-5 bg-muted/30">
        <span className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Формула:</span>{" "}
          1🏆 = 2🥇 = 4🥈 = 6🥉
        </span>
      </GlassCard>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Сезон</p>
          <InlineChipFilter
            options={seasonOpts}
            selected={seasons}
            onToggle={toggle(setSeasons, "Все")}
          />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Тип</p>
          <InlineChipFilter
            options={typeOpts}
            selected={types}
            onToggle={toggle(setTypes, "Все")}
          />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Дивизион</p>
          <InlineChipFilter
            options={divisionOpts}
            selected={divs}
            onToggle={toggle(setDivs, "Все")}
          />
        </div>
      </div>

      {/* Tables */}
      <div className="space-y-6">
        {(divs.includes("Все") || divs.includes("Премьер-лига")) && premierTeams.length > 0 && (
          <RatingTable teams={premierTeams} title="Премьер-лига" />
        )}
        {(divs.includes("Все") || divs.includes("Первая лига")) && firstTeams.length > 0 && (
          <RatingTable teams={firstTeams} title="Первая лига" />
        )}
      </div>
    </div>
  );
}
