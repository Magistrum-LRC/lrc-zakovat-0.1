"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { calculateLeaderboard } from "@/lib/calculations";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { InlineChipFilter } from "@/components/ui/InlineChipFilter";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";

const seasonOpts = [
  { value: "Все", label: "Все" },
  { value: "2026", label: "2026" },
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
];

const divisionOpts = [
  { value: "Все", label: "Все" },
  { value: "Премьер-лига", label: "Премьер-лига" },
  { value: "Первая лига", label: "Первая лига" },
];

const typeOpts = [
  { value: "Все", label: "Все" },
  { value: "Zakovat", label: "Zakovat" },
  { value: "Своя игра", label: "Своя игра" },
  { value: "Брейн-ринг", label: "Брейн-ринг" },
  { value: "Школьная лига", label: "Школьная лига" },
  { value: "Суперкубок", label: "Суперкубок" },
];

const CHART_COLORS = [
  "hsl(var(--primary))",
  "#2dd4bf",
  "#f59e0b",
  "#a855f7",
  "#06b6d4",
  "#ef4444",
  "#8b5cf6",
  "#84cc16",
];

function ChartCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <GlassCard className={`flex flex-col gap-3 ${className}`}>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="h-48">
        {children}
      </div>
    </GlassCard>
  );
}

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "11px",
  color: "hsl(var(--foreground))",
};

const tickStyle = { fontSize: 10, fill: "hsl(var(--muted-foreground))" };

