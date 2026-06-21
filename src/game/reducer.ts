import { freeCells, pointsEqual } from './board';
import { placeFood } from './food';
import { foodPoints } from './scoring';
import { hitsSelf, hitsWall, isReversal, moveSnake, nextHead } from './snake';
import type { BoardSize, Direction, GameState, Point, Rng } from './types';

export type GameAction =
  | { type: 'START' }
  | { type: 'RESTART' }
  | { type: 'CHANGE_DIRECTION'; direction: Direction }
  | { type: 'TICK' };

/** The cell the snake starts on: the centre of the board. */
function startCell(board: BoardSize): Point {
  return { x: Math.floor(board.cols / 2), y: Math.floor(board.rows / 2) };
}

/**
 * Builds a fresh level-1 game in the `idle` state for the given board. Food for
 * level 1 (a single pellet) is placed immediately so the board renders fully.
 */
export function createInitialState(board: BoardSize, rng: Rng = Math.random): GameState {
  const snake = [startCell(board)];
  return {
    board,
    snake,
    direction: 'right',
    pendingDirection: 'right',
    food: placeFood(board, snake, 1, rng),
    level: 1,
    score: 0,
    status: 'idle',
  };
}

/**
 * Pure game transition. Randomness for food placement is injected so transitions
 * are deterministic in tests; production passes `Math.random` (the default).
 */
export function gameReducer(
  state: GameState,
  action: GameAction,
  rng: Rng = Math.random,
): GameState {
  switch (action.type) {
    case 'START':
      return state.status === 'idle' ? { ...state, status: 'running' } : state;

    case 'RESTART':
      // Keep the locked board size; reset everything else to a running level 1.
      return { ...createInitialState(state.board, rng), status: 'running' };

    case 'CHANGE_DIRECTION': {
      if (state.status !== 'running') return state;
      if (isReversal(state.direction, action.direction)) return state;
      return { ...state, pendingDirection: action.direction };
    }

    case 'TICK':
      return tick(state, rng);

    default:
      return state;
  }
}

function tick(state: GameState, rng: Rng): GameState {
  if (state.status !== 'running') return state;

  const direction = state.pendingDirection;
  const head = nextHead(state.snake[0], direction);

  if (hitsWall(head, state.board)) {
    return { ...state, status: 'gameover' };
  }

  const eatenIndex = state.food.findIndex((pellet) => pointsEqual(pellet, head));
  const isEating = eatenIndex >= 0;
  const snake = moveSnake(state.snake, direction, isEating);

  if (hitsSelf(snake)) {
    return { ...state, status: 'gameover' };
  }

  if (!isEating) {
    return { ...state, snake, direction };
  }

  const remaining = state.food.filter((_, i) => i !== eatenIndex);
  const score = state.score + foodPoints(state.level);

  if (remaining.length > 0) {
    return { ...state, snake, direction, food: remaining, score };
  }

  // Level complete: advance to the next level, which requires `level` pellets.
  const level = state.level + 1;

  // Win: the board no longer has room for all of the next level's food.
  if (freeCells(state.board, snake).length < level) {
    return { ...state, snake, direction, food: remaining, level, score, status: 'won' };
  }

  return {
    ...state,
    snake,
    direction,
    // Avoid the snake and any pellets still on the board (none here today).
    food: placeFood(state.board, [...snake, ...remaining], level, rng),
    level,
    score,
  };
}
