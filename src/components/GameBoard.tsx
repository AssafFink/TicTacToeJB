import type { CellValue } from '../game/gameTypes';
import GameCell from './GameCell';

interface GameBoardProps {
  board: CellValue[];
  disabled: boolean;
  winningCells: number[];
  onCellClick: (index: number) => void;
}

export default function GameBoard({ board, disabled, winningCells, onCellClick }: GameBoardProps) {
  return (
    <div className="game-board" role="group" aria-label="לוח המשחק" aria-disabled={disabled} dir="ltr">
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
    </div>
  );
}
