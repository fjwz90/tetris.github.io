// state/game.ts
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
  baseSpeed: 70,
  wordsPerLevel: 12, // 초기 단어 수를 12로 수정
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
      baseSpeed: 70 + currentLevel * 20, // 레벨에 따라 속도 증가
      wordsPerLevel: 12 + currentLevel, // 레벨에 따라 단어 수 증가
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
      wordsPerLevel: 12, // 재시작 시 단어 수도 12로 초기화
      wordsCleared: 0,
      score: 0,
      wpm: 0,
      gameStatus: "playing",
      restartSignal: get().restartSignal + 1,
    });
  },
}));