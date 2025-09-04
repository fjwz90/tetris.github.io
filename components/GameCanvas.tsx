"use client";
import { useEffect, useRef } from "react";
import { useCanvasDPR } from "../hooks/useCanvasDPR";
import { useGameStore } from "../state/game";

type DropWord = { text: string; x: number; y: number; w: number };

const WORDS = [
  "phương đẹp","phương xinh","phương hiền","phương ngoan","phương giỏi", "phương ngọt","phương dễ","phương ngầu","phương quý","phương sang", "phương tươi","phương sáng","phương vui","phương chăm","phương khỏe", "phương nhanh","phương khéo","phương tin","phương ấm","phương dịu", "phương hiếu","phương tinh","phương trong","phương an","phương bền", "phương sâu","phương khôn","phương mềm","phương êm","phương hay", "phương hiếm","phương thơm","phương giòn","phương mới","phương quen", "phương ngây","phương tĩnh","phương bình","phương khích","phương nhiệt", "phương trẻ","phương mát","phương dễ thương","phương quý phái","phương vui vẻ"
];

export default function GameCanvas() {
  const cvsRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const rafRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const levelClearTimerRef = useRef<NodeJS.Timeout | null>(null);

  const measureRef = useRef<(t: string) => number>(() => 0);
  const wordsRef = useRef<DropWord[]>([]);
  const availableWordsRef = useRef<string[]>([]);
  const startTimeRef = useRef<number>(0);
  const correctCharsRef = useRef<number>(0);

  const {
    gameStatus, setGameStatus, restartSignal, setSubmit, nextLevel,
    wordsPerLevel, wordsCleared, incCleared, addScore,
    baseSpeed, level
  } = useGameStore(s => s);

  useCanvasDPR(cvsRef);

  // 캔버스 초기 설정
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

  // 단어 제출 로직
  useEffect(() => {
    const submit = (typed: string) => {
      if (!typed || gameStatus !== 'playing') return;
      
      const arr = wordsRef.current;
      const idx = arr.findIndex(w => w.text === typed);

      if (idx !== -1) {
        arr.splice(idx, 1);
        correctCharsRef.current += typed.length;
        addScore(typed.length);
        incCleared();
      }
    };
    setSubmit(submit);
  }, [gameStatus, addScore, incCleared, setSubmit]);

  // 레벨 시작 로직
  useEffect(() => {
    wordsRef.current = [];
    if (level === 1) {
        availableWordsRef.current = [...WORDS];
    }
    correctCharsRef.current = 0;
    startTimeRef.current = performance.now();
    
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    if (levelClearTimerRef.current) clearTimeout(levelClearTimerRef.current);

    const wordsToSpawnThisLevel: string[] = [];
    for (let i = 0; i < wordsPerLevel; i++) {
        if (availableWordsRef.current.length === 0) break;
        const wordIndex = Math.floor(Math.random() * availableWordsRef.current.length);
        wordsToSpawnThisLevel.push(availableWordsRef.current.splice(wordIndex, 1)[0]);
    }
    
    if (wordsToSpawnThisLevel.length === 0 && wordsRef.current.length === 0) {
        setGameStatus('won');
        return;
    }

    let spawnCount = 0;
    spawnTimerRef.current = setInterval(() => {
        if (spawnCount < wordsToSpawnThisLevel.length) {
            spawnWord(wordsToSpawnThisLevel[spawnCount]);
            spawnCount++;
        } else {
            if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
        }
    }, 1500); // 1.5초마다 단어 생성

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const step = () => { draw(); rafRef.current = requestAnimationFrame(step); };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      if (levelClearTimerRef.current) clearTimeout(levelClearTimerRef.current);
    };
  }, [restartSignal, level, wordsPerLevel, setGameStatus, setSubmit]);

  // 레벨 클리어 조건 확인
  useEffect(() => {
      if (gameStatus === 'playing' && wordsCleared > 0 && wordsCleared === wordsPerLevel) {
          if (wordsRef.current.length === 0) {
            setGameStatus('level_clear');
          }
      }
  }, [wordsCleared, wordsPerLevel, gameStatus, setGameStatus]);

  // 레벨 클리어 후 다음 레벨로 전환
  useEffect(() => {
      if (gameStatus === 'level_clear') {
          levelClearTimerRef.current = setTimeout(() => {
              nextLevel();
          }, 2000); // 2초 후 다음 레벨
      }
  }, [gameStatus, nextLevel]);

  function spawnWord(text: string) {
    if (!cvsRef.current) return;
    const cvs = cvsRef.current;
    const MARGIN = 24;
    const w = measureRef.current(text);
    const maxX = Math.max(MARGIN, cvs.clientWidth - w - MARGIN);
    const x = randInt(MARGIN, maxX);
    wordsRef.current.push({ text, x, y: -30, w });
  }

  function draw() {
    if (!ctxRef.current || !cvsRef.current) return;
    const cvs = cvsRef.current;
    const ctx = ctxRef.current;
    const W = cvs.clientWidth;
    const H = cvs.clientHeight;

    ctx.clearRect(0, 0, W, H);
    
    // 게임 상태가 'playing'이 아닐 경우 WPM 업데이트 및 그리기를 중단합니다.
    if (gameStatus !== 'playing') {
        return;
    }

    // WPM 계산 및 상태 업데이트 로직을 'playing' 상태일 때만 실행하도록 이동
    const elapsed = (performance.now() - startTimeRef.current) / 1000;
    const minutes = Math.max(1 / 60, elapsed / 60);
    const wpm = (correctCharsRef.current / 5) / minutes;
    useGameStore.getState().setWpm(wpm); // 리렌더링 없이 상태 업데이트

    ctx.textBaseline = "top";
    ctx.font = "20px Noto Sans, system-ui, Arial, sans-serif";

    const dt = 1 / 60;
    const speed = baseSpeed;
    let hit = false;

    for (const w of wordsRef.current) {
      w.y += speed * dt;
      const near = (H - w.y) < 150;
      ctx.fillStyle = near ? "#ff8c8c" : "#ececec";
      ctx.fillText(w.text, w.x, w.y);
      if (w.y + 22 >= H) { hit = true; }
    }
    
    if (hit) {
      setGameStatus('lost');
    }
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