export default function StatisticsPage() {
  const { teams, tournaments, results, questions } = useStore();
  const [seasons, setSeasons] = useState(["Все"]);
  const [divs, setDivs] = useState(["Все"]);
  const [types, setTypes] = useState(["Все"]);

  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    (val: string) => {
      setter(prev => {
        if (val === "Все") return ["Все"];
        const next = prev.includes(val)
          ? prev.filter(v => v !== val)
          : [...prev.filter(v => v !== "Все"), val];
        return next.length ? next : ["Все"];
      });
    };

  const leaderboard = useMemo(() => calculateLeaderboard(teams), [teams]);

  const filteredTeams = useMemo(() => {
    return leaderboard.filter(t =>
      (divs.includes("Все") || divs.includes(t.division))
    );
  }, [leaderboard, divs]);

  // 1. Top teams by cups
  const topByCups = [...filteredTeams]
    .sort((a, b) => b.cups - a.cups)
    .slice(0, 8)
    .map(t => ({ name: t.name.length > 10 ? t.name.slice(0, 10) + "…" : t.name, Кубки: t.cups }));

  // 2. Top teams by correct answers
  const topByAnswers = [...filteredTeams]
    .sort((a, b) => b.correctAnswers - a.correctAnswers)
    .slice(0, 8)
    .map(t => ({ name: t.name.length > 10 ? t.name.slice(0, 10) + "…" : t.name, Ответы: t.correctAnswers }));

  // 3. Games by season
  const gamesBySeason = useMemo(() => {
    const seasonMap: Record<string, number> = {};
    tournaments.forEach(t => {
      seasonMap[t.season] = (seasonMap[t.season] || 0) + 1;
    });
    return Object.entries(seasonMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([season, count]) => ({ season, Турниры: count }));
  }, []);

  // 4. Questions by topic
  const questionsByTopic = useMemo(() => {
    const topicMap: Record<string, number> = {};
    questions.forEach(q => {
      topicMap[q.topic] = (topicMap[q.topic] || 0) + 1;
    });
    return Object.entries(topicMap).map(([name, value]) => ({ name, value }));
  }, []);

  // 5. Medal distribution
  const medalData = useMemo(() => {
    const totals = filteredTeams.reduce(
      (acc, t) => ({
        gold: acc.gold + t.gold,
        silver: acc.silver + t.silver,
        bronze: acc.bronze + t.bronze,
      }),
      { gold: 0, silver: 0, bronze: 0 }
    );
    return [
      { name: "Золото", value: totals.gold, color: "oklch(0.75 0.18 75)" },
      { name: "Серебро", value: totals.silver, color: "oklch(0.65 0.02 240)" },
      { name: "Бронза", value: totals.bronze, color: "oklch(0.65 0.15 50)" },
    ];
  }, [filteredTeams]);

  // 6. Win rate by division
  const winRateData = useMemo(() => {
    const premier = leaderboard.filter(t => t.division === "Премьер-лига");
    const first = leaderboard.filter(t => t.division === "Первая лига");
    const avg = (arr: typeof premier) =>
      arr.length ? Math.round(arr.reduce((s, t) => s + t.winRate, 0) / arr.length) : 0;
    return [
      { division: "Премьер-лига", "Win %": avg(premier) },
      { division: "Первая лига", "Win %": avg(first) },
    ];
  }, [leaderboard]);

  // 7. Questions difficulty distribution
  const difficultyData = useMemo(() => {
    const diffMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    questions.forEach(q => { diffMap[q.difficulty]++; });
    return Object.entries(diffMap).map(([d, count]) => ({ difficulty: `${d}/5`, Вопросы: count }));
  }, []);

  // 8. Radar — top team performance profile
  const radarData = useMemo(() => {
    const top = filteredTeams.slice(0, 4);
    const metrics = ["Кубки", "Золото", "Серебро", "Бронза"];
    return metrics.map(m => {
      const row: Record<string, string | number> = { metric: m };
      top.forEach(t => {
        const mLower = m.toLowerCase();
        const key: "cups" | "gold" | "silver" | "bronze" =
          mLower === "кубки" ? "cups" : mLower === "золото" ? "gold" : mLower === "серебро" ? "silver" : "bronze";
        row[t.name.slice(0, 8)] = t[key];
      });
      return row;
    });
  }, [filteredTeams]);

  // 9. Average correct answers by division
  const avgAnswersData = useMemo(() => {
    const premier = leaderboard.filter(t => t.division === "Премьер-лига");
    const first = leaderboard.filter(t => t.division === "Первая лига");
    const avg = (arr: typeof premier) =>
      arr.length ? Math.round(arr.reduce((s, t) => s + t.correctAnswers, 0) / arr.length) : 0;
    return [
      { group: "Премьер-лига", "Ср. ответов": avg(premier) },
      { group: "Первая лига", "Ср. ответов": avg(first) },
    ];
  }, [leaderboard]);

  // 10. Tournament types distribution
  const tournamentTypeData = useMemo(() => {
    const typeMap: Record<string, number> = {};
    tournaments.forEach(t => {
      typeMap[t.type] = (typeMap[t.type] || 0) + 1;
    });
    return Object.entries(typeMap).map(([name, value]) => ({ name, value }));
  }, []);

  // 11. Medals per game (efficiency)
  const medalsPerGame = [...filteredTeams]
    .filter(t => t.gamesPlayed > 0)
    .map(t => ({
      name: t.name.length > 10 ? t.name.slice(0, 10) + "…" : t.name,
      "Медали/игра": +((t.gold + t.silver + t.bronze) / t.gamesPlayed).toFixed(2),
    }))
    .sort((a, b) => b["Медали/игра"] - a["Медали/игра"])
    .slice(0, 8);

  // 12. Questions by season
  const questionsBySeason = useMemo(() => {
    const map: Record<string, number> = {};
    questions.forEach(q => {
      map[q.season] = (map[q.season] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([season, count]) => ({ season, Вопросы: count }));
  }, []);

  // 13. Active teams by games played
  const teamActivity = [...filteredTeams]
    .sort((a, b) => b.gamesPlayed - a.gamesPlayed)
    .slice(0, 8)
    .map(t => ({
      name: t.name.length > 10 ? t.name.slice(0, 10) + "…" : t.name,
      Игры: t.gamesPlayed,
    }));

  // 14. Win rate top teams
  const topWinRate = [...filteredTeams]
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 8)
    .map(t => ({
      name: t.name.length > 10 ? t.name.slice(0, 10) + "…" : t.name,
      "Win %": t.winRate,
    }));

  // Summary stats
  const totalCups = filteredTeams.reduce((s, t) => s + t.cups, 0);
  const totalGames = filteredTeams.reduce((s, t) => s + t.gamesPlayed, 0);
  const totalAnswers = filteredTeams.reduce((s, t) => s + t.correctAnswers, 0);
  const avgWinRate = filteredTeams.length
    ? +(filteredTeams.reduce((s, t) => s + t.winRate, 0) / filteredTeams.length).toFixed(1)
    : 0;

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <PageHeader
        title="Статистика"
        subtitle="Визуальный анализ результатов турниров и команд."
      />

      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Команд", value: filteredTeams.length },
          { label: "Кубки (всего)", value: totalCups },
          { label: "Игры (всего)", value: totalGames },
          { label: "Ср. Win %", value: `${avgWinRate}%` },
        ].map(s => (
          <GlassCard key={s.label} className="py-3 px-4 flex flex-col gap-0.5">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold text-foreground">{s.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Дивизион</p>
          <InlineChipFilter options={divisionOpts} selected={divs} onToggle={toggle(setDivs)} />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Сезон</p>
          <InlineChipFilter options={seasonOpts} selected={seasons} onToggle={toggle(setSeasons)} />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Тип турнира</p>
          <InlineChipFilter options={typeOpts} selected={types} onToggle={toggle(setTypes)} />
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {/* 1. Top by cups */}
        <ChartCard title="Топ команд по кубкам">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topByCups} layout="vertical" margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={tickStyle} />
              <YAxis type="category" dataKey="name" tick={tickStyle} width={72} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="Кубки" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 2. Top by correct answers */}
        <ChartCard title="Топ команд по правильным ответам">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topByAnswers} layout="vertical" margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={tickStyle} />
              <YAxis type="category" dataKey="name" tick={tickStyle} width={72} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="Ответы" fill={CHART_COLORS[1]} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 3. Tournaments by season */}
        <ChartCard title="Турниры по сезонам">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gamesBySeason} margin={{ left: -10, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="season" tick={tickStyle} />
              <YAxis tick={tickStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="Турниры" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 4. Questions by topic */}
        <ChartCard title="Вопросы по темам">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={questionsByTopic}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                innerRadius={28}
                paddingAngle={2}
              >
                {questionsByTopic.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: "10px" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 5. Medal distribution */}
        <ChartCard title="Распределение медалей">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={medalData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                innerRadius={28}
                paddingAngle={3}
              >
                {medalData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: "10px" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 6. Win rate by division */}
        <ChartCard title="Win % по дивизионам">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={winRateData} margin={{ left: -10, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="division" tick={tickStyle} />
              <YAxis tick={tickStyle} domain={[0, 100]} unit="%" />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "Win %"]} />
              <Bar dataKey="Win %" fill={CHART_COLORS[4]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 7. Question difficulty distribution */}
        <ChartCard title="Распределение сложности вопросов">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={difficultyData} margin={{ left: -10, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="difficulty" tick={tickStyle} />
              <YAxis tick={tickStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="Вопросы" radius={[4, 4, 0, 0]}>
                {difficultyData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={["oklch(0.65 0.18 140)", "oklch(0.7 0.17 100)", "oklch(0.72 0.18 70)", "oklch(0.65 0.2 40)", "oklch(0.6 0.22 20)"][i]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 8. Tournament type distribution */}
        <ChartCard title="Типы турниров">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={tournamentTypeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                innerRadius={0}
                paddingAngle={2}
              >
                {tournamentTypeData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: "10px" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 9. Average answers by division */}
        <ChartCard title="Средние правильные ответы за игру">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={avgAnswersData} margin={{ left: -10, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="group" tick={tickStyle} />
              <YAxis tick={tickStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="Ср. ответов" fill={CHART_COLORS[3]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 10. Active teams */}
        <ChartCard title="Самые активные команды (игры)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teamActivity} layout="vertical" margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={tickStyle} />
              <YAxis type="category" dataKey="name" tick={tickStyle} width={72} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="Игры" fill={CHART_COLORS[5]} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 11. Questions by season */}
        <ChartCard title="Вопросы по сезонам">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={questionsBySeason} margin={{ left: -10, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="season" tick={tickStyle} />
              <YAxis tick={tickStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="Вопросы" stroke={CHART_COLORS[6]} strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 12. Medal efficiency */}
        <ChartCard title="Медали за игру (эффективность)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={medalsPerGame} layout="vertical" margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={tickStyle} />
              <YAxis type="category" dataKey="name" tick={tickStyle} width={72} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="Медали/игра" fill={CHART_COLORS[7]} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 13. Top win rate */}
        <ChartCard title="Win % лучших команд">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topWinRate} layout="vertical" margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={tickStyle} domain={[0, 100]} unit="%" />
              <YAxis type="category" dataKey="name" tick={tickStyle} width={72} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "Win %"]} />
              <Bar dataKey="Win %" fill={CHART_COLORS[1]} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 14. Total correct answers per team (stacked insight) */}
        <ChartCard title="Соотношение ответов к играм" className="md:col-span-2 xl:col-span-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredTeams.slice(0, 6).map(t => ({
                name: t.name.length > 8 ? t.name.slice(0, 8) + "…" : t.name,
                "Ответы": t.correctAnswers,
                "Игры×10": t.gamesPlayed * 10,
              }))}
              margin={{ left: -10, right: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={tickStyle} />
              <YAxis tick={tickStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: "10px" }} />
              <Bar dataKey="Ответы" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Игры×10" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      {/* Total answers callout */}
      <GlassCard className="mt-5 py-3 px-5 flex items-center justify-between bg-primary/5">
        <span className="text-sm text-muted-foreground">Суммарно правильных ответов всеми командами</span>
        <span className="text-2xl font-bold text-primary">{totalAnswers.toLocaleString("ru")}</span>
      </GlassCard>
    </div>
  );
}
