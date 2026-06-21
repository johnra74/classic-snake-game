import { HIGH_SCORES_KEY, MAX_HIGH_SCORES } from '../game/constants';

export interface HighScore {
  readonly score: number;
  readonly level: number;
  /** Epoch milliseconds the score was recorded. */
  readonly date: number;
}

/**
 * Abstraction over high-score persistence (Dependency Inversion). Components and
 * hooks depend on this interface, not on `localStorage`, so an in-memory fake
 * can be substituted in tests.
 */
export interface HighScoreStore {
  load(): HighScore[];
  /** Adds an entry, returns the new capped & sorted leaderboard. */
  add(entry: HighScore): HighScore[];
  clear(): void;
}

/** Sorts descending by score and caps to MAX_HIGH_SCORES. */
export function rankScores(scores: readonly HighScore[]): HighScore[] {
  return [...scores].sort((a, b) => b.score - a.score).slice(0, MAX_HIGH_SCORES);
}

/** A localStorage-backed store that tolerates unavailable/corrupt storage. */
export class LocalStorageHighScoreStore implements HighScoreStore {
  constructor(
    private readonly storage: Storage,
    private readonly key: string = HIGH_SCORES_KEY,
  ) {}

  load(): HighScore[] {
    try {
      const raw = this.storage.getItem(this.key);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return rankScores(parsed.filter(isHighScore));
    } catch {
      return [];
    }
  }

  add(entry: HighScore): HighScore[] {
    const ranked = rankScores([...this.load(), entry]);
    try {
      this.storage.setItem(this.key, JSON.stringify(ranked));
    } catch {
      // Ignore quota/availability errors; the leaderboard is best-effort.
    }
    return ranked;
  }

  clear(): void {
    try {
      this.storage.removeItem(this.key);
    } catch {
      // Ignore.
    }
  }
}

function isHighScore(value: unknown): value is HighScore {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as HighScore).score === 'number' &&
    typeof (value as HighScore).level === 'number' &&
    typeof (value as HighScore).date === 'number'
  );
}

/** Builds the default store, falling back to an in-memory stub if needed. */
export function createHighScoreStore(): HighScoreStore {
  try {
    if (typeof localStorage !== 'undefined') {
      return new LocalStorageHighScoreStore(localStorage);
    }
  } catch {
    // Access to localStorage can throw in sandboxed contexts.
  }
  return new MemoryHighScoreStore();
}

/** In-memory store used as a fallback and in tests. */
export class MemoryHighScoreStore implements HighScoreStore {
  private scores: HighScore[] = [];

  load(): HighScore[] {
    return rankScores(this.scores);
  }

  add(entry: HighScore): HighScore[] {
    this.scores = rankScores([...this.scores, entry]);
    return this.scores;
  }

  clear(): void {
    this.scores = [];
  }
}
