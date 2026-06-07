"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { X, ZoomIn, Calendar, Trophy } from "lucide-react";
import { useStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { InlineChipFilter } from "@/components/ui/InlineChipFilter";
import type { GalleryItem } from "@/types";

const seasonOpts = [
  { value: "Все", label: "Все" },
  { value: "2026", label: "2026" },
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
];

const typeOpts = [
  { value: "Все", label: "Все" },
  { value: "Zakovat", label: "Zakovat" },
  { value: "Своя игра", label: "Своя игра" },
  { value: "Брейн-ринг", label: "Брейн-ринг" },
  { value: "Школьная лига", label: "Школьная лига" },
  { value: "Суперкубок", label: "Суперкубок" },
];

const teamOpts = [
  { value: "Все", label: "Все" },
  { value: "МЕГАС", label: "МЕГАС" },
  { value: "КОГИТАРЕ", label: "КОГИТАРЕ" },
  { value: "НЕЙРАЛИНК", label: "НЕЙРАЛИНК" },
  { value: "БИГБИКЛАБ", label: "БИГБИКЛАБ" },
  { value: "ЦЕЗАРЬ", label: "ЦЕЗАРЬ" },
];

function LightboxModal({ item, onClose, onPrev, onNext }: {
  item: GalleryItem;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/80 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
        >
          <X className="size-4" /> Закрыть
        </button>

        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/50">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>

        <div className="mt-3 glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
          {item.caption && <p className="text-xs text-muted-foreground mb-2">{item.caption}</p>}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="size-3" />{item.date}</span>
            <span className="flex items-center gap-1"><Trophy className="size-3" />{item.tournament}</span>
            {item.team && <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">{item.team}</span>}
          </div>
        </div>

        <div className="flex justify-between mt-3">
          <button
            onClick={onPrev}
            className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
          >
            ← Предыдущее
          </button>
          <button
            onClick={onNext}
            className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
          >
            Следующее →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const { gallery } = useStore();
  const [seasons, setSeasons] = useState(["Все"]);
  const [types, setTypes] = useState(["Все"]);
  const [teams, setTeams] = useState(["Все"]);
  const [search, setSearch] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
    return gallery.filter(item => {
      if (!seasons.includes("Все") && !seasons.includes(item.season)) return false;
      if (!types.includes("Все") && !types.includes(item.tournamentType)) return false;
      if (!teams.includes("Все") && (!item.team || !teams.includes(item.team))) return false;
      if (search && !item.title.toLowerCase().includes(search.toLowerCase()) &&
        !item.caption?.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [gallery, seasons, types, teams, search]);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevItem = () => setLightboxIndex(i => (i != null ? (i - 1 + filtered.length) % filtered.length : null));
  const nextItem = () => setLightboxIndex(i => (i != null ? (i + 1) % filtered.length : null));

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <PageHeader
        title="Галерея"
        subtitle="Фотоархив турниров, команд и знаковых моментов."
      />

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск по названию или описанию…"
          className="w-full sm:w-80 h-9 rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Сезон</p>
          <InlineChipFilter options={seasonOpts} selected={seasons} onToggle={toggle(setSeasons)} />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Тип турнира</p>
          <InlineChipFilter options={typeOpts} selected={types} onToggle={toggle(setTypes)} />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Команда</p>
          <InlineChipFilter options={teamOpts} selected={teams} onToggle={toggle(setTeams)} />
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground mb-4">{filtered.length} фото</p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <GlassCard className="text-center py-16">
          <p className="text-muted-foreground text-sm">Нет фото с выбранными фильтрами</p>
        </GlassCard>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              className="break-inside-avoid group cursor-pointer"
              onClick={() => openLightbox(idx)}
            >
              <GlassCard className="p-0 overflow-hidden hover:shadow-glass-lg transition-all duration-200">
                <div className="relative w-full aspect-video overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5">
                      <ZoomIn className="size-3.5 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-foreground line-clamp-2 mb-1">{item.title}</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-muted-foreground">{item.date}</span>
                    {item.team && (
                      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                        {item.team}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{item.tournament}</p>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <LightboxModal
          item={filtered[lightboxIndex]}
          onClose={closeLightbox}
          onPrev={prevItem}
          onNext={nextItem}
        />
      )}
    </div>
  );
}
