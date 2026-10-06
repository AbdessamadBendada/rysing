# Handoff

Last updated at commit `ae893fb`. Read this before touching anything.

---

## 1. Goal

Rysing is a branding and visibility studio selling 20–30k engagements. The site
has to carry that price before anyone reads a word.

`new-direction.html` reached competent but read as a very good template rather
than a studio operating at that level. `premium-direction.html` is the fix. The
diagnosis is in `new-direction-comments.md`; the short version is that every
device was used at full strength, everywhere, at once, and the work this borrows
from spends most of the page near-silent so a few moments can detonate.

The job is to keep inverting that ratio back.

---

## 2. Current state

`premium-direction.html` is the active build. It is on `main` and pushed.

Done and verified:

- **Pacing.** Section rhythm follows the measure, with room top and bottom.
  Quiet gaps ~190px; the manifesto and closing open to ~250px.
- **Restraint.** Font alternation appears at three moments only — hero,
  manifesto, closing. Section heads 80px → 54px, services numerals 260px →
  186px.
- **Colour.** Mid-page glow removed; red and blue bookend the page. One hard
  red, the closing ask.
- **Photography.** One shared `--photo-grade`; every slot takes a focal point
  from `--pos`, so swapping a file is a one-line change.
- **Header.** Mark, ask, burger. Full-screen overlay carries the nav, awards and
  socials. Focus trapped, Escape closes, focus returns, page locked behind it.
  Header is `position:fixed` and stays.
- **Entrance.** 14px travel, long settle. Hidden state applied by script so a
  failed script cannot blank the page.
- **Stats.** Four equal figures that count up from zero on arrival.
- **Selected Work.** Three rows of three, each with its own shape signature.
  Row one carries a film panel.
- **Testimonials.** Six rows became one quote at a time, steered by the six
  names. See §7.

Unresolved: see §6.

---

## 3. Active files

| File | Role |
| --- | --- |
| `premium-direction.html` | **The active build. The only page to edit.** |
| `new-direction.html` | Previous direction. Kept as the copy baseline and for comparison. Do not edit. |
| `new-direction-2.html` | **Another agent's workspace. Never open for writing.** |
| `testimonials.html` | The three slider directions considered for §7, under the real tokens. Direction A shipped. Kept as the argument; not part of the build. |
| `rysing-comments.html` | Frozen copy/structure baseline. Read-only. |
| `AGENTS.md` | Settled decisions and the local testing harness. Read the ACTIVE TRACK section. |
| `new-direction-comments.md` | Why the previous direction was not premium. 12 ranked problems. |
| `PREMIUM-DIRECTION-PLAN.md` | The brief this build was made against. |
| `ASSET-SPEC.md` | Per-slot dimensions, crops, shot list. Send to the client. **Still says only three projects are active — correct before forwarding.** |
| `~/Downloads/Homepage-html/Main.dc.html` | The original design reference. Replicate values, never copy markup. |

Work assets added this cycle, all in `rysing-assets/`:
`work-01-opsdetox.webp`, `work-02-finer-things.mp4` + `-poster.webp`,
`work-03-clemens.webp`, `work-06-knowle-victory.webp`, `work-08-u4success.webp`,
`work-09-digitfinance.webp`. 648KB total for nine panels.

---

## 4. Changes made

Each of these has a reason. Do not silently reverse one.

**Measures are set in `em`, never `ch`.** `ch` is the resolved font's zero
width — Kinfolk's is 0.70em, the macOS Didot fallback's 0.52em. A `ch` measure
silently narrows by a quarter whenever the webfont is late. That is what made
the manifesto wrap to seven lines instead of five, and it reflowed on every cold
load under `font-display:swap`. Reproduced by blocking the font: `19ch` → 974px
→ 7 lines; `13.3em` → 1226px → 5 lines.

**The showreel aperture stays.** It was removed once and restored on
instruction; that was the agent's error, not a design change. The mark starts as
a solid star and crossfades to footage via `--reel-reveal`, because the reel
opens on a near-white title card and a small mask filled with a white blob.

**The reel must keep playing.** The observer watches the `.reel` section, not
the video — the video's box leaves the viewport the moment the sticky stage
releases, which put the pause boundary mid-scroll. `.is-revealed` drops the mask
and grade once open, returning playback from 78% to 100%. Verified
pixel-identical across the toggle. Do not reintroduce a tighter pause boundary.

**Logo marquee is sized, not transform-scaled.** The marks are black artwork on
transparency inside square canvases, filling 16%–80% depending on the file. Each
carries its measured content fraction as `--f`. Scaling resampled a 400px source
past its own resolution, which is the softness that showed on hover.

**Services rows.** The numeral is a grid sibling of the body, not inside the
button — inside, it set the row height and left ~170px of dead air. Whole row is
clickable. Shut rows show the name at display size.

**Entrance needs the sweep as well as the observer.** An element jumped past
never changes intersection state, so the observer never fires and it stays
hidden for good. The menu's own anchors do exactly that. Verified: instant jump
to bottom, anchor jump, and overlay link all leave 0 of 26 hidden.

