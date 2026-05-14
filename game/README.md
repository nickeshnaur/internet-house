# /game

Seven daily-puzzle prototypes on a single static page. No build step — open
`index.html` directly or serve the directory.

```
game/
  index.html   ← all seven games, one file
  README.md    ← this file
```

The page fits the rest of `internet.house`: static HTML, fonts from Google Fonts,
inline CSS and vanilla JS. Each game is an IIFE that registers itself with the
shared `GAMES` object (`reset`, `share`, optional `onShow`). Shared utilities
(`createTimer`, `copyShare`, `shake`, `haptic`, `rafThrottle`) live above the
game modules.

To add a new puzzle, edit the puzzle definition object at the top of the
game's IIFE. The wiring (renderer, win-check, share, reset) stays the same.

## Two groups, two moods

The tab bar is divided into two clusters by a hairline:

- **Logic** — Tableau, Filament, Beat Sheet. Bright editorial paper.
- **Feeling** — Knot, Bloom, Cleave, Strand. The chrome dims to a dark
  after-hours mood and each game lights up with a luminous accent color.

The transition is driven by `body[data-mood="light|dark"]`, which is set
automatically from the active tab's `data-group` attribute. Adding a new
game to either group is just a `data-group` value.

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

---

## Knot

Drag a tangle of 12 nodes onto their target positions. As nodes near home,
edges glow brighter; once every node is within the win radius, the lights
fade and a clean line drawing remains — the puzzle's "art."

Puzzle shape:

```js
const TARGETS = [ /* 12 [x,y] target positions in viewBox 0..600 */ ];
const STARTS  = [ /* 12 [x,y] scrambled starting positions */ ];
const EDGES   = [ /* index pairs [a,b] — which nodes are connected */ ];
const SNAP_R  = 14;  // win radius
const NEAR_R  = 26;  // "tight" pulse threshold
```

To add a new Knot puzzle:

1. Design a target shape — sketch a constellation, an outline, an icon.
   Place 10–14 nodes on a 600×600 canvas at the positions they should land at.
   That's `TARGETS`.
2. Define `EDGES` as index pairs. The edges drawn between target positions
   are the final image — design with the line drawing in mind.
3. Scatter `STARTS` so the initial state looks tangled (edges crossing
   themselves). Aim for visible chaos but keep nodes within the viewBox.
4. Tune `SNAP_R` if your shape is dense (smaller for crowded shapes).

Win check: every node's distance to its target is ≤ `SNAP_R`. There's no
graph-planarity test — the puzzle is "guide the nodes home," not graph
theory.

---

## Bloom

A 7×7 grid with walls. Tap a cell to plant a seed. A cascade runs for a
fixed number of generations; the grown shape is determined entirely by the
seed location. Today's target is shown as a faint ghost behind the cells —
find the seed that grows into it exactly.

Puzzle shape:

```js
const SIZE        = 7;
const GENERATIONS = 5;
const WALL_LIST   = [ /* [r,c] coordinates of walls */ ];
const TARGET_LIST = [ /* [r,c] of cells in the target bloom */ ];
```

To add a new Bloom puzzle:

1. Design wall placement on a 7×7 grid. Walls channel growth.
2. Pick an intended seed cell. Run the cascade by hand (or in your head):
   gen 0 is the seed; each generation adds 4-connected non-wall cells
   adjacent to existing filled cells. Stop after `GENERATIONS` generations.
3. The resulting filled set is `TARGET_LIST`.
4. Try a few other seeds to confirm no other cell produces the same final
   set (this is not enforced by code — the win check just compares the
   player's cascade result to `TARGET`).

On a wrong tap, the cascade animates anyway (so the player learns the
spread rule), then shakes and clears.

---

## Cleave

A long letter string in large serif type. Tap between letters to insert
hairline cuts. When the cuts match the canonical word boundaries of a known
phrase, the cuts dissolve into proper spaces and the phrase typesets with a
shimmer.

Puzzle shape:

```js
const PUZZLE = {
  letters:     'AROLLINGSTONEGATHERSNOMOSS',
  canonical:   [1, 8, 13, 20, 22],
  phrase:      'A rolling stone gathers no moss',
  attribution: 'Proverb',
};
```

To add a new Cleave puzzle:

1. Pick a phrase. Strip spaces and punctuation → `letters`.
2. Walk through the phrase, noting the index *after* the last letter of
   each word (i.e., between letters `i-1` and `i`). That sequence is
   `canonical`. Example: `A ROLLING STONE` → cuts after letter 1 and
   after letter 8.
3. `phrase` is the formatted final form (with spaces, punctuation).
4. `attribution` is shown small-caps below on solve. Leave empty if none.

The prototype only validates against the canonical cut set, not against a
general English wordlist — keep puzzles to phrases the audience will
recognize. Adding a wordlist would let intermediate chunks light up green;
useful future work.

---

## Strand

A field of letters on a dark sky. Drag from letter to letter to trace a
word; release to submit. If it matches one of today's theme words, the
path locks in luminously. Find all five and the constellation completes.

Puzzle shape:

```js
const PUZZLE = {
  theme:   'Night Sky',
  words:   ['STAR', 'ORBIT', 'COMET', 'BEAM', 'GLINT'],
  letters: [
    // [letter, x, y] in viewBox 0..500 × 0..600
    ['S', 178, 131], ['T', 240, 300], /* … */
  ],
};
```

To add a new Strand puzzle:

1. Pick a theme and 4–6 short related words.
2. Collect every letter you need (with repeats across words allowed; the
   field can revisit shared letters as long as no single word traces
   through the same letter twice).
3. Lay out letters on a 500×600 canvas in a constellation that lets each
   word be drawn as a single continuous gesture. Letters can be shared
   between word paths — that's where the constellation pattern comes
   from.
4. The hit radius `HIT_R` (in viewBox units) controls how forgiving touch
   targets are. Default 38 is thumb-friendly.

Win check: a dragged path's letters in order must equal one of the target
words and not have been found yet. All five found → constellation
complete.

---

## Adding a game

1. Pick an accent color and add it to `:root` (e.g. `--newgame: #…`).
2. Add `body[data-game="newgame"] { --accent: var(--newgame); }`.
3. Add a `<button class="tab" data-game="newgame" data-group="logic|feeling">…</button>`
   inside `#tabs`. The group attribute sets the mood automatically.
4. Add a `<section class="game" data-game="newgame">…</section>` inside
   `<main>` with the same structure (`.game-head`, `.toolbar`, `.stage`).
5. Write an IIFE that builds, resets, shares, and optionally exposes
   `onShow()` for layout-sensitive games. Register it as
   `GAMES.newgame = { reset, share, onShow? }`.
