/** Pixel size of a single board cell. Drives how many cells fit the viewport. */
export const CELL_PX = 24;

/** Base milliseconds per tick at level 1. Lower = faster. */
export const BASE_TICK_MS = 160;

/** Base points awarded per pellet, multiplied by the current level. */
export const BASE_FOOD_POINTS = 10;

/** Number of completed levels required for each speed increase. */
export const LEVELS_PER_SPEEDUP = 10;

/** Fractional speed increase applied at each speed-up milestone (0.2 = +20%). */
export const SPEEDUP_FACTOR = 0.2;

/** Maximum number of high scores retained in storage. */
export const MAX_HIGH_SCORES = 5;

/** localStorage key under which high scores are persisted. */
export const HIGH_SCORES_KEY = 'pixel-snake.highscores';

/** Fallback board size used when the viewport cannot be measured. */
export const MIN_COLS = 10;
export const MIN_ROWS = 10;
