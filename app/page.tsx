// app/page.tsx
import HUD from "@/components/HUD";
import GameCanvas from "@/components/GameCanvas";
import InputBar from "@/components/InputBar";
import GameOverModal from "@/components/GameOverModal";
import GameAudioController from "@/components/GameAudioController"; // 1. import 추가

export default function Page() {
  return (
    <> {/* 2. Fragment(<>)로 감싸기 */}
      <GameAudioController /> {/* 3. 컨트롤러 컴포넌트 추가 */}
      <main className="min-h-[100dvh] max-w-[980px] mx-auto px-3 md:px-4 py-3 md:py-4 grid grid-rows-[auto,1fr,auto] gap-y-2">
        {/* 헤더 */}
        <header className="flex items-center justify-between gap-3">
          <h1 className="text-base md:text-lg font-semibold text-white">
            Mưa Từ — Chế độ Giai đoạn
          </h1>
        </header>

        {/* 게임 영역 */}
        <section className="relative min-h-0">
          <div className="absolute inset-0">
            <GameCanvas />
            <GameOverModal />
          </div>
          <div className="pointer-events-none absolute left-0 right-0 top-0 p-2 md:p-3">
            <HUD />
          </div>
        </section>

        {/* 입력바 */}
        <div style={{ transform: "translateY(var(--kb-shift, 0px))" }}>
          <InputBar />
        </div>
      </main>
    </>
  );
}