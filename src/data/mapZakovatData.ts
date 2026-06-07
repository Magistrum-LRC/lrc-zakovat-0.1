import type {
  Team,
  Tournament,
  Game,
  GameResult,
  Question,
  GalleryItem,
  HallOfFameEntry,
  Division,
  GradeGroup,
  Season,
  TournamentType,
  TournamentStatus,
  GameStatus,
  MediaType,
  QuestionTopic,
  Difficulty,
} from "@/types";
import {
  teams as rawTeams,
  tournaments as rawTournaments,
  games as rawGames,
  gameResults as rawGameResults,
  questions as rawQuestions,
  galleryItems as rawGalleryItems,
  hallOfFame as rawHallOfFame,
} from "./zakovat_site_mock_data_expanded_topics";

const SEASONS: Season[] = ["2022", "2023", "2024", "2025", "2026"];

function parseSeason(value: string): Season {
  const parts = value.split(/,\s*/).map((s) => s.trim());
  const latest = parts[parts.length - 1];
  if (SEASONS.includes(latest as Season)) return latest as Season;
  const match = value.match(/20(2[2-6])/);
  if (match) return `20${match[1]}` as Season;
  return "2026";
}

function mapGradeGroup(value: string): GradeGroup {
  if (value.includes("9") && value.includes("11")) return "9-11";
  return "8-и-ниже";
}

function mapDivision(value: string): Division {
  return value === "Премьер-лига" ? "Премьер-лига" : "Первая лига";
}

function asTournamentType(value: string): TournamentType {
  const allowed: TournamentType[] = [
    "Zakovat",
    "Своя игра",
    "Брейн-ринг",
    "Школьная лига",
    "Суперкубок",
  ];
  return allowed.includes(value as TournamentType) ? (value as TournamentType) : "Zakovat";
}

function asTournamentStatus(value: string): TournamentStatus {
  const allowed: TournamentStatus[] = ["Предстоит", "Идёт", "Завершён"];
  return allowed.includes(value as TournamentStatus) ? (value as TournamentStatus) : "Завершён";
}

function asGameStatus(value: string): GameStatus {
  const allowed: GameStatus[] = ["Предстоит", "Идёт", "Завершён"];
  return allowed.includes(value as GameStatus) ? (value as GameStatus) : "Завершён";
}

const KNOWN_TOPICS = new Set<string>([
  "История",
  "География",
  "Литература",
  "Язык и слова",
  "Искусство и культура",
  "Кино и медиа",
  "Музыка",
  "Спорт",
  "Игры",
  "Математика",
  "Логика и ребусы",
  "Физика и космос",
  "Биология и медицина",
  "Химия",
  "Технологии",
  "Экономика и бизнес",
  "Религия и мифология",
  "Общество и политика",
  "Еда и быт",
  "Школа 60 / Zakovat",
]);

function mapQuestionTopic(raw: string): QuestionTopic {
  if (raw === "no-type") return "Другое";
  if (raw === "Философия и идеи") return "Философия";
  if (KNOWN_TOPICS.has(raw)) return raw as QuestionTopic;
  return "Другое";
}

function clampDifficulty(value: number): Difficulty {
  const n = Math.round(value);
  if (n <= 1) return 1;
  if (n >= 5) return 5;
  return n as Difficulty;
}

function mapMediaType(value: string): MediaType {
  return value === "video" ? "video" : "image";
}

type RawTeam = (typeof rawTeams)[number];
type RawTournament = (typeof rawTournaments)[number];
type RawGame = (typeof rawGames)[number];
type RawGameResult = (typeof rawGameResults)[number];
type RawQuestion = (typeof rawQuestions)[number];
type RawGalleryItem = (typeof rawGalleryItems)[number];
type RawHallOfFame = (typeof rawHallOfFame)[number];

