# /game

Three daily-puzzle prototypes on a single static page. No build step — open
`index.html` directly or serve the directory.

```
game/
  index.html   ← all three games, one file
  README.md    ← this file
```

The page fits the rest of `internet.house`: static HTML, fonts from Google Fonts,
inline CSS and vanilla JS. Each game is an IIFE that registers itself with the
shared `GAMES` object (`reset`, `share`). Shared utilities (`createTimer`,
`copyShare`, `shake`) live above the game modules.

To add a new puzzle, edit the puzzle definition object at the top of the
game's IIFE. The wiring (renderer, win-check, share, reset) stays the same.

---

## Tableau

Picross-style 5×5 grid solved entirely from natural-language clues.

Puzzle shape:

```js
const PUZZLE = {
  id: 'tableau-001',
  target: [
    [0,0,1,0,0],   // 1 = filled, 0 = empty
    [0,0,1,0,0],
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
  ],
  clues: [
    'The grid is symmetric both horizontally and vertically.',
    'Row 3 is entirely filled.',
    'Column 3 is entirely filled.',
    'No filled cell is diagonally adjacent to another filled cell.',
    'Exactly 9 cells are filled in total.',
  ],
};
```

To add a new Tableau puzzle:

1. Pick a 5×5 filled/empty pattern. Write it into `target` as 0s and 1s.
2. Write a handful of natural-language clues that uniquely determine the pattern.
   Verify by hand that no other 5×5 pattern satisfies them all — there is no
   solver here.
3. Replace the `PUZZLE` constant.

The win check compares filled cells to `target` exactly. `×` marks are player
aids and don't affect the check.

---

## Filament

Slitherlink on a 5×5 cell grid (6×6 dot lattice). Click two adjacent dots to
draw a segment between them; click a segment again to remove it.

Puzzle shape:

```js
const ANSWER_PATH = [
  // a closed loop as a sequence of dot coordinates [c, r],
  // first == last.
  [2,0],[3,0],[3,1],[4,1], /* … */ [2,0],
];

const CLUES_CELLS = [
  { c: 1, r: 0, n: 2 },
  // …each entry pins one cell to its loop-edge count (0-3).
];
```

To add a new Filament puzzle:

1. Hand-author a closed loop on the 6×6 dot lattice. Each step must be a
   horizontal or vertical move between adjacent dots. `ANSWER_PATH` is only
   used for documentation in the prototype — the win check does not compare
   to it.
2. For each cell on the loop boundary you want to expose, compute how many
   of its four edges the loop uses and add `{ c, r, n }` to `CLUES_CELLS`.
   Pick ~8–12 cells; favor symmetry over coverage.
3. Optional: add a short `CLUE_TEXT` line for the human clue list.

The win check accepts **any** set of drawn segments that:

- forms a single connected closed loop (every used dot has degree 2,
  one connected component, no orphan segments), and
- gives every numbered cell exactly its declared edge count.

So a puzzle with weak number clues will accept multiple loop shapes — that's
fine for a prototype. To guarantee uniqueness, add more numbered cells.

On win, the dot and number layers fade and only the line drawing remains —
that reveal is the point of this game.

---

## Beat Sheet

Place four character tokens on a board, then click them in the order they
were visited. The line follows each click; the win check verifies the
resulting ordering against a list of predicates.

Puzzle shape:

```js
const CHARS = [
  { id: 'detective', name: 'Detective', glyph: '🕵️', pos: 'pos-nw' },
  { id: 'maid',      name: 'Maid',      glyph: '👒', pos: 'pos-ne' },
  { id: 'butler',    name: 'Butler',    glyph: '🎩', pos: 'pos-se' },
  { id: 'heir',      name: 'Heir',      glyph: '👑', pos: 'pos-sw' },
];

const CLUES = [
  {
    text: 'The Detective interviewed the Maid before the Butler.',
    check: order => order.indexOf('maid') < order.indexOf('butler'),
  },
  // …
];
```

To add a new Beat Sheet puzzle:

1. Define the cast as `CHARS`. `pos` is one of `pos-nw | pos-ne | pos-se | pos-sw`
   (corners of the 2×2 board). Add `glyph` (emoji) and a short `name`.
2. Write each clue as `{ text, check }`. `check(order)` receives the player's
   click order as an array of `id`s and returns a boolean. Combine clues
   freely (`indexOf`, `includes`, `order[0]`, `order[order.length-1]`, etc.).
3. Solve the puzzle yourself by hand to confirm exactly one ordering
   satisfies every clue.

The board calls `maybeWin()` once the player has selected all four characters
— a wrong order triggers the shake animation.

---

## Shared bits

- **Timer** — `createTimer(displayEl)` returns `{ start, stop, reset,
  formatted, elapsed }`. Each game starts its own timer on first interaction
  and stops it on solve.
- **Share** — `copyShare(text)` copies a multi-line summary to the clipboard
  and shows a toast. Each game builds its own text; keep the third line as
  `internet.house/game` so the URL travels with the brag.
- **Shake** — `shake(stageEl)` plays a 360 ms shake animation. Use it on
  wrong-answer commits, not on every keystroke.
- **Accent color** — driven by `body[data-game="…"]`. The active tab's
  underline, the eyebrow text, and the clue numerals all read from
  `--accent`, so adding a fourth game means defining one CSS variable and
  one `body[data-game]` rule.

## Add a fourth game

1. Pick an accent color and add it to `:root` (e.g. `--newgame: #…`).
2. Add `body[data-game="newgame"] { --accent: var(--newgame); }`.
3. Add a `<button class="tab" data-game="newgame">Title</button>` inside `#tabs`.
4. Add a `<section class="game" data-game="newgame">…</section>` inside `<main>`
   with the same structure as the existing three (`.game-head`, `.toolbar`,
   `.stage`). Reuse the toolbar buttons; just set `data-game="newgame"`.
5. Write an IIFE that builds, resets, and shares; register it as
   `GAMES.newgame = { reset, share }`.
