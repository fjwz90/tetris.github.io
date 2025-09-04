"use client";
import { useGameStore } from "@/state/game";

export default function HUD() {
  const { level, wordsCleared, wordsPerLevel, wpm, score } = useGameStore(s => ({
    level: s.level,
    wordsCleared: s.wordsCleared,
    wordsPerLevel: s.wordsPerLevel,
    wpm: s.wpm,
    score: s.score
  }));

  return (
    <div className="bg-panel rounded-xl px-3 py-2 mb-2 flex flex-wrap gap-2">
      <div className="flex-1 min-w-[140px]">Cấp: <b>{level}</b></div>
      <div className="flex-1 min-w-[140px]">Tiến độ: <b>{wordsCleared}/{wordsPerLevel}</b></div>
      <div className="flex-1 min-w-[140px]">Đã phá: <b>{score}</b> từ</div>
      <div className="flex-1 min-w-[140px]">WPM: <b>{wpm.toFixed(1)}</b></div>
    </div>
  );
}
