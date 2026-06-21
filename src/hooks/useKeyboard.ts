import { useEffect } from 'react';
import type { Direction } from '../game/types';

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
  W: 'up',
  S: 'down',
  A: 'left',
  D: 'right',
};

/** Maps arrow / WASD key presses to a direction and forwards them. */
export function useKeyboard(onDirection: (direction: Direction) => void): void {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const direction = KEY_MAP[event.key];
      if (direction) {
        event.preventDefault();
        onDirection(direction);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onDirection]);
}
