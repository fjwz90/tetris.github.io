"use client";
import { useEffect } from "react";
import { useGameStore } from "@/state/game";

export default function GameOverModal() {
  const { gameStatus, restart, level, score, wpm } = useGameStore(s => ({
    gameStatus: s.gameStatus,
    restart: s.restart,
    level: s.level,
    score: s.score,
    wpm: s.wpm
  }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((gameStatus === 'lost' || gameStatus === 'won') && e.key === "Enter") {
        restart();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameStatus, restart]);
  
  const isVisible = gameStatus !== 'playing';

  const renderContent = () => {
      switch(gameStatus) {
          case 'lost':
              return {
                  title: "THUA RỒI",
                  stats: `Cấp: <b>${level}</b> · Điểm: <b>${score}</b> · WPM: <b>${wpm.toFixed(1)}</b>`,
                  showRestart: true,
              };
          case 'won':
              return {
                  title: "CHIẾN THẮNG!",
                  stats: `Bạn đã hoàn thành tất cả các từ! Điểm cuối cùng: <b>${score}</b>`,
                  showRestart: true,
              };
          case 'level_clear':
               return {
                  title: `MÀN ${level} HOÀN THÀNH!`,
                  stats: `Chuẩn bị cho màn tiếp theo...`,
                  showRestart: false,
              };
          default:
              return null;
      }
  }

  const content = renderContent();
  if (!isVisible || !content) return null;

  return (
    <div className={`pointer-events-none absolute inset-0 flex items-center justify-center p-3`}>
      <div className="pointer-events-auto bg-black/70 backdrop-blur-md border border-white/15 rounded-2xl p-6 text-center max-w-[92%]">
        <h2 className="text-xl font-bold mb-2">{content.title}</h2>
        <div className="text-sm opacity-90" dangerouslySetInnerHTML={{ __html: content.stats }}/>
        
        {content.showRestart && (
            <>
                <button onClick={restart} className="mt-3 bg-accent text-slate-900 px-4 py-2 rounded-xl font-semibold">Chơi lại</button>
                <div className="text-xs opacity-80 mt-1">Nhấn Enter để chơi lại</div>
            </>
        )}
      </div>
    </div>
  );
}

