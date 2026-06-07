import type { Team, GameResult, LeaderboardEntry, Division } from "@/types";
import { mockTeams, mockGameResults } from "@/data";

/**
 * Trophy equivalent formula: 1 cup = 2 gold = 4 silver = 6 bronze
 */
export function calculateTrophyEquivalent(cups: number, gold: number, silver: number, bronze: number): number {
  return cups * 6 + gold * 3 + silver * 1.5 + bronze * 1;
}

/**
 * Calculate win rate from results
 */
export function calculateWinRate(wins: number, totalGames: number): number {
  if (totalGames === 0) return 0;
  return Math.round((wins / totalGames) * 1000) / 10;
}

/**
 * Calculate leaderboard sorted by: cups → gold → silver → bronze → correctAnswers → winRate
 */
export function calculateLeaderboard(teams: Team[]): LeaderboardEntry[] {
  const sorted = [...teams].sort((a, b) => {
    if (b.cups !== a.cups) return b.cups - a.cups;
    if (b.gold !== a.gold) return b.gold - a.gold;
    if (b.silver !== a.silver) return b.silver - a.silver;
    if (b.bronze !== a.bronze) return b.bronze - a.bronze;
    if (b.correctAnswers !== a.correctAnswers) return b.correctAnswers - a.correctAnswers;
    return b.winRate - a.winRate;
  });
  return sorted.map((team, index) => ({
    ...team,
    rank: index + 1,
    trophyEquivalent: calculateTrophyEquivalent(team.cups, team.gold, team.silver, team.bronze),
  }));
}

/**
 * Calculate team statistics from game results
 */
export function calculateTeamStats(teamId: string, results: GameResult[]) {
  const teamResults = results.filter(r => r.teamId === teamId);
  const wins = teamResults.filter(r => r.place === 1).length;
  const totalGames = teamResults.length;
  const totalCorrect = teamResults.reduce((sum, r) => sum + r.correctAnswers, 0);
  const cups = teamResults.reduce((sum, r) => sum + r.cups, 0);
  const gold = teamResults.reduce((sum, r) => sum + r.gold, 0);
  const silver = teamResults.reduce((sum, r) => sum + r.silver, 0);
  const bronze = teamResults.reduce((sum, r) => sum + r.bronze, 0);
  return { wins, totalGames, totalCorrect, cups, gold, silver, bronze, winRate: calculateWinRate(wins, totalGames) };
}

/**
 * Filter by season
 */
export function filterBySeason<T extends { season: string }>(items: T[], seasons: string[]): T[] {
  if (!seasons.length || seasons.includes("Все")) return items;
  return items.filter(item => seasons.includes(item.season));
}

/**
 * Filter by division
 */
export function filterByDivision<T extends { division: string }>(items: T[], divisions: string[]): T[] {
  if (!divisions.length || divisions.includes("Все")) return items;
  return items.filter(item => divisions.includes(item.division));
}

/**
 * Filter by tournament type
 */
export function filterByTournamentType<T extends { tournamentType?: string; type?: string }>(items: T[], types: string[]): T[] {
  if (!types.length || types.includes("Все")) return items;
  return items.filter(item => {
    const t = item.tournamentType || item.type || "";
    return types.includes(t);
  });
}

/**
 * Calculate overall statistics for stats page
 */
export function calculateStatistics(teams: Team[], results: GameResult[]) {
  const totalGames = results.length > 0 ? Math.max(...results.map(r => parseInt(r.gameId.replace(/\D/g, "") || "0"))) : 0;
  const totalCorrect = results.reduce((sum, r) => sum + r.correctAnswers, 0);
  const avgCorrectPerGame = results.length > 0 ? Math.round(totalCorrect / results.length * 10) / 10 : 0;

  const topTeamsByCups = [...teams].sort((a, b) => b.cups - a.cups).slice(0, 8);
  const topTeamsByCorrect = [...teams].sort((a, b) => b.correctAnswers - a.correctAnswers).slice(0, 8);

  return {
    totalTeams: teams.length,
    totalGames: results.length,
    totalCorrect,
    avgCorrectPerGame,
    topTeamsByCups,
    topTeamsByCorrect,
  };
}

/**
 * Generate a Telegram post from game results
 */
export function generateTelegramPost(gameTitle: string, results: Array<{ teamName: string; correctAnswers: number; place: number }>): string {
  const sorted = [...results].sort((a, b) => a.place - b.place);
  const medals = ["🏆", "🥇", "🥈", "🥉"];
  const lines = sorted.slice(0, 6).map((r, i) => {
    const medal = medals[i] || `${i + 1}.`;
    return `${medal} ${r.teamName} — ${r.correctAnswers}`;
  });
  return `Результаты: ${gameTitle}\n\n${lines.join("\n")}\n\n#zakovat #results`;
}

/**
 * Export data as JSON and trigger download (browser only)
 */
export function exportDataAsJson(data: unknown, filename: string): void {
  if (typeof window === "undefined") return;
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Prepare data for CSV export (returns CSV string)
 */
export function prepareDataForCsvExport(teams: Team[]): string {
  const headers = ["ID", "Название", "Дивизион", "Капитан", "Игры", "Кубки", "Золото", "Серебро", "Бронза", "Правильные ответы", "Win %"];
  const rows = teams.map(t => [
    t.id, t.name, t.division, t.captain,
    t.gamesPlayed, t.cups, t.gold, t.silver, t.bronze,
    t.correctAnswers, t.winRate
  ]);
  return [headers, ...rows].map(row => row.join(",")).join("\n");
}

/**
 * Export CSV
 */
export function exportDataAsCsv(teams: Team[]): void {
  if (typeof window === "undefined") return;
  const csv = prepareDataForCsvExport(teams);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "zakovat_teams.csv";
  a.click();
  URL.revokeObjectURL(url);
}
