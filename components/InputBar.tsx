"use client";
import { useEffect } from "react";
import { useKeyboardInset } from "@/hooks/useKeyboardInset";
import { useGameStore } from "@/state/game";

export default function InputBar() {
  const { kbShiftPx, inputBarH, ref } = useKeyboardInset();
  const { onSubmit, gameOver, restart } = useGameStore(s => ({
    onSubmit: s.onSubmit,
    gameOver: s.gameOver,
    restart: s.restart
  }));

  useEffect(() => {
    document.documentElement.style.setProperty("--inputbar-h", `${inputBarH}px`);
    document.documentElement.style.setProperty("--kb-shift", `${-kbShiftPx}px`);
  }, [kbShiftPx, inputBarH]);

  return (
    <div
      ref={ref}
      className="fixed left-1/2 -translate-x-1/2 bottom-0 z-10 w-[min(980px,100vw)] bg-panel/95 backdrop-blur-md p-3 rounded-t-2xl"
      style={{ transform: `translate(-50%, calc(var(--kb-shift, 0px)))` }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const input = (e.currentTarget.elements.namedItem("word") as HTMLInputElement);
          const val = input.value.trim();
          if (gameOver) { restart(); input.value = ""; return; }
          onSubmit(val);
          input.value = "";
        }}
        className="flex gap-2"
      >
        <input
          name="word"
          inputMode="latin"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          className="flex-1 bg-panel2 text-white rounded-xl px-4 py-3 text-lg border border-black/30 outline-none"
          placeholder="Gõ từ rồi Enter…"
        />
        <button className="bg-accent text-slate-900 px-4 py-3 rounded-xl font-semibold text-lg">Phá</button>
      </form>
      <p className="text-[12px] opacity-70 mt-1">게임 종료 시 Enter로 바로 재시작 가능</p>
    </div>
  );
}
