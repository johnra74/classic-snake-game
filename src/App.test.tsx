import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { MemoryHighScoreStore } from './services/storage';

describe('App integration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.innerWidth = 320;
    window.innerHeight = 320;
  });
  afterEach(() => vi.useRealTimers());

  function advance(ms: number) {
    act(() => {
      vi.advanceTimersByTime(ms);
    });
  }

  it('shows the start hint before any input', () => {
    render(<App store={new MemoryHighScoreStore()} />);
    expect(screen.getByText(/press an arrow key or swipe/i)).toBeInTheDocument();
  });

  it('starts the game from a swipe over the play area (incl. the idle hint)', () => {
    render(<App store={new MemoryHighScoreStore()} />);
    // The play area owns swipe handling, so a swipe works even while the
    // start-hint overlay covers the board.
    const stage = screen.getByText(/press an arrow key or swipe/i).closest('main')!;

    act(() => {
      fireEvent.touchStart(stage, { changedTouches: [{ clientX: 10, clientY: 10 }] });
      fireEvent.touchEnd(stage, { changedTouches: [{ clientX: 80, clientY: 10 }] });
    });

    // Game has started: the hint is gone and the snake moves on the next tick.
    expect(screen.queryByText(/press an arrow key/i)).not.toBeInTheDocument();
    advance(160);
    expect(screen.getByTestId('board')).toBeInTheDocument();
  });

  it('starts on key press and runs to game over against the wall', () => {
    const store = new MemoryHighScoreStore();
    render(<App store={store} />);

    act(() => {
      fireEvent.keyDown(window, { key: 'ArrowRight' });
    });
    expect(screen.queryByText(/press an arrow key/i)).not.toBeInTheDocument();

    // Drive straight right until the snake leaves the board.
    advance(160 * 30);

    expect(screen.getByRole('dialog', { name: /game over/i })).toBeInTheDocument();
    // The finished game was recorded to the store.
    expect(store.load().length).toBe(1);
  });

  it('restarts a finished game from the overlay', () => {
    render(<App store={new MemoryHighScoreStore()} />);
    act(() => {
      fireEvent.keyDown(window, { key: 'ArrowRight' });
    });
    advance(160 * 30);
    expect(screen.getByRole('dialog', { name: /game over/i })).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /play again/i }));
    });
    expect(screen.queryByRole('dialog', { name: /game over/i })).not.toBeInTheDocument();
    expect(screen.getByTestId('board')).toBeInTheDocument();
  });
});
