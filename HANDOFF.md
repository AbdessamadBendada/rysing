# Handoff

Read this before touching anything.

**`index.html` is generated. Do not edit it — edit `src/` and run `node build.js`.**
It was called `premium-direction.html` until the files were reorganised; every
other HTML file now lives in `playground/`. Anything below that names
`premium-direction.html` refers to this same page under its old name. The build
system is §12.

---

## 1. Goal

Rysing is a branding and visibility studio selling 20–30k engagements. The site
has to carry that price before anyone reads a word.

`playground/new-direction.html` reached competent but read as a very good
template rather than a studio operating at that level. `index.html` is the fix.
The diagnosis is in `new-direction-comments.md`; the short version is that every
device was used at full strength, everywhere, at once, and the work this borrows
from spends most of the page near-silent so a few moments can detonate.

The job is to keep inverting that ratio back.

---

## 2. Current state

`index.html` is the active build. It is on `main` and pushed.

Done and verified:

- **Pacing.** Section rhythm follows the measure, with room top and bottom.
  Quiet gaps ~190px; the manifesto and closing open to ~250px.
- **Restraint.** Section heads 80px → 54px, services numerals 260px → 186px.
  Font alternation was cut to three moments — hero, manifesto, closing — so it
  would read as emphasis rather than texture. Client-approved sections have
  since taken it to **five** (adding §8 and §10). That is the device drifting
  back toward wallpaper, which is what the restraint pass existed to stop. The
  manifesto is the cheapest of the three originals to give up.
- **Colour.** Red and blue bookend the page. The mid-page glow was removed, then
  deliberately reinstated for §8 and again for §10, so blue now appears three
  times between the hero and the footer. The closing's red fill is gone (§11),
  so there is no longer a single decisive red anywhere.
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

- **Final CTA.** "Ready to build a legacy?", centred, outline pill. Replaces the
  previous headline and eyebrow — a client copy change. See §11.
- **Newsletter.** Centred column, no printed-cover card. Knowingly deletes four
  strings of baseline copy. See §10.
- **Spotlight.** One giant photograph became three panels on work-row--c's
  geometry. The copy that sat on the image now stands as a section head. See §9.
- **Belonging.** The qualifier, between the proof and the ask. New client copy;
  reverses the no-mid-page-glow decision knowingly. See §8.

Unresolved: see §6.

---

## 3. Active files

| File | Role |
| --- | --- |
| `src/index.html` | **The homepage source. Edit this, not `index.html`.** |
| `src/_header.html`, `src/_footer.html`, `src/_layout.html` | The shared chrome, in one place. See §12. |
| `shared.css`, `shared.js` | The stylesheet and script, extracted from the old inline blocks. Shared by every page. |
| `build.js` | `node build.js`. Zero dependencies. |
| `index.html` | **Generated — do not edit.** Committed so the site can be served as flat files. Was `premium-direction.html`. |
| `playground/new-direction.html` | Previous direction. Kept as the copy baseline and for comparison. Do not edit. |
| `playground/new-direction-2.html` | **Another agent's workspace. Never open for writing.** |
| `playground/testimonials.html` | The three slider directions originally considered for §7. **None of them shipped** — the client asked for a conventional three-up rail instead. Kept as history; not part of the build. |
| `playground/rysing-comments.html` | Frozen copy/structure baseline. Read-only. |
| `playground/` (the rest) | Earlier cycles — `rysing.html`, `rysing2.html`, `rysing-v2.html`, `rysing-private.html`, `rysing-branding.html`. History only. |
| `AGENTS.md` | Settled decisions and the local testing harness. **Its ACTIVE TRACK section is stale — it predates this cycle and still names `new-direction.html` as the build.** Read it for the settled decisions, not for which file to edit. |
| `new-direction-comments.md` | Why the previous direction was not premium. 12 ranked problems. |
| `PREMIUM-DIRECTION-PLAN.md` | The brief this build was made against. Still calls the build `premium-direction.html`. |
| `ASSET-SPEC.md` | Per-slot dimensions, crops, shot list. Send to the client. **Still says only three projects are active — correct before forwarding.** |
| `~/Downloads/Homepage-html/Main.dc.html` | The original design reference. Replicate values, never copy markup. |

