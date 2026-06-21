import {
  BASE_FOOD_POINTS,
  BASE_TICK_MS,
  LEVELS_PER_SPEEDUP,
  SPEEDUP_FACTOR,
} from './constants';

/** Points awarded for eating one pellet at the given level. */
export function foodPoints(level: number): number {
  return BASE_FOOD_POINTS * level;
}

/**
 * Speed multiplier for a level. Increases by SPEEDUP_FACTOR for every
 * LEVELS_PER_SPEEDUP completed levels: levels 1–10 → 1.0, 11–20 → 1.2, etc.
 */
export function speedMultiplier(level: number): number {
  const milestones = Math.floor((level - 1) / LEVELS_PER_SPEEDUP);
  return (1 + SPEEDUP_FACTOR) ** milestones;
}

/** Milliseconds per tick for the given level (faster as level rises). */
export function tickInterval(level: number): number {
  return BASE_TICK_MS / speedMultiplier(level);
}
