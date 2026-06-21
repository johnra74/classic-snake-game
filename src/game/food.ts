import { freeCells } from './board';
import type { BoardSize, Point, Rng } from './types';

/**
 * Places `count` pellets on free board cells. Guarantees, by construction:
 * - never overlaps any `occupied` cell (the snake and any existing pellets),
 * - never places two pellets on the same cell (cells are sampled distinctly),
 * - only ever returns cells inside the board grid, i.e. the visible board.
 *
 * `occupied` is the union of every cell that must be avoided. A partial
 * Fisher–Yates shuffle over the free cells keeps placement uniform; randomness
 * is injected for deterministic tests. If fewer free cells exist than requested,
 * every free cell is returned.
 */
export function placeFood(
  board: BoardSize,
  occupied: readonly Point[],
  count: number,
  rng: Rng = Math.random,
): Point[] {
  const cells = freeCells(board, occupied);
  const wanted = Math.min(count, cells.length);
  for (let i = 0; i < wanted; i++) {
    const j = i + Math.floor(rng() * (cells.length - i));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  return cells.slice(0, wanted);
}
