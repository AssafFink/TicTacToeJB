import type { CellValue, Player } from '../game/gameTypes';
import GameCell from './GameCell';

interface GameBoardProps {
  board: CellValue[];
  disabled: boolean;
  winningCells: number[];
  winner: Player | null;
  onCellClick: (index: number) => void;
}

// Overlay coordinates: the board is drawn as a 300×300 box, each cell 100×100.
const cellCenter = (index: number) => ({ x: (index % 3) * 100 + 50, y: Math.floor(index / 3) * 100 + 50 });
const LINE_OVERHANG = 0.3; // extend the line 30% of a cell beyond the outer cell centers

function WinningLine({ cells, winner }: { cells: number[]; winner: Player }) {
  const from = cellCenter(cells[0]);
  const to = cellCenter(cells[cells.length - 1]);
  const dx = (to.x - from.x) / 2;
  const dy = (to.y - from.y) / 2;
  return (
    <svg className="winning-line" viewBox="0 0 300 300" aria-hidden="true" focusable="false">
      <line
        className={winner === 'X' ? 'neon-x' : 'neon-o'}
        pathLength={1}
        x1={from.x - dx * LINE_OVERHANG}
        y1={from.y - dy * LINE_OVERHANG}
        x2={to.x + dx * LINE_OVERHANG}
        y2={to.y + dy * LINE_OVERHANG}
        strokeWidth={8}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function GameBoard({ board, disabled, winningCells, winner, onCellClick }: GameBoardProps) {
  const hasWinner = winner !== null && winningCells.length > 0;

  return (
    <div
      className={hasWinner ? 'game-board game-board--won' : 'game-board'}
      role="group"
      aria-label="לוח המשחק"
      aria-disabled={disabled}
      dir="ltr"
    >
      {board.map((value, index) => (
        <GameCell
          key={index}
          index={index}
          value={value}
          disabled={disabled}
          winning={winningCells.includes(index)}
          onClick={onCellClick}
        />
      ))}
      {hasWinner && <WinningLine cells={winningCells} winner={winner} />}
    </div>
  );
}
