# Handoff

Read this before touching anything.

**Every page at the root is generated. Do not edit one — edit `src/` and run
`node build.js`.** The build system is §12.

| Page | Source | Section |
| --- | --- | --- |
| `index.html` | `src/index.html` | §2, §7–§11, §15, §16 |
| `contact.html` | `src/contact.html` | §13 |
| `about.html` | `src/about.html` | §14, **§18–§21** |
| all three | `src/_footer.html` | §17 |

**The about page is the live front.** §14 describes it as first built; §18–§21
are this cycle and override §14 wherever they disagree. The homepage has not
been touched since §17.

This was a single page until recently. `index.html` was called
`premium-direction.html` before the files were reorganised, and anything below
that still names `premium-direction.html` refers to it under that old name.
Every other HTML file now lives in `playground/` as history.

The chrome and the stylesheet are shared by all three, so **a change to
`src/_header.html`, `src/_footer.html`, `shared.css` or `shared.js` lands on
every page at once.** After any such change, re-check the pages you did not
mean to touch — the method and the baseline numbers are in §12.

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

Three pages, all on `main` and pushed: the homepage, contact (§13) and about
(§14, §18–§21). The homepage is the one this section describes; it is also the
one the client has signed off, so it is the one a shared-file change must not
disturb.

**Two things now reach all three pages and are newer than most of this
document.** The footer wordmark is the last object on every page rather than
the first thing in the footer (§17). And `shared.css` / `shared.js` are
requested with a content-hash query, `shared.css?v=…`, filled by the build —
without it a CSS-only change ships new markup against a cached stylesheet and
the page renders half-built, which is exactly how the about hero went out
once (§12).

**The about page is where the work is.** It has moved furthest from what §14
describes: a photographic hero replacing a type-on-black one, "Why we exist"
deleted outright, "Our conviction" rebuilt on new copy with its blue claim
removed, and the founder portrait swapped. Section order there is now
**hero · conviction · founder · studio · courage · stats · testimonials**.
Across §18–§20 it has lost **ten blocks of baseline copy — seventeen
sentences — and had one headline altered.** Every one was instructed. The
itemised list and how it was counted are in §19; it is worth putting to the
client as a total rather than as four separate changes, because no single one
of them looked large on its own.

**The section order changed materially this cycle** and several notes below
predate it. It now runs:

> hero · reel · stats · services · **Selected Work (01–06)** · manifesto ·
> **spotlight photograph** · **team** · **founder copy** · recognition ·
> testimonials · belonging · **the last three case studies** · newsletter ·
> closing

What moved: Selected Work dropped its third row; the spotlight went back to one
photograph with the copy over it and moved up above the team; the three case
studies it used to hold now stand bare lower down; the founder's full-width
plate is gone and her copy block sits below the team.

Done and verified on the homepage:

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
- **Services.** Four stages, first open on load. Row 04 was renamed to "Thought
  Leadership" on the client's instruction — see §4.
- **Selected Work.** Two rows of three, each with its own shape signature. Row
  one carries a film panel. It was three rows; the third moved into the
  spotlight (§9) on instruction, so the page now runs six case studies, then
  other sections, then the remaining three.
- **Testimonials.** Six rows became a three-up rail that drifts one column at a
  time. Second design — the first was rejected by the client. See §7.
- **Team.** The founder's full-width plate is gone and she now stands inside the
  team as a fixed lead card with four colleagues drifting past her. The page
  therefore carries **two rails**, which the script had to be generalised for.
  See §15.

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
| `src/contact.html` | Contact page source. §13. |
| `src/about.html` | About page source. §14, and **§18–§21 for everything newer**. |
| `src/_header.html`, `src/_footer.html`, `src/_layout.html` | The shared chrome, in one place. Changing one changes all three pages. See §12. |
| `src/_testimonials.html` | The whole `#proof` section — heading, badges, **the six quotes**, controls, CTA. Included by the homepage and about via `{{> testimonials}}`. **The only place this copy is written** (§7). Carries `data-treel-view`, which is how the script finds a rail's viewport now that there is more than one (§7, §15). |
| `shared.css`, `shared.js` | The stylesheet and script, extracted from the old inline blocks. Shared by every page. |
| `build.js` | `node build.js`. Zero dependencies. Also stamps the `?v=` content hash onto `shared.css` and `shared.js` — see §12, this is load bearing. |
| `index.html`, `contact.html`, `about.html` | **Generated — do not edit.** Committed so the site can be served as flat files. `index.html` was `premium-direction.html`. |
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

`rysing-assets/about-hero.webp` is the about page's hero photograph (§18).
Supplied as a 1024x683 jpg, cropped to 1024x580 to remove a "BRAND on TOUR"
watermark that sat where the headline does, encoded webp q86 at 64KB. **It is
the lowest-resolution image doing the biggest job on the site** and wants a
larger original — see §6.

`anzhelika-chair.webp` is no longer the about founder portrait (§21) but is
still the stand-in behind all six testimonial squares, so it is still live.
`anzhelika-office.webp` and `anzhelika-cutout.webp` remain unused.

Work assets added in the previous cycle, all in `rysing-assets/`:
`work-10-michael-diewald.webp` (spotlight, from the Michael project), 
`work-01-opsdetox.webp`, `work-02-finer-things.mp4` + `-poster.webp`,
`work-03-clemens.webp`, `work-06-knowle-victory.webp`, `work-08-u4success.webp`,
`work-09-digitfinance.webp`. 648KB total for nine panels.

Team portraits added this cycle, all recompressed per §4 and all 4:5 at
900x1125: `anzhelika-red-suit.webp` (67KB, from a 7.2MB PNG),
`kristina-verbitskaia.webp` (92KB) and `marc-babin.webp` (40KB, the only
landscape source). Full provenance in §15.

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
instruction; that was the agent's error, not a design change.

**The star is see-through from the first frame, and opens at 27%** — ~450px at
1440. Both on instruction, and both reverse a decision recorded here. It used to
open as a solid `--paper` fill that crossfaded to the footage via
`--reel-reveal`; that overlay and the variable driving it are gone, and `MIN`
went 16 → 27. See §16 for what this costs, measured — it is not a free change,
and the evidence is there so nobody has to rediscover it.

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

**Row 04 is "Thought Leadership".** Renamed from "Lead Gen & Sales" on the
client's instruction — a visible copy change, so it is a real edit to the
baseline and not a restyle. It is the better name: that stage already listed
podcast, videocast, YouTube channel, long form content, production,
post-production and keynote writing, under the outcome "Be chosen for what comes
next." Lead generation was only ever in the title. Set in title case to match
its three siblings in the source; `.system-name` is `text-transform:uppercase`,
so the case is a source convention rather than anything visible.
`RYSING_COMMENTS_BRIEF.md` still calls it "Row 04 (Lead Gen & Sales)" and was
deliberately left — it is a historical brief, not live copy.

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

**A `fullPage` screenshot paints `position:fixed` chrome into the stitch, and
it reports as a seam that does not exist.** The about page's hero boundary came
back at **221** against a neighbourhood of 1–3, intermittently — two runs in
three. There was nothing there: `elementFromPoint` at the reported coordinate
returned the hero image and the section below it, nothing was focused, and no
paper-coloured element existed in the live DOM anywhere near it. The white box
in the capture started at **x=12**, which is `.skip-link { left:12px }` — the
skip-link is `position:fixed` and `translateY(-180%)`, and Chrome's full-page
capture painted it back in at a stitch boundary, across the edge being probed.