export function mapTeams(data: readonly RawTeam[]): Team[] {
  return data.map((t) => ({
    id: t.id,
    name: t.name,
    division: mapDivision(t.division),
    gradeGroup: mapGradeGroup(t.gradeGroup),
    captain: t.captain || "",
    players: [...t.players],
    photoUrl: t.photoUrl || undefined,
    gamesPlayed: t.gamesPlayed,
    cups: t.cups,
    gold: t.gold,
    silver: t.silver,
    bronze: t.bronze,
    correctAnswers: t.correctAnswers,
    winRate: t.winRate,
    bestResult: t.bestResult,
    season: parseSeason(t.season),
    tournamentTypes: t.tournamentTypes.map(asTournamentType),
    active: t.active,
  }));
}

export function mapTournaments(data: readonly RawTournament[]): Tournament[] {
  return data.map((t) => ({
    id: t.id,
    title: t.title,
    type: asTournamentType(t.type),
    date: t.date,
    status: asTournamentStatus(t.status),
    winner: t.winner || undefined,
    teamsCount: t.teamsCount,
    season: parseSeason(t.season),
    division: t.division === "Все" ? "Все" : mapDivision(t.division),
    description: t.description || undefined,
  }));
}

export function mapGames(data: readonly RawGame[]): Game[] {
  return data.map((g) => ({
    id: g.id,
    title: g.title,
    tournamentId: g.tournamentId,
    tournamentTitle: g.tournamentTitle,
    date: g.date,
    season: parseSeason(g.season),
    round: g.round || "",
    status: asGameStatus(g.status),
    participatingTeams: [...g.participatingTeams],
  }));
}

export function mapGameResults(data: readonly RawGameResult[]): GameResult[] {
  return data.map((r) => ({
    id: r.id,
    gameId: r.gameId,
    tournamentId: r.tournamentId,
    teamId: r.teamId,
    teamName: r.teamName,
    date: r.date,
    season: parseSeason(r.season),
    tournamentType: asTournamentType(r.tournamentType),
    division: mapDivision(r.division),
    place: r.place,
    cups: r.cups,
    gold: r.gold,
    silver: r.silver,
    bronze: r.bronze,
    correctAnswers: r.correctAnswers,
    tieBreakerResult: undefined,
    notes: r.notes || undefined,
  }));
}

export function mapQuestions(data: readonly RawQuestion[]): Question[] {
  return data
    .filter((q) => !("isSensitive" in q && q.isSensitive))
    .map((q) => ({
      id: q.id,
      number: q.number,
      text: q.text,
      answer: q.answer,
      topic: mapQuestionTopic(q.topic),
      difficulty: clampDifficulty(q.difficulty),
      tournament: q.tournament,
      tournamentType: asTournamentType(q.tournamentType),
      game: q.game,
      season: parseSeason(q.season),
      date: q.date,
      imageUrl: q.imageUrl || undefined,
      explanation: q.explanation || undefined,
    }));
}

export function mapGalleryItems(data: readonly RawGalleryItem[]): GalleryItem[] {
  return data
    .filter((item) => item.imageUrl && item.mediaType !== "link")
    .map((item) => ({
      id: item.id,
      title: item.title,
      imageUrl: item.imageUrl,
      mediaType: mapMediaType(item.mediaType),
      date: item.date,
      season: parseSeason(item.season),
      tournament: item.tournament,
      tournamentType: asTournamentType(item.tournamentType),
      game: item.game,
      team: item.team || undefined,
      caption: item.caption || undefined,
    }));
}

export function mapHallOfFame(data: readonly RawHallOfFame[]): HallOfFameEntry[] {
  return data.map((entry) => ({
    id: entry.id,
    year: entry.year,
    season: parseSeason(entry.season),
    championTeam: entry.championTeam,
    teamPhoto: entry.teamPhoto || undefined,
    captain: entry.captain || "",
    players: [...entry.players],
    cups: entry.cups,
    gold: entry.gold,
    silver: entry.silver,
    bronze: entry.bronze,
    bestResult: entry.bestResult,
    description: entry.description,
    achievements: [...entry.achievements],
    recordType: entry.recordType || undefined,
  }));
}

export const mockTeams = mapTeams(rawTeams);
export const mockTournaments = mapTournaments(rawTournaments);
export const mockGames = mapGames(rawGames);
export const mockGameResults = mapGameResults(rawGameResults);
export const mockQuestions = mapQuestions(rawQuestions);
