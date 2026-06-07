"use client";

import { useState } from "react";
import { Users, Trophy, Gamepad2, ChartBar as BarChart2, BookOpen, Image, Star, Download, Send, Database, Plus, Trash2, Save, RefreshCw, Copy, CheckCheck, X, CreditCard as Edit3 } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Team, Tournament, Game, GameResult, Question, GalleryItem, HallOfFameEntry } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";

const TABS = [
  { id: "teams", label: "Команды", icon: Users },
  { id: "tournaments", label: "Турниры", icon: Trophy },
  { id: "games", label: "Игры", icon: Gamepad2 },
  { id: "results", label: "Результаты", icon: BarChart2 },
  { id: "questions", label: "Вопросы", icon: BookOpen },
  { id: "gallery", label: "Галерея", icon: Image },
  { id: "hof", label: "Зал славы", icon: Star },
  { id: "telegram", label: "Telegram пост", icon: Send },
] as const;

type TabId = typeof TABS[number]["id"];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">{children}</h3>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
      <label className="text-xs text-muted-foreground font-medium sm:text-right">{label}</label>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}

const inputCls = "w-full h-8 rounded-md border border-border bg-background px-3 text-sm placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";
const selectCls = `${inputCls} cursor-pointer`;
const textareaCls = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none";

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ======================== TEAMS TAB ======================== */
function TeamsTab() {
  const { teams, addTeam, updateTeam, deleteTeam } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{
    name: string;
    division: Team["division"];
    gradeGroup: Team["gradeGroup"];
    captain: string;
    players: string;
    photoUrl: string;
    gamesPlayed: number;
    cups: number;
    gold: number;
    silver: number;
    bronze: number;
    correctAnswers: number;
    winRate: number;
    bestResult: string;
    active: boolean;
  }>({
    name: "",
    division: "Премьер-лига",
    gradeGroup: "9-11",
    captain: "",
    players: "",
    photoUrl: "",
    gamesPlayed: 0,
    cups: 0,
    gold: 0,
    silver: 0,
    bronze: 0,
    correctAnswers: 0,
    winRate: 0,
    bestResult: "",
    active: true,
  });

  const resetForm = () => setForm({
    name: "", division: "Премьер-лига", gradeGroup: "9-11", captain: "", players: "",
    photoUrl: "", gamesPlayed: 0, cups: 0, gold: 0, silver: 0, bronze: 0,
    correctAnswers: 0, winRate: 0, bestResult: "", active: true,
  });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    addTeam({
      id: generateId(),
      name: form.name,
      division: form.division,
      gradeGroup: form.gradeGroup,
      captain: form.captain,
      players: form.players.split(",").map(p => p.trim()).filter(Boolean),
      photoUrl: form.photoUrl || undefined,
      gamesPlayed: form.gamesPlayed,
      cups: form.cups,
      gold: form.gold,
      silver: form.silver,
      bronze: form.bronze,
      correctAnswers: form.correctAnswers,
      winRate: form.winRate,
      bestResult: form.bestResult,
      season: "2026",
      tournamentTypes: [],
      active: form.active,
    });
    resetForm();
  };

  const startEdit = (team: Team) => {
    setEditingId(team.id);
    setForm({
      name: team.name,
      division: team.division,
      gradeGroup: team.gradeGroup,
      captain: team.captain,
      players: team.players.join(", "),
      photoUrl: team.photoUrl || "",
      gamesPlayed: team.gamesPlayed,
      cups: team.cups,
      gold: team.gold,
      silver: team.silver,
      bronze: team.bronze,
      correctAnswers: team.correctAnswers,
      winRate: team.winRate,
      bestResult: team.bestResult,
      active: team.active,
    });
  };

  const handleSave = () => {
    if (!editingId || !form.name.trim()) return;
    updateTeam(editingId, {
      name: form.name,
      division: form.division,
      gradeGroup: form.gradeGroup,
      captain: form.captain,
      players: form.players.split(",").map(p => p.trim()).filter(Boolean),
      photoUrl: form.photoUrl || undefined,
      gamesPlayed: form.gamesPlayed,
      cups: form.cups,
      gold: form.gold,
      silver: form.silver,
      bronze: form.bronze,
      correctAnswers: form.correctAnswers,
      winRate: form.winRate,
      bestResult: form.bestResult,
      active: form.active,
    });
    setEditingId(null);
    resetForm();
  };

  const handleCancel = () => {
    setEditingId(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <SectionLabel>{editingId ? "Редактировать команду" : "Добавить команду"}</SectionLabel>
        <div className="space-y-3 max-w-lg">
          <FieldRow label="Название">
            <input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="МЕГАС" />
          </FieldRow>
          <FieldRow label="Дивизион">
            <select className={selectCls} value={form.division} onChange={e => setForm(f => ({ ...f, division: e.target.value as Team["division"] }))}>
              <option>Премьер-лига</option>
              <option>Первая лига</option>
            </select>
          </FieldRow>
          <FieldRow label="Классы">
            <select className={selectCls} value={form.gradeGroup} onChange={e => setForm(f => ({ ...f, gradeGroup: e.target.value as Team["gradeGroup"] }))}>
              <option value="9-11">9–11 классы</option>
              <option value="8-и-ниже">8 класс и ниже</option>
            </select>
          </FieldRow>
          <FieldRow label="Капитан">
            <input className={inputCls} value={form.captain} onChange={e => setForm(f => ({ ...f, captain: e.target.value }))} placeholder="Иван Иванов" />
          </FieldRow>
          <FieldRow label="Игроки (через запятую)">
            <input className={inputCls} value={form.players} onChange={e => setForm(f => ({ ...f, players: e.target.value }))} placeholder="Иван, Пётр, Мария" />
          </FieldRow>
          <FieldRow label="URL фото">
            <input className={inputCls} value={form.photoUrl} onChange={e => setForm(f => ({ ...f, photoUrl: e.target.value }))} placeholder="https://..." />
          </FieldRow>
          <div className="grid grid-cols-3 gap-2">
            <FieldRow label="Игры">
              <input type="number" className={inputCls} value={form.gamesPlayed} onChange={e => setForm(f => ({ ...f, gamesPlayed: parseInt(e.target.value) || 0 }))} />
            </FieldRow>
            <FieldRow label="Кубки">
              <input type="number" className={inputCls} value={form.cups} onChange={e => setForm(f => ({ ...f, cups: parseInt(e.target.value) || 0 }))} />
            </FieldRow>
            <FieldRow label="Золото">
              <input type="number" className={inputCls} value={form.gold} onChange={e => setForm(f => ({ ...f, gold: parseInt(e.target.value) || 0 }))} />
            </FieldRow>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <FieldRow label="Серебро">
              <input type="number" className={inputCls} value={form.silver} onChange={e => setForm(f => ({ ...f, silver: parseInt(e.target.value) || 0 }))} />
            </FieldRow>
            <FieldRow label="Бронза">
              <input type="number" className={inputCls} value={form.bronze} onChange={e => setForm(f => ({ ...f, bronze: parseInt(e.target.value) || 0 }))} />
            </FieldRow>
            <FieldRow label="Ответы">
              <input type="number" className={inputCls} value={form.correctAnswers} onChange={e => setForm(f => ({ ...f, correctAnswers: parseInt(e.target.value) || 0 }))} />
            </FieldRow>
          </div>
          <FieldRow label="Win %">
            <input type="number" step="0.1" className={inputCls} value={form.winRate} onChange={e => setForm(f => ({ ...f, winRate: parseFloat(e.target.value) || 0 }))} />
          </FieldRow>
          <FieldRow label="Лучший результат">
            <input className={inputCls} value={form.bestResult} onChange={e => setForm(f => ({ ...f, bestResult: e.target.value }))} placeholder="1 место — Суперкубок 2025" />
          </FieldRow>
          <div className="flex gap-2 pt-2">
            {editingId ? (
              <>
                <button onClick={handleSave} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Save className="size-4" /> Сохранить
                </button>
                <button onClick={handleCancel} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <X className="size-4" /> Отмена
                </button>
              </>
            ) : (
              <button onClick={handleAdd} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Plus className="size-4" /> Добавить команду
              </button>
            )}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-border/60 flex items-center justify-between">
          <SectionLabel>Команды ({teams.length})</SectionLabel>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-muted/10">
                <th className="text-left px-5 py-2.5 text-xs text-muted-foreground font-semibold">Команда</th>
                <th className="text-left px-5 py-2.5 text-xs text-muted-foreground font-semibold hidden md:table-cell">Дивизион</th>
                <th className="text-left px-5 py-2.5 text-xs text-muted-foreground font-semibold hidden sm:table-cell">Капитан</th>
                <th className="text-center px-5 py-2.5 text-xs text-muted-foreground font-semibold">Кубки</th>
                <th className="text-center px-5 py-2.5 text-xs text-muted-foreground font-semibold">Ответы</th>
                <th className="px-5 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {teams.map(t => (
                <tr key={t.id} className="border-b border-border/40 hover:bg-accent/20 transition-colors">
                  <td className="px-5 py-2.5 font-medium text-foreground">{t.name}</td>
                  <td className="px-5 py-2.5 text-muted-foreground hidden md:table-cell">{t.division}</td>
                  <td className="px-5 py-2.5 text-muted-foreground hidden sm:table-cell">{t.captain}</td>
                  <td className="px-5 py-2.5 text-center text-foreground font-semibold">{t.cups}</td>
                  <td className="px-5 py-2.5 text-center text-muted-foreground">{t.correctAnswers}</td>
                  <td className="px-5 py-2.5 text-right flex gap-2 justify-end">
                    <button onClick={() => startEdit(t)} className="text-muted-foreground hover:text-primary transition-colors">
                      <Edit3 className="size-3.5" />
                    </button>
                    <button onClick={() => deleteTeam(t.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="size-3.5" />
                    </button>
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

/* ======================== TOURNAMENTS TAB ======================== */
function TournamentsTab() {
  const { tournaments, addTournament, updateTournament, deleteTournament } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    type: "Zakovat" as Tournament["type"],
    date: "",
    status: "Предстоит" as Tournament["status"],
    winner: "",
    teamsCount: 0,
    season: "2026" as Tournament["season"],
    division: "Премьер-лига" as Tournament["division"],
    description: "",
  });

  const resetForm = () => setForm({
    title: "", type: "Zakovat", date: "", status: "Предстоит", winner: "",
    teamsCount: 0, season: "2026", division: "Премьер-лига", description: "",
  });

  const handleAdd = () => {
    if (!form.title.trim()) return;
    addTournament({
      id: generateId(),
      title: form.title,
      type: form.type,
      date: form.date,
      status: form.status,
      winner: form.winner || undefined,
      teamsCount: form.teamsCount,
      season: form.season,
      division: form.division,
      description: form.description || undefined,
    });
    resetForm();
  };

  const startEdit = (t: Tournament) => {
    setEditingId(t.id);
    setForm({
      title: t.title,
      type: t.type,
      date: t.date,
      status: t.status,
      winner: t.winner || "",
      teamsCount: t.teamsCount,
      season: t.season,
      division: t.division === "Все" ? "Премьер-лига" : t.division,
      description: t.description || "",
    });
  };

  const handleSave = () => {
    if (!editingId || !form.title.trim()) return;
    updateTournament(editingId, {
      title: form.title,
      type: form.type,
      date: form.date,
      status: form.status,
      winner: form.winner || undefined,
      teamsCount: form.teamsCount,
      season: form.season,
      division: form.division,
      description: form.description || undefined,
    });
    setEditingId(null);
    resetForm();
  };

  const handleCancel = () => {
    setEditingId(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <SectionLabel>{editingId ? "Редактировать турнир" : "Добавить турнир"}</SectionLabel>
        <div className="space-y-3 max-w-lg">
          <FieldRow label="Название">
            <input className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Zakovat 2026" />
          </FieldRow>
          <FieldRow label="Тип">
            <select className={selectCls} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as Tournament["type"] }))}>
              {["Zakovat", "Своя игра", "Брейн-ринг", "Школьная лига", "Суперкубок"].map(t => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </FieldRow>
          <FieldRow label="Дата">
            <input className={inputCls} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} placeholder="12.10.2026" />
          </FieldRow>
          <FieldRow label="Статус">
            <select className={selectCls} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Tournament["status"] }))}>
              {["Предстоит", "Идёт", "Завершён"].map(s => <option key={s}>{s}</option>)}
            </select>
          </FieldRow>
          <FieldRow label="Победитель">
            <input className={inputCls} value={form.winner} onChange={e => setForm(f => ({ ...f, winner: e.target.value }))} placeholder="МЕГАС" />
          </FieldRow>
          <FieldRow label="Кол-во команд">
            <input type="number" className={inputCls} value={form.teamsCount} onChange={e => setForm(f => ({ ...f, teamsCount: parseInt(e.target.value) || 0 }))} />
          </FieldRow>
          <FieldRow label="Сезон">
            <select className={selectCls} value={form.season} onChange={e => setForm(f => ({ ...f, season: e.target.value as Tournament["season"] }))}>
              {["2022", "2023", "2024", "2025", "2026"].map(s => <option key={s}>{s}</option>)}
            </select>
          </FieldRow>
          <FieldRow label="Дивизион">
            <select className={selectCls} value={form.division} onChange={e => setForm(f => ({ ...f, division: e.target.value as Tournament["division"] }))}>
              <option>Премьер-лига</option>
              <option>Первая лига</option>
              <option>Все</option>
            </select>
          </FieldRow>
          <FieldRow label="Описание">
            <textarea className={textareaCls} rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </FieldRow>
          <div className="flex gap-2 pt-2">
            {editingId ? (
              <>
                <button onClick={handleSave} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Save className="size-4" /> Сохранить
                </button>
                <button onClick={handleCancel} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <X className="size-4" /> Отмена
                </button>
              </>
            ) : (
              <button onClick={handleAdd} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Plus className="size-4" /> Добавить турнир
              </button>
            )}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-border/60">
          <SectionLabel>Турниры ({tournaments.length})</SectionLabel>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-muted/10">
                <th className="text-left px-5 py-2.5 text-xs text-muted-foreground font-semibold">Название</th>
                <th className="text-left px-5 py-2.5 text-xs text-muted-foreground font-semibold hidden sm:table-cell">Тип</th>
                <th className="text-left px-5 py-2.5 text-xs text-muted-foreground font-semibold">Дата</th>
                <th className="text-left px-5 py-2.5 text-xs text-muted-foreground font-semibold hidden md:table-cell">Статус</th>
                <th className="px-5 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {tournaments.map(t => (
                <tr key={t.id} className="border-b border-border/40 hover:bg-accent/20 transition-colors">
                  <td className="px-5 py-2.5 font-medium text-foreground">{t.title}</td>
                  <td className="px-5 py-2.5 text-muted-foreground hidden sm:table-cell">{t.type}</td>
                  <td className="px-5 py-2.5 text-muted-foreground">{t.date}</td>
                  <td className="px-5 py-2.5 hidden md:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${t.status === "Идёт" ? "bg-green-100 text-green-700" : t.status === "Предстоит" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-right flex gap-2 justify-end">
                    <button onClick={() => startEdit(t)} className="text-muted-foreground hover:text-primary transition-colors">
                      <Edit3 className="size-3.5" />
                    </button>
                    <button onClick={() => deleteTournament(t.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="size-3.5" />
                    </button>
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

/* ======================== GAMES TAB ======================== */
function GamesTab() {
  const { games, tournaments, addGame, updateGame, deleteGame } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    tournamentId: "",
    date: "",
    season: "2026" as Game["season"],
    round: "",
    status: "Предстоит" as Game["status"],
    participatingTeams: "",
  });

  const resetForm = () => setForm({
    title: "", tournamentId: "", date: "", season: "2026", round: "",
    status: "Предстоит", participatingTeams: "",
  });

  const selectedTournament = tournaments.find(t => t.id === form.tournamentId);

  const handleAdd = () => {
    if (!form.title.trim() || !form.tournamentId) return;
    addGame({
      id: generateId(),
      title: form.title,
      tournamentId: form.tournamentId,
      tournamentTitle: selectedTournament?.title || "",
      date: form.date,
      season: form.season,
      round: form.round,
      status: form.status,
      participatingTeams: form.participatingTeams.split(",").map(p => p.trim()).filter(Boolean),
    });
    resetForm();
  };

  const startEdit = (g: Game) => {
    setEditingId(g.id);
    setForm({
      title: g.title,
      tournamentId: g.tournamentId,
      date: g.date,
      season: g.season,
      round: g.round,
      status: g.status,
      participatingTeams: g.participatingTeams.join(", "),
    });
  };

  const handleSave = () => {
    if (!editingId || !form.title.trim() || !form.tournamentId) return;
    updateGame(editingId, {
      title: form.title,
      tournamentId: form.tournamentId,
      tournamentTitle: selectedTournament?.title || "",
      date: form.date,
      season: form.season,
      round: form.round,
      status: form.status,
      participatingTeams: form.participatingTeams.split(",").map(p => p.trim()).filter(Boolean),
    });
    setEditingId(null);
    resetForm();
  };

  const handleCancel = () => {
    setEditingId(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <SectionLabel>{editingId ? "Редактировать игру" : "Добавить игру"}</SectionLabel>
        <div className="space-y-3 max-w-lg">
          <FieldRow label="Название">
            <input className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Финал" />
          </FieldRow>
          <FieldRow label="Турнир">
            <select className={selectCls} value={form.tournamentId} onChange={e => setForm(f => ({ ...f, tournamentId: e.target.value }))}>
              <option value="">— выберите —</option>
              {tournaments.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </FieldRow>
          <FieldRow label="Дата">
            <input className={inputCls} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} placeholder="12.10.2026" />
          </FieldRow>
          <FieldRow label="Тур">
            <input className={inputCls} value={form.round} onChange={e => setForm(f => ({ ...f, round: e.target.value }))} placeholder="Финал" />
          </FieldRow>
          <FieldRow label="Статус">
            <select className={selectCls} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Game["status"] }))}>
              {["Предстоит", "Идёт", "Завершён"].map(s => <option key={s}>{s}</option>)}
            </select>
          </FieldRow>
          <FieldRow label="Команды (ID через запятую)">
            <input className={inputCls} value={form.participatingTeams} onChange={e => setForm(f => ({ ...f, participatingTeams: e.target.value }))} placeholder="megas, kogitare" />
          </FieldRow>
          <div className="flex gap-2 pt-2">
            {editingId ? (
              <>
                <button onClick={handleSave} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Save className="size-4" /> Сохранить
                </button>
                <button onClick={handleCancel} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <X className="size-4" /> Отмена
                </button>
              </>
            ) : (
              <button onClick={handleAdd} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Plus className="size-4" /> Добавить игру
              </button>
            )}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-border/60">
          <SectionLabel>Игры ({games.length})</SectionLabel>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-muted/10">
                <th className="text-left px-5 py-2.5 text-xs text-muted-foreground font-semibold">Название</th>
                <th className="text-left px-5 py-2.5 text-xs text-muted-foreground font-semibold hidden sm:table-cell">Турнир</th>
                <th className="text-left px-5 py-2.5 text-xs text-muted-foreground font-semibold">Дата</th>
                <th className="text-center px-5 py-2.5 text-xs text-muted-foreground font-semibold hidden md:table-cell">Тур</th>
                <th className="px-5 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {games.map(g => (
                <tr key={g.id} className="border-b border-border/40 hover:bg-accent/20 transition-colors">
                  <td className="px-5 py-2.5 font-medium text-foreground">{g.title}</td>
                  <td className="px-5 py-2.5 text-muted-foreground hidden sm:table-cell">{g.tournamentTitle}</td>
                  <td className="px-5 py-2.5 text-muted-foreground">{g.date}</td>
                  <td className="px-5 py-2.5 text-center text-muted-foreground hidden md:table-cell">{g.round}</td>
                  <td className="px-5 py-2.5 text-right flex gap-2 justify-end">
                    <button onClick={() => startEdit(g)} className="text-muted-foreground hover:text-primary transition-colors">
                      <Edit3 className="size-3.5" />
                    </button>
                    <button onClick={() => deleteGame(g.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="size-3.5" />
                    </button>
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

/* ======================== RESULTS TAB ======================== */
function ResultsTab() {
  const { results, teams, tournaments, addResult, updateResult, deleteResult } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    gameId: "",
    tournamentId: "",
    teamId: "",
    date: "",
    season: "2026" as GameResult["season"],
    tournamentType: "Zakovat" as GameResult["tournamentType"],
    division: "Премьер-лига" as GameResult["division"],
    place: 1,
    cups: 0,
    gold: 0,
    silver: 0,
    bronze: 0,
    correctAnswers: 0,
    notes: "",
  });

  const resetForm = () => setForm({
    gameId: "", tournamentId: "", teamId: "", date: "", season: "2026",
    tournamentType: "Zakovat", division: "Премьер-лига", place: 1,
    cups: 0, gold: 0, silver: 0, bronze: 0, correctAnswers: 0, notes: "",
  });

  const selectedTeam = teams.find(t => t.id === form.teamId);

  const handleAdd = () => {
    if (!form.teamId || !form.tournamentId) return;
    addResult({
      id: generateId(),
      gameId: form.gameId || generateId(),
      tournamentId: form.tournamentId,
      teamId: form.teamId,
      teamName: selectedTeam?.name || "",
      date: form.date,
      season: form.season,
      tournamentType: form.tournamentType,
      division: form.division,
      place: form.place,
      cups: form.cups,
      gold: form.gold,
      silver: form.silver,
      bronze: form.bronze,
      correctAnswers: form.correctAnswers,
      notes: form.notes || undefined,
    });
    resetForm();
  };

  const startEdit = (r: GameResult) => {
    setEditingId(r.id);
    setForm({
      gameId: r.gameId,
      tournamentId: r.tournamentId,
      teamId: r.teamId,
      date: r.date,
      season: r.season,
      tournamentType: r.tournamentType,
      division: r.division,
      place: r.place,
      cups: r.cups,
      gold: r.gold,
      silver: r.silver,
      bronze: r.bronze,
      correctAnswers: r.correctAnswers,
      notes: r.notes || "",
    });
  };

  const handleSave = () => {
    if (!editingId || !form.teamId || !form.tournamentId) return;
    updateResult(editingId, {
      gameId: form.gameId,
      tournamentId: form.tournamentId,
      teamId: form.teamId,
      teamName: selectedTeam?.name || "",
      date: form.date,
      season: form.season,
      tournamentType: form.tournamentType,
      division: form.division,
      place: form.place,
      cups: form.cups,
      gold: form.gold,
      silver: form.silver,
      bronze: form.bronze,
      correctAnswers: form.correctAnswers,
      notes: form.notes || undefined,
    });
    setEditingId(null);
    resetForm();
  };

  const handleCancel = () => {
    setEditingId(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <SectionLabel>{editingId ? "Редактировать результат" : "Добавить результат"}</SectionLabel>
        <div className="space-y-3 max-w-lg">
          <FieldRow label="Команда">
            <select className={selectCls} value={form.teamId} onChange={e => setForm(f => ({ ...f, teamId: e.target.value }))}>
              <option value="">— выберите —</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </FieldRow>
          <FieldRow label="Турнир">
            <select className={selectCls} value={form.tournamentId} onChange={e => setForm(f => ({ ...f, tournamentId: e.target.value }))}>
              <option value="">— выберите —</option>
              {tournaments.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </FieldRow>
          <FieldRow label="Дата">
            <input className={inputCls} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} placeholder="12.10.2026" />
          </FieldRow>
          <FieldRow label="Тип турнира">
            <select className={selectCls} value={form.tournamentType} onChange={e => setForm(f => ({ ...f, tournamentType: e.target.value as GameResult["tournamentType"] }))}>
              {["Zakovat", "Своя игра", "Брейн-ринг", "Школьная лига", "Суперкубок"].map(t => <option key={t}>{t}</option>)}
            </select>
          </FieldRow>
          <FieldRow label="Место">
            <input type="number" className={inputCls} value={form.place} onChange={e => setForm(f => ({ ...f, place: parseInt(e.target.value) || 1 }))} min={1} />
          </FieldRow>
          <div className="grid grid-cols-2 gap-2">
            <FieldRow label="Кубки">
              <input type="number" className={inputCls} value={form.cups} onChange={e => setForm(f => ({ ...f, cups: parseInt(e.target.value) || 0 }))} />
            </FieldRow>
            <FieldRow label="Золото">
              <input type="number" className={inputCls} value={form.gold} onChange={e => setForm(f => ({ ...f, gold: parseInt(e.target.value) || 0 }))} />
            </FieldRow>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <FieldRow label="Серебро">
              <input type="number" className={inputCls} value={form.silver} onChange={e => setForm(f => ({ ...f, silver: parseInt(e.target.value) || 0 }))} />
            </FieldRow>
            <FieldRow label="Бронза">
              <input type="number" className={inputCls} value={form.bronze} onChange={e => setForm(f => ({ ...f, bronze: parseInt(e.target.value) || 0 }))} />
            </FieldRow>
          </div>
          <FieldRow label="Прав. ответы">
            <input type="number" className={inputCls} value={form.correctAnswers} onChange={e => setForm(f => ({ ...f, correctAnswers: parseInt(e.target.value) || 0 }))} />
          </FieldRow>
          <div className="flex gap-2 pt-2">
            {editingId ? (
              <>
                <button onClick={handleSave} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Save className="size-4" /> Сохранить
                </button>
                <button onClick={handleCancel} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <X className="size-4" /> Отмена
                </button>
              </>
            ) : (
              <button onClick={handleAdd} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Plus className="size-4" /> Добавить результат
              </button>
            )}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-border/60">
          <SectionLabel>Результаты ({results.length})</SectionLabel>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-muted/10">
                <th className="text-left px-5 py-2.5 text-xs text-muted-foreground font-semibold">Команда</th>
                <th className="text-left px-5 py-2.5 text-xs text-muted-foreground font-semibold hidden sm:table-cell">Турнир</th>
                <th className="text-center px-5 py-2.5 text-xs text-muted-foreground font-semibold">Место</th>
                <th className="text-center px-5 py-2.5 text-xs text-muted-foreground font-semibold">Ответы</th>
                <th className="px-5 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {results.slice(0, 20).map(r => (
                <tr key={r.id} className="border-b border-border/40 hover:bg-accent/20 transition-colors">
                  <td className="px-5 py-2.5 text-foreground">{r.teamName}</td>
                  <td className="px-5 py-2.5 text-muted-foreground hidden sm:table-cell">{r.tournamentType}</td>
                  <td className="px-5 py-2.5 text-center font-semibold">{r.place === 1 ? "1" : r.place}</td>
                  <td className="px-5 py-2.5 text-center text-foreground">{r.correctAnswers}</td>
                  <td className="px-5 py-2.5 text-right flex gap-2 justify-end">
                    <button onClick={() => startEdit(r)} className="text-muted-foreground hover:text-primary transition-colors">
                      <Edit3 className="size-3.5" />
                    </button>
                    <button onClick={() => deleteResult(r.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {results.length > 20 && (
            <div className="px-5 py-3 text-center text-xs text-muted-foreground border-t border-border/40">
              Показаны 20 из {results.length} записей
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

/* ======================== QUESTIONS TAB ======================== */
function QuestionsTab() {
  const { questions, addQuestion, updateQuestion, deleteQuestion } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    number: 1,
    text: "",
    answer: "",
    topic: "История" as Question["topic"],
    difficulty: 3 as Question["difficulty"],
    tournament: "",
    tournamentType: "Zakovat" as Question["tournamentType"],
    game: "",
    season: "2026" as Question["season"],
    date: "",
    explanation: "",
  });

  const resetForm = () => setForm({
    number: 1, text: "", answer: "", topic: "История", difficulty: 3,
    tournament: "", tournamentType: "Zakovat", game: "", season: "2026",
    date: "", explanation: "",
  });

  const handleAdd = () => {
    if (!form.text.trim() || !form.answer.trim()) return;
    addQuestion({
      id: generateId(),
      number: form.number,
      text: form.text,
      answer: form.answer,
      topic: form.topic,
      difficulty: form.difficulty,
      tournament: form.tournament,
      tournamentType: form.tournamentType,
      game: form.game,
      season: form.season,
      date: form.date,
      explanation: form.explanation || undefined,
    });
    resetForm();
  };

  const startEdit = (q: Question) => {
    setEditingId(q.id);
    setForm({
      number: q.number,
      text: q.text,
      answer: q.answer,
      topic: q.topic,
      difficulty: q.difficulty,
      tournament: q.tournament,
      tournamentType: q.tournamentType,
      game: q.game,
      season: q.season,
      date: q.date,
      explanation: q.explanation || "",
    });
  };

  const handleSave = () => {
    if (!editingId || !form.text.trim() || !form.answer.trim()) return;
    updateQuestion(editingId, {
      number: form.number,
      text: form.text,
      answer: form.answer,
      topic: form.topic,
      difficulty: form.difficulty,
      tournament: form.tournament,
      tournamentType: form.tournamentType,
      game: form.game,
      season: form.season,
      date: form.date,
      explanation: form.explanation || undefined,
    });
    setEditingId(null);
    resetForm();
  };

  const handleCancel = () => {
    setEditingId(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <SectionLabel>{editingId ? "Редактировать вопрос" : "Добавить вопрос"}</SectionLabel>
        <div className="space-y-3 max-w-lg">
          <FieldRow label="Номер">
            <input type="number" className={inputCls} value={form.number} onChange={e => setForm(f => ({ ...f, number: parseInt(e.target.value) || 1 }))} />
          </FieldRow>
          <FieldRow label="Вопрос">
            <textarea className={textareaCls} rows={3} value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} placeholder="Текст вопроса..." />
          </FieldRow>
          <FieldRow label="Ответ">
            <input className={inputCls} value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} placeholder="Правильный ответ" />
          </FieldRow>
          <FieldRow label="Тема">
            <select className={selectCls} value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value as Question["topic"] }))}>
              {["История", "Игры", "Математика", "Философия", "Химия", "Литература", "Технологии", "Другое"].map(t => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </FieldRow>
          <FieldRow label="Сложность">
            <select className={selectCls} value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: parseInt(e.target.value) as Question["difficulty"] }))}>
              {[1, 2, 3, 4, 5].map(d => <option key={d} value={d}>{d}/5</option>)}
            </select>
          </FieldRow>
          <FieldRow label="Турнир">
            <input className={inputCls} value={form.tournament} onChange={e => setForm(f => ({ ...f, tournament: e.target.value }))} placeholder="Zakovat 2026" />
          </FieldRow>
          <FieldRow label="Тип турнира">
            <select className={selectCls} value={form.tournamentType} onChange={e => setForm(f => ({ ...f, tournamentType: e.target.value as Question["tournamentType"] }))}>
              {["Zakovat", "Своя игра", "Брейн-ринг", "Школьная лига", "Суперкубок"].map(t => <option key={t}>{t}</option>)}
            </select>
          </FieldRow>
          <FieldRow label="Дата">
            <input className={inputCls} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} placeholder="12.10.2026" />
          </FieldRow>
          <FieldRow label="Объяснение">
            <textarea className={textareaCls} rows={2} value={form.explanation} onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))} placeholder="Необязательно" />
          </FieldRow>
          <div className="flex gap-2 pt-2">
            {editingId ? (
              <>
                <button onClick={handleSave} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Save className="size-4" /> Сохранить
                </button>
                <button onClick={handleCancel} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <X className="size-4" /> Отмена
                </button>
              </>
            ) : (
              <button onClick={handleAdd} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Plus className="size-4" /> Добавить вопрос
              </button>
            )}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-border/60">
          <SectionLabel>Вопросы ({questions.length})</SectionLabel>
        </div>
        <div className="divide-y divide-border/40">
          {questions.slice(0, 15).map(q => (
            <div key={q.id} className="px-5 py-3 hover:bg-accent/20 transition-colors flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground line-clamp-2 mb-0.5">{q.text}</p>
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary">{q.answer}</span>
                  {" · "}{q.topic}{" · "}{q.difficulty}/5
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startEdit(q)} className="text-muted-foreground hover:text-primary transition-colors mt-0.5">
                  <Edit3 className="size-3.5" />
                </button>
                <button onClick={() => deleteQuestion(q.id)} className="text-muted-foreground hover:text-destructive transition-colors mt-0.5">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
          {questions.length > 15 && (
            <div className="px-5 py-3 text-center text-xs text-muted-foreground">
              Показаны 15 из {questions.length} вопросов
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

/* ======================== GALLERY TAB ======================== */
function GalleryTab() {
  const { gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    imageUrl: "",
    mediaType: "image" as GalleryItem["mediaType"],
    date: "",
    season: "2026" as GalleryItem["season"],
    tournament: "",
    tournamentType: "Zakovat" as GalleryItem["tournamentType"],
    game: "",
    team: "",
    caption: "",
  });

  const resetForm = () => setForm({
    title: "", imageUrl: "", mediaType: "image", date: "", season: "2026",
    tournament: "", tournamentType: "Zakovat", game: "", team: "", caption: "",
  });

  const handleAdd = () => {
    if (!form.title.trim() || !form.imageUrl.trim()) return;
    addGalleryItem({
      id: generateId(),
      title: form.title,
      imageUrl: form.imageUrl,
      mediaType: form.mediaType,
      date: form.date,
      season: form.season,
      tournament: form.tournament,
      tournamentType: form.tournamentType,
      game: form.game,
      team: form.team || undefined,
      caption: form.caption || undefined,
    });
    resetForm();
  };

  const startEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      imageUrl: item.imageUrl,
      mediaType: item.mediaType,
      date: item.date,
      season: item.season,
      tournament: item.tournament,
      tournamentType: item.tournamentType,
      game: item.game,
      team: item.team || "",
      caption: item.caption || "",
    });
  };

  const handleSave = () => {
    if (!editingId || !form.title.trim() || !form.imageUrl.trim()) return;
    updateGalleryItem(editingId, {
      title: form.title,
      imageUrl: form.imageUrl,
      mediaType: form.mediaType,
      date: form.date,
      season: form.season,
      tournament: form.tournament,
      tournamentType: form.tournamentType,
      game: form.game,
      team: form.team || undefined,
      caption: form.caption || undefined,
    });
    setEditingId(null);
    resetForm();
  };

  const handleCancel = () => {
    setEditingId(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <SectionLabel>{editingId ? "Редактировать фото" : "Добавить фото"}</SectionLabel>
        <div className="space-y-3 max-w-lg">
          <FieldRow label="Заголовок">
            <input className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Финал Zakovat 2026" />
          </FieldRow>
          <FieldRow label="URL изображения">
            <input className={inputCls} value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
          </FieldRow>
          <FieldRow label="Дата">
            <input className={inputCls} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} placeholder="12.10.2026" />
          </FieldRow>
          <FieldRow label="Турнир">
            <input className={inputCls} value={form.tournament} onChange={e => setForm(f => ({ ...f, tournament: e.target.value }))} placeholder="Zakovat 2026" />
          </FieldRow>
          <FieldRow label="Команда">
            <input className={inputCls} value={form.team} onChange={e => setForm(f => ({ ...f, team: e.target.value }))} placeholder="МЕГАС" />
          </FieldRow>
          <FieldRow label="Подпись">
            <textarea className={textareaCls} rows={2} value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} placeholder="Описание фото..." />
          </FieldRow>
          <div className="flex gap-2 pt-2">
            {editingId ? (
              <>
                <button onClick={handleSave} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Save className="size-4" /> Сохранить
                </button>
                <button onClick={handleCancel} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <X className="size-4" /> Отмена
                </button>
              </>
            ) : (
              <button onClick={handleAdd} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Plus className="size-4" /> Добавить фото
              </button>
            )}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-border/60">
          <SectionLabel>Галерея ({gallery.length})</SectionLabel>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-4">
          {gallery.map(item => (
            <div key={item.id} className="relative group">
              <img src={item.imageUrl} alt={item.title} className="w-full h-24 object-cover rounded-lg" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <button onClick={() => startEdit(item)} className="text-white hover:text-primary transition-colors">
                  <Edit3 className="size-4" />
                </button>
                <button onClick={() => deleteGalleryItem(item.id)} className="text-white hover:text-destructive transition-colors">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

/* ======================== HALL OF FAME TAB ======================== */
function HofTab() {
  const { hallOfFame, teams, addHallOfFameEntry, updateHallOfFameEntry, deleteHallOfFameEntry } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    year: 2026,
    season: "2026" as HallOfFameEntry["season"],
    championTeam: "",
    teamPhoto: "",
    captain: "",
    players: "",
    cups: 0,
    gold: 0,
    silver: 0,
    bronze: 0,
    bestResult: "",
    description: "",
    achievements: "",
    recordType: "",
  });

  const resetForm = () => setForm({
    year: 2026, season: "2026", championTeam: "", teamPhoto: "", captain: "",
    players: "", cups: 0, gold: 0, silver: 0, bronze: 0, bestResult: "",
    description: "", achievements: "", recordType: "",
  });

  const handleAdd = () => {
    if (!form.championTeam.trim()) return;
    addHallOfFameEntry({
      id: generateId(),
      year: form.year,
      season: form.season,
      championTeam: form.championTeam,
      teamPhoto: form.teamPhoto || undefined,
      captain: form.captain,
      players: form.players.split(",").map(p => p.trim()).filter(Boolean),
      cups: form.cups,
      gold: form.gold,
      silver: form.silver,
      bronze: form.bronze,
      bestResult: form.bestResult,
      description: form.description,
      achievements: form.achievements.split(",").map(a => a.trim()).filter(Boolean),
      recordType: form.recordType || undefined,
    });
    resetForm();
  };

  const startEdit = (entry: HallOfFameEntry) => {
    setEditingId(entry.id);
    setForm({
      year: entry.year,
      season: entry.season,
      championTeam: entry.championTeam,
      teamPhoto: entry.teamPhoto || "",
      captain: entry.captain,
      players: entry.players.join(", "),
      cups: entry.cups,
      gold: entry.gold,
      silver: entry.silver,
      bronze: entry.bronze,
      bestResult: entry.bestResult,
      description: entry.description,
      achievements: entry.achievements.join(", "),
      recordType: entry.recordType || "",
    });
  };

  const handleSave = () => {
    if (!editingId || !form.championTeam.trim()) return;
    updateHallOfFameEntry(editingId, {
      year: form.year,
      season: form.season,
      championTeam: form.championTeam,
      teamPhoto: form.teamPhoto || undefined,
      captain: form.captain,
      players: form.players.split(",").map(p => p.trim()).filter(Boolean),
      cups: form.cups,
      gold: form.gold,
      silver: form.silver,
      bronze: form.bronze,
      bestResult: form.bestResult,
      description: form.description,
      achievements: form.achievements.split(",").map(a => a.trim()).filter(Boolean),
      recordType: form.recordType || undefined,
    });
    setEditingId(null);
    resetForm();
  };

  const handleCancel = () => {
    setEditingId(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <SectionLabel>{editingId ? "Редактировать запись" : "Добавить запись в Зал славы"}</SectionLabel>
        <div className="space-y-3 max-w-lg">
          <FieldRow label="Год">
            <input type="number" className={inputCls} value={form.year} onChange={e => setForm(f => ({ ...f, year: parseInt(e.target.value) || 2026 }))} min={2020} max={2030} />
          </FieldRow>
          <FieldRow label="Команда-чемпион">
            <select className={selectCls} value={form.championTeam} onChange={e => setForm(f => ({ ...f, championTeam: e.target.value }))}>
              <option value="">— выберите —</option>
              {teams.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
          </FieldRow>
          <FieldRow label="Капитан">
            <input className={inputCls} value={form.captain} onChange={e => setForm(f => ({ ...f, captain: e.target.value }))} placeholder="Иван Иванов" />
          </FieldRow>
          <FieldRow label="Игроки (через запятую)">
            <input className={inputCls} value={form.players} onChange={e => setForm(f => ({ ...f, players: e.target.value }))} placeholder="Иван, Пётр, Мария" />
          </FieldRow>
          <div className="grid grid-cols-2 gap-2">
            <FieldRow label="Кубки">
              <input type="number" className={inputCls} value={form.cups} onChange={e => setForm(f => ({ ...f, cups: parseInt(e.target.value) || 0 }))} />
            </FieldRow>
            <FieldRow label="Золото">
              <input type="number" className={inputCls} value={form.gold} onChange={e => setForm(f => ({ ...f, gold: parseInt(e.target.value) || 0 }))} />
            </FieldRow>
          </div>
          <FieldRow label="Описание">
            <textarea className={textareaCls} rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Итоги сезона..." />
          </FieldRow>
          <FieldRow label="Достижения (через запятую)">
            <input className={inputCls} value={form.achievements} onChange={e => setForm(f => ({ ...f, achievements: e.target.value }))} placeholder="Первое место, Рекорд" />
          </FieldRow>
          <FieldRow label="Тип рекорда">
            <input className={inputCls} value={form.recordType} onChange={e => setForm(f => ({ ...f, recordType: e.target.value }))} placeholder="Тройная корона" />
          </FieldRow>
          <div className="flex gap-2 pt-2">
            {editingId ? (
              <>
                <button onClick={handleSave} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Save className="size-4" /> Сохранить
                </button>
                <button onClick={handleCancel} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <X className="size-4" /> Отмена
                </button>
              </>
            ) : (
              <button onClick={handleAdd} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Plus className="size-4" /> Добавить запись
              </button>
            )}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-border/60">
          <SectionLabel>Зал славы ({hallOfFame.length})</SectionLabel>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-muted/10">
                <th className="text-left px-5 py-2.5 text-xs text-muted-foreground font-semibold">Год</th>
                <th className="text-left px-5 py-2.5 text-xs text-muted-foreground font-semibold">Чемпион</th>
                <th className="text-center px-5 py-2.5 text-xs text-muted-foreground font-semibold">Кубки</th>
                <th className="px-5 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {hallOfFame.map(entry => (
                <tr key={entry.id} className="border-b border-border/40 hover:bg-accent/20 transition-colors">
                  <td className="px-5 py-2.5 font-medium text-foreground">{entry.year}</td>
                  <td className="px-5 py-2.5 text-muted-foreground">{entry.championTeam}</td>
                  <td className="px-5 py-2.5 text-center text-foreground">{entry.cups}</td>
                  <td className="px-5 py-2.5 text-right flex gap-2 justify-end">
                    <button onClick={() => startEdit(entry)} className="text-muted-foreground hover:text-primary transition-colors">
                      <Edit3 className="size-3.5" />
                    </button>
                    <button onClick={() => deleteHallOfFameEntry(entry.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="size-3.5" />
                    </button>
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

/* ======================== TELEGRAM TAB ======================== */
function TelegramTab() {
  const { results } = useStore();
  const [gameTitle, setGameTitle] = useState("");
  const [selectedTournament, setSelectedTournament] = useState("");
  const [preview, setPreview] = useState("");
  const [copied, setCopied] = useState(false);

  const filteredResults = selectedTournament
    ? results.filter(r => r.tournamentType === selectedTournament || r.tournamentId === selectedTournament)
    : results.slice(0, 10);

  const generate = () => {
    const lines = [
      `🏆 ${gameTitle || "Турнир Zakovat"}`,
      "",
      "📊 Результаты:",
      ...filteredResults
        .sort((a, b) => a.place - b.place)
        .slice(0, 5)
        .map((r, i) => {
          const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${r.place}.`;
          return `${medal} ${r.teamName} — ${r.correctAnswers} ответов`;
        }),
      "",
      "#Zakovat #LRCStudio",
    ];
    setPreview(lines.join("\n"));
  };

  const copy = () => {
    navigator.clipboard.writeText(preview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <SectionLabel>Параметры поста</SectionLabel>
        <div className="space-y-3 max-w-lg">
          <FieldRow label="Название игры">
            <input className={inputCls} value={gameTitle} onChange={e => setGameTitle(e.target.value)} placeholder="Zakovat 2026 — Финал" />
          </FieldRow>
        </div>

        <div className="mt-4">
          <button
            onClick={generate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Send className="size-4" /> Сгенерировать пост
          </button>
        </div>
      </GlassCard>

      {preview && (
        <GlassCard>
          <div className="flex items-center justify-between mb-3">
            <SectionLabel>Предпросмотр</SectionLabel>
            <button
              onClick={copy}
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
            >
              {copied ? <CheckCheck className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "Скопировано!" : "Копировать"}
            </button>
          </div>
          <pre className="bg-muted/40 rounded-lg p-4 text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed border border-border/60">
            {preview}
          </pre>
          <div className="mt-3">
            <a
              href="https://t.me/zakovat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0088cc] text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Send className="size-4" /> Открыть Telegram
            </a>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

/* ======================== MAIN PAGE ======================== */
export default function AdminPage() {
  const { resetToMockData, teams, tournaments, games, results, questions, gallery, hallOfFame } = useStore();
  const [activeTab, setActiveTab] = useState<TabId>("teams");

  const renderTab = () => {
    switch (activeTab) {
      case "teams": return <TeamsTab />;
      case "tournaments": return <TournamentsTab />;
      case "games": return <GamesTab />;
      case "results": return <ResultsTab />;
      case "questions": return <QuestionsTab />;
      case "gallery": return <GalleryTab />;
      case "hof": return <HofTab />;
      case "telegram": return <TelegramTab />;
    }
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <PageHeader
        title="Администрирование"
        subtitle="Управление данными турниров, команд и вопросов."
      />

      {/* Stats bar */}
      <div className="mb-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span>Команды: <strong className="text-foreground">{teams.length}</strong></span>
        <span>·</span>
        <span>Турниры: <strong className="text-foreground">{tournaments.length}</strong></span>
        <span>·</span>
        <span>Игры: <strong className="text-foreground">{games.length}</strong></span>
        <span>·</span>
        <span>Результаты: <strong className="text-foreground">{results.length}</strong></span>
        <span>·</span>
        <span>Вопросы: <strong className="text-foreground">{questions.length}</strong></span>
        <span>·</span>
        <span>Галерея: <strong className="text-foreground">{gallery.length}</strong></span>
        <span>·</span>
        <span>Зал славы: <strong className="text-foreground">{hallOfFame.length}</strong></span>
        <span className="ml-auto">
          <button
            onClick={resetToMockData}
            className="inline-flex items-center gap-1 px-2 py-1 rounded border border-border hover:bg-accent transition-colors"
          >
            <RefreshCw className="size-3" /> Сбросить к mock-данным
          </button>
        </span>
      </div>

      {/* Tab bar */}
      <div className="mb-6 -mx-6 px-6 overflow-x-auto">
        <div className="flex gap-1 min-w-max border-b border-border/60 pb-0">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors -mb-px ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <Icon className="size-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      {renderTab()}
    </div>
  );
}
