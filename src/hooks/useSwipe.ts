import { useCallback, useRef } from 'react';
import type { TouchEvent } from 'react';
import type { Direction } from '../game/types';

/** Minimum travel (px) before a touch is treated as a swipe. */
export const SWIPE_THRESHOLD = 24;

/**
 * Resolves a swipe delta to a direction, or null when below the threshold.
 * Pure and exported for direct unit testing.
 */
export function swipeDirection(
  dx: number,
  dy: number,
  threshold = SWIPE_THRESHOLD,
): Direction | null {
  if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return null;
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left';
  }
  return dy > 0 ? 'down' : 'up';
}

interface SwipeHandlers {
  onTouchStart: (event: TouchEvent) => void;
  onTouchEnd: (event: TouchEvent) => void;
}

/** Returns touch handlers that translate swipe gestures into directions. */
export function useSwipe(onDirection: (direction: Direction) => void): SwipeHandlers {
  const start = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((event: TouchEvent) => {
    const touch = event.changedTouches[0];
    start.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const onTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (!start.current) return;
      const touch = event.changedTouches[0];
      const direction = swipeDirection(
        touch.clientX - start.current.x,
        touch.clientY - start.current.y,
      );
      start.current = null;
      if (direction) onDirection(direction);
    },
    [onDirection],
  );

  return { onTouchStart, onTouchEnd };
}
