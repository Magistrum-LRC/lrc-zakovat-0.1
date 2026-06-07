"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Trophy, Gamepad2, BookOpen, TrendingUp } from "lucide-react";
import { useStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatCard } from "@/components/ui/StatCard";
import { DivisionBadge, MedalSummary } from "@/components/ui/Badges";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function TeamDetailPage({ params }: { params: { id: string } }) {
  const { teams, results } = useStore();
  const team = teams.find(t => t.id === params.id);
  if (!team) return notFound();

  const teamResults = results.filter(r => r.teamId === params.id);

  const chartData = teamResults.map(r => ({
    date: r.date,
    answers: r.correctAnswers,
    place: r.place,
  })).slice(-8);

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <Link
          href="/teams"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ChevronLeft className="size-4" />
          Назад к командам
        </Link>

        <GlassCard className="bg-gradient-to-br from-primary/5 via-transparent to-transparent">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-40 h-40 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 border border-primary/20">
              <span className="text-5xl font-bold text-primary/30">{team.name[0]}</span>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">{team.name}</h1>
                <DivisionBadge division={team.division} />
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                Капитан: <span className="text-foreground font-medium">{team.captain}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                Лучший результат: <span className="text-foreground font-medium">{team.bestResult}</span>
              </p>
              <MedalSummary cups={team.cups} gold={team.gold} silver={team.silver} bronze={team.bronze} size="default" />
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard title="Кубки" value={`🏆 ${team.cups}`} icon={Trophy} accent />
        <StatCard title="Игры" value={team.gamesPlayed} icon={Gamepad2} />
        <StatCard title="Правильные ответы" value={team.correctAnswers} icon={BookOpen} />
        <StatCard title="Win %" value={`${team.winRate}%`} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard>
          <h2 className="text-sm font-semibold text-foreground mb-4">Состав команды</h2>
          <ul className="space-y-2">
            {team.players.map((player, i) => (
              <li key={player} className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {i + 1}
                </div>
                <span className={player === team.captain ? "font-semibold text-foreground" : "text-muted-foreground"}>
                  {player}
                  {player === team.captain && <span className="ml-1 text-xs text-primary">(Капитан)</span>}
                </span>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard>
          <h2 className="text-sm font-semibold text-foreground mb-4">Медальный зачёт</h2>
          <div className="space-y-3">
            {[
              { label: "Кубки", value: team.cups, emoji: "🏆", color: "bg-amber-100 text-amber-700" },
              { label: "Золото", value: team.gold, emoji: "🥇", color: "bg-yellow-100 text-yellow-700" },
              { label: "Серебро", value: team.silver, emoji: "🥈", color: "bg-slate-100 text-slate-600" },
              { label: "Бронза", value: team.bronze, emoji: "🥉", color: "bg-orange-100 text-orange-600" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-lg w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>{item.emoji}</span>
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                </div>
                <span className="text-lg font-bold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-sm font-semibold text-foreground mb-4">Участие в турнирах</h2>
          <div className="flex flex-wrap gap-2">
            {team.tournamentTypes.map(type => (
              <span key={type} className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                {type}
              </span>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border/60">
            <p className="text-xs text-muted-foreground">Группа:</p>
            <p className="text-sm font-medium text-foreground mt-1">
              {team.gradeGroup === "9-11" ? "9–11 классы" : "8 класс и ниже"}
            </p>
          </div>
        </GlassCard>
      </div>

      {chartData.length > 0 && (
        <GlassCard className="mt-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Динамика результатов</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                />
                <Line type="monotone" dataKey="answers" name="Правильные ответы" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {teamResults.length > 0 && (
        <GlassCard className="mt-6 p-0 overflow-hidden">
          <div className="px-5 py-3 border-b border-border/60">
            <h2 className="text-sm font-semibold text-foreground">История игр</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-muted/20">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Дата</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Турнир</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground">Место</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground">Прав. ответы</th>
                </tr>
              </thead>
              <tbody>
                {teamResults.map(r => (
                  <tr key={r.id} className="border-b border-border/40 hover:bg-accent/20 transition-colors">
                    <td className="px-5 py-3 text-muted-foreground">{r.date}</td>
                    <td className="px-5 py-3 text-foreground">{r.tournamentType}</td>
                    <td className="px-5 py-3 text-center font-semibold">
                      {r.place === 1 ? "🏆" : r.place === 2 ? "🥇" : r.place === 3 ? "🥈" : `${r.place}.`}
                    </td>
                    <td className="px-5 py-3 text-center text-foreground font-medium">{r.correctAnswers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
