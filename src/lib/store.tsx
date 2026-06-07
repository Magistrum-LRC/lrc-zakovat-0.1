"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Team, Tournament, Game, GameResult, Question, GalleryItem, HallOfFameEntry } from "@/types";
import { mockTeams } from "@/data/teams";
import { mockTournaments, mockGames, mockGameResults } from "@/data/tournaments";
import { mockQuestions } from "@/data/questions";
import { mockGalleryItems } from "@/data/gallery";
import { mockHallOfFame } from "@/data/halloffame";

const STORAGE_KEY = "zakovat-data";

interface AppData {
  teams: Team[];
  tournaments: Tournament[];
  games: Game[];
  results: GameResult[];
  questions: Question[];
  gallery: GalleryItem[];
  hallOfFame: HallOfFameEntry[];
}

const defaultData: AppData = {
  teams: mockTeams,
  tournaments: mockTournaments,
  games: mockGames,
  results: mockGameResults,
  questions: mockQuestions,
  gallery: mockGalleryItems,
  hallOfFame: mockHallOfFame,
};

interface StoreContextType extends AppData {
  // Teams
  addTeam: (team: Team) => void;
  updateTeam: (id: string, team: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  // Tournaments
  addTournament: (tournament: Tournament) => void;
  updateTournament: (id: string, tournament: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;
  // Games
  addGame: (game: Game) => void;
  updateGame: (id: string, game: Partial<Game>) => void;
  deleteGame: (id: string) => void;
  // Results
  addResult: (result: GameResult) => void;
  updateResult: (id: string, result: Partial<GameResult>) => void;
  deleteResult: (id: string) => void;
  // Questions
  addQuestion: (question: Question) => void;
  updateQuestion: (id: string, question: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  // Gallery
  addGalleryItem: (item: GalleryItem) => void;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;
  // Hall of Fame
  addHallOfFameEntry: (entry: HallOfFameEntry) => void;
  updateHallOfFameEntry: (id: string, entry: Partial<HallOfFameEntry>) => void;
  deleteHallOfFameEntry: (id: string) => void;
  // Reset
  resetToMockData: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

function loadData(): AppData {
  if (typeof window === "undefined") return defaultData;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load data from localStorage:", e);
  }
  return defaultData;
}

function saveData(data: AppData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save data to localStorage:", e);
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(defaultData);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = loadData();
    setData(stored);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      saveData(data);
    }
  }, [data, loaded]);

  const resetToMockData = useCallback(() => {
    setData(defaultData);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Teams
  const addTeam = useCallback((team: Team) => {
    setData(prev => ({ ...prev, teams: [...prev.teams, team] }));
  }, []);

  const updateTeam = useCallback((id: string, team: Partial<Team>) => {
    setData(prev => ({
      ...prev,
      teams: prev.teams.map(t => t.id === id ? { ...t, ...team } : t),
    }));
  }, []);

  const deleteTeam = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      teams: prev.teams.filter(t => t.id !== id),
    }));
  }, []);

  // Tournaments
  const addTournament = useCallback((tournament: Tournament) => {
    setData(prev => ({ ...prev, tournaments: [...prev.tournaments, tournament] }));
  }, []);

  const updateTournament = useCallback((id: string, tournament: Partial<Tournament>) => {
    setData(prev => ({
      ...prev,
      tournaments: prev.tournaments.map(t => t.id === id ? { ...t, ...tournament } : t),
    }));
  }, []);

  const deleteTournament = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      tournaments: prev.tournaments.filter(t => t.id !== id),
    }));
  }, []);

  // Games
  const addGame = useCallback((game: Game) => {
    setData(prev => ({ ...prev, games: [...prev.games, game] }));
  }, []);

  const updateGame = useCallback((id: string, game: Partial<Game>) => {
    setData(prev => ({
      ...prev,
      games: prev.games.map(g => g.id === id ? { ...g, ...game } : g),
    }));
  }, []);

  const deleteGame = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      games: prev.games.filter(g => g.id !== id),
    }));
  }, []);

  // Results
  const addResult = useCallback((result: GameResult) => {
    setData(prev => ({ ...prev, results: [...prev.results, result] }));
  }, []);

  const updateResult = useCallback((id: string, result: Partial<GameResult>) => {
    setData(prev => ({
      ...prev,
      results: prev.results.map(r => r.id === id ? { ...r, ...result } : r),
    }));
  }, []);

  const deleteResult = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      results: prev.results.filter(r => r.id !== id),
    }));
  }, []);

  // Questions
  const addQuestion = useCallback((question: Question) => {
    setData(prev => ({ ...prev, questions: [...prev.questions, question] }));
  }, []);

  const updateQuestion = useCallback((id: string, question: Partial<Question>) => {
    setData(prev => ({
      ...prev,
      questions: prev.questions.map(q => q.id === id ? { ...q, ...question } : q),
    }));
  }, []);

  const deleteQuestion = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id),
    }));
  }, []);

  // Gallery
  const addGalleryItem = useCallback((item: GalleryItem) => {
    setData(prev => ({ ...prev, gallery: [...prev.gallery, item] }));
  }, []);

  const updateGalleryItem = useCallback((id: string, item: Partial<GalleryItem>) => {
    setData(prev => ({
      ...prev,
      gallery: prev.gallery.map(i => i.id === id ? { ...i, ...item } : i),
    }));
  }, []);

  const deleteGalleryItem = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      gallery: prev.gallery.filter(i => i.id !== id),
    }));
  }, []);

  // Hall of Fame
  const addHallOfFameEntry = useCallback((entry: HallOfFameEntry) => {
    setData(prev => ({ ...prev, hallOfFame: [...prev.hallOfFame, entry] }));
  }, []);

  const updateHallOfFameEntry = useCallback((id: string, entry: Partial<HallOfFameEntry>) => {
    setData(prev => ({
      ...prev,
      hallOfFame: prev.hallOfFame.map(e => e.id === id ? { ...e, ...entry } : e),
    }));
  }, []);

  const deleteHallOfFameEntry = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      hallOfFame: prev.hallOfFame.filter(e => e.id !== id),
    }));
  }, []);

  const value: StoreContextType = {
    ...data,
    addTeam,
    updateTeam,
    deleteTeam,
    addTournament,
    updateTournament,
    deleteTournament,
    addGame,
    updateGame,
    deleteGame,
    addResult,
    updateResult,
    deleteResult,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    addHallOfFameEntry,
    updateHallOfFameEntry,
    deleteHallOfFameEntry,
    resetToMockData,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
