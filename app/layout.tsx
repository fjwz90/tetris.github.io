// app/layout.tsx
export const metadata = { title: "Typing Rain — Starlit" };
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  userScalable: false,
} as const;

import "./globals.css";
import KeyboardInsets from "@/components/KeyboardInsets";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        {/* 키보드 대응: CSS 변수 갱신 */}
        <KeyboardInsets />
        <div className="starfield" />
        <img className="spaceship w-10 md:w-12" src="/spaceship.svg" alt="spaceship" />
        {children}
      </body>
    </html>
  );
}
