import type { CellValue } from '../game/gameTypes';
import GameCell from './GameCell';

interface GameBoardProps {
  board: CellValue[];
  disabled: boolean;
  onCellClick: (index: number) => void;
}

export default function GameBoard({ board, disabled, onCellClick }: GameBoardProps) {
  return (
    <div className="game-board" role="group" aria-label="לוח המשחק" dir="ltr">
      {board.map((value, index) => (
        <GameCell key={index} index={index} value={value} disabled={disabled} onClick={onCellClick} />
      ))}
    </div>
  );
}
