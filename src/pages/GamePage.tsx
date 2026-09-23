import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';
import type { LayoutContext } from '../components/AppLayout';
import GameBoard from '../components/GameBoard';
import MuteButton from '../components/MuteButton';
import NewGameButton from '../components/NewGameButton';
import ResultMessage from '../components/ResultMessage';
import { chooseComputerMove } from '../game/computerPlayer';
import { createInitialGameState, getGameResult, getWinningCells, isValidMove, placeMark } from '../game/gameRules';
import { COMPUTER, HUMAN, type GameState, type Player } from '../game/gameTypes';

const COMPUTER_DELAY_MS = 500;

function applyMove(state: GameState, cellIndex: number, player: Player): GameState {
  const board = placeMark(state.board, cellIndex, player);
  const result = getGameResult(board);
  return {
    board,
    result,
    isComputerTurn: result === 'playing' && player === HUMAN,
    winningCells: getWinningCells(board),
  };
}

export default function GamePage() {
  const { muted, toggleMuted } = useOutletContext<LayoutContext>();
  const [game, setGame] = useState<GameState>(createInitialGameState);

  // Computer turn: the cleanup cancels a pending move on new game, unmount and route change.
  useEffect(() => {
    if (!game.isComputerTurn) return;

    const timer = window.setTimeout(() => {
      setGame((current) => {
        if (!current.isComputerTurn || current.result !== 'playing') return current;
        const move = chooseComputerMove(current.board);
        return move === null ? { ...current, isComputerTurn: false } : applyMove(current, move, COMPUTER);
      });
    }, COMPUTER_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [game.isComputerTurn]);

  const handleCellClick = (cellIndex: number) => {
    setGame((current) => {
      if (current.result !== 'playing' || current.isComputerTurn || !isValidMove(current.board, cellIndex)) {
        return current;
      }
      return applyMove(current, cellIndex, HUMAN);
    });
  };

  const handleNewGame = () => setGame(createInitialGameState());

  const boardLocked = game.isComputerTurn || game.result !== 'playing';

  return (
    <section className="page">
      <h1 className="visually-hidden">משחק</h1>
      <div className="game__toolbar">
        <MuteButton muted={muted} onToggle={toggleMuted} />
      </div>
      <GameBoard
        board={game.board}
        disabled={boardLocked}
        winningCells={game.winningCells}
        onCellClick={handleCellClick}
      />
      <ResultMessage result={game.result} />
      <NewGameButton onClick={handleNewGame} />
    </section>
  );
}