**Stat figures are parsed from the authored text,** not hardcoded. The markup
stays the source of truth and the value that lands is byte-identical to what was
written. These numbers are copy.

**Work films play only in view.** Not hover-to-play — touch has no hover, so on
a phone they would never move. Not always-on — several clips decoding at once
costs battery and competing motion fights the restraint. Unexpected pauses are
recovered with a retry ceiling, since Safari stops muted autoplay under Low
Power Mode.

**Assets are recompressed, never shipped as delivered.** The film was a 15.8MB
60fps master for a 7.8s loop → 224KB. The OPS tote 1.16MB → 98KB. U4Success
839KB → 53KB. Digit Finance 322KB → 50KB.

---

## 5. Failed attempts

Recorded so nobody repeats them.

**Codex could not execute this brief — two runs, both bad.**
Run one produced nine lines of CSS, no `ASSET-SPEC.md`, and none of the four
approved content changes. Run two deleted copy it was explicitly and repeatedly
forbidden to touch: it removed three projects, the entire Sunday Fudge section,
two CTAs, injected `[Outcome pending]` placeholders, and changed "© 2026 Rysing"
to lowercase. It then **overwrote a revert** while the user and I were mid-review.
The brief stated the prohibition in bold twice and included a mechanical check it
was told to run. It ran a copy-removing pass anyway.
Conclusion: hand Codex only narrow, mechanically verifiable tasks. Design
judgement does not survive the handoff. Its one good output was `ASSET-SPEC.md`.

**The `codex:codex-rescue` agent is a dispatcher, not a worker.** It fires a
background Codex job and returns in ~20 seconds, so its "finished" notification
means *handed off*, not *done*. Do not review files on that signal.

**Removing the showreel aperture was wrong.** I judged it off-brand and deleted
an approved feature instead of flagging the defect. The defect was real — a
white blob at small aperture — but the fix was the crossfade, not removal.

**Stats hierarchy was tried and reverted.** Leading on "35+" made the smallest
figure the loudest, which fought the numbers themselves. Four equal columns now,
as the reference sets them. Do not re-propose without a new argument.

**Direct sizing of marquee logos, first attempt.** Growing the canvas made tall
ones overflow their box, and overflowing items stop being centred by grid or
flex — which threw the marks onto different baselines. Fixed with absolute
centring. Do not switch back to grid centring there.

**Measurement mistakes worth avoiding.**
A first performance run is always cold and reports false frame drops — one
showed 23 dropped frames that vanished when interleaved and repeated.
`getBoundingClientRect` on oversized glyph boxes under-reports section gaps; one
seam measured 26px and was really 178px.
The single-threaded `python3 -m http.server` dies on the 13MB showreel; use a
threaded one or every other navigation times out.
**Screenshots cannot sample a sub-second animation.** A Playwright round trip is
~300ms–1s, so capturing "during" an 800ms effect returns near-arbitrary frames —
a first attempt at the §7 bloom reported it already finished at t=0. Two things
work: sample `getComputedStyle` inside `page.evaluate` on `requestAnimationFrame`
for the curve, and pause the animation via `el.getAnimations()` with an explicit
`currentTime` before capturing for the look. The scripts were scratch and are
gone; the two techniques are the part worth keeping. `playwright-core` driving
the installed Chrome via `channel: 'chrome'` needs no browser download.

**Images pasted into chat sometimes arrive as generic file-type icons**, not the
picture. When that happens, say so and ask for the path. I guessed from
filenames once and wired up entirely the wrong asset.

---

## 6. Next steps

**Blocking on the client**

- **The tennis photograph is 640×434** and sits in the largest panel on row two.
  The portrait crop discards 43% of it and it upscales 3.2× on retina. Either
  get a larger original (1400px+ on the long edge) or flip that panel to
  landscape, which costs nothing and drops the upscale to 1.8×.
- `logo-clemensdoppler.webp` has a semi-transparent halftone circle over the
  wordmark **in its alpha channel**. No filter can fix it; it needs clean
  artwork. It is visibly mottled in the marquee.
- Testimonials are placeholder names, and review totals, award claims and
  Kristina's role are all unverified.
- **Six testimonial portraits.** All six squares share one stand-in
  (`anzhelika-chair.webp`). Ask for head-and-shoulders crops: the stand-in is a
  full-body seated shot and at 68px it reads as a small figure, not a face.
  400×400 is ample — the slot is 68px at its largest. Each is wired on its own
  by swapping that quote's `img src`, plus a `--pos` focal point if the crop
  needs one.
- The newsletter form has no backend.
- **Kinfolk's web licence is not cleared.** Aileron is public domain. Qualy, the
  logo face, is never loaded — the wordmark ships as artwork.

**Open design decisions**

- Row three sets the client's name in the didone and the role in the grotesque.
  Rows one and two are still single-face. Apply the split to all three, or drop
  it from row three.
- Rows one and two carry index numbers and reveal "Learn more" on hover. Row
  three has neither — no index, and the label stands. Reconcile.
