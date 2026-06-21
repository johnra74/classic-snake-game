import { describe, expect, it } from 'vitest';
import {
  hitsSelf,
  hitsWall,
  isReversal,
  moveSnake,
  nextHead,
} from './snake';

const board = { cols: 5, rows: 5 };

describe('snake mechanics', () => {
  it('computes the next head per direction', () => {
    const head = { x: 2, y: 2 };
    expect(nextHead(head, 'up')).toEqual({ x: 2, y: 1 });
    expect(nextHead(head, 'down')).toEqual({ x: 2, y: 3 });
    expect(nextHead(head, 'left')).toEqual({ x: 1, y: 2 });
    expect(nextHead(head, 'right')).toEqual({ x: 3, y: 2 });
  });

  it('detects reversals', () => {
    expect(isReversal('up', 'down')).toBe(true);
    expect(isReversal('left', 'right')).toBe(true);
    expect(isReversal('up', 'left')).toBe(false);
  });

  it('moves without growing by dropping the tail', () => {
    const snake = [
      { x: 2, y: 2 },
      { x: 1, y: 2 },
    ];
    expect(moveSnake(snake, 'right', false)).toEqual([
      { x: 3, y: 2 },
      { x: 2, y: 2 },
    ]);
  });

  it('grows by retaining the tail', () => {
    const snake = [
      { x: 2, y: 2 },
      { x: 1, y: 2 },
    ];
    expect(moveSnake(snake, 'right', true)).toEqual([
      { x: 3, y: 2 },
      { x: 2, y: 2 },
      { x: 1, y: 2 },
    ]);
  });

  it('detects wall collisions', () => {
    expect(hitsWall({ x: -1, y: 0 }, board)).toBe(true);
    expect(hitsWall({ x: 0, y: 0 }, board)).toBe(false);
  });

  it('detects when the head overlaps any body segment', () => {
    const colliding = [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 1 },
    ];
    expect(hitsSelf(colliding)).toBe(true);

    const clear = [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ];
    expect(hitsSelf(clear)).toBe(false);
  });
});
