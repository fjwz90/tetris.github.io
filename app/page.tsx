import HUD from "@/components/HUD";
import GameCanvas from "@/components/GameCanvas";
import InputBar from "@/components/InputBar";
import GameOverModal from "@/components/GameOverModal";

export default function Page() {
  return (
    // 데스크톱에서는 콘텐츠 높이만큼만(불필요한 여백 제거)
    <main className="max-w-[980px] mx-auto p-3 md:p-4">
      <header className="mb-2 flex items-center justify-between gap-3">
        <h1 className="text-base md:text-lg font-semibold text-white">
          Mưa Từ — Chế độ Giai đoạn
        </h1>
      </header>

      {/* 섹션: 모바일=뷰포트 꽉 채움(키보드 회피), 데스크톱=콘텐츠 높이 */}
      <section className="relative kb-avoid md:min-h-0">
        {/* 데스크톱: 캔버스 높이(반응형) 지정 + 정상 흐름
            모바일: 섹션 자체가 100dvh이므로 아래 InputBar를 오버레이로 */}
        <div
          className="relative md:rounded-xl md:border md:border-white/10 md:overflow-hidden md:bg-[#0b0d13]"
          style={{
            // 데스크톱에서 적당한 높이(상황에 맞게 조정 가능)
            height: "clamp(380px, 56vh, 620px)",
          }}
        >
          {/* 캔버스는 컨테이너를 가득 채움 */}
          <div className="absolute inset-0">
            <GameCanvas />
            <GameOverModal />
          </div>

          {/* HUD는 상단에 자유 배치(원래 스타일 유지) */}
          <div className="pointer-events-none absolute left-0 right-0 top-0 p-2 md:p-3">
            <HUD />
          </div>
        </div>

        {/* ⬇️ 입력바: 모바일=오버레이, 데스크톱=캔버스 바로 아래 붙이기 */}
        <div
          className="absolute inset-x-0 bottom-0 p-3 md:static md:p-0 md:mt-2"
          style={{ transform: "translateY(var(--kb-shift, 0px))" }}
        >
          <InputBar />
        </div>
      </section>
    </main>
  );
}