**Everything in `playground/` has broken asset paths.** Those files reference
`rysing-assets/…` and `rysing brand assets/…` relative to the repository root,
which no longer resolves from one directory down — 136 references across the nine
files. They were moved as history, so this was left alone deliberately; if one
has to render again, prefix its asset paths with `../` rather than copying assets
into `playground/`.

Work assets added this cycle, all in `rysing-assets/`:
`work-10-michael-diewald.webp` (spotlight, from the Michael project), 
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

**Every decorative glow carries `.glow-soft`.** It fades the glow to nothing
before the top and bottom of its own section. Vertical only — left and right are
clipped at the viewport edge, where a cut is invisible. Without it a glow is
simply sliced by the section box and leaves a hard horizontal line the full
width of the page; three of those shipped at once and are what made the page
look like sections glued together. It masks rather than resizing each gradient
to fit, because these glows are placed off-centre and near their edges on
purpose and shrinking them moves the light away from where the design puts it.
The hero and footer carry one-sided versions. Do not add a glow without it, and
see the measurement note in §5 before assuming a new one is clean.

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
`playground/testimonials.html`; it was simply not what she wanted. Rebuilt as the rail in
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
**Verify the page, not the section. This was the single worst process failure
of the cycle.** Three sections were built and signed off one at a time, each
checked on its own bounds and each fine. Together they put three hard
horizontal lines across the full width of the page — the hero, the newsletter
and the closing all cut their own glow flat at their bottom edge. The client saw
it immediately; no amount of per-section checking would ever have shown it. After
any section-level change, shoot the whole page and scan every boundary. The
audit is cheap: `fullPage` screenshot, then for each section edge sample the
pixel 2px above and 2px below across the width and report the largest channel
delta. Anything over ~10 is a visible line. The three seams measured 146, 82 and
51; everything on the page is now ≤3.

**An element screenshot cannot show an edge artifact, because the artifact is
at the edge.** The belonging glow shipped as a hard-edged rectangle: an ellipse
larger than its section under `overflow:clip`, guillotined into a straight top
and straight sides. Every check missed it because the section was captured with
`locator('#belong').screenshot()`, which crops to exactly the bounds the cut
fell on. Anything involving a section's boundary — glows, bleeds, sticky seams,
negative margins — has to be captured in page context with the neighbours
visible, and is worth a pixel probe across the edge: walk a column of the PNG
and look for a sudden channel jump. A clean edge reads as page black right up to
the boundary.

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

- `RYSING_PROJECT_DIRECTION.md` and `playground/new-direction-2.html` sat modified and
  uncommitted from Oct 3 and were held out of every push on the grounds that
  committing another track's workspace on a general "push everything" is not
  what that instruction means. They went in on `b943842` once the instruction
  was repeated. Checked first — doctype, balanced tags, script parses — but not
  reviewed for design or behaviour; that is the other track's call. The two
  changes are consistent with each other: the HTML is a full rebuild and the
  markdown is the decision-log entry describing it.
- `ASSET-SPEC.md` still describes three active projects, has no entry for the
  six testimonial portraits, and none for the spotlight's three panels. Correct
  all three before forwarding.
- The footer wordmark has a soft white orb to the left of the star. It is in the
  supplied artwork (`rysing-logo-lockup-light.webp`), not a rendering fault —
  invisible at header size, obvious at full width. Needs clean artwork if the
  client does not want it.

---

## 7. Testimonials

Three quotes on the measure, drifting one column at a time.

**This is the second design.** The first shipped a named index — one quote at
display size, the six names as the navigation — and the client did not want it.
She asked for a conventional slider, three up, autoplaying. That is a decision,
not a question; do not re-propose the index. `playground/testimonials.html` still holds the
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
`e807407`, before any slider existed — the `01 / 06` counter went with the
index. That held for this section only, and only until §9 and §11: the
spotlight's panel captions and "Ready to build a legacy?" are both new copy,
added on the client's instruction.

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
broken, and the client asked for a normal slider. Two marks, and the back arrow
is the page's own mark rotated rather than a second glyph.

**There was a filling progress hairline and it is gone.** Six quotes three at a
time is a sliding window, not a sequence of pages, so there is no honest
fraction to show: the window covers positions 5,6,7 of six, which is either
133% or a wrap. It overflowed its track and jumped backwards once a cycle. Do
not re-add one without first deciding what it would actually measure.

