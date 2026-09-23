import { useOutletContext } from 'react-router';
import type { LayoutContext } from '../components/AppLayout';
import GameBoard from '../components/GameBoard';
import MuteButton from '../components/MuteButton';
import NewGameButton from '../components/NewGameButton';
import type { CellValue } from '../game/gameTypes';

const EMPTY_BOARD: CellValue[] = Array(9).fill(null);

export default function GamePage() {
  const { muted, toggleMuted } = useOutletContext<LayoutContext>();

  // Game logic arrives in Milestone 2; for now the board is display-only.
  const handleCellClick = () => {};
  const handleNewGame = () => {};

  return (
    <section className="page">
      <h1 className="visually-hidden">משחק</h1>
      <div className="game__toolbar">
        <MuteButton muted={muted} onToggle={toggleMuted} />
      </div>
      <GameBoard board={EMPTY_BOARD} disabled={false} onCellClick={handleCellClick} />
      <NewGameButton onClick={handleNewGame} />
    </section>
  );
}
