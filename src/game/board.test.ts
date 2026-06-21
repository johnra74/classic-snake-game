import { describe, expect, it } from 'vitest';
import {
  freeCells,
  isInsideBoard,
  occupiedKeys,
  pointKey,
  pointsEqual,
} from './board';

const board = { cols: 3, rows: 3 };

describe('board helpers', () => {
  it('compares points by value', () => {
    expect(pointsEqual({ x: 1, y: 2 }, { x: 1, y: 2 })).toBe(true);
    expect(pointsEqual({ x: 1, y: 2 }, { x: 2, y: 1 })).toBe(false);
  });

  it('detects in/out of bounds', () => {
    expect(isInsideBoard({ x: 0, y: 0 }, board)).toBe(true);
    expect(isInsideBoard({ x: 2, y: 2 }, board)).toBe(true);
    expect(isInsideBoard({ x: -1, y: 0 }, board)).toBe(false);
    expect(isInsideBoard({ x: 3, y: 0 }, board)).toBe(false);
    expect(isInsideBoard({ x: 0, y: 3 }, board)).toBe(false);
  });

  it('builds stable point keys and occupied sets', () => {
    expect(pointKey({ x: 1, y: 2 })).toBe('1,2');
    const set = occupiedKeys([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ]);
    expect(set.has('0,0')).toBe(true);
    expect(set.has('1,1')).toBe(true);
    expect(set.size).toBe(2);
  });

  it('lists only unoccupied cells', () => {
    const occupied = [{ x: 0, y: 0 }];
    const cells = freeCells(board, occupied);
    expect(cells).toHaveLength(8);
    expect(cells.some((c) => c.x === 0 && c.y === 0)).toBe(false);
  });
});