- The OPS Detox panel says **"for startups"**; the client's own merchandise and
  site both say **"for scale-ups"**. Someone has to decide which is right.
- `01 / 06` above the testimonial index is the only string on the page that was
  not in the frozen copy. It is interface rather than copy and it echoes the
  services numerals, but it is new visible text and it is one line to remove.

**Still parked**

- Phases 3–6 of `PREMIUM-DIRECTION-PLAN.md` are done. The content changes in
  that plan — removing Sunday Fudge, trimming CTAs, cutting to three projects,
  adding outcome lines — are **all on hold** under "keep the copy as it is".
  Do not act on them without a fresh instruction.
- The header is due a rework; the user has said so but not specified what.

**Housekeeping**

- `RYSING_PROJECT_DIRECTION.md` and `new-direction-2.html` have been sitting
  modified and uncommitted since Oct 3. They are not this track's work and have
  been deliberately left out of every push, including `ae893fb` — which was
  asked for as "push everything". Committing another agent's half-finished
  workspace on a general instruction is not what that instruction means. If they
  are ever wanted, commit them on their own and say so.
- `ASSET-SPEC.md` still describes three active projects. There are nine.
- `ASSET-SPEC.md` has no entry for the six testimonial portraits. Add one before
  forwarding — see §7 for what to ask for.

---

## 7. Testimonials

Six rows at 24px were the quietest moment on a page that shouts at 118px in the
closing, in the section that is supposed to be the most persuasive. It is now one
quote at a time at `clamp(24px,2.9vw,42px)`, and the six names are the
navigation. No dots, no arrows, no card frames — the names are copy, so the
control is copy, and the section gained no new furniture.

`testimonials.html` holds the three directions that were considered (named
index, editorial rail, odometer) under the real tokens. Direction A was chosen.
Keep the file; it is the argument for why, and the rail is worth re-reading
before anyone proposes a conventional slider again.

**All six quotes stay in the markup.** Only one is visible, but every quote,
name and role is authored, and without JavaScript they stack and read in full.
The index is built by reading the authored `<strong>` in each quote, so no name
is written twice and the script invents nothing. A first pass had the names
living only in `data-name` attributes — that put copy in the script and left the
page nameless without JS. Do not reintroduce it.

**All six quotes share one grid cell.** The stage is always as tall as the
longest quote, so turning one moves nothing else on the page. A stage that
resized per quote would shunt the section below it on every turn.

**Autoplay, 6s, and the cursor rule is the clock.** The hairline beside the
active name draws itself across as the dwell elapses. It holds on hover, on
focus, when the section is off-screen and when the tab is hidden; a manual pick
ends it permanently rather than deferring it. Pause/resume needs a CSS
*animation* — `animation-play-state` is the only primitive that freezes
mid-flight. A transition cannot: zeroing its duration snaps it to the target.
The dwell is read from `--dwell` in the stylesheet so the rule and the timer
cannot drift apart.

**The cursor animates `transform`, not `width`,** and its space is reserved on
every name. Animating width for six seconds reflows the line every frame and
drags the name sideways throughout.

**The portrait blooms out of the mark** — the showreel aperture's move, played
small. The picture is always seen through the mark at 1400%, far past the
square, so nothing is cropped at rest; the animation only runs that scale up
from 38%. 1400% is chosen so the star's waist clears the corners — its arms run
on the axes, so the diagonals are what has to be checked.

The bloom's timing lives on the keyframes and the element runs `linear`, which
looks wrong and is not. `mask-size` interpolates linearly and the mark covers
the square at ~250% — only 16% of the way from 38% to 1400%. On the page's usual
`--ease-weight` that point arrived **25ms** in, so the star was a star for a
frame and a half and the rest crawled invisibly from 1300% to 1400%. It reported
as "the animation is not visible at all" while running perfectly. The star has
to hold near its own size and accelerate late — the opposite curve to everything
else here.

**The square has no background.** `#1f1f1f` read as a lighter patch on the
section, most visible early in the bloom when the mark is small. Transparent,
not a matched hex, so it keeps matching if the section changes.

**`.proof-foot` carries its own top margin now.** The old rows each had
`padding:36px 0`, so that rule had been taking its breathing room second-hand
from the last row. Removing the rows left it sitting on the attribution.

Open, for the client:

- **Six portraits are needed.** All six squares currently share one stand-in
  (`anzhelika-chair.webp`). Ask for head-and-shoulders crops — the stand-in is a
  full-body seated shot and at 68px it reads as a small figure rather than a
  face. 400×400 is ample; the slot is 68px at its largest.
- `01 / 06` above the index is the only string on the page that was not there
  before. It is interface rather than copy and it echoes the services numerals,
  but it is new text and it is one line to remove.
- On mobile the index lies on its side as a scrolling strip. There is no margin
  for the rule to hang in, so the underline becomes the cursor and the autoplay
  clock is not shown. Deliberate — better than a progress bar on a phone.

The 25ms bug was invisible to reasoning and to screenshots alike, and only
became a number under per-frame tracing. See the measurement note in §5.
