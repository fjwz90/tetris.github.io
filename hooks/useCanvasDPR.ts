"use client";
import { useLayoutEffect } from "react";

export function useCanvasDPR(ref: React.RefObject<HTMLCanvasElement>) {
  useLayoutEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = cvs.getBoundingClientRect();
      cvs.width = Math.max(1, Math.round(rect.width * dpr));
      cvs.height = Math.max(1, Math.round(rect.height * dpr));
      const ctx = cvs.getContext("2d");
      if (ctx) { ctx.setTransform(1,0,0,1,0,0); ctx.scale(dpr, dpr); }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cvs);
    window.visualViewport?.addEventListener("resize", resize);
    return () => {
      ro.disconnect();
      window.visualViewport?.removeEventListener("resize", resize);
    };
  }, [ref]);
}
