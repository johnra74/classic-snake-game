import { useEffect, useRef } from 'react';

/**
 * Invokes `onTick` every `intervalMs` while `running` is true. The latest
 * callback is always used (no stale closures) and the timer is recreated when
 * the interval changes so speed-ups take effect immediately.
 */
export function useGameLoop(intervalMs: number, running: boolean, onTick: () => void): void {
  const savedTick = useRef(onTick);
  savedTick.current = onTick;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => savedTick.current(), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, running]);
}
