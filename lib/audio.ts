// lib/audio.ts

// 오디오 컨텍스트와 상태를 저장할 변수들
let audioCtx: AudioContext | null = null;
let bgmCtx: AudioContext | null = null;
let bgmGain: GainNode | null = null;
let bgmTimer: NodeJS.Timeout | null = null;
let isUnlocked = false;

// 오디오 컨텍스트 초기화 (사용자 상호작용 시 호출)
export function initAudio() {
  if (isUnlocked || typeof window === 'undefined') return;
  
  const AC = window.AudioContext || (window as any).webkitAudioContext;
  if (!AC) return;
  
  audioCtx = new AC();
  bgmCtx = new AC({ latencyHint: 'interactive' });
  bgmGain = bgmCtx.createGain();
  bgmGain.gain.value = 0.18;
  bgmGain.connect(bgmCtx.destination);

  isUnlocked = true;
  console.log("Audio contexts initialized.");

  // 모바일 브라우저 등에서 중단된 컨텍스트를 재개
  const resumeContexts = () => {
    if (audioCtx?.state === 'suspended') audioCtx.resume();
    if (bgmCtx?.state === 'suspended') bgmCtx.resume();
    window.removeEventListener('pointerdown', resumeContexts);
    window.removeEventListener('keydown', resumeContexts);
  };
  window.addEventListener('pointerdown', resumeContexts);
  window.addEventListener('keydown', resumeContexts);
}

// --- 오디오 유틸리티 함수 ---
function env(ctx: AudioContext, startTime: number, dur: number, startGain = 0.12, endGain = 0.0001) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(startGain, startTime);
  g.gain.exponentialRampToValueAtTime(endGain, startTime + dur);
  return g;
}

function osc(ctx: AudioContext, type: OscillatorType, freq: number) {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.value = freq;
  return o;
}

// --- 효과음 재생 함수 ---
export function playTetrisJingle() {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const seq = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  seq.forEach((f, i) => {
    const t = now + i * 0.08;
    const o = osc(audioCtx!, 'square', f);
    const g = env(audioCtx!, t, 0.12, 0.12);
    o.connect(g).connect(audioCtx!.destination);
    o.start(t);
    o.stop(t + 0.12);
  });
}

export function playExplosion() {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const dur = 0.2;
  const bufferSize = audioCtx.sampleRate * dur;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const src = audioCtx.createBufferSource();
  src.buffer = buffer;
  const g = env(audioCtx, now, dur + 0.05, 0.2);
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1800, now);
  src.connect(filter).connect(g).connect(audioCtx.destination);
  src.start(now);
}

export function playGameOver() {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const freqs = [523.25, 392.00, 329.63, 261.63]; // C5, G4, E4, C4
  freqs.forEach((f, i) => {
    const t = now + i * 0.2;
    const o = osc(audioCtx!, 'square', f);
    const g = env(audioCtx!, t, 0.18, 0.12);
    o.connect(g).connect(audioCtx!.destination);
    o.start(t);
    o.stop(t + 0.18);
  });
}


// --- BGM 관련 함수 ---
const BGM_BPM = 148;
const SIXTEENTH = 60 / BGM_BPM / 4;
const MEL = [[659.25,2],[493.88,1],[523.25,1],[587.33,2],[523.25,2],[493.88,2],[440.00,4],[0,2],[523.25,2],[659.25,4],[587.33,2],[523.25,2],[493.88,4]];
const BASS = [[220.00,2],[329.63,2],[440.00,2],[329.63,2],[196.00,2],[293.66,2],[392.00,2],[293.66,2]];
let tLead = 0, tBass = 0;

function pulse(out: AudioNode, freq: number, t: number, dur: number, duty = 0.25) {
  if (!bgmCtx || !freq) return;
  const oscNode = bgmCtx.createOscillator();
  const real = new Float32Array(2);
  const imag = new Float32Array(2);
  real[1] = Math.cos(Math.PI * duty);
  imag[1] = Math.sin(Math.PI * duty);
  const wave = bgmCtx.createPeriodicWave(real, imag, { disableNormalization: true });
  oscNode.setPeriodicWave(wave);
  oscNode.frequency.setValueAtTime(freq, t);

  const envNode = bgmCtx.createGain();
  envNode.gain.setValueAtTime(0.0001, t);
  envNode.gain.exponentialRampToValueAtTime(1.0, t + 0.01);
  envNode.gain.exponentialRampToValueAtTime(0.6, t + Math.max(0.04, dur * 0.35));
  envNode.gain.setTargetAtTime(0.0001, t + dur - 0.03, 0.02);

  oscNode.connect(envNode).connect(out);
  oscNode.start(t);
  oscNode.stop(t + dur + 0.05);
}

function schedulePhrase() {
  if (!bgmCtx || !bgmGain) return;
  for (const [f, l] of MEL) {
    const d = l * SIXTEENTH * 0.98;
    pulse(bgmGain, f, tLead, d, 0.125);
    tLead += l * SIXTEENTH;
  }
  for (const [f, l] of BASS) {
    const d = l * SIXTEENTH * 0.98;
    pulse(bgmGain, f, tBass, d, 0.5);
    tBass += l * SIXTEENTH;
  }
}

export function startBGM() {
  if (!bgmCtx || !bgmGain) return;
  const now = bgmCtx.currentTime;
  bgmGain.gain.cancelScheduledValues(now);
  bgmGain.gain.setValueAtTime(bgmGain.gain.value, now);
  bgmGain.gain.linearRampToValueAtTime(0.18, now + 0.1);

  tLead = bgmCtx.currentTime + 0.05;
  tBass = tLead;
  
  schedulePhrase();
  if (bgmTimer) clearInterval(bgmTimer);
  bgmTimer = setInterval(() => {
    if (bgmCtx && tLead - bgmCtx.currentTime < 0.4) {
      schedulePhrase();
    }
  }, 50);
}

export function stopBGM() {
  if (!bgmCtx || !bgmGain) return;
  if (bgmTimer) {
    clearInterval(bgmTimer);
    bgmTimer = null;
  }
  const now = bgmCtx.currentTime;
  try {
    bgmGain.gain.cancelScheduledValues(now);
    bgmGain.gain.setTargetAtTime(0.0001, now, 0.06);
  } catch (e) {
    console.error("Error stopping BGM:", e);
  }
}