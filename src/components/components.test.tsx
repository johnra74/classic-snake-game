import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Board } from './Board';
import { Cell } from './Cell';
import { GameOverOverlay } from './GameOverOverlay';
import { HighScoreList } from './HighScoreList';
import { Hud } from './Hud';
import type { GameState } from '../game/types';
import type { HighScore } from '../services/storage';

describe('Cell', () => {
  it('renders the kind as a class and test id', () => {
    render(<Cell kind="food" size={10} />);
    expect(screen.getByTestId('cell-food')).toHaveClass('cell--food');
  });
});

describe('Hud', () => {
  it('shows level, score and remaining food', () => {
    render(<Hud level={3} score={120} foodLeft={2} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});

describe('HighScoreList', () => {
  it('shows an empty state when there are no scores', () => {
    render(<HighScoreList scores={[]} />);
    expect(screen.getByText(/no scores yet/i)).toBeInTheDocument();
  });

  it('renders ranked rows', () => {
    const scores: HighScore[] = [
      { score: 90, level: 4, date: 2 },
      { score: 30, level: 2, date: 1 },
    ];
    render(<HighScoreList scores={scores} />);
    expect(screen.getByTestId('high-scores').children).toHaveLength(2);
    expect(screen.getByText('90')).toBeInTheDocument();
    expect(screen.getByText('Lv 4')).toBeInTheDocument();
  });
});

describe('Board', () => {
  const state: GameState = {
    board: { cols: 3, rows: 3 },
    snake: [
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ],
    direction: 'right',
    pendingDirection: 'right',
    food: [{ x: 2, y: 2 }],
    level: 1,
    score: 0,
    status: 'running',
  };

  it('renders one cell per grid square with correct kinds', () => {
    render(<Board state={state} onTouchStart={() => {}} onTouchEnd={() => {}} />);
    expect(screen.getByTestId('board').children).toHaveLength(9);
    expect(screen.getAllByTestId('cell-head')).toHaveLength(1);
    expect(screen.getAllByTestId('cell-body')).toHaveLength(1);
    expect(screen.getAllByTestId('cell-food')).toHaveLength(1);
    expect(screen.getAllByTestId('cell-empty')).toHaveLength(6);
  });

  it('forwards touch events for swipe handling', () => {
    const onTouchStart = vi.fn();
    const onTouchEnd = vi.fn();
    render(<Board state={state} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} />);
    const board = screen.getByTestId('board');
    fireEvent.touchStart(board, { changedTouches: [{ clientX: 0, clientY: 0 }] });
    fireEvent.touchEnd(board, { changedTouches: [{ clientX: 1, clientY: 1 }] });
    expect(onTouchStart).toHaveBeenCalled();
    expect(onTouchEnd).toHaveBeenCalled();
  });
});

describe('GameOverOverlay', () => {
  const scores: HighScore[] = [{ score: 50, level: 3, date: 1 }];

  it('shows the game-over summary and restarts on click', () => {
    const onRestart = vi.fn();
    render(
      <GameOverOverlay
        outcome="gameover"
        score={50}
        level={3}
        rank={1}
        scores={scores}
        onRestart={onRestart}
      />,
    );
    expect(screen.getByText(/game over/i)).toBeInTheDocument();
    expect(screen.getByText(/reached level/i)).toBeInTheDocument();
    expect(screen.getByText(/new high score/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /play again/i }));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  it('shows the win summary and restarts on click', () => {
    const onRestart = vi.fn();
    render(
      <GameOverOverlay
        outcome="won"
        score={500}
        level={20}
        rank={1}
        scores={scores}
        onRestart={onRestart}
      />,
    );
    expect(screen.getByRole('dialog', { name: /you win/i })).toBeInTheDocument();
    expect(screen.getByText(/you win!/i)).toBeInTheDocument();
    expect(screen.getByText(/completed level/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /play again/i }));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  it('hides the rank banner when the score did not place', () => {
    render(
      <GameOverOverlay
        outcome="gameover"
        score={5}
        level={1}
        rank={null}
        scores={scores}
        onRestart={() => {}}
      />,
    );
    expect(screen.queryByText(/new high score/i)).not.toBeInTheDocument();
  });
});
