import { useState } from 'react';
import { CELL_PX, MIN_COLS, MIN_ROWS } from '../game/constants';
import type { BoardSize } from '../game/types';

/** Vertical pixels reserved for the HUD so the board never overflows. */
export const HUD_RESERVE_PX = 96;
/** Horizontal/edge padding reserved around the board. */
export const EDGE_RESERVE_PX = 16;

/**
 * Computes the largest board (in cells) that fits the given viewport, clamped to
 * a sensible minimum. Pure and exported for unit testing.
 */
export function computeBoardSize(
  width: number,
  height: number,
  cellPx = CELL_PX,
): BoardSize {
  const cols = Math.floor((width - EDGE_RESERVE_PX) / cellPx);
  const rows = Math.floor((height - HUD_RESERVE_PX) / cellPx);
  return {
    cols: Math.max(MIN_COLS, cols),
    rows: Math.max(MIN_ROWS, rows),
  };
}

/**
 * Measures the viewport once on mount and locks the board size for the whole
 * session. The size is intentionally NOT recomputed on resize so it cannot
 * change once the game starts.
 */
export function useBoardSize(cellPx = CELL_PX): BoardSize {
  const [size] = useState<BoardSize>(() =>
    computeBoardSize(window.innerWidth, window.innerHeight, cellPx),
  );
  return size;
}
