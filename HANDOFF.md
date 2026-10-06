# Handoff

Last updated at commit `f6eab5d` + the rail rebuild below. Read this before touching anything.

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
- **Testimonials.** Six rows became a three-up rail that drifts one column at a
  time. Second design — the first was rejected by the client. See §7.

Unresolved: see §6.

---

## 3. Active files

| File | Role |
| --- | --- |
| `premium-direction.html` | **The active build. The only page to edit.** |
| `new-direction.html` | Previous direction. Kept as the copy baseline and for comparison. Do not edit. |
| `new-direction-2.html` | **Another agent's workspace. Never open for writing.** |
| `testimonials.html` | The three slider directions originally considered for §7. **None of them shipped** — the client asked for a conventional three-up rail instead. Kept as history; not part of the build. |
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

**The named-index testimonial slider was rejected by the client.** It shipped —
one quote at display size, the six names as the navigation, the cursor rule
doubling as the autoplay clock. She asked instead for a conventional three-up
slider with autoplay. The reasoning behind the index was sound and is still in
`testimonials.html`; it was simply not what she wanted. Rebuilt as the rail in
§7. Do not re-propose the index.

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

Three quotes on the measure, drifting one column at a time.

**This is the second design.** The first shipped a named index — one quote at
display size, the six names as the navigation — and the client did not want it.
She asked for a conventional slider, three up, autoplaying. That is a decision,
not a question; do not re-propose the index. `testimonials.html` still holds the
three directions originally considered and is worth reading before anyone
proposes anything here again, but it describes a road already closed.

The job became making a three-up slider not look like one.

**No cards.** Three bordered boxes of equal height turn quotes into a comparison
table, and that is the single thing that makes this pattern read as a template.
One hairline runs the full measure and the columns hang off it. What holds them
together instead is the baseline their attributions share — every thumb, name
and role lands on one line however many lines the quote above it runs. That
alignment is most of the difference between hand-set and assembled.

**It advances one column, not a page of three.** Paging three is the jolt that
gives these away. Stepping by one is a drift, which is the behaviour the logo
marquee already establishes on this page.

**The rail breaks the right gutter** so the next quote is always entering the
margin — how the row says there is more without a dot row. Anything off the
measure is dimmed to .26; asking the eye to read a half-visible column is the
other half of why these feel cheap.

**The loop is built from clones** the script marks `aria-hidden`, exactly as the
marquee duplicates its track. The six authored quotes stay the only place this
copy is written. Verified: the section's visible text is byte-identical to
`e807407`, before any slider existed. The `01 / 06` counter is gone with the
index, so there is now no string on the page outside the frozen copy.

**Placing and lighting are separate functions, and that is deliberate.** The
backward wrap has to park the track at a position it is not at before it
travels, and parking must not light anything. Forward, the silent reset waits
for the slide to land or the jump happens mid-travel and shows. Backward it is
the reverse order: park a full set further along, then travel back out of it.
Stepping back from the first column without that park slides the rail the wrong
way and reads as the slider correcting itself. It was written wrong the first
time and caught by walking the loop in Playwright, not by looking at it.

**Every measurement comes from rendered geometry,** never recomputed from the
CSS: the step is the distance between the first two items, the window is the
viewport divided by the step. The basis changes at two breakpoints and the gap
is a clamp, so anything derived from the stylesheet would eventually disagree
with it. Resize repaints without animating, or the track sits between columns.

**Arrows, deliberately.** On the index the names were the control, so arrows
would have been clutter. A drifting rail with no visible control reads as
broken, and the client asked for a normal slider. Two marks and a hairline that
fills — the back arrow is the page's own mark rotated, not a second glyph.

**Steering restarts the dwell rather than ending autoplay.** The opposite of the
index, where a manual pick ended it for good: a rail gives you no way to sit on
a chosen quote, so stopping it dead would strand the reader mid-set.

**Autoplay, 4.6s.** Holds on hover, focus, off-screen and hidden tab, counting
its reasons so one ending does not resume on behalf of another still in force.

**The portrait blooms out of the mark** — the showreel aperture played small.
Exactly one column enters per advance, so exactly one square blooms at a time,
and that is what tells you the rail moved instead of a progress bar having to.

**The bloom is driven by `is-entering`, which is set deliberately, never by
`is-lit`.** Lit means on the measure; entering means newly arrived, and the
silent rewind is exactly where those two facts part company. Wired to `is-lit`,
the reset moved the class from the three clones onto the three originals in a
single frame and fired all three blooms at once — at the loop point, the one
moment that has to be seamless. The geometry was invisible; the blooms announced
it. The class is removed again after 850ms or a column that comes back round
cannot re-trigger it. Arrival deliberately blooms all three together: that is
the section entering, not the rail looping.

The bloom's timing lives on the keyframes with the element `linear`, which looks
wrong and is not. `mask-size` interpolates linearly and the mark covers the
square at ~250% — only 16% of the way from 38% to 1400%. On the page's usual
`--ease-weight` that point arrived **25ms** in, so the star was a star for a
frame and a half and the rest crawled invisibly from 1300% to 1400%. It reported
as "the animation is not visible at all" while running perfectly. The star has
to hold near its own size and accelerate late — the opposite curve to everything
else here. 1400% is chosen so the star's waist clears the square's corners; its
arms run on the axes, so the diagonals are what has to be checked.

**The thumb square has no background.** `#1f1f1f` read as a lighter patch on the
section, most visible early in the bloom when the mark is small. Transparent,
not a matched hex, so it keeps matching if the section changes.

**Without JavaScript the rail is a row that wraps,** every quote lit and
readable. The copy never depends on a script running.

Open, for the client:

- **Six portraits are needed.** All six squares share one stand-in
  (`anzhelika-chair.webp`). Ask for head-and-shoulders crops — the stand-in is a
  full-body seated shot and at 68px it reads as a small figure, not a face.
  400x400 is ample; the slot is 68px at its largest. Each is wired on its own by
  swapping that quote's `img src`, plus a `--pos` focal point if the crop needs
  one. `ASSET-SPEC.md` has no entry for these yet.