So: probe boundaries from **viewport** screenshots with the edge parked
mid-screen, not from one stitched `fullPage` capture. Scroll to `edge - 450`,
shoot the viewport, probe at `edge - scrollY`. Re-measured that way the whole
about page is **max 4**. The `fullPage` capture is still the right tool for
*looking* at the page (§5's whole-page rule stands); it is the wrong tool for
*measuring* an edge. An intermittent result on a boundary near a viewport
multiple is this, until proven otherwise.

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

- **The about page has lost ten blocks of copy across four instructed
  changes** (§18–§20) — most of what the page said *to the reader*, as opposed
  to about the studio. Each was approved on its own; the total has never been
  put to her. The itemised table is in §19. This is first on the list because
  it is the only item here that is cheap now and expensive later: the strings
  still exist in git and each is a one-block revert today.
- **The about hero photograph is only 1024px wide** for a full-viewport slot —
  it upscales 1.4× at 1× and 2.8× on retina. Ask for the original out of the
  camera; 2400px+ on the long edge fixes it and nothing in the markup changes.
  §18.
- **The about hero crop removed a "BRAND on TOUR" watermark** from the supplied
  photograph. It sat exactly where the headline does, so the image was unusable
  as delivered — but it is another brand's mark, so confirm the client is happy
  to drop the attribution. §18.
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
  by swapping that quote's `img src` in `src/_testimonials.html`, plus a `--pos`
  focal point if the crop needs one. **This now fixes both pages at once** — the
  rail is shared.
- **Two forms have no backend,** the newsletter and contact (§13). Both validate
  and then say sending is not connected; neither reports a false success.
- **The contact page says `hello@rysing.studio`; the footer on that same page
  and the homepage say `hello@rysing.agency`.** Both are visible at once. Built
  as the design draws it. Someone has to say which is right.
- **Calendly's embed does not look like the design** — white, Content Fudge
  branding, its own cookie banner, because custom colours and de-branding are
  paid-plan features. Full detail and the options in §13.
- **The about page's stats contradict the homepage's.** "30+ brands built" and
  "35+ websites launched" there against "35+ personal brands built" here;
  "50k+ followers" appears only here and "49 named testimonials" only there.
- **The founder photograph on about is a white-background shot** and is now the
  brightest object on the site. `anzhelika-cutout.webp` is the same photo with
  an alpha channel. §14.
- **Kinfolk's web licence is not cleared.** Aileron is public domain. Qualy, the
  logo face, is never loaded — the wordmark ships as artwork.

**Open design decisions**

- The two panel styles now sit in different sections, which makes the split
  easier to defend than when all three rows were in Selected Work — but it is
  still unreconciled. Selected Work's rows carry index numbers 01–06, a
  single-face caption, and reveal "Learn more" on hover. The spotlight row has
  no index, sets the client's name in the didone against the role in the
  grotesque, and its label stands rather than revealing. Either that is now the
  deliberate signature of the spotlight, or it should be reconciled.
- The OPS Detox panel says **"for startups"**; the client's own merchandise and
  site both say **"for scale-ups"**. Someone has to decide which is right.
- **The red-suit portrait is now on two pages** — the founder's lead card in
  the homepage team rail and the about founder section (§21). A page apart, and
  it is the founder in both, so it is a weaker repeat than the Gerd one in §9.
  `anzhelika-office.webp` and `anzhelika-cutout.webp` are both unused if she
  wants a second frame.
- **The about page has no blue object left.** §20 removed the blue-marked
  claim, which §14 called the page's one cool note; blue survives there only as
  the founder glow. The `<mark>` device itself is still used on the homepage
  spotlight, so it is available if the page wants it back.
- **The about page's largest light is now the conviction glow.** §19 deleted
  `.about-why-glow`, which was the biggest red wash on the site. The page is
  quieter and §11 wants red scarce, so this is probably an improvement — but it
  was not a decision anyone made, it fell out of a copy deletion.
- **"rysing" or "Rysing".** The about page sets it lowercase throughout its body
  copy, as its designs do; the footer and the homepage set it capitalised. Both
  appear on the about page at once.
- **The header's two "Apply to work with us" pills still point at the
  homepage's closing section,** not at the contact page that now exists. The nav
  Contact link was repointed; the pills were deliberately left, because moving
  them changes the homepage's behaviour. Decide.
- **The four footer legal links are still `href="#"`** — Imprint, Privacy
  Policy, Terms & Conditions, Cookie Policy. An Austrian business is expected to
  carry an Imprint, and the Calendly embed makes the cookie question real.
- **The nav's Blog link still points at `/blog`,** which does not exist.

**Still parked**

- Phases 3–6 of `PREMIUM-DIRECTION-PLAN.md` are done. The content changes in
  that plan — removing Sunday Fudge, trimming CTAs, cutting to three projects,
  adding outcome lines — are **all on hold** under "keep the copy as it is".
  Do not act on them without a fresh instruction.
- The header is due a rework. **The contact design drew one** — a full inline
  nav, HOME ABOUT SERVICES PORTFOLIO BLOG CONTACT with the current page
  underlined, instead of the burger. It was put to the user and the answer was
  to keep the burger everywhere, so that mock's nav is indicative only and this
  item is still open and still unspecified. Do not build it from that mock
  without a fresh instruction.

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
  six testimonial portraits, none for the spotlight's three panels, none for
  the team portraits, and none for the about hero. Correct all five before
  forwarding — and carry §15's finding into it, that a team portrait needs a
  mid-tone or darker background because a light one behaves like a spotlight
  on this page.
- **§14's measure table was corrected in place** rather than left standing
  with a note beside it. Two rows moved, three did not; it now carries the two
  measures §20 added. Checked against `shared.css` rather than assumed.
- The footer wordmark has a soft white orb to the left of the star. It is in the
  supplied artwork (`rysing-logo-lockup-light.webp`), not a rendering fault —
  invisible at header size, obvious at full width. Needs clean artwork if the
  client does not want it. **It is more visible since the mark moved to the
  bottom** (§17): the footer's blue light sits low-left, directly behind the
  orb, which is the brightest pairing it has had.

---

## 7. Testimonials

Three quotes on the measure, drifting one column at a time.

**It lives in `src/_testimonials.html` and appears on two pages** — the homepage
and about — included by both with `{{> testimonials}}` (§14). Everything below
describes the one implementation they share.

**The script is no longer single-instance.** It bound one `[data-treel]` under
`if (treel)` until the team rail (§15) became a second one on the homepage; it
is now `initRail(treel)` applied to every match. Every piece of state — index,
clones, dwell, the hold set, the pending rewind — is per-instance and must stay
that way, or two rails share an index and steer each other. The viewport is
found by `[data-treel-view]` rather than the `.treel` class, so a second rail
does not have to borrow these classes to be measured. The testimonial rail's
behaviour is unchanged and was verified unchanged on both pages.

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

**The index can no longer outrun the clone set, and it used to.** Reported by
the user as the rail "finishing a bit then regenerating". There is exactly one
clone set, so the index has to stay at or below `total` — but the silent reset
is deliberately delayed 1.1s so the slide can land, and clicking again inside
that window walked the index straight past the end of the array. The lit window
fell off it and the row went dark until the reset caught up. Measured: nine fast
clicks on the four-person team rail left **nothing lit at all**; the six-quote
testimonial rail had the same fault with more runway before it showed.

The fix is to settle any pending lap at the top of `advance` before stepping
again. It costs nothing on screen, because position `i` is pixel-identical to
`i + total` — the same fact the silent rewind already depends on — and it caps
the index however fast the button is pressed. `perView` is also clamped to the
set size, so a rail with fewer people than visible columns cannot read off the
end either.

**This is a different bug from the idempotent rewind below, in the same 1.1s
window.** That one stopped resets stacking up; this one stops the index running
away before a reset fires. Fixing either does not fix the other.

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
  swapping that quote's `img src` in `src/_testimonials.html`, plus a `--pos`
  focal point if the crop needs one — which now fixes both pages at once.
  `ASSET-SPEC.md` has no entry for these yet.

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

**The section is now two separate things, in two places on the page.** It was
one photograph with the copy over it; it became three panels with the copy
standing as a head; it is now back to the photograph, and the three panels live
on separately further down. Read both halves before changing either.

**The photograph, `#spotlight`, sits above the team roster** — between the
founder band and "Behind the work." — which is where the client's design puts
it, not where the three-panel version stood. `.spot` is the full-bleed image
with `.spot-copy` absolutely positioned over its lower-left, carrying all four
strings: the eyebrow, the headline, the lead and the pill. Restored verbatim
from `6f11f18^`, markup and CSS, so this is the original and not a rebuild.

**The three keynote case studies stand on their own, lower down,** where the
three-panel version was — after belonging, before the newsletter. They carry no
eyebrow, no headline, no lead and no pill, because all four went back onto the
photograph. The section has an `aria-label` rather than a visible heading, so it
still has an accessible name without inventing copy. It holds Selected Work's
old third row: Gerd Bommer, U4Success, Finance Consultancy.

**`Gerd-Hero-Section-image.webp` is on the page twice** — full-bleed up top, and
again as the big landscape in that row. They are about five sections apart so
they do not collide, but it is the same photograph and the client may not want
it twice. The cheap fix is swapping the row's first panel to Michael Diewald,
whose asset is still wired and sized (see below); that removes the repeat and
puts him back at the same time.

**Michael Diewald is currently off the page.** He was the only panel unique to
the three-panel version, and three clients remained for a three-panel row when
Selected Work's third row moved in. `rysing-assets/work-10-michael-diewald.webp`
is still there and the sourcing work below still stands, so restoring him is a
one-line change. Nothing else references him.

**The headline measure is 18.7em, and the original's `17ch` was wrong.** This is
§4's trap exactly: Kinfolk's zero is 0.70em, so `17ch` resolves to ~11.9em with
the webfont and ~8.8em without — and both break this headline into *three*
lines, not the two the design draws. The original shipped that way. Swept
16–22em: the design's break, "We bring company founders / into the spotlight",
holds from 17.2 to 20.2em, so 18.7em is the midpoint rather than an edge.
Verified holding at 1680, 1440, 1280, 1024, 900 and 768; at 560 and 390 it wraps
further, which is correct.

**The headline does not alternate faces, and the mock arguably shows that it
should.** `.spot-copy h2 .alt` is in the neutralised list, so the whole line sets
in the didone — restored exactly as the original had it. In the supplied mock
"WE BRING COMPANY FOUNDERS INTO THE" reads as the grotesque against a didone
"SPOTLIGHT". Left as the original because alternation has already drifted from
three moments to five (§2, §10) and this would make six; flagged rather than
decided. One line in the neutralised list either way.

Open:

- ~~No photograph of Michael Diewald~~ — supplied from the Michael project
  (`redesign/assets/img/michael-shoulder-model.png`) and now wired as
  `work-10-michael-diewald.webp`. 1748x1240 PNG at 697KB, centre-cropped to 4:5,
  resampled to 920x1150 and encoded to webp at 47KB — a 93% saving, and still
  comfortably above the 2x retina requirement for a 361px slot (0.78x, no
  upscaling). The stand-in and its CSS are gone.
- ~~Gerd Bommer and Finance Consultancy appear twice on the page~~ — resolved by
  moving Selected Work's third row here. Selected Work drops its last row, which
  was the second of the two options put to the client.
- **The three case studies now have no heading of any kind.** That is what was
  asked for — the copy went back onto the photograph — but a bare row of three
  panels between belonging and the newsletter has nothing naming it. Worth
  confirming with the client that it reads as intended and not as a section that
  lost its title.

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
src/_layout.html        the document shell; owns <head> and <main>
src/_header.html        skip-link, header, menu overlay
src/_footer.html        footer
src/_testimonials.html  the #proof section, included by two pages
src/index.html          homepage content only, with front matter
src/contact.html        §13
src/about.html          §14
shared.css              the former inline <style>
shared.js               the former inline <script>
build.js                node build.js  →  writes every page at the root
```

Any `src/_name.html` is a partial: it is never built as a page (the leading
underscore is what excludes it) and is pulled into a page with `{{> name}}`.

**The generated pages are** exactly the `src/*.html` files without a leading
underscore. Edit `src/` and rebuild. The generated files are
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

One optional key: **`pagescripts`**, injected at the end of `<body>`, for a
third-party tag that belongs to one page only. The contact page's Calendly
loader is the reason it exists; it defaults to empty, so pages that need
nothing declare nothing.

A missing required key or an unresolved `{{token}}` fails the build with exit 1.
A page that ships `{{home}}#work` inside an href is worse than one that refuses
to build. Optional keys are the one exception, and the list of them in
`build.js` is deliberately short — every name not on it is still a hard failure,
so a typo in a token never becomes an empty attribute.

**`{{> name}}` includes `src/_name.html`.** Markup that appears on more than one
page is written once and pulled in; it nests up to five deep and fails on a
missing partial. The testimonial quotes are why it exists — §7 requires them to
have exactly one home, and a page that copies them is a page that will drift
from them.

**The build is idempotent and says so.** A second run on unchanged sources
prints `unchanged` for every page and rewrites nothing, which makes it a cheap
check in its own right: if a refactor of the sources prints `unchanged`, the
output did not move.

**`no-js` moved from `<body>` to `<html>`, cleared by an inline script in the
head.** Not cosmetic. `.no-js` changes real layout — the reel's sticky stage and
the testimonial rail, nine rules in `shared.css`. Clearing it from the deferred
external `shared.js` painted the no-script layout and then reflowed on every
load, a jump the inline script never had. It is on `<html>` because `<body>` does
not exist that early. A failed `shared.js` still leaves the page fully readable,
which is the §2 rule.

**The stylesheet and script URLs carry a content hash, and that is load
bearing.** `shared.css?v={{cssv}}` and `shared.js?v={{jsv}}`; the build hashes
each file's bytes and fills the token. Without it a CSS-only change ships new
HTML against whatever stylesheet the browser already has, and the page renders
as a half-built version of itself — new markup, old layout rules. **This is
not hypothetical: the about hero (§18) went out exactly that way**, the
photograph at its natural size with the headline flowing out underneath it,
because the markup was new and `.about-hero-shot` was not in the cached CSS.
The pages are flat files on whatever cache headers the host defaults to, and
these two files reach all three pages, so there is no change here that is too
small to need this.

It is a query string rather than a fingerprinted filename on purpose:
`shared.css` has to stay at the repository root under its own name because its
five `@font-face` rules resolve `rysing-assets/…` relative to the stylesheet
(below), and a renamed file is one more way to break those paths silently.

A consequence worth knowing before the next regression check: **the two pages
you did not touch no longer rebuild byte-identical after a CSS or JS change** —
their version query moves too. That check (§12, below) now means "identical
apart from the hash". The render is unaffected, since the bytes behind the URL
are what they always were.

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

**Checking a shared-file change, which is the standing regression.** Everything
in `src/_header.html`, `src/_footer.html`, `shared.css` and `shared.js` reaches
all three pages, so the risk is no longer "does my page look right" but "did I
move a page I was not working on". Two cheap checks, in order:

1. Run the build. `unchanged` on a page means its bytes did not move at all,
   which settles markup immediately and costs nothing.
2. If the change was to CSS or JS, the bytes will not have moved but the render
   may have. Shoot the homepage full-page at 1440 and diff it row by row against
   the previous capture. **The homepage has stayed at 0 of 22,821,120 differing
   pixels through the build-system extraction, the contact page and the about
   page** — that is the number to keep. Pin animations to `currentTime = 0`
   first or the hero, the film panel and the marquee will report differences
   that are only phase (§5).

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

---

## 14. About page

`src/about.html` → `about.html`. Seven sections from the supplied designs, then
the homepage's testimonial rail.

**The rail is included, not copied.** `src/_testimonials.html` now holds the
whole `#proof` section — heading, badges, six quotes, controls, CTA — and both
`src/index.html` and `src/about.html` pull it in with `{{> testimonials}}`. §7
requires the six quotes to have exactly one home; a second page carrying its own
copy is a second copy that will drift. The build gained `{{> name}}` for this:
it expands `src/_name.html`, nests up to five deep, and fails on a missing
partial. **Extracting it changed no output at all** — `index.html` rebuilt
byte-identical, and is still pixel-identical to its pre-build-system baseline:
0 of 22,821,120 pixels.

**Every headline measure here is measured.** Each was swept from 6em to 26em,
the window where the design's break holds was recorded, and the midpoint taken
rather than an edge:

| Headline | Window | Set | |
| --- | --- | --- | --- |
| `.about-title` | 12.2 – 13.7em | **13em** | §18 — new copy, re-swept |
| `.about-conviction-title` | 5.6 – 15em | **11em** | §20 — kept, not re-centred |
| `.about-conviction-body` | 39 – 40.7em | **39.9em** | §20 — and see the em-pinning fault there |
| `.about-studio-title` | 20 – 21.5em | 20.7em | stands |
| `.about-name` | 6 – 9.5em | 7.7em | stands |
| `.about-h` | see below | 11.6em | stands — from the courage headline |
| ~~`.about-claim`~~ | ~~23 – 24.5em~~ | — | §20 — removed with the blue claim |

`.about-h` is the one with a real conflict. The courage headline holds its
three-line break from 11 to 20em at 1440 and below, but only to 12.25em at 1680
and 1920, where the column grows enough to pull "conform." up. 11.6em is the
middle of the intersection, so one value is right at every width instead of
right only at the width the design was drawn at.

**Two breaks cannot be reached by measure at all.** "exceptional people" takes
its own line via `.keep`, because that headline sits in a grid column always
narrower than any cap — the cap never binds, so only a nowrap can move the
break. Same situation as the contact question (§13).

**Measuring line breaks by word position has two traps, both hit here.**
Grouping words by their `top` reports a break between two faces sharing a
baseline, because the grotesque and the didone have different ascents — cluster
by vertical midpoint instead. And sorting words by midpoint before grouping
reorders them *within* a line, which reported "to almost nothing" for a line
that actually reads "almost nothing to". Walk in document order and start a new
line only when the midpoint steps down.

**Alternation runs through nearly every headline here,** which is the opposite
of the homepage, where it was cut to three moments so it would read as emphasis
rather than texture (§2). It is built as the designs draw it. It survives
because this page is one continuous argument rather than eleven unrelated
sections, but it is the first thing to pull back if the page starts reading as
wallpaper. The included rail keeps the homepage's neutralised heading, so it
does not add a sixth.

**Five stats, equal.** Not ranked — leading on one figure was tried on the
homepage and reverted because it made the smallest number the loudest (§5). The
figures are parsed from the authored text by the existing count-up, so they are
copy; `.stat strong` binds all instances, and `[data-treel]` binds one, so both
reused without touching the script.

### Verified

Eight sections, the rail clones six quotes into twelve, the count-up reads
"3,000+" through its comma, zero console errors, zero failed requests. Every
designed break holds at 1680, 1440, 1200, 1024, 900, 768 and 560; at 390 the
hero wraps further, which is correct. Nothing overflows horizontally at any of
them. All sixteen section boundaries probed across the width: median 0, max 3,
no column over 10 — no seam (§5). With JavaScript off: 4,756 characters of copy,
all six quotes at full opacity, nothing hidden. `index.html` and `contact.html`
both rebuilt byte-identical.

### Open

- ~~**The founder photograph is a white-background studio shot.**~~ Resolved —
  `anzhelika-red-suit.webp` is wired instead, on instruction (§21). The note
  below is kept because it is the argument for the swap, and because
  `anzhelika-cutout.webp` is still the better answer if the slot ever changes
  shape. The mock labels the slot `ANZHELIKA-CHAIR` and draws a dark box, so
  `anzhelika-chair.webp` was what was wired — but the file is near-white, which
  made it the brightest object on the entire site. §10 removed the newsletter's printed cover for
  exactly that reason: "nothing else on the page is paper-white now." This puts
  one back. `anzhelika-cutout.webp` is the same shot at the same resolution
  **with an alpha channel** — she stands on the black with no box at all and the
  face reads far larger. Rendered both; the cutout is plainly better, but
  swapping it is an art-direction call, not a bug fix. Built as specified,
  flagged here.
- **The stats contradict the homepage.** This page says "30+ brands built" and
  "35+ websites launched"; the homepage says "35+ personal brands built". The
  homepage's "50k+ followers" does not appear here, and this page's "49 named
  testimonials" does not appear there. Both are live at once.
- "rysing" is lowercase throughout the body copy here, as the designs set it.
  The footer and the homepage set "Rysing". Deliberate in the design; worth
  confirming it is deliberate in the brand.
- "award-winning", the 350 students figure, both platform names, "sixteen
  countries" and the HIPE award are all unverified — the same standing as the
  claims already listed in §6.

---

## 15. Team rail

"Behind the work." The founder is a fixed card; four colleagues drift past her.

**The client removed her full-width plate.** She did not want her photograph
large and above the team. `.founder-plate` and its CSS are gone, and the
founder *copy* block survives — moved below the team, also on instruction. That
block now carries `id="founder"`, because the shared header's About link points
at `#founder` and the plate that used to hold that id no longer exists. Moving
that id is not cosmetic: dropping it would have broken a nav link on all three
pages at once.

**The "Founder" eyebrow above that headline was removed** on instruction. It is
the one string dropped from the section, so it is a real copy removal and not a
restyle; the headline now opens the block. Two spacing values went with it and
had to: `.founder-title` carried a `clamp(16px,2.4vh,22px)` top margin that
existed only to clear the eyebrow, and `.founder-body` carried `padding-top:34px`
set to meet a headline that started lower. Left alone, the two columns fall out
of step. They are 0 and 8px now — 8 rather than 0 because the didone's cap
height sits below its box top, so a literal zero reads as the body being high.

> **The founder block is marked to move to the about page.** The user has said
> it belongs there rather than on the homepage, but asked to leave it in place
> for now. Do not move it without a fresh instruction — and when it does move,
> `id="founder"` goes with it, which means the shared header's About link has
> to be repointed from `index.html#founder` to the about page in the same
> commit, on all three pages. That link is the reason the id exists at all.

**Emphasis by behaviour, not by size.** She is the one figure that does not
move, the first in reading order, the only one without a photographic
background, and her name is one size step larger. Nothing is enlarged for its
own sake, because scale is precisely what she asked to remove.

**Keeping her outside the track is also what makes the arithmetic work.** The
rail measures its step as the distance between the first two items, so an
unequal card inside the track would break `perView` and the placement with it.
A fixed lead card sidesteps that completely.

**Offsets are per-person, never `nth-child`.** Each figure carries its own
`--drop`. The rail loops by cloning, and with an odd roster an `nth-child`
pattern inverts on every pass and lands two offset cards together at the seam.
Verified: the rendered margins repeat exactly across the clone set
(`0,46,14,62 / 0,46,14,62`), so the stagger is stable through the loop. They are
hand-authored rather than randomised for the same reason a random value cannot
be reviewed, approved, or reproduced in a screenshot.

**Three things were built wrong first and are worth not repeating.**

- *A plinth gradient under her feet.* A radial centred on the bottom edge is
  brightest exactly where its box clips it, so it rendered as a hard-edged
  lighter rectangle — §8's mistake again, in a new place. There is no background
  behind her at all now.
- *`object-fit:contain`.* The whole standing figure fitted the box, which made
  her head **smaller** than the head-and-shoulders crops beside her — the exact
  opposite of the emphasis the card exists for. It is `cover`, cropped from the
  top to head-and-thigh.
- *Matching her box to a rail card.* The cutout carries transparent margins, so
  her body fills about two thirds of its box; matched widths measured 248
  against the rail's 328 and she was the smallest person on the row. Her column
  is deliberately wider. Measure the rendered boxes after any change here —
  the numbers are not what the column widths suggest.

**`minmax(0,…)` on the rail column.** Without it the flex track's min-content
wins the grid negotiation and squeezes her column to its own minimum; it looked
like the `fr` values were being ignored.

**Her bottom edge is masked, not cut.** She has no frame, so a straight crop
reads as a mistake rather than an edge. The last 18% fades out — the same move
`.glow-soft` makes on every glow.

**Without JavaScript it is a row that wraps,** every face at full opacity and
the controls hidden, exactly as the quote rail does. Unstyled it would have been
four people at `.26` with the fourth clipped inside a hidden overflow, since
nothing lights itself without the script. Verified: all five at opacity 1 with
JS off, no overflow.

### Verified

Two rails coexist on the homepage with no console errors; the team's four items
clone to eight, three light at a time, and the testimonial rail still reports
twelve items and three lit on **both** the homepage and about. Zero overflow and
zero failed requests on all three pages at 1680/1440/1024/900/768/560/390. All
section boundaries probed across the width — no new seam. At 900 she stacks
above the rail capped at 300px and the rail runs two-up; at 390, one-up.

### Open

**All five are real people with real photographs.** There are no placeholder
tiles left anywhere on the page. The roster, in rail order after the fixed lead:

| Who | Role as supplied | Asset | From |
| --- | --- | --- | --- |
| Anzhelika | Founder · The mind behind it all | `anzhelika-red-suit.webp` | 2547x3221 PNG, 7.2MB → 67KB |
| Kim | Brand identity, design systems, and everything you see | `kim-brand-designer.webp` | unchanged |
| Ben | Web development, SEO, and everything web-side | `abdessamad-pic.webp` | unchanged |
| Kristina | Photographer, videographer and content creator | `kristina-verbitskaia.webp` | 1067x1600, 217KB → 92KB |
| Marc | Partner and producer | `marc-babin.webp` | **1600x1200 landscape**, 92KB → 40KB |

Every slot is 4:5 at 900x1125. Kristina's crop is lifted pixel-for-pixel from
her original with no resampling at all. **Marc's source is landscape** — the
only one in the set — so his is a 960x1200 portrait region taken from the left
of frame where he stands; re-cropping him needs that noted or the next person
will letterbox him.

**Two AI-generated stand-ins existed briefly and were deleted,** not left in the
folder. They were used to judge the layout with five photographic tiles before
the real portraits arrived, and that preview earned one finding worth keeping:
**a light background behaves like a spotlight on this page regardless of who is
in it.** A bright tile pulled the eye straight off the founder card. That is the
constraint to put in `ASSET-SPEC.md` for any future team portrait — mid-tone or
darker background, no white seamless.

### Open

- **First names, not full names.** The row sets ANZHELIKA, KIM, BEN, KRISTINA,
  MARC. Kristina Verbitskaia and Marc Babin were supplied in full and the full
  names are in the `alt` text, but "KRISTINA VERBITSKAIA" at 26px didone wraps
  to two lines and breaks the baseline the captions share. Put to the user and
  still unconfirmed. If full names are wanted it has to be all five at once —
  mixing the two formats in one row is the thing to avoid.
- **Marc's card is the only one with no environment.** His is a black studio
  shot, so against the page it reads almost as a cutout while the other four sit
  in rooms. It looks deliberate rather than broken, but it is a different
  register and worth a decision.
- **Anzhelika's red suit is the largest saturated object on the page.** §11
  removed the closing ask's red fill so that red stayed scarce — it survives
  only in the review stars, the belonging mark and the focus ring. This is much
  larger than any of those. It may be right for a founder card; it does change
  the page's colour argument.
- `anzhelika-office.webp` and `anzhelika-cutout.webp` are now unused by any
  page. Left in `rysing-assets/`.
- `ASSET-SPEC.md` has no entry for the team portraits.

---

## 16. The showreel aperture

The star mask over the reel. Changed on instruction, with a measured cost.

**What it is now.** See-through from the first frame, opening at `MIN = 27` (~450px at 1440)
(`shared.js`). There is no fill: `.reel-frame::after` and the `--reel-reveal`
variable that faded it are both deleted, along with the two `display:none`
overrides that existed only to switch the overlay off under `no-js` and reduced
motion.

**What it was, and why.** The mark opened as a solid `--paper` star that
crossfaded to the footage as the aperture widened. At 16% the star is ~230px
showing a 230px crop of a 1440px frame, so whatever sat mid-screen *became* the
mark — and the reel opens on "SHOWREEL" in black brush lettering over white,
which cut a gash straight through it. That was the whole reason for the fill.

**Raising MIN was tried as a mitigation and it is not one.** It went 16 → 22 →
27 (~450px at 1440), the last step purely because a bigger star was asked for.
The reasoning behind the first bump — that a wider crop samples more of the
frame and is less likely to land inside flat lettering — does not survive
contact: the brush lettering spans the whole frame, so a wider aperture shows
*more* of it. A bigger star makes the gash bigger. **Treat MIN as a size
decision only.**

Sampled through a live playthrough at the smallest aperture:

| Footage at | Behind the star | Reads as |
| --- | --- | --- |
| 0.9s | "SHOWREEL", black brush on white | **Broken** — the black strokes merge with the page and the silhouette gashes |
| 3.9s | Person and slide text on white | A window, not a mark |
| 7.0s | Dark brown "JK" plate | Fine |
| 10.1s | Muted blue-grey | **Good** — clean star |
| 13.1s | Purple and yellow graphic | Good |
| 16.2s | U4Success logo on white | A window with another brand's logo inside it |

So it reads about half the time, and **the worst frame is the first one.** The
video autoplays from the title card, so the single view everybody gets on a cold
load is the weakest, and the 34.8s loop brings it back round.

**The problem is the footage, not the mask.** The reel is a montage of title
cards and client logo plates, so a transparent aperture is a random crop. The
real fix is to start the reel on footage rather than on the title card — at
which point a see-through star works at every point in the loop. The cost is
losing the "SHOWREEL" intro from the full-screen view too, where it is presumably
wanted. That was put to the user and is **not yet decided**.

**Do not reach for `MIN` to fix a blob or a gash — it does not work, measured.**
The only two real levers are the footage (start the reel past the title card) or
the overlay (restore the fill, which costs the opening its reveal and is the
thing the instruction was about). The same note sits in `shared.css` above the
mask rule and in `shared.js` above the constant.

**Seeking the reel in a test does not work on the local server.** `currentTime`
silently stays at 0 because the dev server refuses Range requests (§5), and two
grids of "different" timestamps came back pixel-identical before that was
spotted. Let the video play and sample as it goes.

### Open

- **Decide between three.** Keep it as-is and accept the weak opening; trim the
  reel so it starts on footage and the aperture works throughout; or restore the
  fill, which is the thing that was asked to be removed.

---

## 17. Footer order

**The wordmark is the last thing on the page.** On instruction. It used to open
the footer, above the link grid; it now sits below the grid *and* below the
copyright line, so the page signs off on the mark and nothing follows it.

Two spacing values moved with it and had to. The 56px that sat under the mark is
now `.site-footer`'s top padding — without it the grid's hairline, which is what
opens the footer now, would sit hard against the closing section above. And
`.footer-mark`'s `margin-bottom:56px` became `margin-top:72px`; it is also
`display:block`, because as the last child its inline baseline gap would
otherwise add a few stray pixels under the page's final element.

**The light behind it changed meaning, and this is worth a look rather than an
assumption.** The footer's two glows are placed red high-right and blue low-left,
and the original comment says they sit behind the wordmark so it "reads as lit
from within." With the mark at the top that was the red; at the bottom it is the
blue, which now sits directly behind the mark's left end and the star. It still
reads as lit from within — arguably better — but the colour is different from
what that comment describes. It also makes the artwork's white orb (§6) the
brightest thing in the footer.

Verified on all three pages: DOM order grid → meta → mark on each, the mark's
bottom 28px from the end of the document (the footer's own bottom padding), no
console errors beyond the deliberately aborted `.mp4`. Zero horizontal overflow
at 1680/1440/1024/900/768/560/390, the mark scaling 1546px wide down to 346px.

---

## 18. About hero

The page opens on a photograph running full bleed under the fixed header,
with the pill, the headline and the lead over its lower left. Built from the
client's supplied design. It replaced a copy-only hero that was type on black.

**It drops two strings of live copy, and that is a real removal.** The old
headline "Being known has almost nothing to do with being good." and its note
"Whole industries are led by whoever was loudest…" are both gone — the new
design has no slot for either. They are the kind of line the page is poorer
for losing; "Too many exceptional people are unseen and unheard." in the next
section is the nearest surviving relative but is not the same claim. **Put to
the client before this is treated as settled.** If either comes back, the note
is the easier of the two to rehome.

**The new copy.** Headline "Rysing is a branding and visibility studio"; lead
"The studio was founded by Anzhelika Tauber in response to a market flooded
with plain, mediocre AI brands that exist to fill space rather than to build
something meaningful." Neither exists in any earlier file.

**The alternation is word-level and runs the whole line** — grotesque "RYSING
IS A", didone "BRANDING", grotesque "AND", didone "VISIBILITY", grotesque
"STUDIO". `.display` is Kinfolk by default and `.alt` flips a run to Aileron,
so the `.alt` spans are the *sans* runs here, which is the opposite of how it
reads. §14 already notes that alternation runs through nearly every headline
on this page and is the first thing to pull back if it starts reading as
wallpaper; this is the loudest instance of it on the site.

**The measure is 13em.** The design sets "RYSING IS A BRANDING / AND
VISIBILITY STUDIO". Swept 8–26em at 1920/1680/1440/1280/1024/900/768: the
window is 12.2–13.7em and is **identical at every width**, because the measure
is in em and the size clamp moves with it — which is the §4 argument stated as
cleanly as it gets. 13em is the midpoint. At 390 it takes four lines, which is
correct.

**The red glow is gone from this section.** It existed because the hero was
type on black and needed something behind it. A glow behind a photograph is
two light sources competing, and the photograph is the light now.

**Two scrims, not one.** The bottom one carries the copy and goes properly
dark; the top one only has to hold the header's own links, which are small and
already light. A single gradient strong enough for the copy flattens the whole
frame. Separately, `.about-hero::after` resolves the last 12% to `--ink` so the
photograph's bottom edge does not cut flat against the black page — the
one-sided version of what `.glow-soft` does to every glow (§4).

### The photograph

`rysing-assets/about-hero.webp`, the client's own, supplied as
`~/Downloads/about-hero.jpg`. The podcast interview frame the design draws.

**It is 1024px wide and that is not enough — this is the §6 tennis-photograph
problem again, worse.** The slot is the full viewport: 1440 CSS px on a
laptop, 2880 device px on a retina one. The file upscales **1.4× at 1×** and
**2.8× at 2×**, so it is soft before anyone zooms. Ask for the original out of
the camera; anything 2400px+ on the long edge fixes it outright and nothing in
the markup changes. This is the single thing most worth chasing on this page.

**It was cropped, and the crop removed another brand's watermark.** The source
carried "BRAND on TOUR" in white across its lower left — which is exactly
where the pill, the headline and the lead now sit, so it was unusable as
supplied. The bottom 103px went: 1024×683 → 1024×580, which is also a 1.766
ratio against the hero box's 1.739, so `cover` throws away almost nothing.
Encoded webp q86, 447KB → 64KB. **Worth confirming the client is happy to drop
that attribution** — it is their own appearance footage, but it is someone
else's mark being removed.

**Two focal points, both inline on the img.** `--pos:62% center` for the wide
crop; `--pos-narrow:86% center` takes over under 760px. The box goes from
1.74:1 to 0.47:1, so `cover` keeps barely a quarter of the width on a phone —
at the wide focal point that quarter is the pot plant between the two chairs,
with neither person in it. The narrow point frames Anzhelika at the mic.

**The scrim was then measured against this picture, not guessed.** Rendered the
hero with the copy hidden so every sample is genuinely what the type sits on,
and read the WCAG contrast of white against it. The first pass put parts of the
headline on **2.9:1 and below** — white type on the white chairs and the
window. Strengthened the bottom gradient to `.86 / .68 22% / .42 44% /
.15 64% / transparent 82%`, which also brings the frame closer to the mock's
mood; it now reads **mean 7.4:1 on line one, 14.3:1 on line two, 16.0:1 on the
lead**, worst single sample 2.98:1 at the very top row of the first line's
ascenders. Re-measure that way after any change to the photograph or the
scrim — sampling the rendered type instead of the background reads glyph
pixels and reports nonsense.

### Verified

Designed break "RYSING IS A BRANDING / AND VISIBILITY STUDIO" holds at 1920,
1680, 1440, 1280, 1024, 900, 768 and 560; at 390 it takes four lines, which is
correct. Zero horizontal overflow, zero console errors and zero failed requests
at 1440/900/390. All eight section boundaries on the page probed across the
width — max channel delta 3, nothing over 10, so no seam (§5), the new
photograph's bottom edge among them at 2. `index.html` and `contact.html` both
rebuilt byte-identical, so nothing reached the other two pages.

---

## 19. "Why we exist" was removed

The about page ran hero → **Why we exist** → Our conviction → founder → … It
now runs hero → Our conviction → founder → … On instruction, chosen
explicitly over a reorder that would have kept the section further down.

**This is a copy deletion, not a reorder, and none of it is set anywhere
else.** What went:

- the eyebrow "Why we exist"
- the headline "Too many exceptional people are unseen and unheard."
- two paragraphs — "It is rarely for lack of substance…" and "You are a
  perfectionist, so nothing is ever ready…"
- the didone pull quote "Meanwhile the room fills up with people who have far
  less to say and no hesitation about saying it."

One revert brings the section back; it is a single contiguous block in
`src/about.html` and a single contiguous block in `shared.css`.

**The running total for the about page, counted rather than estimated.** Diff
the rendered text of `about.html` at `c0d0267~1` against HEAD — strip tags and
comments, split on sentence ends, and list what was present before and is
absent now. That reports **17 sentences**, which group into **ten blocks**,
plus one headline altered rather than removed:

| § | Removed | |
| --- | --- | --- |
| §18 | hero headline | "Being known has almost nothing to do with being good." |
| §18 | hero note | "Whole industries are led by whoever was loudest…" |
| §19 | eyebrow | "Why we exist" |
| §19 | headline | "Too many exceptional people are unseen and unheard." |
| §19 | paragraph | "It is rarely for lack of substance…" |
| §19 | paragraph | "You are a perfectionist, so nothing is ever ready…" |
| §19 | pull quote | "Meanwhile the room fills up with people…" |
| §20 | paragraph | "We build brands that come from conviction. Brands that are human…" |
| §20 | paragraph | "When someone with something worth saying decides to be seen…" |
| §20 | blue claim | "We make the people worth listening to heard and recognised." |

Altered, not removed: the conviction headline lost its article, "Visibility is
a responsibility." → "Visibility is responsibility." (§20).

All of it was instructed and all of it is recorded. But that is **most of the
page's original argument about the reader** — the hero claim, the whole "Why
we exist" section and both conviction paragraphs were the parts addressed to
the person reading. What remains addresses the studio. Worth putting in front
of the client as one total, because no single change looked large on its own.

**Three CSS rules went with it** — `.about-why`, `.about-why-glow` and
`.about-pull`. Deliberately *not* removed: `.about-split`, `.about-h` and
`.about-body`, which the courage section still uses. `.about-h`'s 11.6em
measure in the §14 table was derived from the courage headline, not this one,
so that table entry still stands.

**The page's loudest light went with it.** `.about-why-glow` was the big red
wash on the right of the band — §14 called it the brightest thing on the site
even held under the mock's saturation. The conviction section's own red glow
is now the page's largest, and it sits directly under the hero photograph.
That reads well and is arguably the better page for it (§11 wants red scarce),
but if anyone later asks where the about page's colour went, this is the
answer.

### Verified

Seven section boundaries now instead of eight, all probed across the width:
max channel delta 3, nothing over 10, so no seam (§5). Zero horizontal
overflow, zero console errors and zero failed requests on **all three pages**
at 1680/1440/1024/900/768/560/390. No reference to any of the three removed
classes remains in `src/` or `shared.css`.

---

## 20. Our conviction, rebuilt

New copy from the client, and the blue claim removed. The section is still
centred and still the only centred one on the page.

**The headline lost its article.** "Visibility is a responsibility." →
"Visibility is responsibility." One word, but it changes the break the design
wants from three lines to two: "VISIBILITY IS / RESPONSIBILITY."

**The two paragraphs became one.** Both of the old ones are gone — "We build
brands that come from conviction. Brands that are human, specific…" and "When
someone with something worth saying decides to be seen…". The replacement is
"We build brands that come from conviction and a big vision. Brands with the
courage to stand out and be seen, and the ambition to change something in this
world. When you work with people and businesses like this, marketing becomes a
mission."

**The blue-marked claim is gone,** on instruction: "We make the people worth
listening to heard and recognised." `.about-claim` and `.about-claim mark`
went with it. That was **the page's only blue object** — §14 called it the
page's one cool note. Blue survives on the page only as `.about-founder-glow`
now. The `<mark>` treatment itself is still in use on the homepage spotlight,
so the device is not lost, just no longer used here.

**The measure that was not measuring anything.** `.about-conviction-body` set
`max-width:40em`, but `em` there resolved against the *inherited* body size —
`clamp(15px,1.1vw,17px)` — while the paragraph itself was a fixed `15px`. So
the measure quietly grew to 17px-ems at 1920 while the text it was measuring
did not move, and the designed break held over three windows that shared no
common value: **34.4–35.9em at 1920/1680, 36.9–38.6em at 1440, 39–40.7em at
1280 and below.** There was no single correct number, which is why the sweep
reported an empty intersection.

This is the §4 `ch` trap wearing a different coat: *a measure expressed in
units of a different font than the text it governs.* The fix is one
declaration — `font-size:15px` on the wrapper, so the em is pinned to the text
— after which the window is **39–40.7em at every width** and 39.9em is the
midpoint. The paragraph now takes `font-size:inherit` so the two cannot drift
apart again. **Check for this anywhere a max-width in `em` sits on a wrapper
rather than on the element carrying the type.**

**The headline measure was left at 11em deliberately.** Swept 3–26em: the
break holds from 5.6 to 15em at every width, because "responsibility." is a
single unbreakable word and the measure only has to stop "Visibility is"
splitting at one end and pulling the long word up at the other. 11em is well
inside that, so it was not re-centred on 10.3 — a measure that is not doing
work is not worth moving. The size went `clamp(34px,5.4vw,86px)` →
`clamp(34px,5.8vw,104px)` to match the mock's weight; it now sits just under
the hero's `clamp(40px,6.6vw,118px)`, which is the right order.

### Verified

Both designed breaks hold at 1920, 1680, 1440, 1280, 1024, 900, 768, 560 and
390 — the headline on two lines and the paragraph on three, at every one.
Seven section boundaries probed across the width: max channel delta 3, nothing
over 10, so no seam (§5). Zero horizontal overflow, zero console errors and
zero failed requests on all three pages at 1680/1440/1024/900/768/560/390. No
reference to `.about-claim` remains in `src/` or `shared.css`.

---

## 21. The about founder portrait

`anzhelika-chair.webp` → `anzhelika-red-suit.webp`, on instruction.

**It resolves the §14 open item.** The chair shot is a white-background studio
frame and was the brightest object on the entire site — the same fault §10
removed the newsletter's printed cover for. The red-suit frame is mid-tone,
shot against greenery and concrete, and the face reads far larger in it.

**No `--pos`, deliberately.** The file is 4:5 at 900x1125 and `.about-portrait
img` is `aspect-ratio:4/5`, so `cover` has nothing to crop and a focal point
would be noise. The chair shot needed `center 28%` because it was 1067x1600.

**The same photograph is now on two pages.** It is the founder's lead card in
the homepage team rail (§15) and the portrait here. They are a page apart so
they do not collide, and it is the founder in both places, which is a weaker
objection than the Gerd repeat in §9 — but it is the same frame twice and the
client may want a second one. `anzhelika-office.webp` and
`anzhelika-cutout.webp` are both still unused if so.

**Resolution is adequate, not generous.** 900x1125 natural into a 579x724 slot
is **1.29x at 2x retina** — under the 2x ideal but well short of the upscaling
in §18's hero. Not worth chasing on its own; worth bundling into any ask that
already exists for larger originals.

**It puts the page's largest saturated red next to the founder glow,** which is
blue and low-left behind her. §15 already flags the suit as the largest
saturated object on the homepage; it is now that on the about page too. The two
read well together in place — the blue sits under the frame rather than on it —
but §11's argument for keeping red scarce is worth remembering if more red
arrives on this page.

### Verified

Portrait loads as `anzhelika-red-suit.webp`, zero failed requests, zero console
errors. All seven section boundaries re-probed from viewport captures — **max
channel delta 4 across the whole page**, nothing over 10, so no seam (§5; the
`fullPage` reading of 221 at the hero edge was the skip-link artifact now
recorded there). Zero horizontal overflow on all three pages at
1680/1440/1024/900/768/560/390. `contact.html` and `index.html` rebuilt with no
change beyond their asset-version query.

---

## 22. The about page restructure

Built from seven supplied screenshots. The page now runs:

> hero · conviction · **founder** · **team** · studio · **courage + photograph**
> · stats · **named quotes** · **recognition** · **the standard** · **closing**

Four sections are new, two were rewritten, and three were already correct.
**Nothing was deleted** — the instruction "anything not in these screenshots is
to be deleted" turned out to remove nothing, because every surviving section
appeared in one of them.

**Read the prototype screenshots as broken, not as designed.** Three of them
show `ANZHELIKA-CHAIR`, `KIM-BRAND-DESIGNER`, `ABDESSAMAD-PIC`, `PHOTO`, and a
row reading "CLEMENS DOPPLER ✦ GERD BOMMER ✦ JENNIFER DJONGOW". Those are
`alt` text from images the prototype failed to load — the last one is the logo
marquee, not a typographic name list. Checked against the `alt` attributes in
`src/_marquee.html`, which they match in order. **Do not rebuild a design from
a mock's missing-image state.**

### What changed

**Founder — new copy.** Three paragraphs replacing two: the cancer-immunology
background, the Instagram account for her dog Rio, and leaving science. The
supplied design carried three typos — "foudner", "buil tmor", "ethan" — which
were corrected rather than reproduced. The portrait is unchanged (§21).

**Team — a grid, not the rail.** The homepage's four colleagues, static, with
**Anzhelika deliberately excluded** on instruction: the founder section
directly above is hers, and the mock shows her only because it predates that
call. None of the rail's machinery is involved — no clones, no autoplay, no
controls, nothing dimmed, because nothing is off the measure. The per-person
`--drop` convention is kept even though, with no cloning, an `nth-child`
pattern could not invert here (§15); both rosters read the same way in source.

**The team head takes its alternation back.** `.band-head h2 .alt` is in the
neutralised list, so "Behind the work." set entirely in the didone while the
design draws "BEHIND THE" in the grotesque. Overridden for
`.about-team .band-head h2 .alt` only — scoped to this one head rather than
lifted from the list, or the homepage's section heads would light up with it.

**Courage — a photograph, and a layout fault worth recording.** The copy is
unchanged; the frame beside it is new. Built first with `align-items:end`,
which pinned the eyebrow near the foot of a very tall column and left most of
a screen empty above it. The design runs the photograph past the copy at both
ends, so the copy is centred in it and the frame is capped at
`min(78vh,760px)`. The image is a **stand-in** — `work-03-clemens.webp`,
marked `TODO(asset)`; the design draws a cable-car interview frame that has
not been supplied.

**Named quotes — about only, by decision.** Four real client testimonials,
static, four up. This was put as a question and the answer was explicit: the
about page gets these, **the homepage keeps its six-quote rail untouched**.
So `src/_testimonials.html` is unchanged and still has exactly one home (§7);
the about page simply no longer includes it. The consequence is two sets of
testimonial copy live at once — these four are the first *real* named quotes
on the site, while the homepage's six are still the placeholders §6 flags.
No cards, for §7's reason: four bordered boxes of equal height turn quotes
into a comparison table. One hairline over the row, rules between columns,
and the attributions share a baseline because `blockquote` takes `flex:1`.

**Recognition — the marquee now has one home.** The thirteen marks and their
measured `--f` fractions were lifted into `src/_marquee.html` and are included
by both pages, for the reason the testimonial partial exists (§12): markup on
two pages that is copied is markup that will drift. **`index.html` rebuilt
byte-identical** after the extraction — verified, and the reason the partial
carries no comment of its own is that an HTML comment would have shipped into
the homepage and broken that guarantee. The headline above it is new and
belongs to this page.

**The standard, and the closing.** Both new. The standard is a `<dl>` because
that is what it is — five named things and what each means — with the rows as
`div`s so each pair can be a grid cell without the list losing its semantics.
Rows align on `baseline`, not centre: the didone name and the grotesque
description have different cap heights, and centring two faces of different
size reads as a misalignment even when the boxes are even.

**The closing CTA is the site's second filled pill.** §11 removed the
homepage ask's red fill so every pill became an outline, and §13 records the
contact form's send button as the only filled one. The design draws this one
filled too, and it is the page's single destination, so it takes the weight —
flagged here rather than quietly made an outline. It points at `contact.html`;
the header's two pills still go to the homepage's closing anchor (§6), and a
new control had no reason to inherit that.

### Measures

Swept, not chosen. Every new measured element carries its own `font-size`, so
the em is pinned to the text it governs — the fault §20 found.

| Element | Window | Set | |
| --- | --- | --- | --- |
| `.about-recog-title` | 28.4 – 32em | **30.2em** | intersection; window differs by width |
| `.about-standard-title` | 19.7 – 39.9em | **24em** | left alone — not doing work |
| `.about-closing-title` | 10.4 – 15.5em | **13em** | intersection; 11em sat near the edge |
| `.about-closing-note` | 33.5 – 36.9em | **35.2em** | **was wrong at 30em** |

Two of these have windows that differ by viewport rather than one window at
all widths, because the column is a fraction of the viewport while the size is
a `vw` clamp — the same conflict §14 records for `.about-h`. The intersection
is the right value there, not any single width's window.

**One was genuinely wrong and only the sweep caught it.** `.about-closing-note`
was built at 30em, below the 33.5em floor, so it broke a word early against
the design. It looked fine.

### Verified

Every designed break holds at 1920/1680/1440/1280; below that headlines wrap
further, which is correct. All **eleven** section boundaries probed from
viewport captures (never `fullPage` — §5): max channel delta **4**, nothing
over 10, so no seam. Zero horizontal overflow, zero console errors and zero
failed requests on all three pages at 1680/1440/1024/900/768/560/390.
`index.html` and `contact.html` each differ by **exactly one line**, the
stylesheet's version hash. `src/_testimonials.html` is untouched.

### Open

- **The courage photograph is a stand-in.** The cable-car interview frame in
  the supplied design has not been delivered. One `src` and one `--pos`.
- **Kristina's role** is "Photographer, videographer and content creator" here,
  as on the homepage. The mock says "DISCIPLINE TO BE CONFIRMED", which is the
  prototype's placeholder, not a copy change — but it does suggest the client
  may still be deciding it.
- **Two sets of testimonials now exist**, by decision. Worth revisiting once
  the homepage's six placeholder quotes are replaced with real ones, at which
  point one shared set may be wanted again.
- **The about page's stats still contradict the homepage's** (§6). The
  instruction was "the same numbers as the home page", but the supplied
  screenshot shows this page's existing five figures, so they were left as
  they are. The contradiction is unchanged and still needs deciding.

---

## 23. The about page shares the homepage's testimonials

**Corrected.** §22 built a page-specific block of four named quotes on the
about page, on my reading of an answer to a question I had framed as an
either/or. The instruction was, and remains, that the about page carries **the
same testimonials as the homepage**. `src/about.html` includes
`{{> testimonials}}` again, exactly as it did before §22, and
`src/_testimonials.html` was never modified — so the six quotes still have
exactly one home (§7) and both pages show the same section.

`.about-words`, `.about-word` and their three responsive rules are gone. **One
trap in removing them:** two of those rules were multi-selector, and stripping
the `.about-word` line out of
`.about-team-grid,\n.about-words-grid { … }` left `.about-team-grid,`
dangling into the *next* rule — which silently gave the team grid
`max-width:24em` instead of its column count. Verified by reading
`gridTemplateColumns` back from the rendered page rather than by eye: 4
columns at 1440, 2 at 1024, 1 at 560. **When deleting one selector from a
comma-separated group, re-read the whole rule, not the line.**

### The four quotes, preserved

These came from the client's own design and are **the only real, named
testimonials that have ever been on this site** — the six in
`src/_testimonials.html` are still the placeholders §6 flags ("Marcus H.",
"Elena V."). They are recorded here so that removing the block does not lose
them, and they are the obvious candidates for replacing those placeholders:

| Quote | Attributed to |
| --- | --- |
| "When I read what you write, you make me a hundred times bigger than what I am." | Julian Knowle |
| "You describe me in a way that I never would — but yes, it is me, and I've achieved this." | Jennifer Djongow |
| "I feel that you saw more in me than I do. And I guess that was the brief. To see more than I can see." | Gvantsa Kikalishvili |
| "We are summarising the things that I wouldn't dare summarise for myself." | Veneta Behar |

Three of the four names already appear on the site as marks in the logo
marquee — Julian Knowle, Jennifer Djongow and Clemens Doppler are in
`src/_marquee.html` — so these are existing clients, not new ones.

**If these replace the placeholders**, it is one edit to
`src/_testimonials.html` and it lands on both pages at once, which is the
whole point of that file. Note the rail is built for six and clamps `perView`
to the set size (§7), so four is safe — but check it, because four quotes in a
three-up window is the narrowest the rail has ever run.

### Verified

Eleven section boundaries probed from viewport captures: max channel delta 4,
no seam (§5). Zero horizontal overflow, zero console errors and zero failed
requests on all three pages at 1680/1440/1024/900/768/560/390. The team grid
resolves 4/2/1 columns at 1440/1024/560. No reference to `.about-word` remains
in `src/` or `shared.css`, and `src/_testimonials.html` is untouched.

---

## 24. The testimonial head is just a heading

"In their words" stands alone. The lead paragraph and both badges that sat
beside it are gone, on instruction.

**This is the shared partial, so it landed on the homepage too.** That was the
point — §23 settled that both pages carry the same testimonial section — but
it does mean the signed-off homepage changed, and it is the first copy removal
this cycle to reach it. One revert restores it on both.

### The copy that was removed

- The lead: "49 five-star reviews and a HIPE Award for outstanding service and
  customer satisfaction. Here's what founders say after working with us."
- The rating badge: "★★★★★" and "4.9 / 5 · 49 reviews"
- The award badge: "Certified 2025", "HIPE Award", "Outstanding service"

**The site has not lost the HIPE award claim** — the about page's stats
section still carries its own "Certified 2025 / HIPE Award / Outstanding
service" block and the sentence about the award in its foot. The homepage,
however, now states the award **nowhere at all**, and the "49 reviews" and
"4.9 / 5" figures are gone from both pages. If that proof is wanted back on
the homepage it has to be rebuilt, not just reverted into the rail's head —
unless the head itself returns.

**`.stars` was deliberately kept.** It is still worn by all six quotes, so the
rating marks did not disappear from the section, and §11 counts the review
stars among the last few red objects on the site. Removing the rule would
have taken red out of the whole section.

**What went with it:** `.proof-head`, `.proof-lead` and `.proof-badges` and
their four rules, plus the `.proof-badges` responsive rule. The heading took
the class `.proof-title`, which also meant updating the neutralised
alternation list (`.proof-lead h2 .alt` → `.proof-title .alt`) so "In their"
keeps setting in the didone rather than suddenly flipping to the grotesque on
both pages. That list is at the top of the stylesheet, a long way from the
rule being changed — **check it whenever a headline's class changes.**

**The section's CTA below the quotes was left alone** — "Read all 49 reviews".
The instruction and its screenshot covered the head band only. Worth noting it
still says 49, which is the figure just removed from the head above it.

### Verified

Rail unchanged in behaviour on both pages: six quotes clone to twelve, three
lit, both controls present, twelve `.stars` runs. All section boundaries
probed from viewport captures — max channel delta 4, no seam (§5). Zero
horizontal overflow, zero console errors and zero failed requests on all three
pages at 1680/1440/1024/900/768/560/390. With JavaScript off, both pages still
show all six quotes at full opacity.

---

## 25. The glows were brown, and why

Reported by the user as the background shapes making the page uglier rather
than prettier. They were right, and nothing in the per-section checking that
had been done would ever have caught it — every one of these glows passed its
own seam probe. **The fault was only visible with the whole page in one
frame.** §5 already says "verify the page, not the section" about hard edges;
this is the same rule about colour.

### The cause, measured

`--red` is `#f04222`. The page background `--ink` is `#141414` — **a grey, not
black.** Alpha-compositing a saturated red toward a grey raises its green
channel relative to red, so a dim red glow is not a dim red: it is brown.

| | composites to | green/red |
| --- | --- | --- |
| `--red` at full strength | rgb(240,66,34) | **0.275** |
| `--red` at `.26` over `--ink` | rgb(77,32,24) | 0.42 |
| `rgba(255,40,8)` at `.26` over `--ink` | rgb(81,25,17) | **0.31** |

So the warm glows no longer use `--red` as their source. They start hotter and
with almost no green — `rgba(255,40,8)` — and land close to the brand red's own
ratio once dimmed. **This is counter-intuitive and will look like a mistake to
the next person: a glow whose source colour is not the brand colour is correct
here, and changing it back to `var(--red)` will quietly reintroduce the mud.**

**Curve shape matters as much as alpha.** A slow ramp — `.56 → .36 → .12 → .03`
— spends most of its *area* between .15 and .40, which is exactly the muddy
band. A bright core falling off fast keeps that band to a thin ring. Every
warm glow now runs roughly `.3 → .1 at ~33% → .025 at ~60% → transparent ~77%`.

### Measuring it

Peak colour is the wrong metric and sent me down a blind alley twice. The
original conviction glow measured rgb(124,48,29), green/red 0.39 — *better*
than some values that look fine — and it was the ugliest thing on the page.
**What reads as ugly is area, not hue:** how much of a section is lifted off
the page black into a mid-tone wash.

The measurement that works: render with every image hidden and all text set
transparent, so the capture contains nothing but the glow layer, then report
the percentage of each section's pixels above luminance 34 (the page itself
is 20). Over ~18% is a wash. The about page is now **1.6% at worst**; before
this it had four sections well past that.

### What changed

| Section | Before | Now |
| --- | --- | --- |
| about conviction | 34vw circle at `.56`, **dead centre behind the headline** | small, high, `.30` — spill from the photograph above |
| about founder | blue ellipse low left | **removed** — the design draws this section on flat black |
| about team | none | blue, bottom left, as the mock draws it |
| about studio | none | blue, upper left — the design's loudest light, and the one glow allowed to be big |
| about courage | `.38` centred on the right, washing the whole band | `.28`, tightened into the bottom-right corner |
| about stats | `.26` | `.32`, tightened into the top-right corner |
| homepage closing | `.26` ramping slowly | same position and read, retuned — it measured rgb(77,32,24) |

**The placement now follows the client's own screenshots,** which is where it
had drifted from: the mocks put blue in the studio and team sections and flat
black under the founder, and the build had it the other way round.

**Blue never had this problem.** `#3524d5` at `.5` over `--ink` composites to
rgb(43,30,117), which is still unambiguously blue. Only the warm glows needed
retuning, and that asymmetry is worth remembering before adding a new one.

**The homepage's hero and belonging sections were left alone.** They measure
38.3% and 6.9% washed, which is far past the threshold — and both are
deliberate: §2 has red and blue bookending the page, and §8 has the belonging
glow as the only mid-page blue, approved by the client. The metric is a tool
for finding accidents, not a rule to apply blindly.

### The over-correction, and the real trap

**The first fix went too far and the user had to push again.** Taking the mud
out by lowering alpha produced glows that measured beautifully clean and were
*invisible* — a faint grey-blue smear in a corner where the design draws a
large saturated field. Absent is not the same as restrained. The metric said
1.6% washed and the page looked dead; the metric was measuring the right
thing and I was reading it as a target rather than a floor.

**`.glow-soft` erases the top and bottom 15% of every glow, and that is what
made them vanish.** Writing a corner light the natural way — `at 90% -6%`,
`at 2% 100%` — puts the gradient's core inside the mask's fade, so almost all
of it is removed no matter how high the alpha goes. I had moved every core to
an edge in the name of "tightening into the corner", which is precisely the
wrong move under that mask. **Cores belong between roughly 18% and 82%
vertically**, letting the gradient's own falloff reach the edge. The note is
now also in `shared.css` directly above `.glow-soft`.

**Brightness is the safe direction, which is counter-intuitive.** The brown is
in the *dim middle*, not the bright core — `rgba(255,40,8)` composites to
green/red 0.36 at `.2` but 0.22 at `.5`, which is *more* saturated than the
brand red itself. So a warm glow that looks muddy should usually get brighter
and tighter, not fainter.

Final values: blue cores at `.80` (studio) and `.68` (team); warm cores at
`.62` (courage, stats), `.56` (homepage closing) and `.30` (conviction —
deliberately the quietest, because the design draws that section almost black
and the headline sits dead centre, where anything strong reads as a lamp
behind the type).

### Verified

All eleven about boundaries probed from viewport captures: max channel delta
3, no seam (§5). Zero horizontal overflow, zero console errors and zero failed
requests on all three pages at 1680/1440/1024/900/768/560/390. Each section
was then looked at full size at 1440 rather than judged from a thumbnail or a
number — which is what should have happened before the first fix shipped.
