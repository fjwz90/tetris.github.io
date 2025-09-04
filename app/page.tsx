// app/page.tsx
import HUD from "@/components/HUD";
import GameCanvas from "@/components/GameCanvas";
import InputBar from "@/components/InputBar";
import GameOverModal from "@/components/GameOverModal";

export default function Page() {
  return (
    // [헤더 | 게임영역(1fr) | 입력바] — 화면 높이(min-h-[100dvh])를 가득 채움
    <main className="min-h-[100dvh] max-w-[980px] mx-auto px-3 md:px-4 py-3 md:py-4 grid grid-rows-[auto,1fr,auto] gap-y-2">
      {/* 헤더 */}
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-base md:text-lg font-semibold text-white">
          Mưa Từ — Chế độ Giai đoạn
        </h1>
      </header>

      {/* 게임 영역: 가운데 행(1fr)이 남는 높이를 전부 차지 */}
      <section className="relative min-h-0">
        {/* GameCanvas/Modal을 컨테이너에 '가득' 채움 */}
        <div className="absolute inset-0">
          <GameCanvas />
          <GameOverModal />
        </div>

        {/* HUD는 상단 오버레이 */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 p-2 md:p-3">
          <HUD />
        </div>
      </section>

      {/* 입력바: 일반 흐름 — 섹션 바로 '아래'에 붙음
          (모바일에서 키보드 뜨면 --kb-shift 만큼 올라오도록 InputBar가 처리) */}
      <div style={{ transform: "translateY(var(--kb-shift, 0px))" }}>
        <InputBar />
      </div>
    </main>
  );
}
