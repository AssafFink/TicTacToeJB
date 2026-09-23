export type Player = 'X' | 'O';

export type CellValue = Player | null;

export type GameResult = 'playing' | 'player-won' | 'computer-won' | 'draw';

export interface GameState {
  board: CellValue[];
  result: GameResult;
  isComputerTurn: boolean;
  winningCells: number[];
}

export const HUMAN: Player = 'X';
export const COMPUTER: Player = 'O';
