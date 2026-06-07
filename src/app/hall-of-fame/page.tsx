"use client";

import Image from "next/image";
import { Trophy, Star, Medal } from "lucide-react";
import { useStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { MedalSummary } from "@/components/ui/Badges";

const recordColors: Record<string, string> = {
  "Первый чемпион": "bg-amber-100 text-amber-700 border-amber-200",
  "Двукратный чемпион": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Новый чемпион": "bg-blue-100 text-blue-700 border-blue-200",
  "Тройная корона": "bg-orange-100 text-orange-700 border-orange-200",
  "Текущий лидер": "bg-green-100 text-green-700 border-green-200",
};

export default function HallOfFamePage() {
  const { hallOfFame } = useStore();
  const sorted = [...hallOfFame].sort((a, b) => b.year - a.year);

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <PageHeader
        title="Зал славы"
        subtitle="Чемпионы и легенды интеллектуальных игр по сезонам."
      />

      {/* Header stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <GlassCard className="py-3 px-4 text-center">
          <p className="text-2xl font-bold text-primary">5</p>
          <p className="text-xs text-muted-foreground mt-0.5">Сезонов</p>
        </GlassCard>
        <GlassCard className="py-3 px-4 text-center">
          <p className="text-2xl font-bold text-amber-600">2</p>
          <p className="text-xs text-muted-foreground mt-0.5">Команды-чемпионы</p>
        </GlassCard>
        <GlassCard className="py-3 px-4 text-center col-span-2 sm:col-span-1">
          <p className="text-2xl font-bold text-foreground">4×</p>
          <p className="text-xs text-muted-foreground mt-0.5">МЕГАС — рекорд побед</p>
        </GlassCard>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/40 to-transparent hidden sm:block" />

        <div className="space-y-8">
          {sorted.map((entry, idx) => {
            const isMegas = entry.championTeam === "МЕГАС";
            const isLatest = idx === 0;

            return (
              <div key={entry.id} className="relative sm:pl-16">
                {/* Timeline dot */}
                <div className="absolute left-3.5 top-6 hidden sm:flex size-5 rounded-full border-2 border-primary bg-background items-center justify-center">
                  <div className={`size-2 rounded-full ${isLatest ? "bg-primary animate-pulse" : "bg-primary/60"}`} />
                </div>

                {/* Year label */}
                <div className="hidden sm:flex absolute left-0 top-4 -translate-x-1/2 ml-6">
                </div>

                <GlassCard className={`${isLatest ? "border-primary/30 bg-primary/5" : ""} hover:shadow-glass-lg transition-all duration-200`}>
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Photo */}
                    <div className="w-full lg:w-48 xl:w-56 flex-shrink-0">
                      <div className="relative w-full aspect-video lg:aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/20">
                        <Image
                          src={entry.teamPhoto ?? "https://picsum.photos/seed/placeholder/600/400"}
                          alt={entry.championTeam}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 224px"
                        />
                        {/* Year overlay */}
                        <div className="absolute top-2 left-2">
                          <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
                            {entry.year}
                          </span>
                        </div>
                        {isLatest && (
                          <div className="absolute top-2 right-2">
                            <span className="bg-green-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Идёт
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Trophy className="size-4 text-amber-500" />
                            <h2 className="text-lg font-bold text-foreground">{entry.championTeam}</h2>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${(entry.recordType && recordColors[entry.recordType]) || "bg-muted text-muted-foreground border-border"}`}>
                              {entry.recordType}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Капитан: <span className="text-foreground font-medium">{entry.captain}</span>
                            {" · "}Сезон {entry.season}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{entry.description}</p>

                      {/* Medal summary */}
                      <div className="mb-3">
                        <MedalSummary cups={entry.cups} gold={entry.gold} silver={entry.silver} bronze={entry.bronze} size="default" />
                      </div>

                      {/* Achievements */}
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                          <Star className="size-3 text-amber-500" />
                          Достижения сезона
                        </p>
                        <ul className="space-y-1">
                          {entry.achievements.map((a, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <span className="mt-0.5 size-1.5 rounded-full bg-primary/60 flex-shrink-0 mt-1.5" />
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Best result badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                        <Medal className="size-3 text-amber-600" />
                        <span className="text-xs font-medium text-amber-700">{entry.bestResult}</span>
                      </div>

                      {/* Players */}
                      <div className="mt-3 pt-3 border-t border-border/60">
                        <p className="text-xs text-muted-foreground mb-1.5">Состав ({entry.players.length} игроков):</p>
                        <div className="flex flex-wrap gap-1.5">
                          {entry.players.map(p => (
                            <span
                              key={p}
                              className={`text-[11px] px-2 py-0.5 rounded-full border ${p === entry.captain ? "bg-primary/10 text-primary border-primary/20 font-medium" : "bg-muted text-muted-foreground border-transparent"}`}
                            >
                              {p}
                              {p === entry.captain && " ★"}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer call to action */}
      <GlassCard className="mt-8 py-4 px-6 text-center bg-gradient-to-r from-primary/5 via-transparent to-primary/5 border-primary/20">
        <p className="text-sm font-semibold text-foreground mb-1">Будь следующим в Зале Славы</p>
        <p className="text-xs text-muted-foreground">Регистрируйтесь на турниры и пишите историю вместе с нами</p>
      </GlassCard>
    </div>
  );
}
