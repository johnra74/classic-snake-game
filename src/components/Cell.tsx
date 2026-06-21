import { memo } from 'react';
import type { CellKind } from '../game/types';

interface CellProps {
  kind: CellKind;
  size: number;
}

/** A single pixel cell. Memoised so unchanged cells don't re-render. */
function CellComponent({ kind, size }: CellProps) {
  return (
    <div
      className={`cell cell--${kind}`}
      style={{ width: size, height: size }}
      data-testid={`cell-${kind}`}
    />
  );
}

export const Cell = memo(CellComponent);
