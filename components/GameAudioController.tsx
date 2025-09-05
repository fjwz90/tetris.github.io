// components/GameAudioController.tsx
"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/state/game";
import type { GameState } from "@/state/game"; // game.ts에서 export한 타입을 가져옵니다.
import {
  initAudio,
  playExplosion,
  playGameOver,
  playTetrisJingle,
  startBGM,
  stopBGM,
} from "@/lib/audio";

// Zustand 스토어 값의 변경을 감지하는 더 안전한 방식의 커스텀 훅
function useStoreChange<T>(
  selector: (state: GameState) => T,
  onChange: (newValue: T, oldValue: T | undefined) => void
) {
  const value = useGameStore(selector);
  const prevValueRef = useRef<T>();

  useEffect(() => {
    // 이전 렌더링 값과 현재 값을 비교하여 변경되었을 때만 콜백 실행
    if (prevValueRef.current !== value) {
      onChange(value, prevValueRef.current);
    }
    // 다음 렌더링을 위해 현재 값을 ref에 저장
    prevValueRef.current = value;
  }, [value, onChange]);
}

export default function GameAudioController() {
  const isGameActive = useRef(false);

  // 컴포넌트가 처음 마운트될 때 오디오 초기화를 위한 이벤트 리스너 설정
  useEffect(() => {
    const handleFirstInteraction = () => {
      initAudio();
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };

    window.addEventListener("pointerdown", handleFirstInteraction);
    window.addEventListener("keydown", handleFirstInteraction);

    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      stopBGM(); // 컴포넌트가 사라질 때 BGM 정지
    };
  }, []);

  // gameStatus 상태 변화 감지
  useStoreChange(
    (s) => s.gameStatus,
    (newStatus, oldStatus) => {
      if (newStatus === "playing" && oldStatus !== "playing") {
        startBGM();
        isGameActive.current = true;
      } else if (newStatus === "lost" && isGameActive.current) {
        stopBGM();
        playGameOver();
        isGameActive.current = false;
      } else if (newStatus === "won" && isGameActive.current) {
        stopBGM();
        playTetrisJingle();
        isGameActive.current = false;
      } else if (newStatus === "level_clear" && oldStatus === "playing") {
        playTetrisJingle();
      }
    }
  );

  // wordsCleared 상태 변화 감지 (단어 제거 시 효과음)
  useStoreChange(
    (s) => s.wordsCleared,
    (newCleared, oldCleared) => {
      // oldCleared가 undefined가 아닐 때(첫 렌더링 제외) 그리고 값이 증가했을 때만 실행
      if (typeof oldCleared !== "undefined" && newCleared > oldCleared) {
        playExplosion();
      }
    }
  );

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
}