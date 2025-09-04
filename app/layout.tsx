export const metadata = { title: "Typing Rain — Starlit" };

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
