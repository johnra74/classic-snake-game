import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGameLoop } from './useGameLoop';

describe('useGameLoop', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('ticks on the interval while running', () => {
    const onTick = vi.fn();
    renderHook(() => useGameLoop(100, true, onTick));
    vi.advanceTimersByTime(350);
    expect(onTick).toHaveBeenCalledTimes(3);
  });

  it('does not tick while paused', () => {
    const onTick = vi.fn();
    renderHook(() => useGameLoop(100, false, onTick));
    vi.advanceTimersByTime(500);
    expect(onTick).not.toHaveBeenCalled();
  });

  it('uses the latest callback without resetting the timer', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(({ cb }) => useGameLoop(100, true, cb), {
      initialProps: { cb: first },
    });
    rerender({ cb: second });
    vi.advanceTimersByTime(100);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