**The rewind is idempotent.** Each advance past the end used to schedule its own
`i -= total`, so clicking faster than the 1.1s reset stacked them — from 7, two
firings landed on -5, the lit window fell off the start of the array and every
column went dark. There is one pending reset now, replaced rather than added to,
and it normalises with modulo so it is correct however far the index has run.

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

---

## 8. Belonging

The section between the testimonials and the spotlight. Client's design, client's
copy, supplied as a screenshot and confirmed word for word before it was built.

**What it is for.** It sells nothing and lists nothing. It names a feeling the
reader is meant to recognise in themselves and answers it with belonging rather
than a service. The testimonials are other people's words — proof that this
works for somebody else — and the closing is the ask. This is what turns "these
people got results" into "and you are one of them" immediately before being
asked to apply. Self-selection: anyone who nods at it has qualified themselves.

That is why it carries no eyebrow, no button and no body copy. One sentence held
in space is the whole design, and anything else added here gives the eye
somewhere to go other than the line.

**It knowingly reverses two settled decisions.** Both were flagged before
building and both were approved:

- The mid-page glow was removed early on, and this puts one back. It is the only
  blue between the hero and the footer, so it should stay the only one. It is
  built well below the saturation of the supplied mock: at full strength it is
  the brightest object on a page whose whole argument is restraint, and it would
  still be ringing when the red closing ask arrives a screen later.
- It is the fourth font-alternation moment, against the rule that cut it to
  three (hero, manifesto, closing) so it would read as emphasis rather than
  wallpaper. It earns it — if any line on the page should detonate it is the one
  doing the identifying — but if the device starts feeling noisy, drop the
  alternation from the manifesto, which is the least load-bearing of the three.

**The measure is 20em because that is where the sentence breaks on its own
clauses:** "...and your brand / are meant for something bigger, / Rysing is the
place that gets you." At 16em it split "meant for" from "something bigger" and
ran the second clause into the third, which reads as text that happened to wrap
rather than a line that was set. Verified by walking the rendered words and
grouping them by line box, at both ends of the size clamp. It holds three lines
down to 820px and wraps further below that, which is correct — the alternative
is type too small to carry the moment.

**Every decorative glow carries `.glow-soft`,** which fades it to nothing before
the top and bottom of its own section. Only the vertical axis is faded: left and
right are clipped at the viewport edge where a cut is invisible. It masks rather
than resizing each gradient to fit, because the glows are deliberately placed
off-centre and near their edges, and shrinking them to fit moves the light away
from where the design puts it. The hero and the footer carry one-sided versions
of the same fade. Do not add a glow without it.

**The glow is a gradient that reaches transparent inside its own box,** not an
oval larger than the section. Built the other way round first — a 1254px ellipse
in a 725px section under `overflow:clip` — it was guillotined into a rectangle
with a hard top edge straight across the page. Its drift is scale-only for the
same reason: a translating drift walks the faded edge back into the boundary and
the hard edge returns at one end.

Spread too wide it also stops being an object and becomes a wash across the
band, which reads as a blue panel the words sit on rather than light behind
them. The corners of the section stay black on purpose.

---

## 9. Spotlight

One full-width photograph with the copy laid over it became three panels.

**The copy did not change.** The eyebrow, the headline and the line beneath it
used to sit on top of the image; they now stand as a section head. Verified
against the previous commit: nothing lost from the section, only the three panel
captions added. "One giant one" meant the picture, not the words.

**It reuses `work-row--c`,** not a second system built for this section — the
big landscape, then the panel that hangs lowest, then the one between. That is
exactly the geometry of the supplied mock, and reusing it keeps this section and
the last row of Selected Work in step if either is ever retuned.

**The lead's width cap belongs on the sentence, not the column.** Capping the
whole column squeezed a 54px headline into five lines while every other section
head takes three.

Open:

- ~~No photograph of Michael Diewald~~ — supplied from the Michael project
  (`redesign/assets/img/michael-shoulder-model.png`) and now wired as
  `work-10-michael-diewald.webp`. 1748x1240 PNG at 697KB, centre-cropped to 4:5,
  resampled to 920x1150 and encoded to webp at 47KB — a 93% saving, and still
  comfortably above the 2x retina requirement for a 361px slot (0.78x, no
  upscaling). The stand-in and its CSS are gone.
