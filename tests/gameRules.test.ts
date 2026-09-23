import { describe, expect, it } from 'vitest';
import {
  WINNING_LINES,
  createEmptyBoard,
  getAvailableMoves,
  getGameResult,
  getWinner,
  getWinningCells,
  isBoardFull,
  isValidMove,
  placeMark,
} from '../src/game/gameRules';
import type { CellValue } from '../src/game/gameTypes';

/** Builds a board from a 9-char string: 'X', 'O' or '.' for empty. */
function board(cells: string): CellValue[] {
  return [...cells].map((c) => (c === '.' ? null : (c as 'X' | 'O')));
}

function boardWithLine(line: readonly number[], player: 'X' | 'O'): CellValue[] {
  const b = createEmptyBoard();
  line.forEach((i) => (b[i] = player));
  return b;
}

describe('getWinner / getWinningCells', () => {
  it.each(WINNING_LINES.map((line) => [line]))('detects X win on %j', (line) => {
    const b = boardWithLine(line, 'X');
    expect(getWinner(b)).toBe('X');
    expect(getWinningCells(b)).toEqual([...line]);
    expect(getGameResult(b)).toBe('player-won');
  });

  it.each(WINNING_LINES.map((line) => [line]))('detects O win on %j', (line) => {
    const b = boardWithLine(line, 'O');
    expect(getWinner(b)).toBe('O');
    expect(getWinningCells(b)).toEqual([...line]);
    expect(getGameResult(b)).toBe('computer-won');
  });

  it('returns no winner for an empty board', () => {
    expect(getWinner(createEmptyBoard())).toBeNull();
    expect(getWinningCells(createEmptyBoard())).toEqual([]);
  });

  it('does not treat a mixed line as a win', () => {
    expect(getWinner(board('XXO......'))).toBeNull();
  });
});

describe('getGameResult', () => {
  it('reports playing for an empty board', () => {
    expect(getGameResult(createEmptyBoard())).toBe('playing');
  });

  it('reports playing for a partial board with no winner', () => {
    expect(getGameResult(board('XO..X...O'))).toBe('playing');
  });

  it('reports a draw for a full board with no winner', () => {
    const b = board('XOXXOOOXX');
    expect(isBoardFull(b)).toBe(true);
    expect(getGameResult(b)).toBe('draw');
  });

  it('prefers a win over a draw when the last move fills the board', () => {
    expect(getGameResult(board('XOXOXOOXX'))).toBe('player-won');
  });
});

describe('moves', () => {
  it('lists available moves', () => {
    expect(getAvailableMoves(board('X...O...X'))).toEqual([1, 2, 3, 5, 6, 7]);
  });

  it('accepts a move on an empty cell', () => {
    expect(isValidMove(createEmptyBoard(), 4)).toBe(true);
  });

  it('rejects a move on an occupied cell', () => {
    expect(isValidMove(board('....X....'), 4)).toBe(false);
  });

  it('rejects out-of-range indices', () => {
    expect(isValidMove(createEmptyBoard(), -1)).toBe(false);
    expect(isValidMove(createEmptyBoard(), 9)).toBe(false);
    expect(isValidMove(createEmptyBoard(), 1.5)).toBe(false);
  });

  it('placeMark returns a new board without mutating the original', () => {
    const original = createEmptyBoard();
    const next = placeMark(original, 3, 'X');
    expect(next[3]).toBe('X');
    expect(original[3]).toBeNull();
    expect(next).not.toBe(original);
  });
});
