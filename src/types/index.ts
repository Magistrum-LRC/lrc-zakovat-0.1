// =============================================
// CORE TYPES for Zakovat by LRC Studio
// =============================================

export type Division = "Премьер-лига" | "Первая лига";
export type GradeGroup = "9-11" | "8-и-ниже";
export type TournamentType = "Zakovat" | "Своя игра" | "Брейн-ринг" | "Школьная лига" | "Суперкубок";
export type TournamentStatus = "Предстоит" | "Идёт" | "Завершён";
export type GameStatus = "Предстоит" | "Идёт" | "Завершён";
export type MediaType = "image" | "video";
export type Season = "2022" | "2023" | "2024" | "2025" | "2026";
export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type QuestionTopic =
  | "История"
  | "География"
  | "Литература"
  | "Язык и слова"
  | "Искусство и культура"
  | "Кино и медиа"
  | "Музыка"
  | "Спорт"
  | "Игры"
  | "Математика"
  | "Логика и ребусы"
  | "Физика и космос"
  | "Биология и медицина"
  | "Химия"
  | "Технологии"
  | "Экономика и бизнес"
  | "Религия и мифология"
  | "Философия"
  | "Общество и политика"
  | "Еда и быт"
  | "Школа 60 / Zakovat"
  | "Другое";

// =============================================
// TEAM
// =============================================
export interface Team {
  id: string;
  name: string;
  division: Division;
  gradeGroup: GradeGroup;
  captain: string;
  players: string[];
  photoUrl?: string;
  gamesPlayed: number;
  cups: number;
  gold: number;
  silver: number;
  bronze: number;
  correctAnswers: number;
  winRate: number;
  bestResult: string;
  season: Season;
  tournamentTypes: TournamentType[];
  active: boolean;
}

// =============================================
// TOURNAMENT
// =============================================
export interface Tournament {
  id: string;
  title: string;
  type: TournamentType;
  date: string;
  status: TournamentStatus;
  winner?: string;
  teamsCount: number;
  season: Season;
  division: Division | "Все";
  description?: string;
}

// =============================================
// GAME
// =============================================
export interface Game {
  id: string;
  title: string;
  tournamentId: string;
  tournamentTitle: string;
  date: string;
  season: Season;
  round: string;
  status: GameStatus;
  participatingTeams: string[];
}

// =============================================
// GAME RESULT
// =============================================
export interface GameResult {
  id: string;
  gameId: string;
  tournamentId: string;
  teamId: string;
  teamName: string;
  date: string;
  season: Season;
  tournamentType: TournamentType;
  division: Division;
  place: number;
  cups: number;
  gold: number;
  silver: number;
  bronze: number;
  correctAnswers: number;
  tieBreakerResult?: string;
  notes?: string;
}

// =============================================
// QUESTION
// =============================================
export interface Question {
  id: string;
  number: number;
  text: string;
  answer: string;
  topic: QuestionTopic;
  difficulty: Difficulty;
  tournament: string;
  tournamentType: TournamentType;
  game: string;
  season: Season;
  date: string;
  imageUrl?: string;
  explanation?: string;
}

// =============================================
// GALLERY
// =============================================
export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  mediaType: MediaType;
  date: string;
  season: Season;
  tournament: string;
  tournamentType: TournamentType;
  game: string;
  team?: string;
  caption?: string;
}

// =============================================
// HALL OF FAME
// =============================================
export interface HallOfFameEntry {
  id: string;
  year: number;
  season: Season;
  championTeam: string;
  teamPhoto?: string;
  captain: string;
  players: string[];
  cups: number;
  gold: number;
  silver: number;
  bronze: number;
  bestResult: string;
  description: string;
  achievements: string[];
  recordType?: string;
}

// =============================================
// COMPUTED / LEADERBOARD
// =============================================
export interface LeaderboardEntry extends Team {
  rank: number;
  trophyEquivalent: number;
}

// =============================================
// FILTER TYPES
// =============================================
export interface FilterState {
  seasons: string[];
  tournamentTypes: string[];
  divisions: string[];
  statuses: string[];
}
