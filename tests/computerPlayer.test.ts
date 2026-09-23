import { describe, expect, it } from 'vitest';
import { chooseComputerMove } from '../src/game/computerPlayer';
import { getAvailableMoves, getGameResult, placeMark } from '../src/game/gameRules';
import type { CellValue } from '../src/game/gameTypes';

function board(cells: string): CellValue[] {
  return [...cells].map((c) => (c === '.' ? null : (c as 'X' | 'O')));
}

/** Deterministic PRNG (mulberry32) for reproducible random tests. */
function seeded(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('chooseComputerMove', () => {
  it('takes a winning move', () => {
    // O can win at 5 (row 3-4-5).
    expect(chooseComputerMove(board('XX.OO.X..'))).toBe(5);
  });

  it('prefers winning over blocking', () => {
    // X threatens 2, but O can win at 5.
    expect(chooseComputerMove(board('XX.OO....'))).toBe(5);
  });

  it('blocks the player from winning', () => {
    // X threatens 2 (row 0-1-2).
    expect(chooseComputerMove(board('XX.......'))).toBe(2);
    // X threatens 6 (column 0-3-6).
    expect(chooseComputerMove(board('X..X....O'))).toBe(6);
  });

  it('takes the center when free', () => {
    expect(chooseComputerMove(board('X........'))).toBe(4);
  });

  it('takes a corner when the center is taken', () => {
    const move = chooseComputerMove(board('....X....'), () => 0.99);
    expect([0, 2, 6, 8]).toContain(move);
  });

  it('uses randomness for non-critical corner choices', () => {
    const b = board('....X....');
    expect(chooseComputerMove(b, () => 0)).toBe(0);
    expect(chooseComputerMove(b, () => 0.99)).toBe(8);
  });

  it('returns null when there are no moves or the game is over', () => {
    expect(chooseComputerMove(board('XOXXOOOXX'))).toBeNull();
    expect(chooseComputerMove(board('XXX.OO...'))).toBeNull();
  });

  it('never picks an occupied cell across many random games', () => {
    const random = seeded(42);
    for (let game = 0; game < 500; game++) {
      let b: CellValue[] = board('.........');
      while (getGameResult(b) === 'playing') {
        const free = getAvailableMoves(b);
        b = placeMark(b, free[Math.floor(random() * free.length)], 'X');
        if (getGameResult(b) !== 'playing') break;
        const move = chooseComputerMove(b, random);
        expect(move).not.toBeNull();
        expect(b[move!]).toBeNull();
        b = placeMark(b, move!, 'O');
      }
    }
  });

  it('is beatable: the opposite-corners fork wins for X', () => {
    for (const r of [0, 0.99]) {
      let b = placeMark(board('.........'), 0, 'X');
      b = placeMark(b, chooseComputerMove(b, () => r)!, 'O'); // center
      b = placeMark(b, 8, 'X');
      const oCorner = chooseComputerMove(b, () => r)!; // corner 2 or 6 — creates a threat
      b = placeMark(b, oCorner, 'O');
      const block = oCorner === 2 ? 6 : 2;
      b = placeMark(b, block, 'X'); // X blocks and now has two threats
      b = placeMark(b, chooseComputerMove(b, () => r)!, 'O'); // O can block only one
      const winning = getAvailableMoves(b).find((m) => getGameResult(placeMark(b, m, 'X')) === 'player-won');
      expect(winning).toBeDefined();
    }
  });
});
