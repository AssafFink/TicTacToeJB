import { SoundOffIcon, SoundOnIcon } from './icons';

interface MuteButtonProps {
  muted: boolean;
  onToggle: () => void;
}

export default function MuteButton({ muted, onToggle }: MuteButtonProps) {
  return (
    <button
      type="button"
      className="icon-btn"
      aria-label={muted ? 'הפעל שמע' : 'השתק שמע'}
      aria-pressed={muted}
      onClick={onToggle}
    >
      {muted ? <SoundOffIcon /> : <SoundOnIcon />}
    </button>
  );
}
