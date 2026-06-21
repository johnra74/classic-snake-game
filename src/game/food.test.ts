import { describe, expect, it } from 'vitest';
import { isInsideBoard, pointKey } from './board';
import { placeFood } from './food';

const board = { cols: 4, rows: 4 };

describe('placeFood', () => {
  it('places the requested number of pellets', () => {
    const food = placeFood(board, [{ x: 0, y: 0 }], 3, () => 0);
    expect(food).toHaveLength(3);
  });

  it('never overlaps any occupied cell (snake or existing food)', () => {
    const snake = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ];
    const existingFood = [
      { x: 3, y: 3 },
      { x: 2, y: 2 },
    ];
    const occupied = [...snake, ...existingFood];
    const occupiedKeys = new Set(occupied.map(pointKey));
    const food = placeFood(board, occupied, 5, () => 0.5);
    for (const pellet of food) {
      expect(occupiedKeys.has(pointKey(pellet))).toBe(false);
    }
  });

  it('never places two pellets on the same cell', () => {
    const food = placeFood(board, [], 8, Math.random);
    const keys = new Set(food.map(pointKey));
    expect(keys.size).toBe(food.length);
  });

  it('only ever returns cells inside the board grid', () => {
    const food = placeFood(board, [], board.cols * board.rows, Math.random);
    for (const pellet of food) {
      expect(isInsideBoard(pellet, board)).toBe(true);
    }
  });

  it('clamps the count to the number of free cells', () => {
    const fullExceptOne = [];
    for (let y = 0; y < board.rows; y++) {
      for (let x = 0; x < board.cols; x++) {
        if (!(x === 3 && y === 3)) fullExceptOne.push({ x, y });
      }
    }
    const food = placeFood(board, fullExceptOne, 10, () => 0);
    expect(food).toEqual([{ x: 3, y: 3 }]);
  });

  it('defaults to Math.random when no rng is supplied', () => {
    const food = placeFood(board, [], 2);
    expect(food).toHaveLength(2);
  });
});
