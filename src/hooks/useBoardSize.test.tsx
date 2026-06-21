import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  EDGE_RESERVE_PX,
  HUD_RESERVE_PX,
  computeBoardSize,
  useBoardSize,
} from './useBoardSize';
import { MIN_COLS, MIN_ROWS } from '../game/constants';

describe('computeBoardSize', () => {
  it('fills the viewport minus reserved chrome', () => {
    const size = computeBoardSize(400 + EDGE_RESERVE_PX, 600 + HUD_RESERVE_PX, 20);
    expect(size).toEqual({ cols: 20, rows: 30 });
  });

  it('clamps to a usable minimum on tiny viewports', () => {
    const size = computeBoardSize(50, 50, 24);
    expect(size).toEqual({ cols: MIN_COLS, rows: MIN_ROWS });
  });
});

describe('useBoardSize', () => {
  it('locks a size measured once on mount', () => {
    window.innerWidth = 800;
    window.innerHeight = 600;
    const { result, rerender } = renderHook(() => useBoardSize(20));
    const first = result.current;

    // A later resize must NOT change the locked size.
    window.innerWidth = 200;
    window.innerHeight = 200;
    rerender();

    expect(result.current).toBe(first);
    expect(first.cols).toBeGreaterThan(MIN_COLS);
  });
});
