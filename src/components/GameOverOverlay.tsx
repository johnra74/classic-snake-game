import type { HighScore } from '../services/storage';
import { HighScoreList } from './HighScoreList';

export type GameOutcome = 'won' | 'gameover';

interface GameOverOverlayProps {
  outcome: GameOutcome;
  score: number;
  level: number;
  rank: number | null;
  scores: HighScore[];
  onRestart: () => void;
}

const COPY: Record<GameOutcome, { title: string; label: string; verb: string }> = {
  won: { title: 'You Win!', label: 'You win', verb: 'completed' },
  gameover: { title: 'Game Over', label: 'Game over', verb: 'reached' },
};

/** End-of-game modal: final score, leaderboard and a restart action. */
export function GameOverOverlay({
  outcome,
  score,
  level,
  rank,
  scores,
  onRestart,
}: GameOverOverlayProps) {
  const copy = COPY[outcome];
  return (
    <div className="overlay" role="dialog" aria-label={copy.label}>
      <div className="overlay__panel">
        <h2 className="overlay__title">{copy.title}</h2>
        <p className="overlay__summary">
          Score <strong>{score}</strong> · {copy.verb} level <strong>{level}</strong>
        </p>
        {rank !== null && (
          <p className="overlay__rank">New high score — rank #{rank}!</p>
        )}
        <h3 className="overlay__subtitle">Top Scores</h3>
        <HighScoreList scores={scores} />
        <button className="btn" type="button" onClick={onRestart} autoFocus>
          Play Again
        </button>
      </div>
    </div>
  );
}