- **Gerd Bommer and Finance Consultancy now appear twice on the page** — here and
  in the last row of Selected Work, with identical captions. That came from the
  mock and was built as drawn, but it is worth putting to the client: either
  this section carries three clients who appear nowhere else, or Selected Work
  drops its last row.

---

## 10. Newsletter

A centred column. The two-up with the printed cover beside it is gone.

**It deletes baseline copy, deliberately.** The card carried "Sunday edition",
"Rysing Studio", "Fudge for founders." and "People branding. Without the fluff."
— all present in `playground/rysing-comments.html`, so this is a real removal, flagged
before it was made and built because the supplied design has no card. One revert
brings it back. If it returns, it needs a home that is not beside the form: the
reason the centred version works is that the ask is a single field and
everything above it narrows toward that field instead of sitting beside a second
object competing for the eye.

It was also the only light object on the page. Nothing else on the page is
paper-white now.

**It is the fifth font-alternation moment,** and `.fudge h2 .alt` has left the
neutralised list. Alternation was cut to three (hero, manifesto, closing) so it
would read as emphasis; §8 made it four and this makes it five. That is the
device drifting back toward wallpaper — the thing the restraint pass existed to
stop. Watch it. The manifesto is still the cheapest one to give up.

**The headline measure is 17.3em and it is measured, not chosen.** The window in
which it breaks after "business" — the way the design sets it — is 17.0 to
17.6em. Narrower and it falls to three lines, one per face. Wider and "and" is
dragged up to hang at the end of line one. In `em`, never px: a px measure holds
the break at one font size and loses it at the next step of the clamp. Verified
holding the identical break at 1680, 1440, 1200, 1000, 820 and 560px.

**The blue returns at the right edge** as the page approaches the footer, where
it is already waiting behind the wordmark — so it reads as the footer's light
rising rather than a fourth use of the colour. Painted as a gradient that
reaches transparent inside its own box, for the reason in §9.

---

## 11. Final CTA

"Ready to build a legacy?" — centred, one question and one pill.

**It is a client copy change, not a restyle.** It replaces "Turn your vision
into a courageous brand and thought leader reputation." and drops the eyebrow
"Ready when you are" — both baseline copy. "Ready to build a legacy?" exists
nowhere in the earlier files. Checked before building, built because the
supplied design says so. It does earn its place: it answers the manifesto's
"build a legacy" at the other end of the page.

**The red fill is gone.** That was the page's single decisive use of red — every
other pill is an outline, so the one that mattered was the one that was filled.
Now every pill including this one is an outline, and the closing ask has to take
its weight from the space around it and from being the only thing on the screen.
Red survives only in the review stars, the belonging mark and the focus ring.
If the page ever reads as having no destination, this is the first place to look.

**One light, red, low left.** The blue that sat high right was removed on
instruction: the newsletter above already bleeds its blue down into the top of
this section, so the colour is present without this section adding a second
source, and the ask sits on one light rather than two. The red was at 98%, which
buried almost all of it under `.glow-soft`'s bottom fade; it is at 74% now, where
it reads and still clears the fade.

**The measure is 9.4em.** The question breaks between its two faces — "Ready to
build a" on the grotesque line, "legacy?" alone on the didone — anywhere from
8.6em to about 12.7em, so 9.4em sits well inside the window rather than on an
edge. In em regardless, because a px measure holds a break at one step of the
size clamp and loses it at the next. Verified holding at 1680 down to 560px; at
390px it takes three lines, which is correct.

---

## 12. The build system

Added when the site needed a second page and the header, footer, 1240 lines of
CSS and 500 lines of script existed only inside one 2270-line file.

```
src/_layout.html    the document shell; owns <head> and <main>
src/_header.html    skip-link, header, menu overlay
src/_footer.html    footer
src/index.html      homepage content only, with front matter
shared.css          the former inline <style>
shared.js           the former inline <script>
build.js            node build.js  →  writes index.html at the root
```

**`index.html` is generated.** Edit `src/` and rebuild. The generated files are
committed on purpose: the output is flat HTML that needs no JavaScript and no
server, so the site can be opened from disk, dropped on any host, or handed to
Divi without the chrome depending on a fetch.

