// app/components/InputBar.tsx
"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/state/game";

export default function InputBar() {
  const { onSubmit, gameOver, restart } = useGameStore((s) => ({
    onSubmit: s.onSubmit,
    gameOver: s.gameOver,
    restart: s.restart,
  }));

  const wrapRef = useRef<HTMLDivElement | null>(null);

  // 모바일 키보드가 뜨면 입력바를 살짝 위로(겹침 방지)
  useEffect(() => {
    const root = document.documentElement;
    const vv = window.visualViewport;

    const update = () => {
      if (!vv) return;
      const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      root.style.setProperty("--kb", kb + "px");
      root.style.setProperty("--kb-shift", -kb + "px");
    };

    update();
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      root.style.setProperty("--kb", "0px");
      root.style.setProperty("--kb-shift", "0px");
    };
  }, []);

  return (
    // fixed/bottom-0 사용 안 함 → 페이지 그리드의 마지막 행(입력바 자리)에 자연 배치
    <div
      ref={wrapRef}
      className="w-full max-w-[980px] mx-auto bg-panel/95 backdrop-blur-md p-3 rounded-xl shadow-lg"
    >
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.elements.namedItem("word") as HTMLInputElement;
          const val = input.value.trim();

          if (gameOver) {
            restart();
            input.value = "";
            return;
          }
          if (val) onSubmit(val);
          input.value = "";
        }}
      >
        <input
          name="word"
          className="flex-1 bg-panel2 text-white rounded-xl px-4 py-3 text-[16px] md:text-lg border border-black/30 outline-none"
          placeholder="Gõ từ rồi Enter…"
          inputMode="text"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          onFocus={() => {
            try {
              window.scrollTo({ top: 0, behavior: "auto" });
            } catch {
              window.scrollTo(0, 0);
            }
          }}
        />
        <button
          className="bg-accent text-slate-900 px-4 py-3 rounded-xl font-semibold text-lg"
          type="submit"
        >
          Phá
        </button>
      </form>
      <p className="text-[12px] opacity-70 mt-1">게임 종료 시 Enter로 바로 재시작 가능</p>
    </div>
  );
}
