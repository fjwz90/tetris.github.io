"use client";

import { useEffect } from "react";

export default function KeyboardInsets() {
  useEffect(() => {
    const root = document.documentElement;
    const vv = window.visualViewport;

    const update = () => {
      if (!vv) return;
      const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      root.style.setProperty("--kb", `${kb}px`);      // 레이아웃용
      root.style.setProperty("--kb-shift", `${-kb}px`); // 입력바 이동용(있으면)
    };

    update();
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      root.style.setProperty("--kb", "0px");
      root.style.setProperty("--kb-shift", "0px");
    };
  }, []);

  return null;
}
