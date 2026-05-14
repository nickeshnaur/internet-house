# /game

Twelve daily-puzzle prototypes, one per folder, served straight out of
`game/`. No build step.

```
game/
  index.html             ← hub (card grid)
  shared.css             ← chrome, type, toolbar, stage, picker, badge
  shared.js              ← timer, share, haptics, reveal-flash, GAMES wiring
  tableau/index.html     ← Game 1
  filament/index.html    ← Game 2
  beatsheet/index.html   ← Game 3
  knot/index.html        ← Game 4
  bloom/index.html       ← Game 5
  cleave/index.html      ← Game 6
  strand/index.html      ← Game 7
  tally/index.html       ← Game 8
  concordance/index.html ← Game 9
  sculpt/index.html      ← Game 10
  curator/index.html     ← Game 11
  average/index.html     ← Game 12
```

Each game lives in its own folder; visiting `/game/<slug>/` loads only
that game. All games share `shared.css` and `shared.js`. Each ships
with three puzzles selectable from a `1 · 2 · 3` picker in the toolbar.

## Conventions

- A game registers itself with the shared registry:
  `GAMES[slug] = { reset, share, reveal?, load?, onShow? }`.
- `<script src="../shared.js">` wires picker, reset, reveal, and share
  clicks via a single document listener.
- `body[data-game="<slug>"]` sets the accent color. `body[data-mood="dark"]`
  flips the chrome to the after-hours palette for Feeling-group games.
- Each game's HTML follows the same shell: masthead, `.game-head`,
  `.toolbar`, `.stage`. CSS for game-specific surfaces is inlined in
  that game's file.

## Three groups

The hub clusters the twelve games:

- **Logic** — Tableau, Filament, Beat Sheet. Editorial paper.
- **Feeling** — Knot, Bloom. Dark, gestural, atmospheric.
- **Words** — Cleave, Strand, Tally, Concordance, Sculpt, Curator,
  Average. Editorial typography carries the experience.

The hub itself (`game/index.html`) is a card grid — each card has a
glyph, name, one-line description, and a tinted accent border.

---

## Existing games

### Tableau · 5×5 picross with language clues
Each puzzle defines `target` (5×5 of 0/1) and `clues` (strings). Win
check: filled cells match `target` exactly.

### Filament · slitherlink
Each puzzle defines `ANSWER_PATH` (closed dot loop) and `CLUES_CELLS`
(per-cell edge counts derived from the loop). Win check accepts any
closed loop whose edges satisfy every numbered cell.

### Beat Sheet · ordered witnesses
Each puzzle has a 4-character cast (`CHARS`, with corner `pos`) and
`CLUES` whose `check(order)` returns boolean. `answer` is used by
reveal.

### Knot · drag a tangle into a picture
Each puzzle has `TARGETS` (12 home positions on 0..600 viewBox),
`STARTS` (scrambled), and `EDGES` (index pairs). Reveal eases nodes
from current to target over 620ms.

### Bloom · cascade puzzle
Each puzzle has `WALL_LIST`, `ANSWER_SEED`, `TARGET_LIST` (the
deterministic cascade result). Verify uniqueness with a quick
cascade-simulation script before shipping.

### Cleave · phrase compression
Each puzzle has `letters` (uninterrupted string), `canonical` (cut
positions), `phrase` (formatted), and `attribution`.

### Strand · theme constellation
Each puzzle has `theme`, `words` (no internal letter repeats), and
`letters` (each letter once in the field with x/y coords).

---

## New games

### Tally · 60-second category recall · `game/tally/`

A category prompt + a 60-second countdown. Type answers; each match
locks in. When time runs out, the full possible set is shown with the
player's accepted answers highlighted.

```js
{
  id: 'tally-NNN',
  category: 'Pixar feature films',
  answers: ['Toy Story', "A Bug's Life", ...],
}
```

Matching: case-insensitive, `the ` prefix stripped, non-alphanumerics
ignored. Share artifact is a `■·····■■···■` portrait of which answers
landed.

### Concordance · cumulative poem builder · `game/concordance/`

A 30-day composition where the player contributes one word per day
under a daily constraint. The prototype simulates day 12 of 30, with
hand-authored constraints and example words for days 1–11.

```js
{
  id: 'concordance-NNN',
  title: 'Compositions',
  days: [
    { day: 1, constraint: 'A noun evoking weather, one syllable', word: 'mist' },
    // …
    { day: 12, constraint: 'A verb evoking dusk', word: null },
  ],
  total: 30,
}
```

The day with `word: null` is "today" — its row gets an input field.
Validation is intentionally light (any plausible English word).

### Sculpt · phrase compression · `game/sculpt/`

A phrase shown in very large serif. Tap any letter to remove. After
removal, each space-separated word must still be in the curated
lexicon, else the removal shakes and reverts.

```js
{ id: 'sculpt-NNN', phrase: 'STARES INTO TIGERS' }
```

The lexicon (`LEXICON_RAW`) ships inline — about 1,500 short English
words. Author new puzzles around phrases whose reduction tree stays
inside the lexicon. Score = letters remaining. Game ends when no
further single-letter removal would leave all words valid.

### Curator · drag to rank · `game/curator/`

Five pieces of short text. Drag cards to rank most → least. On
submit, attribution reveals and the mock global ranking renders
alongside the player's, with deviation arrows per row.

```js
{
  id: 'curator-NNN',
  prompt: 'Rank these opening lines from most to least compelling.',
  items: [
    { id: 'm', line: 'Call me Ishmael.', attr: 'Herman Melville · Moby-Dick' },
    // …
  ],
  globalOrder: ['a','t','g','m','h'],   // ids most → least
  meta: '3,142 rankings submitted today',
}
```

Drag is pointer-event based with translateY offsets. Share artifact
is a vertical "taste portrait" string: `═` for agreement, `▲`/`▼`
for above/below the crowd on each line.

### Average · word association + cohort distribution · `game/average/`

A single prompt word. Player types one word back. On submit, the
day's mocked distribution renders as horizontal bars; the player's
answer is highlighted in its position (or added to the long tail if
not in the listed top words).

```js
{
  id: 'average-NNN',
  prompt: 'AUTUMN',
  dist: [
    { word: 'leaves', pct: 23 },
    { word: 'cold',   pct: 14 },
    // …
  ],
}
```

`pct` values are hand-authored to feel realistic; they don't need to
sum to 100 (the implicit "other" category covers the remainder).

---

## Adding a thirteenth game

1. Create `/game/<slug>/index.html` modeled on any existing game.
2. Add an accent color in `shared.css`:
   ```css
   :root { --<slug>: #....; }
   body[data-game="<slug>"] { --accent: var(--<slug>); }
   ```
3. Add `.card[data-game="<slug>"] { --card-accent: var(--<slug>); }` and a card
   to `/game/index.html` linking to `<slug>/`.
4. Write the IIFE that registers
   `GAMES.<slug> = { reset, share, reveal?, load? }` and uses
   `flashReveal(stageEl)` on reveal.
