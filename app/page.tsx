import HUD from "@/components/HUD";
import GameCanvas from "@/components/GameCanvas";
import InputBar from "@/components/InputBar";
import GameOverModal from "@/components/GameOverModal";

export default function Page() {
  return (
    <main className="screen max-w-[980px] mx-auto px-3 md:px-4 py-3 md:py-4">
      {/* 헤더 */}
      <header className="mb-2 flex items-center justify-between gap-3">
        <h1 className="text-base md:text-lg font-semibold text-white">
          Mưa Từ — Chế độ Giai đoạn
        </h1>
      </header>

      {/* 게임 영역: 남는 높이를 모두 차지 (입력바 높이만큼 자동 감산) */}
      <section className="stage-wrap relative">
        {/* 캔버스/모달은 컨테이너를 가득 채움 */}
        <div className="absolute inset-0">
          <GameCanvas />
          <GameOverModal />
        </div>

        {/* HUD 상단 오버레이 */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 p-2 md:p-3">
          <HUD />
        </div>
      </section>

      {/* 하단 고정 입력바: 키보드 뜨면 var(--kb)만큼 위로 */}
      <div
        className="typebar-fixed"
        style={{ bottom: "calc(var(--kb, 0px) + var(--safe-bottom, 0px))" }}
      >
        <InputBar />
      </div>
    </main>
  );
}
