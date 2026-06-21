/** A coordinate on the board grid. */
export interface Point {
  readonly x: number;
  readonly y: number;
}

/** The four movement directions. */
export type Direction = 'up' | 'down' | 'left' | 'right';

/** Lifecycle state of a game session. */
export type GameStatus = 'idle' | 'running' | 'gameover' | 'won';

/** The visual category of a single board cell, used for rendering. */
export type CellKind = 'empty' | 'head' | 'body' | 'food';

/** Dimensions of the (immutable, once started) board. */
export interface BoardSize {
  readonly cols: number;
  readonly rows: number;
}

/** A source of randomness in the range [0, 1). Injected for deterministic tests. */
export type Rng = () => number;

/**
 * The complete, serialisable state of a game. The snake is stored head-first
 * (index 0 is the head). `food` holds every pellet currently on the board.
 */
export interface GameState {
  readonly board: BoardSize;
  readonly snake: readonly Point[];
  readonly direction: Direction;
  /** Buffered direction applied on the next tick (prevents double-turns per tick). */
  readonly pendingDirection: Direction;
  readonly food: readonly Point[];
  readonly level: number;
  readonly score: number;
  readonly status: GameStatus;
}
