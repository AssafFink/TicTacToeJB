import { getAvailableMoves, getWinner, placeMark } from './gameRules';
import { COMPUTER, HUMAN, type CellValue, type Player } from './gameTypes';

const CENTER = 4;
const CORNERS = [0, 2, 6, 8];

type RandomFn = () => number;

function pickRandom(options: number[], random: RandomFn): number {
  return options[Math.floor(random() * options.length)];
}

function findWinningMove(board: CellValue[], player: Player): number | undefined {
  return getAvailableMoves(board).find((move) => getWinner(placeMark(board, move, player)) === player);
}

/**
 * Rule-based computer move: win → block → center → random corner → random other cell.
 * Intentionally ignores forks, so the player can still win.
 * Returns null when there is no legal move.
 */
export function chooseComputerMove(board: CellValue[], random: RandomFn = Math.random): number | null {
  const available = getAvailableMoves(board);
  if (available.length === 0 || getWinner(board) !== null) return null;

  const winningMove = findWinningMove(board, COMPUTER);
  if (winningMove !== undefined) return winningMove;

  const blockingMove = findWinningMove(board, HUMAN);
  if (blockingMove !== undefined) return blockingMove;

  if (available.includes(CENTER)) return CENTER;

  const freeCorners = CORNERS.filter((corner) => available.includes(corner));
  if (freeCorners.length > 0) return pickRandom(freeCorners, random);

  return pickRandom(available, random);
}
