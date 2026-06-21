# Pixel Snake

A pixelated single-player snake / blockade game built with **pure React + TypeScript** (Vite).

## Gameplay
- A line with a head and tail grows by one with each pellet eaten.
- **Level N** shows **N pellets** at once, placed randomly so they never overlap the snake or each other.
- A level is complete when **all** its pellets are consumed; the level then increments and one more pellet is added.
- Every **10 completed levels** the snake speeds up by **20%**.
- Score = points per pellet scaled by the current level. Top scores persist in `localStorage`.
- Game over on hitting a wall or yourself — restart from the overlay.

## Controls
- **Desktop:** arrow keys or WASD.
- **Mobile:** swipe on the board.

## Board
The board is sized once on load to maximize the viewport and is **locked** for the rest of the session (it never resizes mid-game).

## Scripts
```bash
npm install      # install dependencies
npm run dev      # start the dev server
npm run build    # type-check + production build
npm test         # run the test suite
npm run coverage # run tests with a coverage report (>80% enforced)
```
