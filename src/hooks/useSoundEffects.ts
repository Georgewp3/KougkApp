const AudioCtx = typeof window !== "undefined" ? (window.AudioContext || (window as any).webkitAudioContext) : null;

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (!AudioCtx) return null;
  if (!ctx || ctx.state === "closed") ctx = new AudioCtx();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function playTone(freq: number, duration: number, type: OscillatorType = "sine", vol = 0.15) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

export function playRoundWin() {
  const c = getCtx();
  if (!c) return;
  [523, 659, 784, 1047].forEach((f, i) => {
    setTimeout(() => playTone(f, 0.25, "triangle", 0.12), i * 100);
  });
}

export function playBust() {
  playTone(200, 0.4, "sawtooth", 0.1);
  setTimeout(() => playTone(150, 0.5, "sawtooth", 0.1), 150);
}

export function playElimination() {
  [300, 250, 200, 150].forEach((f, i) => {
    setTimeout(() => playTone(f, 0.3, "square", 0.08), i * 120);
  });
}

export function playPerfectCut() {
  [880, 1100, 1320, 1760].forEach((f, i) => {
    setTimeout(() => playTone(f, 0.15, "sine", 0.1), i * 70);
  });
  setTimeout(() => playTone(2093, 0.4, "triangle", 0.08), 300);
}

export function playGameStart() {
  [440, 554, 659, 880].forEach((f, i) => {
    setTimeout(() => playTone(f, 0.2, "triangle", 0.1), i * 120);
  });
}

export function playGameOver() {
  [784, 659, 523, 440, 523, 659, 784, 1047].forEach((f, i) => {
    setTimeout(() => playTone(f, 0.3, "triangle", 0.12), i * 150);
  });
}

export function playClick() {
  playTone(600, 0.05, "sine", 0.06);
}

export function playError() {
  playTone(200, 0.15, "square", 0.08);
  setTimeout(() => playTone(180, 0.15, "square", 0.08), 100);
}
