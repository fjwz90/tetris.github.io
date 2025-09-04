import HUD from "@/components/HUD";
import GameCanvas from "@/components/GameCanvas";
import InputBar from "@/components/InputBar";
import GameOverModal from "@/components/GameOverModal";

export default function Page() {
  return (
    <main className="h-[100dvh] max-w-[980px] mx-auto p-3 md:p-4">
      <header className="mb-2 flex items-center justify-between gap-3">
        <h1 className="text-base md:text-lg font-semibold text-white">
          Mưa Từ — Chế độ Giai đoạn
        </h1>
      </header>

      {/* 게임 HUD + 캔버스 + 하단 오버레이 입력바 */}
      <section className="kb-avoid relative min-h-0">
        {/* HUD는 상단에 자유 배치 */}
        <HUD />

        {/* 게임 캔버스는 섹션을 가득 채움 */}
        <div className="absolute inset-0">
          <GameCanvas />
          <GameOverModal />
        </div>

        {/* ⬇️ 입력바: 게임 섹션 안쪽 하단에 오버레이로 붙임 */}
        <div
          className="absolute inset-x-0 bottom-0 p-3"
          style={{ transform: "translateY(var(--kb-shift, 0px))" }}
        >
          <InputBar />
        </div>
      </section>
    </main>
  );
}
