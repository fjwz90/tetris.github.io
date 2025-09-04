// page.tsx
import HUD from "@/components/HUD";
import GameCanvas from "@/components/GameCanvas";
import InputBar from "@/components/InputBar";
import GameOverModal from "@/components/GameOverModal";

export default function Page() {
  return (
    // ✅ 전체를 그리드로: [위=콘텐츠(캔버스 포함) / 아래=입력바]
    <main className="h-[100dvh] max-w-[980px] mx-auto p-3 md:p-4 grid grid-rows-[1fr_auto]">
      <header className="mb-2 flex items-center justify-between gap-3">
        <h1 className="text-base md:text-lg font-semibold text-white">
          Mưa Từ — Chế độ Giai đoạn
        </h1>
      </header>

      {/* 게임 HUD + 캔버스 영역 */}
      <section className="kb-avoid relative min-h-0">
        <HUD />
        <div className="absolute inset-0">
          <GameCanvas />
          <GameOverModal />
        </div>
      </section>

      {/* 하단 고정 입력바 (컴포넌트 내부 스타일은 다음 단계 참고) */}
      <div className="typebar">
        <InputBar />
      </div>
    </main>
  );
}
