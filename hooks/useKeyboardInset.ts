"use client";
import { useEffect, useRef, useState } from "react";

export function useKeyboardInset() {
  const ref = useRef<HTMLDivElement>(null);
  const [kbShiftPx, setKbShiftPx] = useState(0);
  const [inputBarH, setInputBarH] = useState(0);

  const recalc = () => {
    const el = ref.current;
    if (!el) return;
    setInputBarH(Math.ceil(el.getBoundingClientRect().height));
    if (window.visualViewport) {
      const vv = window.visualViewport;
      const shift = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop));
      setKbShiftPx(shift);
    } else {
      setKbShiftPx(0);
    }
  };

  useEffect(() => {
    recalc();
    window.visualViewport?.addEventListener("resize", recalc);
    window.visualViewport?.addEventListener("scroll", recalc);
    const ro = new ResizeObserver(recalc);
    if (ref.current) ro.observe(ref.current);
    return () => {
      window.visualViewport?.removeEventListener("resize", recalc);
      window.visualViewport?.removeEventListener("scroll", recalc);
      ro.disconnect();
    };
  }, []);

  return { kbShiftPx, inputBarH, ref };
}
