import { isInsideBoard, pointsEqual } from './board';
import type { BoardSize, Direction, Point } from './types';

const DELTAS: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITES: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

/** Returns true when `next` is the direct reverse of `current`. */
export function isReversal(current: Direction, next: Direction): boolean {
  return OPPOSITES[current] === next;
}

/** Computes the cell the head moves into for a given direction. */
export function nextHead(head: Point, direction: Direction): Point {
  const delta = DELTAS[direction];
  return { x: head.x + delta.x, y: head.y + delta.y };
}

/**
 * Moves the snake one step. When `grow` is true the tail is retained so the
 * snake lengthens; otherwise the tail cell is dropped. Returns a new array.
 */
export function moveSnake(
  snake: readonly Point[],
  direction: Direction,
  grow: boolean,
): Point[] {
  const head = nextHead(snake[0], direction);
  const body = grow ? snake : snake.slice(0, -1);
  return [head, ...body];
}

/** True when the head has left the board bounds. */
export function hitsWall(head: Point, board: BoardSize): boolean {
  return !isInsideBoard(head, board);
}

/**
 * True when the head overlaps any other segment. Call this on the snake AFTER
 * moving: a non-growing move already drops the old tail, so the vacated cell is
 * absent from the array and the whole remaining body is a valid collision set.
 */
export function hitsSelf(snake: readonly Point[]): boolean {
  const [head, ...rest] = snake;
  return rest.some((segment) => pointsEqual(segment, head));
}
