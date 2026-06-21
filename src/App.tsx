import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { Board } from './components/Board';
import { GameOverOverlay } from './components/GameOverOverlay';
import { Hud } from './components/Hud';
import { createInitialState, gameReducer } from './game/reducer';
import type { GameAction } from './game/reducer';
import { tickInterval } from './game/scoring';
import type { Direction, GameState } from './game/types';
import { useBoardSize } from './hooks/useBoardSize';
import { useGameLoop } from './hooks/useGameLoop';
import { useHighScores } from './hooks/useHighScores';
import { useKeyboard } from './hooks/useKeyboard';
import { useSwipe } from './hooks/useSwipe';
import { createHighScoreStore, type HighScoreStore } from './services/storage';

interface AppProps {
  /** Injectable for tests; defaults to the localStorage-backed store. */
  store?: HighScoreStore;
}

const reducer = (state: GameState, action: GameAction) => gameReducer(state, action);

export default function App({ store }: AppProps = {}) {
  const board = useBoardSize();
  const highScoreStore = useMemo(() => store ?? createHighScoreStore(), [store]);
  const { scores, submit } = useHighScores(highScoreStore);

  const [state, dispatch] = useReducer(reducer, board, createInitialState);
  const [rank, setRank] = useState<number | null>(null);

  const handleDirection = useCallback((direction: Direction) => {
    dispatch({ type: 'START' });
    dispatch({ type: 'CHANGE_DIRECTION', direction });
  }, []);

  useKeyboard(handleDirection);
  const swipe = useSwipe(handleDirection);

  useGameLoop(tickInterval(state.level), state.status === 'running', () =>
    dispatch({ type: 'TICK' }),
  );

  // Record the score once, when a game ends.
  const isOver = state.status === 'gameover' || state.status === 'won';

  // Record the score once, when a game ends (by losing or winning).
  useEffect(() => {
    if (isOver) {
      setRank(submit(state.score, state.level));
    }
  }, [isOver, state.score, state.level, submit]);

  const handleRestart = useCallback(() => {
    setRank(null);
    dispatch({ type: 'RESTART' });
  }, []);

  return (
    <div className="app">
      <Hud level={state.level} score={state.score} foodLeft={state.food.length} />
      <main className="stage">
        <Board state={state} onTouchStart={swipe.onTouchStart} onTouchEnd={swipe.onTouchEnd} />
        {state.status === 'idle' && (
          <div className="overlay overlay--hint">
            <p>Press an arrow key or swipe to start</p>
          </div>
        )}
        {isOver && (
          <GameOverOverlay
            outcome={state.status === 'won' ? 'won' : 'gameover'}
            score={state.score}
            level={state.level}
            rank={rank}
            scores={scores}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}
