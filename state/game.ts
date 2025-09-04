"use client";
import { create } from "zustand";

type SubmitFn = (word: string) => void;
type GameStatus = "playing" | "level_clear" | "lost" | "won";

type GameState = {
  level: number;
  baseSpeed: number;
  wordsPerLevel: number;
  wordsCleared: number;
  score: number;
  wpm: number;
  gameStatus: GameStatus;
  onSubmit: SubmitFn;
  restartSignal: number;
  setWpm: (wpm: number) => void;
  setGameStatus: (status: GameStatus) => void;
  setSubmit: (fn: SubmitFn) => void;
  nextLevel: () => void;
  incCleared: () => void;
  addScore: (n: number) => void;
  restart: () => void;
};

export const useGameStore = create<GameState>((set, get) => ({
  level: 1,
  baseSpeed: 35,
  wordsPerLevel: 4, // Initial value for level 1
  wordsCleared: 0,
  score: 0,
  wpm: 0,
  gameStatus: "playing",
  onSubmit: () => {},
  restartSignal: 0,
  setWpm: (wpm) => set({ wpm }),
  setGameStatus: (status) => set({ gameStatus: status }),
  setSubmit: (fn) => set({ onSubmit: fn }),
  nextLevel: () => {
    const currentLevel = get().level;
    set({
      level: currentLevel + 1,
      baseSpeed: 70 + currentLevel * 20, // Speed increases with the new level
      wordsPerLevel: 4 + currentLevel, // Words increase with the new level
      wordsCleared: 0,
      gameStatus: "playing",
    });
  },
  incCleared: () => set((s) => ({ wordsCleared: s.wordsCleared + 1 })),
  addScore: (n) => set((s) => ({ score: s.score + n })),
  restart: () => {
    set({
      level: 1,
      baseSpeed: 70,
      wordsPerLevel: 4,
      wordsCleared: 0,
      score: 0,
      wpm: 0,
      gameStatus: "playing",
      restartSignal: get().restartSignal + 1,
    });
  },
}));
