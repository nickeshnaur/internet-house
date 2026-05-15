# /game

Thirty-two daily-puzzle prototypes, one per folder, served straight
out of `game/`. No build step.

```
game/
  index.html             ← hub (card grid)
  shared.css             ← chrome, type, toolbar, stage, picker, badge
  shared.js              ← timer, share, haptics, reveal-flash, GAMES wiring
  tableau/index.html     ← Game 1     Logic
  filament/index.html    ← Game 2     Logic
  beatsheet/index.html   ← Game 3     Logic
  knot/index.html        ← Game 4     Feeling
  bloom/index.html       ← Game 5     Feeling
  cleave/index.html      ← Game 6     Words
  strand/index.html      ← Game 7     Words
  tally/index.html       ← Game 8     Words
  concordance/index.html ← Game 9     Words
  sculpt/index.html      ← Game 10    Words
  curator/index.html     ← Game 11    Words
  average/index.html     ← Game 12    Words
  glance/index.html      ← Game 13    Still
  trace/index.html       ← Game 14    Still
  echo/index.html        ← Game 15    Still
  glyph/index.html       ← Game 16    Still
  rule/index.html        ← Game 17    Sharp
  order/index.html       ← Game 18    Sharp
  trio/index.html        ← Game 19    Sharp
  bridge/index.html      ← Game 20    Sharp
  beam/index.html        ← Game 21    Field
  tide/index.html        ← Game 22    Field
  weft/index.html        ← Game 23    Field
  splice/index.html      ← Game 24    Field
  pinhole/index.html     ← Game 25    Probe
  spectrum/index.html    ← Game 26    Probe
  switch/index.html      ← Game 27    Probe
  doubt/index.html       ← Game 28    Probe
  fossil/index.html      ← Game 29    Hunt
  shadows/index.html     ← Game 30    Hunt
  magnets/index.html     ← Game 31    Hunt
  alchemy/index.html     ← Game 32    Hunt
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

## Eight groups

The hub clusters the thirty-two games:

- **Logic** — Tableau, Filament, Beat Sheet. Editorial paper.
- **Feeling** — Knot, Bloom. Dark, gestural, atmospheric.
- **Words** — Cleave, Strand, Tally, Concordance, Sculpt, Curator,
  Average. Editorial typography carries the experience.
- **Still** — Glance, Trace, Echo, Glyph. One verb each — see, move,
  write, remember. Contemplative, no urgent timers, no scores.
- **Sharp** — Rule, Order, Trio, Bridge. Closed-answer Wordle-DNA:
  hidden answer, info-rich feedback per guess, daily cadence,
  emoji-grid share artifact.
- **Field** — Beam, Tide, Weft, Splice. Place pieces, run the
  simulation, see what happened. Mix of spatial reasoning (Beam,
  Tide) and lexical pairing (Weft, Splice).
- **Probe** — Pinhole, Spectrum, Switch, Doubt. Engineered around
  the probe-and-learn loop. Every guess pays back regardless of
  whether it's correct.
- **Hunt** — Fossil, Shadows, Magnets, Alchemy. Themed worlds.
  Each is a probe-and-learn loop dressed in its own setting:
  paleontology, architecture, physics, alchemy.

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

## The Still group

Four contemplative prototypes added together. Each is built around a
single verb. Each completes in under sixty seconds. Each produces a
small keepable artifact. Nothing more.

### Glance · see, then answer · `game/glance/`

An image is shown for exactly three seconds, then fades to black. A
single question appears about what was just seen. The image returns
with the relevant detail ringed in the accent color.

```js
{
  id: 'glance-NNN',
  scene: '<svg viewBox="0 0 800 600">…</svg>',   // inline scene
  question: 'How many people were walking past the door?',
  choices: ['2', '3', '4', '5'],
  answer: '3',
  caption: 'three figures, late afternoon',
}
```

The prototype ships three hand-illustrated SVG scenes — a street with
three figures, a still life with a green vase, a window with a cat.
Production should swap these for license-free photographs (Wikimedia
Commons, Library of Congress, FSA collection) with author-verified
questions. The `.highlight` paths inside the scene render under
`.frame.revealed` with the accent stroke; add one per focus point.

### Trace · draw one line · `game/trace/`

A daily abstract prompt above a blank canvas. The player draws one
continuous line. On lift the line locks. After submit, a gallery of
five to six mocked previous players' lines appears beneath.

```js
{
  id: 'trace-NNN',
  prompt: 'loneliness',
  gallery: [
    { who: 'a · 2:14 am', d: 'M30 150 C 120 150, 220 152, 560 150' },
    // …
  ],
}
```

`d` is an SVG path string for the gallery cell. Hand-author variety:
a long curl, a single dot, a horizontal slash, a heavy scrawl, an
upward stroke. The viewBox is `0 0 600 300`; design within that box.
The player's own stroke is captured as a polyline of pointer samples
and rendered as `<path>` in the same viewBox.

### Echo · write one line · `game/echo/`

A daily writing prompt — a question, a fragment, a small provocation.
The player composes one line (max 140 chars). On send, the prompt
plus the player's line render as a couplet, and a gallery of five to
six mocked responses scrolls beneath.

```js
{
  id: 'echo-NNN',
  prompt: 'What did you almost say today?',
  meta: '184 lines sent today',
  gallery: [
    { who: 'a · 9:22 am', line: 'I almost said yes. I said maybe instead.' },
    // …
  ],
}
```

Author the gallery for tonal variety — one funny, one dark, one
literal, one personal, one strange. The visual treatment is editorial
throughout; player input is the largest element on screen until they
send.

### Glyph · look, then redraw · `game/glyph/`

A daily symbol from a world writing system or symbolic vocabulary —
kanji, hieroglyph, rune, alchemical sigil, Devanagari letter. Shown
large for about ten seconds with its meaning beneath, then the symbol
fades. The player redraws on a blank canvas matching the same frame
size. Their drawing sits beside the original for comparison. A mocked
library of past attempts renders as a grid below.

```js
{
  id: 'glyph-NNN',
  glyph: '木',
  rom: 'ki · boku',
  gloss: 'tree',
  system: 'kanji',
}
```

The character is rendered with Noto Serif JP (loaded from Google
Fonts) so kanji + Devanagari + runes all display cleanly. The
ten-second study window is invisible — a `setTimeout` triggers a
fade transition; the player perceives the glyph dimming naturally.
The drawing canvas accepts multiple strokes (each pointerdown starts
a new path); the `Done drawing` button advances to the compare phase.
The library array (`LIBRARY` in the IIFE) holds hand-authored past
attempts; in production these would be the player's own history.

---

## The Sharp group

Four closed-answer strategy games. Hidden answer, info-rich per-guess
feedback, emoji-grid share artifact. Aesthetic: tighter and more
confident than the contemplative batch — closer to a chess interface
than a notebook.

### Rule · probe a hidden transform · `game/rule/`

A hidden function maps inputs to outputs. The player makes up to five
free probes (any word in → transformed word out), then faces three
prediction challenges: given a new input, predict its output. Score
is correct predictions out of three.

```js
{
  id: 'rule-NNN',
  name: 'vowel-shift forward',
  transform(s) { /* string → string */ },
  challenges: ['PIZZA', 'MUSIC', 'ANSWER'],
}
```

Three rules ship: vowel-shift (a→e, e→i, i→o, o→u, u→a), reverse the
word, and "first letter moves to end." The challenge correct-answer
is just `transform(challenge)` evaluated client-side. Calibration
target: solvable in three to four well-chosen probes.

### Order · sequence Mastermind · `game/order/`

Six items in a hidden order. Drag into a proposed sequence and
submit. Per-slot feedback: ✓ (right position), ↑ (item belongs
earlier), ↓ (item belongs later). Five guesses. Solve = all six
correct.

```js
{
  id: 'order-NNN',
  prompt: 'Order these novels by publication year, earliest to latest.',
  items: [
    { id: 'hm', title: 'Hamlet', meta: 'Shakespeare · 1603' },
    // …
  ],
  order: ['hm','pp','md','gg','84','cr'],   // truth (earliest → latest)
}
```

Three puzzles ship: novels by year, inventions by year, wars by
year. Drag uses pointer events with translateY offsets (same pattern
as Curator). The history rail to the right shows the per-slot
emoji portrait of every guess so you can see your progress.

### Trio · three of nine with hidden category · `game/trio/`

Nine word tiles in a 3×3 grid. Three share a hidden category; six
are decoys. Tap exactly three and submit; feedback is the count of
your three that were in the hidden trio. Four guesses. The strategy
that emerges: probe with controlled substitutions to isolate which
member of a previous guess was correct.

```js
{
  id: 'trio-NNN',
  words: ['HARP','SAW','DRILL','VIOLIN','HAMMER','PIANO','BRUSH','CELLO','WRENCH'],
  trio:  ['HARP','VIOLIN','CELLO'],
  category: 'stringed instruments',
  trap: 'PIANO is an instrument — but not a stringed one in the orchestral sense.',
}
```

The category reveals only on solve (or after a loss, alongside the
trap explainer). Three puzzles ship: stringed instruments, citrus
fruits, birds.

### Bridge · find the compound bridge word · `game/bridge/`

Two anchor words with a blank between them: `FIRE __ WORK`. The
player guesses a word that forms a valid compound with each side
(`WOOD` → FIREWOOD + WOODWORK). Five guesses. Per-guess feedback:
✓/✗ on each side independently.

```js
{
  id: 'bridge-NNN',
  left: 'FIRE', right: 'WORK',
  canonical: 'WOOD',
  leftAccept:  ['WOOD','HOUSE','STONE',...],   // forms compound on left
  rightAccept: ['WOOD','HOUSE','STONE',...],   // forms compound on right
  examples: ['WOOD → FIREWOOD + WOODWORK', 'HOUSE → FIREHOUSE + HOUSEWORK'],
}
```

A guess succeeds on a side iff it appears in that side's accept-list.
A solve requires both. Three puzzles ship: FIRE/WORK (canonical
WOOD; also accepts HOUSE, STONE), SUN/LIGHT (DAY; also SPOT, LAMP,
DOWN), BACK/SIDE (ROAD; also COUNTRY, FIRE).

Production version would replace the hand-authored accept lists with
a compound-word corpus lookup.

---

## The Field group

Place pieces, run a simulation, see what happened. Two spatial games
and two lexical games sharing the same submit-and-observe grammar.

### Beam · route the light · `game/beam/`

5×5 grid with a beam source on one edge, walls, and a target cell.
Drag mirrors (╱ and ╲) from inventory onto cells; tap a placed
mirror to rotate it. Submit fires the beam — it reflects on
diagonals, blocks at walls, exits the grid, or hits the target.
Five attempts.

```js
{
  id: 'beam-NNN',
  source: { r: 0, c: 4, dir: 'down' },     // entering from above col 4
  target: { r: 4, c: 4 },
  walls:  [[2,4]],
  inv:    { '/': 2, '\\': 1 },             // mirror counts available
}
```

Reflection table:
- `╱` (forward): up→right, down→left, left→down, right→up
- `╲` (back):    up→left,  down→right, left→up,  right→down

Hand-author each puzzle by designing the wall/source/target layout,
then place mirrors to confirm a solution exists within the inventory.
The `verify-beam.js` script in /tmp/jsdomtest does this check.

### Tide · direct the flow · `game/tide/`

5×5 grid where each cell has a height (0–3). Cells of height 3 act
as ridges — water can't enter or pass. Place 1–3 sources; water
spreads via BFS to neighbors of equal-or-lower height. The result
is compared against TARGETS (must end wet) and DRYS (must stay dry).
Five attempts.

```js
{
  id: 'tide-NNN',
  heights: [
    [1,1,3,1,1],
    [1,0,3,0,1],
    // …
  ],
  targets: [],   // optional explicit list; defaults to all non-3 cells
  drys:    [],   // optional; height-3 cells are auto-dry
  maxSources: 2,
}
```

Author by designing topography that channels water into specific
basins, then verifying the source count needed by mental simulation.

### Weft · pair to bind · `game/weft/`

Two columns of four word cards. Drag from a left card to a right
card to pair them. Each left word must pair with exactly one right
word that forms a valid compound. Submit returns count-correct.
Four attempts.

```js
{
  id: 'weft-NNN',
  left:  ['FIRE','SNOW','MOON','RAIN'],
  right: ['BOW','FLAKE','PLACE','LIGHT'],
  pairs: { FIRE: 'PLACE', SNOW: 'FLAKE', MOON: 'LIGHT', RAIN: 'BOW' },
  compound: { FIRE: 'FIREPLACE', SNOW: 'SNOWFLAKE', MOON: 'MOONLIGHT', RAIN: 'RAINBOW' },
}
```

Right column is shuffled deterministically per puzzle so it's not in
pair order. On submit, an SVG overlay renders the player's pairing
lines; on solve, all four lines glow and the compounds reveal below.

### Splice · find the anagram pair · `game/splice/`

A given phrase displayed at top. The hidden answer is a different
phrase with the same letters. Letter tiles drag (tap-tap) into
slot-rows that match the hidden phrase's word lengths. Per-slot
green-check feedback. Correct tiles lock; incorrect tiles return to
the tray. Five attempts.

```js
{
  id: 'splice-NNN',
  given:  'ELEVEN PLUS TWO',
  answer: 'TWELVE PLUS ONE',
  hint:   'Restatement',
}
```

Both phrases must use exactly the same multiset of letters (verify
before shipping). The hint is one of "Restatement" / "Twist" /
similar — a clue to the semantic relationship without giving away
the answer.

---

## The Probe group

Engineered specifically around the probe-and-learn loop. Five or six
well-chosen probes can crack each puzzle; every probe pays back
regardless of whether it's correct.

### Pinhole · probe to reveal · `game/pinhole/`

A famous image is hidden behind a black overlay. Tap anywhere to
punch a circular pinhole that reveals the underlying image at full
resolution within that circle. Pinholes accumulate. When you think
you know the image, type a guess. Score is the number of probes used
before correct.

```js
{
  id: 'pinhole-NNN',
  title: 'Mona Lisa',
  url:   'https://upload.wikimedia.org/wikipedia/commons/.../600px-Mona_Lisa.jpg',
  accept: ['mona lisa','la gioconda',…],
  canonical: 'Mona Lisa · Leonardo da Vinci · c. 1503',
}
```

The reveal uses an SVG mask: a white rect (overlay visible)
everywhere, with black circles (overlay hidden) at each probe
location. Three puzzles ship: Mona Lisa, The Great Wave off
Kanagawa, The Starry Night — all license-free Wikimedia URLs.

### Spectrum · triangulate the color · `game/spectrum/`

A hidden RGB color is the answer, with a thematic hint ("the sky
during a Mediterranean afternoon"). RGB sliders 0–255. Submit a
guess; per-channel proximity bars show how close each channel is.
Five guesses. Solve when within ±15 on every channel.

```js
{
  id:'spectrum-NNN',
  hint:'The sky during a Mediterranean afternoon.',
  target:[120,175,220],
  desc:'cerulean',
}
```

The history rail shows previous guesses as a colored chip + their
three proximity bars, so the player can read the trace. On solve, a
target swatch slides in beside the player's final guess.

### Switch · deduce the wiring · `game/switch/`

A panel of 4 switches and 4 lights with hidden wiring. A light is on
when ANY of its wired switches is on. Player toggles switches and
taps Test to see the response. After enough tests, tap "Submit
wiring" to mark each connection on a 4×4 grid. Score is the number
of tests used.

```js
{
  id: 'switch-NNN',
  // wiring[s][l] = true if switch s is connected to light l
  wiring: [
    [true,false,false,false],     // A → W
    [true,true, false,false],     // B → W, X
    [false,false,true, true],     // C → Y, Z
    [false,false,false,true],     // D → Z
  ],
}
```

The wiring submission UI is a 4×4 grid (rows = switches, cols =
lights). On submit, correct connections render green, wrong
connections render orange.

### Doubt · Wordle, where one feedback lies · `game/doubt/`

Standard 5-letter Wordle, six guesses. The twist: one tile across
the entire 6×5 grid lies — its color is wrong. Lie position is
deterministic per puzzle (so today's puzzle has the same lie for
every player). Cycle: gray → yellow → green → gray.

```js
{
  id: 'doubt-NNN',
  answer: 'BREAD',
  lie: { row: 1, col: 1 },   // 0-indexed
}
```

Players cross-reference rows for inconsistencies. On solve, the
lying tile is theatrically flipped to its true color with a 🎭
flourish. Share artifact is a standard Wordle emoji grid plus a 🎭
on the lying row.

---

## The Hunt group

Same probe-and-learn loop as the Probe group, dressed in themed
worlds. Each game has its own visual vocabulary and metaphor.

### Fossil · excavate to identify · `game/fossil/`

A 6×6 dig site with a hidden dinosaur skeleton. Tap any cell to
dig: empty soil or a specific bone (skull, rib, vertebra, claw,
leg, hip, tail, plate, horn). The bones' spatial pattern is
diagnostic. Submit a species guess any time. Score is digs used.

```js
{
  id: 'fossil-NNN',
  species: 'Tyrannosaurus rex',
  accept: ['t-rex','trex','tyrannosaurus',…],
  canonical: 'Tyrannosaurus rex · Late Cretaceous',
  bones: gridify([[0,1,'skull'], [1,1,'vertebra'], …]),
}
```

Three species ship: T-Rex, Triceratops, Stegosaurus. Bone icons
are small inline SVGs in `BONE_ICONS`. The species options are
shown as tappable chips under the input for easy reference.

### Shadows · cast to identify · `game/shadows/`

A circular compass of 8 cardinal directions (N · NE · E · SE · S
· SW · W · NW). Tap a direction to cast light from that angle and
see the silhouette of the hidden 3D object from that side.
Silhouettes accumulate in a small horizontal strip below. Submit a
guess any time. Score is shadows cast.

```js
{
  id: 'shadows-NNN',
  title: 'Eiffel Tower',
  accept: ['eiffel','eiffel tower','tour eiffel',…],
  canonical: 'Eiffel Tower · Paris · 1889',
  sil: { N:'M…Z', NE:'M…Z', …, NW:'M…Z' },
}
```

Each silhouette is a single SVG `path d` string drawn within a
100×100 viewBox. Three objects ship: Eiffel Tower (4-fold
symmetric), Grand Piano (asymmetric, profile-rich), Stonehenge
(top vs side reveal different counts).

### Magnets · drop to triangulate · `game/magnets/`

A 5×5 grid with hidden magnets. Each has a position and strength
(1–3). Drop a paperclip on any cell — it rolls toward the
strongest sufficiently-close magnet via a step-by-step path,
leaving a faint trail. After up to 5 drops, switch to the commit
phase and tap cells where you believe the magnets sit. Solve =
all positions correct.

```js
{
  id: 'magnets-NNN',
  magnets: [{ r: 1, c: 1, s: 3 }, { r: 3, c: 3, s: 2 }],
}
```

The roll uses a simple physics model: each tick, find the magnet
with highest pull (strength / (manhattan + 1)); if above threshold
0.4, step one cell toward it (prefer larger axis delta). Three
puzzles: 2-magnet center/corner, 2-magnet diagonal corners,
3-magnet variable strength.

### Alchemy · brew to deduce · `game/alchemy/`

A pantry of 6 fantasy ingredients. Today's hidden recipe uses 3 of
them. Tap two ingredients then Brew — the cauldron reacts:
- Both in recipe → bright accent burst
- One in recipe → muted shimmer
- Neither → gray smoke

Use brew history to deduce the recipe set; switch to submit phase
and pick three ingredients as your final guess.

```js
{
  id: 'alchemy-NNN',
  ingredients: [
    { id:'moon', name:'Moonleaf',         color:'#5DBE94' },
    // …six total
  ],
  recipe: ['moon','crys','phoe'],
  title: 'Sunrise Tonic',
  effect: 'Sharpens the morning.',
}
```

The validation is set comparison: 3 correct of 3 = solve. The
deduction strategy is fundamentally combinatorial (set-theoretic
reasoning over pair probes). Three potions ship: Sunrise Tonic,
Quiet Resolve, Dusk Embers.

---

## Adding a thirty-third game

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
