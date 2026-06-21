import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useHighScores } from './useHighScores';
import { MemoryHighScoreStore } from '../services/storage';

describe('useHighScores', () => {
  it('loads existing scores on mount', () => {
    const store = new MemoryHighScoreStore();
    store.add({ score: 50, level: 3, date: 1 });
    const { result } = renderHook(() => useHighScores(store));
    expect(result.current.scores.map((s) => s.score)).toEqual([50]);
  });

  it('submits a score, updates state and returns its rank', () => {
    const store = new MemoryHighScoreStore();
    store.add({ score: 100, level: 5, date: 1 });
    const { result } = renderHook(() => useHighScores(store));

    let rank: number | null = null;
    act(() => {
      rank = result.current.submit(40, 2);
    });

    expect(rank).toBe(2);
    expect(result.current.scores.map((s) => s.score)).toEqual([100, 40]);
  });
});
