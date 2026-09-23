// Synthesized sound effects via the Web Audio API. Any failure is swallowed so audio never blocks the game.

type Wave = OscillatorType;

interface Tone {
  frequency: number;
  endFrequency?: number;
  start: number; // seconds from now
  duration: number;
  type?: Wave;
  volume?: number;
}

let context: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;

function getContext(): AudioContext | null {
  if (context) return context;
  try {
    const Ctor = globalThis.AudioContext;
    if (!Ctor) return null;
    context = new Ctor();
    master = context.createGain();
    master.gain.value = 0.35;
    master.connect(context.destination);
  } catch {
    context = null;
    master = null;
  }
  return context;
}

/** Create or resume the AudioContext. Call from a user gesture (click) so the browser allows playback. */
export function unlock(): void {
  try {
    const ctx = getContext();
    if (ctx && ctx.state === 'suspended') void ctx.resume().catch(() => {});
  } catch {
    // Audio is optional.
  }
}

export function setMuted(value: boolean): void {
  muted = value;
}

function playTones(tones: Tone[], delay = 0): void {
  if (muted) return;
  try {
    const ctx = getContext();
    if (!ctx || !master) return;
    if (ctx.state === 'suspended') void ctx.resume().catch(() => {});

    const now = ctx.currentTime + delay;
    for (const tone of tones) {
      const start = now + tone.start;
      const end = start + tone.duration;
      const volume = tone.volume ?? 0.6;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = tone.type ?? 'sine';
      osc.frequency.setValueAtTime(tone.frequency, start);
      if (tone.endFrequency) osc.frequency.exponentialRampToValueAtTime(tone.endFrequency, end);

      // Short attack and exponential release to avoid clicks.
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);

      osc.connect(gain);
      gain.connect(master);
      osc.start(start);
      osc.stop(end + 0.02);
    }
  } catch {
    // Audio is optional.
  }
}

export function playXSound(): void {
  playTones([{ frequency: 620, endFrequency: 940, start: 0, duration: 0.12, type: 'triangle' }]);
}

export function playOSound(): void {
  playTones([{ frequency: 520, endFrequency: 340, start: 0, duration: 0.14, type: 'sine', volume: 0.7 }]);
}

export function playWinSound(delay = 0): void {
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  playTones(
    notes.map((frequency, i) => ({
      frequency,
      start: i * 0.1,
      duration: i === notes.length - 1 ? 0.4 : 0.14,
      type: 'triangle' as const,
    })),
    delay,
  );
}

export function playLoseSound(delay = 0): void {
  const notes = [392, 329.63, 261.63]; // G4 E4 C4
  playTones(
    notes.map((frequency, i) => ({
      frequency,
      endFrequency: i === notes.length - 1 ? 196 : undefined,
      start: i * 0.16,
      duration: i === notes.length - 1 ? 0.45 : 0.18,
      type: 'sawtooth' as const,
      volume: 0.25,
    })),
    delay,
  );
}

export function playDrawSound(delay = 0): void {
  playTones(
    [
      { frequency: 440, start: 0, duration: 0.18, type: 'sine' },
      { frequency: 440, start: 0.22, duration: 0.25, type: 'sine' },
    ],
    delay,
  );
}
