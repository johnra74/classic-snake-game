import { useCallback, useState } from 'react';
import type { HighScore, HighScoreStore } from '../services/storage';

interface UseHighScores {
  scores: HighScore[];
  /** Records a finished game and returns the rank (1-based) if it made the board. */
  submit(score: number, level: number): number | null;
}

/** React binding over a HighScoreStore. */
export function useHighScores(store: HighScoreStore): UseHighScores {
  const [scores, setScores] = useState<HighScore[]>(() => store.load());

  const submit = useCallback(
    (score: number, level: number): number | null => {
      const entry: HighScore = { score, level, date: Date.now() };
      const ranked = store.add(entry);
      setScores(ranked);
      const rank = ranked.findIndex(
        (s) => s.score === entry.score && s.date === entry.date,
      );
      return rank >= 0 ? rank + 1 : null;
    },
    [store],
  );

  return { scores, submit };
}
