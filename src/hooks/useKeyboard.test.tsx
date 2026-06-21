import { describe, expect, it, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { useKeyboard } from './useKeyboard';

describe('useKeyboard', () => {
  it('maps arrow keys to directions', () => {
    const onDirection = vi.fn();
    renderHook(() => useKeyboard(onDirection));
    fireEvent.keyDown(window, { key: 'ArrowUp' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(onDirection).toHaveBeenNthCalledWith(1, 'up');
    expect(onDirection).toHaveBeenNthCalledWith(2, 'right');
  });

  it('maps WASD keys (both cases) to directions', () => {
    const onDirection = vi.fn();
    renderHook(() => useKeyboard(onDirection));
    fireEvent.keyDown(window, { key: 'w' });
    fireEvent.keyDown(window, { key: 'D' });
    expect(onDirection).toHaveBeenNthCalledWith(1, 'up');
    expect(onDirection).toHaveBeenNthCalledWith(2, 'right');
  });

  it('ignores unrelated keys', () => {
    const onDirection = vi.fn();
    renderHook(() => useKeyboard(onDirection));
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(onDirection).not.toHaveBeenCalled();
  });
});
