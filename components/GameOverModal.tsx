"use client";
import { useEffect } from "react";
import { useGameStore } from "@/state/game";

export default function GameOverModal() {
  const { gameOver, restart, level, wordsCleared, wordsPerLevel, wpm, score } = useGameStore(s => ({
    gameOver: s.gameOver,
    restart: s.restart,
    level: s.level,
    wordsCleared: s.wordsCleared,
    wordsPerLevel: s.wordsPerLevel,
    wpm: s.wpm,
    score: s.score
  }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (gameOver && e.key === "Enter") restart(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameOver, restart]);

  return (
    <div className={`pointer-events-none absolute inset-0 ${gameOver ? "flex" : "hidden"} items-center justify-center p-3 md:items-end md:pb-[calc(var(--inputbar-h,0px)+16px)]`}>
      <div className="pointer-events-auto bg-black/70 backdrop-blur-md border border-white/15 rounded-2xl p-6 text-center max-w-[92%]">
        <h2 className="text-xl font-bold mb-2">THUA RỒI</h2>
        <div className="text-sm opacity-90">Cấp: <b>{level}</b> · Tiến độ: <b>{wordsCleared}/{wordsPerLevel}</b></div>
        <div className="text-sm opacity-90">Đã phá: <b>{score}</b> · WPM: <b>{wpm.toFixed(1)}</b></div>
        <button onClick={restart} className="mt-3 bg-accent text-slate-900 px-4 py-2 rounded-xl font-semibold">Chơi lại</button>
        <div className="text-xs opacity-80 mt-1">Nhấn Enter để chơi lại</div>
      </div>
    </div>
  );
}
