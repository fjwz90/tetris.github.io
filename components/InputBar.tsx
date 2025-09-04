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

  useEffect(() => {
    const root = document.documentElement;
    const vv = window.visualViewport;

    const updateKb = () => {
      if (!vv) return;
      const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      root.style.setProperty("--kb", `${kb}px`);
    };

    const updateBarH = () => {
      if (wrapRef.current) {
        root.style.setProperty("--bar-h", `${wrapRef.current.offsetHeight}px`);
      }
    };

    updateKb();
    updateBarH();

    vv?.addEventListener("resize", updateKb);
    vv?.addEventListener("scroll", updateKb);

    const ro = new ResizeObserver(updateBarH);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener("resize", updateBarH);

    return () => {
      vv?.removeEventListener("resize", updateKb);
      vv?.removeEventListener("scroll", updateKb);
      ro.disconnect();
      window.removeEventListener("resize", updateBarH);
      root.style.setProperty("--kb", "0px");
      // bar-h는 남겨도 무방 (레이아웃 안정성)
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="w-full max-w-[980px] mx-auto bg-panel/95 backdrop-blur-md p-3 rounded-xl shadow-lg"
    >
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.elements.namedItem(
            "word"
          ) as HTMLInputElement;
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
            // iOS 주소창/툴바 수축 유도
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
      <p className="text-[12px] opacity-70 mt-1">
        게임 종료 시 Enter로 바로 재시작 가능
      </p>
    </div>
  );
}
