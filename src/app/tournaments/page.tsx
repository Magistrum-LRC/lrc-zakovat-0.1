"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { InlineChipFilter } from "@/components/ui/InlineChipFilter";
import { DivisionBadge, StatusBadge } from "@/components/ui/Badges";

const typeOpts = [
  { value: "Все", label: "Все" },
  { value: "Zakovat", label: "Zakovat" },
  { value: "Своя игра", label: "Своя игра" },
  { value: "Брейн-ринг", label: "Брейн-ринг" },
  { value: "Школьная лига", label: "Школьная лига" },
  { value: "Суперкубок", label: "Суперкубок" },
];
const seasonOpts = [
  { value: "Все", label: "Все" },
  { value: "2026", label: "2026" },
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
];
const statusOpts = [
  { value: "Все", label: "Все" },
  { value: "Предстоит", label: "Предстоит" },
  { value: "Идёт", label: "Идёт" },
  { value: "Завершён", label: "Завершён" },
];
const divisionOpts = [
  { value: "Все", label: "Все" },
  { value: "Премьер-лига", label: "Премьер-лига" },
  { value: "Первая лига", label: "Первая лига" },
];

export default function TournamentsPage() {
  const { tournaments } = useStore();
  const [types, setTypes] = useState(["Все"]);
  const [seasons, setSeasons] = useState(["Все"]);
  const [statuses, setStatuses] = useState(["Все"]);
  const [divs, setDivs] = useState(["Все"]);

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

  const filtered = useMemo(() => {
    return tournaments.filter(t => {
      if (!types.includes("Все") && !types.includes(t.type)) return false;
      if (!seasons.includes("Все") && !seasons.includes(t.season)) return false;
      if (!statuses.includes("Все") && !statuses.includes(t.status)) return false;
      if (!divs.includes("Все") && !divs.includes(t.division)) return false;
      return true;
    });
  }, [tournaments, types, seasons, statuses, divs]);

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <PageHeader
        title="Турниры"
        subtitle="Расписание и результаты турниров текущего и прошлых сезонов."
      />

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Тип</p>
          <InlineChipFilter options={typeOpts} selected={types} onToggle={toggle(setTypes)} />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Сезон</p>
          <InlineChipFilter options={seasonOpts} selected={seasons} onToggle={toggle(setSeasons)} />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Статус</p>
          <InlineChipFilter options={statusOpts} selected={statuses} onToggle={toggle(setStatuses)} />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Дивизион</p>
          <InlineChipFilter options={divisionOpts} selected={divs} onToggle={toggle(setDivs)} />
        </div>
      </div>

      {/* Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/20">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Название</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Тип</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Дата</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Статус</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Победитель</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Команд</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Сезон</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden xl:table-cell">Дивизион</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-muted-foreground text-sm">
                    Нет турниров с выбранными фильтрами
                  </td>
                </tr>
              ) : filtered.map(t => (
                <tr key={t.id} className="border-b border-border/40 hover:bg-accent/20 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-foreground">{t.title}</td>
                  <td className="px-5 py-3.5 text-muted-foreground hidden sm:table-cell">{t.type}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{t.date}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={t.status} /></td>
                  <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell">{t.winner || "—"}</td>
                  <td className="px-5 py-3.5 text-center text-muted-foreground hidden lg:table-cell">{t.teamsCount}</td>
                  <td className="px-5 py-3.5 text-center text-muted-foreground hidden lg:table-cell">{t.season}</td>
                  <td className="px-5 py-3.5 hidden xl:table-cell">
                    <DivisionBadge division={t.division as "Премьер-лига" | "Первая лига" | "Все"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
