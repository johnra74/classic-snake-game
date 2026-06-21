import { describe, expect, it } from 'vitest';
import { createInitialState, gameReducer } from './reducer';
import { foodPoints } from './scoring';
import type { GameState } from './types';

const board = { cols: 5, rows: 5 };
const zeroRng = () => 0;

/** Builds a running state with sensible defaults that tests can override. */
function runningState(overrides: Partial<GameState> = {}): GameState {
  return {
    board,
    snake: [{ x: 2, y: 2 }],
    direction: 'right',
    pendingDirection: 'right',
    food: [],
    level: 1,
    score: 0,
    status: 'running',
    ...overrides,
  };
}

describe('createInitialState', () => {
  it('starts idle at level 1 with one centred pellet', () => {
    const state = createInitialState(board, zeroRng);
    expect(state.status).toBe('idle');
    expect(state.level).toBe(1);
    expect(state.score).toBe(0);
    expect(state.snake).toEqual([{ x: 2, y: 2 }]);
    expect(state.food).toHaveLength(1);
  });
});

describe('gameReducer — lifecycle', () => {
  it('START moves idle → running', () => {
    const state = createInitialState(board, zeroRng);
    expect(gameReducer(state, { type: 'START' }).status).toBe('running');
  });

  it('START is a no-op once running', () => {
    const state = runningState();
    expect(gameReducer(state, { type: 'START' })).toBe(state);
  });

  it('RESTART resets to a running level 1 but keeps the board size', () => {
    const ended = runningState({ status: 'gameover', level: 7, score: 999 });
    const restarted = gameReducer(ended, { type: 'RESTART' }, zeroRng);
    expect(restarted.status).toBe('running');
    expect(restarted.level).toBe(1);
    expect(restarted.score).toBe(0);
    expect(restarted.board).toEqual(board);
  });
});

describe('gameReducer — direction', () => {
  it('buffers a valid turn', () => {
    const next = gameReducer(runningState(), {
      type: 'CHANGE_DIRECTION',
      direction: 'up',
    });
    expect(next.pendingDirection).toBe('up');
  });

  it('ignores a direct reversal', () => {
    const next = gameReducer(runningState({ direction: 'right' }), {
      type: 'CHANGE_DIRECTION',
      direction: 'left',
    });
    expect(next.pendingDirection).toBe('right');
  });

  it('ignores direction changes when not running', () => {
    const idle = createInitialState(board, zeroRng);
    expect(gameReducer(idle, { type: 'CHANGE_DIRECTION', direction: 'up' })).toBe(idle);
  });
});

describe('gameReducer — tick movement & eating', () => {
  it('moves the snake without growing on an empty cell', () => {
    const next = gameReducer(runningState(), { type: 'TICK' });
    expect(next.snake).toEqual([{ x: 3, y: 2 }]);
    expect(next.status).toBe('running');
  });

  it('eats a pellet, grows, scores, and keeps the level when food remains', () => {
    const state = runningState({
      level: 2,
      food: [
        { x: 3, y: 2 },
        { x: 0, y: 0 },
      ],
    });
    const next = gameReducer(state, { type: 'TICK' }, zeroRng);
    expect(next.snake).toEqual([
      { x: 3, y: 2 },
      { x: 2, y: 2 },
    ]);
    expect(next.score).toBe(foodPoints(2));
    expect(next.food).toEqual([{ x: 0, y: 0 }]);
    expect(next.level).toBe(2);
  });

  it('wins when the next level cannot fit its food', () => {
    // 2x2 board: snake fills 3 of 4 cells, last pellet on the 4th.
    const tinyBoard = { cols: 2, rows: 2 };
    const state = runningState({
      board: tinyBoard,
      level: 1,
      snake: [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
      direction: 'right',
      pendingDirection: 'right',
      food: [{ x: 1, y: 0 }],
    });
    const next = gameReducer(state, { type: 'TICK' }, zeroRng);
    expect(next.status).toBe('won');
    expect(next.level).toBe(2);
    expect(next.score).toBe(foodPoints(1));
    // The snake grew to fill the board; no new food remains.
    expect(next.snake).toHaveLength(4);
    expect(next.food).toEqual([]);
  });

  it('advances the level and respawns when the last pellet is eaten', () => {
    const state = runningState({ level: 1, food: [{ x: 3, y: 2 }] });
    const next = gameReducer(state, { type: 'TICK' }, zeroRng);
    expect(next.level).toBe(2);
    expect(next.score).toBe(foodPoints(1));
    expect(next.food).toHaveLength(2);
    // New pellets must avoid the snake and stay within the board.
    const snakeKeys = new Set(next.snake.map((p) => `${p.x},${p.y}`));
    for (const pellet of next.food) {
      expect(snakeKeys.has(`${pellet.x},${pellet.y}`)).toBe(false);
      expect(pellet.x).toBeGreaterThanOrEqual(0);
      expect(pellet.x).toBeLessThan(board.cols);
      expect(pellet.y).toBeGreaterThanOrEqual(0);
      expect(pellet.y).toBeLessThan(board.rows);
    }
  });
});

describe('gameReducer — collisions', () => {
  it('ends the game on a wall collision', () => {
    const state = runningState({ snake: [{ x: 4, y: 2 }], direction: 'right', pendingDirection: 'right' });
    expect(gameReducer(state, { type: 'TICK' }).status).toBe('gameover');
  });

  it('ends the game on a self collision', () => {
    const state = runningState({
      snake: [
        { x: 2, y: 2 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
        { x: 3, y: 2 },
        { x: 3, y: 3 },
      ],
      direction: 'right',
      pendingDirection: 'right',
    });
    expect(gameReducer(state, { type: 'TICK' }).status).toBe('gameover');
  });

  it('ignores ticks when not running', () => {
    const idle = createInitialState(board, zeroRng);
    expect(gameReducer(idle, { type: 'TICK' })).toBe(idle);
  });

  it('applies the buffered direction on tick', () => {
    const state = runningState({ direction: 'right', pendingDirection: 'up' });
    const next = gameReducer(state, { type: 'TICK' });
    expect(next.snake).toEqual([{ x: 2, y: 1 }]);
    expect(next.direction).toBe('up');
  });
});
