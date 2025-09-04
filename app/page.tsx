import HUD from "@/components/HUD";
import GameCanvas from "@/components/GameCanvas";
import InputBar from "@/components/InputBar";
import GameOverModal from "@/components/GameOverModal";

export default function Page() {
  return (
    <main className="min-h-[100svh] max-w-[980px] mx-auto p-3 md:p-4 flex flex-col">
      <header className="mb-2 flex items-center justify-between gap-3">
        <h1 className="text-base md:text-lg font-semibold text-white">Mưa Từ — Chế độ Giai đoạn</h1>
      </header>
      <HUD />
      <section className="relative flex-1 min-h-0">
        <GameCanvas />
        <GameOverModal />
      </section>
      <InputBar />
    </main>
  );
}
