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

  // 키보드 높이 추정 → --kb-shift 업데이트
  useEffect(() => {
    const root = document.documentElement;
    const vv = window.visualViewport;

    const update = () => {
      if (!vv) return;
      const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      // 입력바를 위로 올리기(음수 적용)
      root.style.setProperty("--kb-shift", `${-kb}px`);
    };

    update();
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      root.style.setProperty("--kb-shift", "0px");
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="fixed left-1/2 -translate-x-1/2 bottom-0 z-10 w-[min(980px,100vw)] bg-panel/95 backdrop-blur-md p-3 rounded-t-2xl"
      style={{ transform: "translate(-50%, var(--kb-shift, 0px))" }}
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
          // 모바일 자동 확대 방지(>=16px), 베트남어 입력 친화 옵션
          className="flex-1 bg-panel2 text-white rounded-xl px-4 py-3 text-[16px] md:text-lg border border-black/30 outline-none"
          placeholder="Gõ từ rồi Enter…"
          inputMode="text"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          onFocus={() => {
            // iOS 사파리 주소창/툴바 수축 유도
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
