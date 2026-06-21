import type { BoardSize, Point } from './types';

/** Returns true when two points occupy the same cell. */
export function pointsEqual(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

/** Returns true when a point lies within the board bounds. */
export function isInsideBoard(point: Point, board: BoardSize): boolean {
  return point.x >= 0 && point.x < board.cols && point.y >= 0 && point.y < board.rows;
}

/** Serialises a point to a stable key for set/map membership checks. */
export function pointKey(point: Point): string {
  return `${point.x},${point.y}`;
}

/** Builds a Set of cell keys occupied by the given points. */
export function occupiedKeys(points: readonly Point[]): Set<string> {
  return new Set(points.map(pointKey));
}

/** Returns every cell on the board that is not occupied by the given points. */
export function freeCells(board: BoardSize, occupied: readonly Point[]): Point[] {
  const taken = occupiedKeys(occupied);
  const cells: Point[] = [];
  for (let y = 0; y < board.rows; y++) {
    for (let x = 0; x < board.cols; x++) {
      const point = { x, y };
      if (!taken.has(pointKey(point))) {
        cells.push(point);
      }
    }
  }
  return cells;
}
