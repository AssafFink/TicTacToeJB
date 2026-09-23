import type { CellValue } from '../game/gameTypes';
import { OMark, XMark } from './Marks';

interface GameCellProps {
  index: number;
  value: CellValue;
  disabled: boolean;
  winning: boolean;
  onClick: (index: number) => void;
}

const MARK_LABEL = { X: 'איקס', O: 'עיגול' } as const;

export default function GameCell({ index, value, disabled, winning, onClick }: GameCellProps) {
  const label = `תא ${index + 1}${value ? `, ${MARK_LABEL[value]}` : ', ריק'}`;
  const className = winning ? 'game-cell game-cell--winning' : 'game-cell';

  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      disabled={disabled || value !== null}
      onClick={() => onClick(index)}
    >
      {value && (
        <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          {value === 'X' ? <XMark /> : <OMark />}
        </svg>
      )}
    </button>
  );
}
