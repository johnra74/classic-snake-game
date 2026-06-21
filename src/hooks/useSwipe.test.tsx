import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { swipeDirection, useSwipe } from './useSwipe';
import type { Direction } from '../game/types';

describe('swipeDirection', () => {
  it('returns null below the threshold', () => {
    expect(swipeDirection(5, 5)).toBeNull();
  });

  it('resolves horizontal swipes', () => {
    expect(swipeDirection(40, 0)).toBe('right');
    expect(swipeDirection(-40, 0)).toBe('left');
  });

  it('resolves vertical swipes', () => {
    expect(swipeDirection(0, 40)).toBe('down');
    expect(swipeDirection(0, -40)).toBe('up');
  });
});

function Harness({ onDirection }: { onDirection: (d: Direction) => void }) {
  const handlers = useSwipe(onDirection);
  return <div data-testid="surface" {...handlers} />;
}

describe('useSwipe', () => {
  it('emits a direction from a touch gesture', () => {
    const onDirection = vi.fn();
    const { getByTestId } = render(<Harness onDirection={onDirection} />);
    const surface = getByTestId('surface');

    fireEvent.touchStart(surface, { changedTouches: [{ clientX: 0, clientY: 0 }] });
    fireEvent.touchEnd(surface, { changedTouches: [{ clientX: 60, clientY: 0 }] });

    expect(onDirection).toHaveBeenCalledWith('right');
  });

  it('does nothing for a tap below the threshold', () => {
    const onDirection = vi.fn();
    const { getByTestId } = render(<Harness onDirection={onDirection} />);
    const surface = getByTestId('surface');

    fireEvent.touchStart(surface, { changedTouches: [{ clientX: 10, clientY: 10 }] });
    fireEvent.touchEnd(surface, { changedTouches: [{ clientX: 12, clientY: 12 }] });

    expect(onDirection).not.toHaveBeenCalled();
  });

  it('ignores a touch end without a preceding start', () => {
    const onDirection = vi.fn();
    const { getByTestId } = render(<Harness onDirection={onDirection} />);
    fireEvent.touchEnd(getByTestId('surface'), {
      changedTouches: [{ clientX: 60, clientY: 0 }],
    });
    expect(onDirection).not.toHaveBeenCalled();
  });
});
