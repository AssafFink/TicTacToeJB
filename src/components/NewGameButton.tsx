import { ResetIcon } from './icons';

interface NewGameButtonProps {
  onClick: () => void;
}

export default function NewGameButton({ onClick }: NewGameButtonProps) {
  return (
    <button type="button" className="btn btn--secondary game__new-game" onClick={onClick}>
      משחק חדש
      <ResetIcon />
    </button>
  );
}