**A new page is one file.** Create `src/<name>.html`, give it front matter, run
the build. It inherits the chrome and the stylesheet automatically.

```
<!--
  title: Keynote speaking — Rysing
  description: ...
  home: index.html
  skip: #intro
-->
    <section class="band" id="intro"> ... </section>
```

`title` and `description` are per-page. The other two keys exist because the
chrome's links are same-page anchors:

- **`home`** prefixes anchors that live on the homepage. Empty on `src/index.html`
  so `#work` stays a same-page scroll; `index.html` on a sub-page so the same
  link navigates home and then scrolls. Without this, a sub-page's nav silently
  points at ids that are not on it.
- **`skip`** is the skip-link target, which has to be a real id on that page.

A missing key or an unresolved `{{token}}` fails the build with exit 1. A page
that ships `{{home}}#work` inside an href is worse than one that refuses to
build.

**`no-js` moved from `<body>` to `<html>`, cleared by an inline script in the
head.** Not cosmetic. `.no-js` changes real layout — the reel's sticky stage and
the testimonial rail, nine rules in `shared.css`. Clearing it from the deferred
external `shared.js` painted the no-script layout and then reflowed on every
load, a jump the inline script never had. It is on `<html>` because `<body>` does
not exist that early. A failed `shared.js` still leaves the page fully readable,
which is the §2 rule.

**`shared.css` is at the repository root, not in a subfolder.** Its five
`@font-face` rules use paths relative to the stylesheet (`rysing-assets/…`).
From `assets/shared.css` those resolve to `assets/rysing-assets/…`, and under
`font-display:swap` a missing font is not an error — the page renders in Didot
and Helvetica and looks nearly right. Same silent-failure class as the `ch`
measure in §4. If the CSS ever moves, rewrite those five paths in the same
commit.

**The extraction was verified pixel-identical, not eyeballed.** CSS and JS
compared verbatim against the inline originals; body markup diffed to zero;
then full-page captures of the old and new pages at 1440px compared row by row
across all 15,848 rows. A first pass showed 0.43% of pixels differing in the
hero, the Selected Work film panel and the logo marquee — all three
continuously animating. Pinning every animation to `currentTime = 0` and parking
the videos on one frame per §5 took it to **0 of 22,821,120 pixels**. Pausing an
animation is not the same as pinning it: `animation-play-state:paused` freezes
it wherever it happened to be, which is not reproducible between two loads.
Re-run that comparison after any change to the extraction.

Also checked: fonts report `loaded` rather than falling back; zero console
errors and zero failed requests; with JavaScript disabled the page keeps all
5,556 characters of copy, all six nav links and all six testimonial quotes at
full opacity with nothing hidden. The build is idempotent — a second run on
unchanged sources reports `unchanged` and rewrites nothing.

**Known gap.** The spotlight's "Learn more" button points at
`playground/rysing2.html`. That was a stopgap so the move did not leave a 404;
it links the live page into the archive and wants a real keynote page.

---

## 13. Contact page

`src/contact.html` → `contact.html`. Built from the client's supplied design.
First page after the homepage, and the first real test of the §12 build.

**The header was left alone.** The supplied design draws a full inline nav —
HOME ABOUT SERVICES PORTFOLIO BLOG CONTACT with the current page underlined —
instead of the burger. That was put to the user and the answer was to keep the
burger everywhere, so the mock's nav is treated as indicative only. **The header
rework in §6 is still open and still unspecified.** The one change made to the
chrome: the nav's Contact link now points at `contact.html` instead of the
homepage's `#contact` anchor. The two "Apply to work with us" pills still point
at the homepage's closing section; moving them here is an open question.

**`aria-current="page"` is applied by the build,** not hand-written — whichever
nav link points at the file being built gets it, so a new page never has to
carry its own edited copy of the nav. Styled as the underline the design draws.

**The question breaks where it breaks by a nowrap, not by a measure.** The
design sets "READY TO BUILD" / "A LEGACY?". That break cannot be reached by
width alone: "a legacy?" is wider than "Ready to build a", so any measure that
fits the first also pulls the "a" up onto line one — confirmed by walking every
value from 7em to 14.5em. "a legacy?" is held together with the hero's own
`.keep`. Verified holding at 1680, 1440, 1280, 1024, 900, 768, 560 and 390px.

