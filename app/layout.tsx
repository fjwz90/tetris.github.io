// layout.tsx
export const metadata = { title: "Typing Rain — Starlit" };

// ✅ 뷰포트 설정 (iOS 노치/홈바 영역까지 사용)
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  userScalable: false,
} as const;

import "./globals.css";
import { useEffect } from "react";

function useKeyboardInsets() {
  useEffect(() => {
    const root = document.documentElement;
    const vv = (window as any).visualViewport as VisualViewport | undefined;

    const update = () => {
      if (!vv) return;
      // 레이아웃 뷰포트와 시각 뷰포트 차이로 키보드 높이 추정
      const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      root.style.setProperty("--kb", `${kb}px`);
    };

    update();
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      root.style.setProperty("--kb", "0px");
    };
  }, []);
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useKeyboardInsets();
  return (
    <html lang="vi">
      <body>
        <div className="starfield" />
        <img className="spaceship w-10 md:w-12" src="/spaceship.svg" alt="spaceship" />
        {children}
      </body>
    </html>
  );
}
