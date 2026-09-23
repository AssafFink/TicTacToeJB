import type { GameResult } from '../game/gameTypes';

const MESSAGES: Record<Exclude<GameResult, 'playing'>, { title: string; subtitle: string }> = {
  'player-won': { title: 'ניצחת!', subtitle: 'כל הכבוד!' },
  'computer-won': { title: 'הפסדת', subtitle: 'המחשב ניצח הפעם. נסה שוב!' },
  draw: { title: 'תיקו!', subtitle: 'אף אחד לא ניצח.' },
};

interface ResultMessageProps {
  result: GameResult;
}

export default function ResultMessage({ result }: ResultMessageProps) {
  const message = result === 'playing' ? null : MESSAGES[result];

  return (
    <div className="result-slot" aria-live="polite">
      {message && (
        <div className={`result-card result-card--${result}`}>
          <p className="result-card__title">{message.title}</p>
          <p className="result-card__subtitle">{message.subtitle}</p>
        </div>
      )}
    </div>
  );
}
