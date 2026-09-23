import { describe, expect, it } from 'vitest';
import {
  playDrawSound,
  playLoseSound,
  playOSound,
  playWinSound,
  playXSound,
  setMuted,
  unlock,
} from '../src/audio/audioEngine';

const playAll = () => {
  unlock();
  playXSound();
  playOSound();
  playWinSound();
  playLoseSound();
  playDrawSound();
};

describe('audioEngine without Web Audio support', () => {
  it('does not throw when AudioContext is unavailable', () => {
    expect(globalThis.AudioContext).toBeUndefined();
    setMuted(false);
    expect(playAll).not.toThrow();
  });

  it('does not throw while muted', () => {
    setMuted(true);
    expect(playAll).not.toThrow();
    setMuted(false);
  });
});

describe('audioEngine with a failing AudioContext', () => {
  it('swallows constructor errors', () => {
    const original = globalThis.AudioContext;
    globalThis.AudioContext = class {
      constructor() {
        throw new Error('blocked');
      }
    } as unknown as typeof AudioContext;
    try {
      expect(playAll).not.toThrow();
    } finally {
      globalThis.AudioContext = original;
    }
  });
});
