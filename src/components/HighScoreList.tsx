import type { HighScore } from '../services/storage';

interface HighScoreListProps {
  scores: HighScore[];
}

/** Renders the top-scores leaderboard. */
export function HighScoreList({ scores }: HighScoreListProps) {
  if (scores.length === 0) {
    return <p className="scores__empty">No scores yet — be the first!</p>;
  }

  return (
    <ol className="scores" data-testid="high-scores">
      {scores.map((entry, i) => (
        <li key={`${entry.date}-${i}`} className="scores__row">
          <span className="scores__rank">{i + 1}</span>
          <span className="scores__score">{entry.score}</span>
          <span className="scores__level">Lv {entry.level}</span>
        </li>
      ))}
    </ol>
  );
}
