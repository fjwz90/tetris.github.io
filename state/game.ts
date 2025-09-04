"use client";
import { create } from "zustand";

type SubmitFn = (word: string) => void;

type GameState = {
  level: number;
  baseSpeed: number;
  wordsPerLevel: number;
  wordsCleared: number;
  score: number;
  wpm: number;
  gameOver: boolean;
  onSubmit: SubmitFn;
  restartSignal: number;
  setWpm: (wpm: number) => void;
  setGameOver: (v: boolean) => void;
  setSubmit: (fn: SubmitFn) => void;
  nextLevel: () => void;
  incCleared: () => void;
  addScore: (n: number) => void;
  restart: () => void;
};

export const useGameStore = create<GameState>((set, get) => ({
  level: 1,
  baseSpeed: 140,
  wordsPerLevel: 12,
  wordsCleared: 0,
  score: 0,
  wpm: 0,
  gameOver: false,
  onSubmit: () => {},
  restartSignal: 0,
  setWpm: (wpm) => set({ wpm }),
  setGameOver: (v) => set({ gameOver: v }),
  setSubmit: (fn) => set({ onSubmit: fn }),
  nextLevel: () => {
    const lv = get().level + 1;
    const newSpeed = 140 + (lv - 1) * 40;
    set({ level: lv, baseSpeed: newSpeed, wordsCleared: 0 });
  },
  incCleared: () => set(s => ({ wordsCleared: s.wordsCleared + 1 })),
  addScore: (n) => set(s => ({ score: s.score + n })),
  restart: () => {
    set({
      level: 1,
      baseSpeed: 140,
      wordsCleared: 0,
      score: 0,
      wpm: 0,
      gameOver: false,
      restartSignal: get().restartSignal + 1
    });
  }
}));