**Grouping rendered words by their `top` to find line breaks is wrong here,**
and reported three lines where there are two. The grotesque and the didone have
different ascents, so two faces sharing a baseline do not share a top. Cluster
by the vertical midpoint instead. The earlier sections' measurements did not hit
this because they break between faces rather than across one.

**The hero and the three details are one section,** so the red light runs behind
all of them. Split in two, each half would have to fade at its own edge under
`.glow-soft` and the light would break across the join.

### Calendly — works, but does not look like the design

The live embed was chosen over the designed placeholder. It loads and books:
assets and `api/booking/initial_settings` all return 200, the frame renders
"1:1 call with Anzhelika", and the profile is real (Anzhelika Tauber,
`contentfudge_anzhelika`, no unavailability). What it actually looks like:

- **It renders white.** `background_color` / `text_color` / `primary_color` are
  passed and ignored — custom colours are a paid Calendly feature and this
  account is on a free plan. A white card on a black page.
- **It is branded Content Fudge,** in orange, not Rysing — plus Calendly's own
  "POWERED BY" corner ribbon, which is also plan-gated.
- **It serves its own cookie-consent banner** inside the panel. The embed sets
  third-party cookies; for an Austrian business that is a real consent question,
  not a styling one.
- **It needs ~700px.** The panel is `clamp(560px,58vw,760px)`, taller than the
  design's, because a shorter box crops the time slots.

Options, in order of fidelity to the design: upgrade the Calendly plan (fixes
colours and both brandings at once); or keep the designed dark placeholder and
link out. Not a decision to make silently — flagged, not resolved.

**It mounts lazily.** Calendly does not build the booking UI until the widget is
scrolled into view. Any check that loads the page and reads the frame without
scrolling sees an empty iframe and a spinner that never clears — that is the
test being wrong, not the embed.

**The fallback sits behind the widget, not inside it.** Calendly *appends* its
iframe rather than replacing the element, so anything left inside is pushed out
of the clipped panel — which is what happened first. The placeholder is now a
sibling underneath, and `.calendly-inline-widget:empty { display:none }`
collapses the widget until Calendly fills it, so with the script blocked or off
the fallback's link stays clickable. Verified: with JavaScript disabled the
widget is `display:none` and `elementFromPoint` returns the link. That is why
the widget div is written on one line with no whitespace — whitespace would make
it non-`:empty`.

### Form

No backend, same standing as the newsletter (§6 — there are now two). It
validates and then says sending is not connected; it never reports success for a
submit that goes nowhere. `novalidate` moves validation into the page's own
voice, but `required` and `type="email"` stay on the fields so the browser still
enforces them with JavaScript off. Fields are flagged only after a first submit
attempt and cleared as soon as they are corrected. Verified: empty submit flags
3 fields and focuses the first; a malformed address flags 1; a valid submit
clears all and reports the pending-backend message.

**The send button is the only filled pill on the site.** §11 removed the closing
ask's red fill so every pill became an outline. The design draws this one
filled, and a form whose commit control is as quiet as its labels reads as
unfinished. Hover inverts it rather than brightening it.

### Verified

Whole page at 1440px: no console errors, no failed requests, nothing overflows
horizontally at 1680/1280/1024/900/768/560/390, columns collapse at 900.
Every section boundary probed across the width — median 0, max 3, no column
over 10, so no seam (§5). With JavaScript off: all copy present, nothing hidden,
native validation intact, Calendly fallback visible and clickable.

**The homepage was re-checked after the shared files changed,** because this
page appended to `shared.css` and `shared.js` and edited `_header.html`:
`index.html` is still pixel-identical to its pre-contact-page baseline — 0 of
22,821,120 pixels at 1440px.

### Open

- **The email address disagrees with the rest of the site.** This page says
  `hello@rysing.studio`, as the design does. The footer — on this very page —
  and the homepage both say `hello@rysing.agency`. Both are visible at once.
  Built as drawn; someone has to say which is right.
- The booking URL and the Calendly branding are both `contentfudge`, the earlier
  brand name.
- The phone number and Koflergasse address are new copy, not in any earlier
  file, and unverified.
