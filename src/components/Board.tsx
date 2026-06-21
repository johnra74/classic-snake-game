import { CELL_PX } from '../game/constants';
import { occupiedKeys, pointKey } from '../game/board';
import type { CellKind, GameState } from '../game/types';
import { Cell } from './Cell';

interface BoardProps {
  state: GameState;
}

/** Resolves the visual kind of the cell at index i, given precomputed lookups. */
function kindAt(
  x: number,
  y: number,
  headKey: string,
  bodyKeys: Set<string>,
  foodKeys: Set<string>,
): CellKind {
  const key = pointKey({ x, y });
  if (key === headKey) return 'head';
  if (bodyKeys.has(key)) return 'body';
  if (foodKeys.has(key)) return 'food';
  return 'empty';
}

/** Renders the immutable grid as a CSS grid of pixel cells. */
export function Board({ state }: BoardProps) {
  const { board, snake, food } = state;
  const headKey = pointKey(snake[0]);
  const bodyKeys = occupiedKeys(snake.slice(1));
  const foodKeys = occupiedKeys(food);

  const cells = [];
  for (let y = 0; y < board.rows; y++) {
    for (let x = 0; x < board.cols; x++) {
      const kind = kindAt(x, y, headKey, bodyKeys, foodKeys);
      cells.push(<Cell key={`${x},${y}`} kind={kind} size={CELL_PX} />);
    }
  }

  return (
    <div
      className="board"
      data-testid="board"
      style={{
        gridTemplateColumns: `repeat(${board.cols}, ${CELL_PX}px)`,
        gridTemplateRows: `repeat(${board.rows}, ${CELL_PX}px)`,
      }}
    >
      {cells}
    </div>
  );
}
