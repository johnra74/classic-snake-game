import { describe, expect, it } from 'vitest';
import { BASE_FOOD_POINTS, BASE_TICK_MS } from './constants';
import { foodPoints, speedMultiplier, tickInterval } from './scoring';

describe('scoring & speed', () => {
  it('scales food points by level', () => {
    expect(foodPoints(1)).toBe(BASE_FOOD_POINTS);
    expect(foodPoints(5)).toBe(BASE_FOOD_POINTS * 5);
  });

  it('keeps base speed for the first 10 levels', () => {
    expect(speedMultiplier(1)).toBe(1);
    expect(speedMultiplier(10)).toBe(1);
  });

  it('increases speed 20% every 10 completed levels', () => {
    expect(speedMultiplier(11)).toBeCloseTo(1.2);
    expect(speedMultiplier(20)).toBeCloseTo(1.2);
    expect(speedMultiplier(21)).toBeCloseTo(1.44);
  });

  it('shortens the tick interval as speed rises', () => {
    expect(tickInterval(1)).toBe(BASE_TICK_MS);
    expect(tickInterval(11)).toBeCloseTo(BASE_TICK_MS / 1.2);
    expect(tickInterval(11)).toBeLessThan(tickInterval(1));
  });
});
