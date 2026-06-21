import { beforeEach, describe, expect, it } from 'vitest';
import {
  LocalStorageHighScoreStore,
  MemoryHighScoreStore,
  createHighScoreStore,
  rankScores,
  type HighScore,
} from './storage';

function makeStorage(initial: Record<string, string> = {}): Storage {
  const map = new Map<string, string>(Object.entries(initial));
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k) => map.get(k) ?? null,
    key: (i) => [...map.keys()][i] ?? null,
    removeItem: (k) => map.delete(k),
    setItem: (k, v) => map.set(k, v),
  };
}

const entry = (score: number, level = 1): HighScore => ({ score, level, date: score });

describe('rankScores', () => {
  it('sorts descending and caps at the max', () => {
    const ranked = rankScores([entry(10), entry(50), entry(30), entry(20), entry(40), entry(5)]);
    expect(ranked.map((s) => s.score)).toEqual([50, 40, 30, 20, 10]);
  });
});

describe('LocalStorageHighScoreStore', () => {
  let storage: Storage;
  let store: LocalStorageHighScoreStore;

  beforeEach(() => {
    storage = makeStorage();
    store = new LocalStorageHighScoreStore(storage, 'k');
  });

  it('returns an empty list when nothing is stored', () => {
    expect(store.load()).toEqual([]);
  });

  it('persists, ranks and caps added scores', () => {
    store.add(entry(10));
    const ranked = store.add(entry(40));
    expect(ranked.map((s) => s.score)).toEqual([40, 10]);
    expect(new LocalStorageHighScoreStore(storage, 'k').load().map((s) => s.score)).toEqual([
      40, 10,
    ]);
  });

  it('clears stored scores', () => {
    store.add(entry(10));
    store.clear();
    expect(store.load()).toEqual([]);
  });

  it('ignores corrupt JSON', () => {
    expect(new LocalStorageHighScoreStore(makeStorage({ k: '{not json' }), 'k').load()).toEqual(
      [],
    );
  });

  it('ignores non-array and malformed entries', () => {
    const messy = makeStorage({ k: JSON.stringify([{ score: 1, level: 1, date: 1 }, { nope: true }]) });
    expect(new LocalStorageHighScoreStore(messy, 'k').load()).toHaveLength(1);
    expect(new LocalStorageHighScoreStore(makeStorage({ k: '"oops"' }), 'k').load()).toEqual([]);
  });

  it('tolerates a throwing storage backend', () => {
    const throwing: Storage = {
      ...makeStorage(),
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('quota');
      },
      removeItem: () => {
        throw new Error('blocked');
      },
    };
    const s = new LocalStorageHighScoreStore(throwing, 'k');
    expect(s.load()).toEqual([]);
    expect(() => s.add(entry(10))).not.toThrow();
    expect(() => s.clear()).not.toThrow();
  });
});

describe('MemoryHighScoreStore', () => {
  it('ranks, adds and clears in memory', () => {
    const store = new MemoryHighScoreStore();
    store.add(entry(10));
    store.add(entry(30));
    expect(store.load().map((s) => s.score)).toEqual([30, 10]);
    store.clear();
    expect(store.load()).toEqual([]);
  });
});

describe('createHighScoreStore', () => {
  it('returns a working store backed by the environment', () => {
    const store = createHighScoreStore();
    store.clear();
    expect(store.add(entry(15)).map((s) => s.score)).toEqual([15]);
    store.clear();
  });
});
