/**
 * Audio Manager - Web Audio API based pixel-style sound effects
 * Generates retro 8-bit sounds programmatically (no external files needed)
 */

let audioCtx: AudioContext | null = null;

const getContext = (): AudioContext => {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
};

// Helper: play a simple tone
const playTone = (freq: number, duration: number, type: OscillatorType = 'square', volume = 0.15) => {
  try {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not supported or blocked
  }
};

// Play a sequence of tones (melody)
const playSequence = (notes: Array<[number, number]>, type: OscillatorType = 'square', volume = 0.12) => {
  try {
    const ctx = getContext();
    let time = ctx.currentTime;
    notes.forEach(([freq, dur]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + dur);
      time += dur;
    });
  } catch {
    // ignore
  }
};

// Sound Effects
export const sfx = {
  /** UI click */
  click: () => playTone(800, 0.05, 'square', 0.1),

  /** Choice selected */
  select: () => {
    playTone(600, 0.06, 'square', 0.1);
    setTimeout(() => playTone(900, 0.08, 'square', 0.12), 60);
  },

  /** Dialog advance */
  advance: () => playTone(500, 0.04, 'square', 0.08),

  /** Typing effect tick */
  typeTick: () => playTone(400, 0.02, 'square', 0.03),

  /** Goal scored! */
  goal: () => {
    playSequence([
      [523, 0.1], [659, 0.1], [784, 0.1], [1047, 0.3],
    ], 'square', 0.15);
  },

  /** Victory fanfare */
  victory: () => {
    playSequence([
      [523, 0.15], [659, 0.15], [784, 0.15], [1047, 0.2],
      [784, 0.1], [1047, 0.4],
    ], 'square', 0.12);
  },

  /** Sad/loss tone */
  sad: () => {
    playSequence([
      [440, 0.2], [392, 0.2], [349, 0.4],
    ], 'triangle', 0.1);
  },

  /** Achievement unlocked */
  achievement: () => {
    playSequence([
      [784, 0.1], [1047, 0.1], [1318, 0.1], [1568, 0.3],
      [1318, 0.1], [1568, 0.5],
    ], 'square', 0.1);
  },

  /** Save complete */
  save: () => {
    playTone(440, 0.1, 'square', 0.08);
    setTimeout(() => playTone(880, 0.15, 'square', 0.1), 100);
  },

  /** Error / invalid action */
  error: () => {
    playTone(200, 0.15, 'sawtooth', 0.08);
    setTimeout(() => playTone(150, 0.15, 'sawtooth', 0.08), 150);
  },

  /** Page transition */
  transition: () => {
    playSequence([
      [330, 0.1], [440, 0.1], [550, 0.1], [660, 0.2],
    ], 'square', 0.06);
  },
} as const;

// Background Music - simple looping melodies
let bgmOscillators: OscillatorNode[] = [];
let bgmGain: GainNode | null = null;
let bgmPlaying = false;

export const bgm = {
  /** Start a simple ambient background loop */
  startMenu: () => {
    bgm.stop();
    try {
      const ctx = getContext();
      bgmGain = ctx.createGain();
      bgmGain.gain.value = 0.04;
      bgmGain.connect(ctx.destination);

      // Simple ambient drone
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 220;
      osc1.connect(bgmGain);
      osc1.start();

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = 330;
      osc2.connect(bgmGain);
      osc2.start();

      bgmOscillators = [osc1, osc2];
      bgmPlaying = true;
    } catch { /* ignore */ }
  },

  /** Start a more energetic game BGM */
  startGame: () => {
    bgm.stop();
    try {
      const ctx = getContext();
      bgmGain = ctx.createGain();
      bgmGain.gain.value = 0.03;
      bgmGain.connect(ctx.destination);

      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.value = 262;
      osc1.connect(bgmGain);
      osc1.start();

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.value = 392;
      osc2.connect(bgmGain);
      osc2.start();

      bgmOscillators = [osc1, osc2];
      bgmPlaying = true;
    } catch { /* ignore */ }
  },

  /** Set volume */
  setVolume: (vol: number) => {
    if (bgmGain) {
      bgmGain.gain.value = vol * 0.04 / 100;
    }
  },

  /** Stop all BGM */
  stop: () => {
    bgmOscillators.forEach((osc) => {
      try { osc.stop(); } catch { /* already stopped */ }
    });
    bgmOscillators = [];
    bgmPlaying = false;
  },

  isPlaying: () => bgmPlaying,
} as const;
