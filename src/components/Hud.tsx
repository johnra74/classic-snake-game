interface HudProps {
  level: number;
  score: number;
  foodLeft: number;
}

/** Top status bar: level, score and remaining pellets. */
export function Hud({ level, score, foodLeft }: HudProps) {
  return (
    <header className="hud">
      <div className="hud__item">
        <span className="hud__label">Level</span>
        <span className="hud__value">{level}</span>
      </div>
      <div className="hud__item">
        <span className="hud__label">Score</span>
        <span className="hud__value">{score}</span>
      </div>
      <div className="hud__item">
        <span className="hud__label">Food left</span>
        <span className="hud__value">{foodLeft}</span>
      </div>
    </header>
  );
}
