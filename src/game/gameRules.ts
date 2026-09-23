import { COMPUTER, HUMAN, type CellValue, type GameResult, type GameState, type Player } from './gameTypes';

export const BOARD_SIZE = 9;

// Board indices:
// 0 | 1 | 2
// 3 | 4 | 5
// 6 | 7 | 8
export const WINNING_LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function createEmptyBoard(): CellValue[] {
  return Array<CellValue>(BOARD_SIZE).fill(null);
}

export function createInitialGameState(): GameState {
  return { board: createEmptyBoard(), result: 'playing', isComputerTurn: false, winningCells: [] };
}

function findWinningLine(board: CellValue[]): readonly [number, number, number] | undefined {
  return WINNING_LINES.find(([a, b, c]) => board[a] !== null && board[a] === board[b] && board[a] === board[c]);
}

export function getWinner(board: CellValue[]): Player | null {
  const line = findWinningLine(board);
  return line ? board[line[0]] : null;
}

export function getWinningCells(board: CellValue[]): number[] {
  const line = findWinningLine(board);
  return line ? [...line] : [];
}

export function isBoardFull(board: CellValue[]): boolean {
  return board.every((cell) => cell !== null);
}

export function getGameResult(board: CellValue[]): GameResult {
  const winner = getWinner(board);
  if (winner === HUMAN) return 'player-won';
  if (winner === COMPUTER) return 'computer-won';
  return isBoardFull(board) ? 'draw' : 'playing';
}

export function getAvailableMoves(board: CellValue[]): number[] {
  const moves: number[] = [];
  board.forEach((cell, index) => {
    if (cell === null) moves.push(index);
  });
  return moves;
}

export function isValidMove(board: CellValue[], cellIndex: number): boolean {
  return Number.isInteger(cellIndex) && cellIndex >= 0 && cellIndex < BOARD_SIZE && board[cellIndex] === null;
}

export function placeMark(board: CellValue[], cellIndex: number, player: Player): CellValue[] {
  const next = [...board];
  next[cellIndex] = player;
  return next;
}
