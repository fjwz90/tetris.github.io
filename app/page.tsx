import HUD from "@/components/HUD";
import GameCanvas from "@/components/GameCanvas";
import InputBar from "@/components/InputBar";
import GameOverModal from "@/components/GameOverModal";

export default function Page() {
  return (
    // 화면 높이를 가득 쓰는 3행 그리드: [헤더 | 게임영역(1fr) | 입력바]
    <main className="max-w-[980px] mx-auto px-3 md:px-4 py-3 md:py-4 min-h-[100dvh] grid grid-rows-[auto,1fr,auto] gap-y-0">
      {/* 헤더 */}
      <header className="mb-2 flex items-center justify-between gap-3">
        <h1 className="text-base md:text-lg font-semibold text-white">
          Mưa Từ — Chế độ Giai đoạn
        </h1>
      </header>

      {/* 게임 영역: 가운데 행이 남는 높이를 모두 차지 */}
      <section
        className="relative min-h-0"
        // 키보드가 뜰 때 남는 높이에서 kb만큼 줄여서 캔버스가 계속 보이도록
        style={{ height: "calc(100% - var(--kb, 0px))" }}
      >
        {/* 캔버스/모달은 컨테이너를 가득 채움 */}
        <div className="absolute inset-0">
          <GameCanvas />
          <GameOverModal />
        </div>

        {/* HUD는 상단 오버레이(필요시 내부 여백 조절) */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 p-2 md:p-3">
          <HUD />
        </div>
      </section>

      {/* 입력바: 데스크톱에선 '바로 아래'에 붙음. 모바일에서 키보드 뜨면 위로 살짝 올림 */}
      <div
        className="w-full"
        style={{ transform: "translateY(var(--kb-shift, 0px))" }}
      >
        <InputBar />
      </div>
    </main>
  );
}
