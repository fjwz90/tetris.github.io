"use client";
import { useEffect, useRef } from "react";
import { useCanvasDPR } from "@/hooks/useCanvasDPR";
import { useGameStore } from "@/state/game";

type DropWord = { text: string; x: number; y: number; w: number; };

const WORDS = [
  "phương đẹp","phương xinh","phương hiền","phương ngoan","phương giỏi",
  "phương ngọt","phương dễ","phương ngầu","phương quý","phương sang",
  "phương tươi","phương sáng","phương vui","phương chăm","phương khỏe",
  "phương nhanh","phương khéo","phương tin","phương ấm","phương dịu",
  "phương hiếu","phương tinh","phương trong","phương an","phương bền",
  "phương sâu","phương khôn","phương mềm","phương êm","phương hay",
  "phương hiếm","phương thơm","phương giòn","phương mới","phương quen",
  "phương ngây","phương tĩnh","phương bình","phương khích","phương nhiệt",
  "phương trẻ","phương mát","phương dễ thương","phương quý phái","phương vui vẻ"
];

export default function GameCanvas() {
  const cvsRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const rafRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<number | null>(null);

  const measureRef = useRef<(t: string) => number>(() => 0);
  const wordsRef = useRef<DropWord[]>([]);
  const startTimeRef = useRef<number>(0);
  const correctCharsRef = useRef<number>(0);

  const { setWpm, setGameOver, gameOver, restartSignal, setSubmit, nextLevel,
          wordsPerLevel, wordsCleared, incCleared, addScore,
          baseSpeed, level } = useGameStore(s => ({
            setWpm: s.setWpm, setGameOver: s.setGameOver, gameOver: s.gameOver,
            restartSignal: s.restartSignal, setSubmit: s.setSubmit,
            nextLevel: s.nextLevel, wordsPerLevel: s.wordsPerLevel,
            wordsCleared: s.wordsCleared, incCleared: s.incCleared,
            addScore: s.addScore, baseSpeed: s.baseSpeed, level: s.level
          }));

  useCanvasDPR(cvsRef);

  useEffect(() => {
    const cvs = cvsRef.current!;
    const ctx = cvs.getContext("2d")!;
    ctxRef.current = ctx;
    measureRef.current = (t: string) => {
      ctx.save();
      ctx.font = "20px Noto Sans, system-ui, Arial, sans-serif";
      const w = ctx.measureText(t).width;
      ctx.restore();
      return w;
    };
  }, []);

  useEffect(() => {
    const submit = (typed: string) => {
      if (!typed) return;
      if (gameOver) return;
      const arr = wordsRef.current;
      const idx = arr.findIndex(w => w.text === typed);
      if (idx !== -1) {
        const w = arr[idx];
        arr.splice(idx, 1);
        correctCharsRef.current += typed.length;
        addScore(1);
        incCleared();
        if (wordsCleared + 1 >= wordsPerLevel) {
          nextLevel();
        }
      }
    };
    setSubmit(submit);
  }, [gameOver, wordsCleared, wordsPerLevel, nextLevel, incCleared, addScore, setSubmit]);

  useEffect(() => {
    wordsRef.current = [];
    correctCharsRef.current = 0;
    startTimeRef.current = performance.now();

    if (spawnTimerRef.current) window.clearInterval(spawnTimerRef.current);
    spawnTimerRef.current = window.setInterval(() => spawnWord(), 1000);

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const step = () => { draw(); rafRef.current = requestAnimationFrame(step); };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [restartSignal]);

  function spawnWord() {
    const cvs = cvsRef.current!;
    const MARGIN = 24;
    const PAD = 40;
    const text = WORDS[Math.floor(Math.random() * WORDS.length)];
    const w = measureRef.current(text);
    const maxX = Math.max(MARGIN, cvs.clientWidth - w - MARGIN);
    let attempts = 0;
    let x = randInt(MARGIN, maxX);
    while (attempts < 30) {
      let overlap = false;
      for (const it of wordsRef.current) {
        if (rangesOverlap(x - PAD, x + w + PAD, it.x - PAD, it.x + it.w + PAD)) {
          overlap = true; break;
        }
      }
      if (!overlap) break;
      x = randInt(MARGIN, maxX);
      attempts++;
    }
    wordsRef.current.push({ text, x, y: -30 - randInt(0, 60), w });
  }

  function draw() {
    const cvs = cvsRef.current!;
    const ctx = ctxRef.current!;
    const W = cvs.clientWidth;
    const H = cvs.clientHeight;

    const elapsed = (performance.now() - startTimeRef.current) / 1000;
    const minutes = Math.max(1 / 60, elapsed / 60);
    const wpm = (correctCharsRef.current / 5) / minutes;
    setWpm(wpm);

    ctx.clearRect(0, 0, W, H);
    ctx.textBaseline = "top";
    ctx.font = "20px Noto Sans, system-ui, Arial, sans-serif";

    const dt = 1 / 60;
    const speed = baseSpeed;

    let hit = false;
    for (const w of wordsRef.current) {
      w.y += speed * dt;
      const near = ((H - 84) - (w.y + 22)) < 60;
      ctx.fillStyle = near ? "#ff8c8c" : "#ececec";
      ctx.fillText(w.text, w.x, w.y);
      if (w.y + 22 >= (H - 84)) { hit = true; }
    }

    if (hit) {
      setGameOver(true);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    }

    ctx.fillStyle = "#1e2127";
    ctx.fillRect(0, H - 84, W, 84);
    ctx.fillStyle = "#3c4148";
    ctx.fillRect(12, H - 84 + 12, W - 24, 84 - 24);
  }

  return (
    <div className="relative h-full">
      <canvas ref={cvsRef} className="w-full h-full rounded-2xl border border-white/10 bg-gradient-to-b from-slate-950 to-slate-900" />
    </div>
  );
}

function randInt(a: number, b: number) {
  return Math.floor(a + Math.random() * (b - a + 1));
}
function rangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
}

