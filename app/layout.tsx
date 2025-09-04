// app/layout.tsx
export const metadata = { title: "Typing Rain — Starlit" };

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  userScalable: false,
} as const;

import "./globals.css";
import KeyboardInsets from "@/components/KeyboardInsets"; // 있다면 사용, 없어도 무방

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        {/* 키보드 높이 변화를 CSS 변수로 반영 (컴포넌트가 있다면) */}
        <KeyboardInsets />
        <div className="starfield" />
        <img className="spaceship w-10 md:w-12" src="/spaceship.svg" alt="spaceship" />
        {children}
      </body>
    </html>
  );
}
