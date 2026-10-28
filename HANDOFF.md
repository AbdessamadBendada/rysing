# Handoff

Read this before touching anything.

**There is a second track.** The site is being ported to WordPress / Divi 5 in
`wordpress/`, and **`wordpress/HANDOFF.md` is the authority for it**. This
document and `src/` remain the design source of truth: the port consumes them
and never feeds back. Fix a design problem here and re-port — never by editing
the Divi page, which a generator will overwrite.

**Every page at the root is generated. Do not edit one — edit `src/` and run
`node build.js`.** The build system is §12.

| Page | Source | Section |
| --- | --- | --- |
| `index.html` | `src/index.html` | §2, §7–§11, §15, §16 |
| `contact.html` | `src/contact.html` | §13, **§32** |
| `about.html` | `src/about.html` | §14, §18–§25, **§31** |
| `process.html` | `src/process.html` | §26 |
| `communication-strategy.html` | `src/communication-strategy.html` | **§27, §29, §30** |
| all five | `src/_footer.html` | §17, §27 |
| all five | `shared.css` colour tokens | **§28** |
| homepage + about + service | `src/_testimonials.html` | §7, §23, §24, §27 |
| homepage + about | `src/_marquee.html` | §22 |
| all five | the background shapes | **§27, then §29 and §33** |

**There is a scratch page that is not part of the site.**
`pattern-playground.html` exists to try cursor animation on the hero's
orange light. It is `chrome: none`, nothing links to it, and no page of the
site changed for it. **§44** records four approaches the client has already
rejected and the findings they produced; **§45** is the fifth, which is the
one currently on the page. **It is broken in Safari** — read §45 before
touching it, and do not judge it in Safari.

**§46 adds a third variant to the same page and it is a different problem.**
It is the brand mark repeated as a pattern around the wordmark, repelled by
the cursor. **§44's rules do not bind it** — those are about a continuous
field of light, and these are discrete marks with homes to return to. Read
§46 before assuming otherwise.

**Three things are newer than most of this document. Read them before
touching a background shape, a colour, or a service page.**

**1. Backgrounds belong to the page, not to sections (§27).** `body` is the
single compositing group. A section hosting a shape carries
`position:relative` and **nothing else** — no `isolation`, no
`overflow:clip`, no opaque `background`.

That is only half of it. **The shape's own box is the other half (§29, §33).**
A gradient paints only inside its own element, so `inset:0` on a glow is a
cut section boundary waiting to happen — and a box that overhangs too far
runs past the end of `body`, where there is no page fill, which is the same
hard edge at the other end plus dead scroll. Both rules, always:

> the box must contain the light's falloff on every side, **and** it must
> not reach past the bottom of the document.

**Every page is converted. The backdrop work is finished** —
`communication-strategy.html` (§27), `about.html` (§31), `contact.html`
(§32), `process.html` (§34), `case-gerd-bommer.html` (§35) and the homepage
last and hardest (§36). **`.glow-soft` is deleted**, along with
`.hero-light`'s one-sided variant. No section on the site isolates or clips
any more. Do not reintroduce either rule; §36 says what to do instead.

**Two things §36 found that apply beyond the homepage.** `html {
overflow-x:clip }` **does not stop horizontal scrolling** — it only hides the
scrollbar, and `communication-strategy.html` can still be pushed 400px
sideways into dead black today. And the fix belongs on the **shape
container**, horizontal axis only (`overflow-x:clip; overflow-y:visible`),
never on the section.

**§34 also records a gap in the §29 scan.** A glow anchored off one side is
cut across *its own* width, not the page's: the process page's boundary cut
covered 42% of the columns and a scan thresholded at 90% called the page
clean. Scan for a run of columns that change together, or read the geometry
of every hit at 25%.

**§36 adds two measurement traps to that**, both of which produced confident
wrong answers. A second tab backgrounds the page under test and Chrome stops
its `requestAnimationFrame` — any rAF-driven wait then hangs for ever, with
no error (`Page.bringToFront` first). And a fixed header smears its own 1px
border across a document-coordinate scan at one viewport offset per capture,
which read as 16 full-width hard rows that were not there (hide the fixed
chrome before scanning).

**2. The page black is `#000000` (§28).** All four brand colours now match
`rysing brand assets/Branding-Guidelines.pdf` §3.0 exactly. `--ink` was
`#141414`; `--ink-deep` no longer means anything on its own, because nothing
is darker than black. Many comments in `shared.css` still argue from
`#141414` by name and are left standing as the record of why each mask
exists.

**3. The service page is complete at eight sections (§27, §29, §30).** It is
the template for the service pages still to come. **Section order on those
pages is given by the client, not derived** — see §27.

**§26, the process page**, is still the reference for the brand pattern assets
used as foreground shapes — how they are graded, masked and placed. §27 adds
that the same asset is lit three different ways across the site *on purpose*,
and says which and why. **§28 changes what that grading sits on**: the masks
that hide the assets' black surround were tuned against `#141414` and the
surround now matches the page exactly, so one of them may be removable.

**Also changed since §25, all client-instructed:**

- **The team order is now Kristina, Marc, Kim, Ben** on both the homepage rail
  and the about grid. It was Kim, Ben, Kristina, Marc. §15.
- **The about page's courage photograph is the real one.** The cable-car
  interview frame the design called for was supplied and is in; the
  `work-03-clemens` stand-in and its `TODO(asset)` are gone. §22.

**The about page is the live front.** §14 describes it as first built; §18–§25
are that cycle and override §14 wherever they disagree.

**The homepage is no longer untouched.** It was, up to §17. Since then §22
moved its logo marquee into a partial (byte-identical output), §24 removed
three blocks of copy from the testimonial head it shares with about, and §25
retuned its closing glow. All three were instructed or were defect fixes, but
the signed-off page has moved.

This was a single page until recently. `index.html` was called
`premium-direction.html` before the files were reorganised, and anything below
that still names `premium-direction.html` refers to it under that old name.
Every other HTML file now lives in `playground/` as history.

The chrome and the stylesheet are shared by all five, so **a change to
`src/_header.html`, `src/_footer.html`, `shared.css` or `shared.js` lands on
every page at once.** After any such change, re-check the pages you did not
mean to touch — the method and the baseline numbers are in §12.

**`shared.css` fails silently on one specific mistake.** A CSS comment cannot
contain the two characters that end one; writing that sequence inside a
comment terminates it early and every declaration after it is dropped without
an error. It happened three times in one cycle. The check is at the end of
§27 — run it after editing the stylesheet.

**Three checks belong to any shape or colour change, and each one exists
because looking at the page missed the bug.** All three are cheap:

| Check | Catches | Where |
| --- | --- | --- |
| whole-page hard-row scan | a glow cut at a section edge | §29 |
| `scrollHeight` vs `body` bottom | a glow past the end of the page, dead scroll | §33 |
| authored-centre assertion | a light that moved when it should not have | §33 |

**Do not trust a single-boundary probe or a `fullPage` screenshot for any of
them** — §5 and §29 both record a measurement that passed while the defect
was plainly visible in a browser.

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

**This section describes the homepage and is kept for that. The page count
is out of date wherever it appears below: there are five pages now** — the
homepage, contact (§13), about (§14, §18–§25, §31), process (§26, §34) and
communication-strategy (§27, §29, §30). Sections written when there were
three say "all three pages"; read those as a record of what was verified at
the time, not as a current count.

**Everything in this cycle is uncommitted.** The service page (both files),
the `#000` black (§28) and the three backdrop conversions (§27, §31, §32) are
all in the working tree and have not been pushed.

The homepage is the one this section describes; it is also the one the client
has signed off, so it is the one a shared-file change must not disturb — and
it is now the last page still on the per-section backdrop model (§33).

**Two things now reach every page and are newer than most of this
document.** The footer wordmark is the last object on every page rather than
the first thing in the footer (§17). And `shared.css` / `shared.js` are
requested with a content-hash query, `shared.css?v=…`, filled by the build —
without it a CSS-only change ships new markup against a cached stylesheet and
the page renders half-built, which is exactly how the about hero went out
once (§12).

**The about page is where the work is.** It has moved furthest from what §14
describes, and §22 rebuilt it wholesale from seven supplied screenshots. Order
now, read off the built page:

> hero · conviction · founder · **team** · studio · courage **+ photograph** ·
> stats · testimonials · **recognition** · **the standard** · **closing**

Four sections are new, the founder and conviction copy were rewritten, "Why we
exist" was deleted outright, and the hero became photographic.

**Thirteen blocks of baseline copy have come off this page**, every one
instructed: ten across §18–§20 (itemised with the counting method in §19),
plus the three §24 took out of the shared testimonial head. One headline was
altered rather than removed. It is worth putting to the client as a total
rather than as five separate changes, because no single one of them looked
large on its own — and because §24's three also came off the homepage.

**Two structural rules came out of this cycle and are easy to break by
accident.** Glows: no two adjacent sections may carry one on the same side,
and `.glow-soft` erases the top and bottom 15% of every glow, so a core
written at the edge is masked away (§25). Measures: a `max-width` in `em` on a
wrapper resolves against the *inherited* font size, not the text it governs
(§20).

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
| `src/contact.html` | Contact page source. §13, and **§32** for the backdrop conversion. |
| `src/about.html` | About page source. §14, §18–§25, and **§31** for the backdrop conversion. |
| `src/process.html` | Process page source. **§26**, and **§34** for the backdrop conversion. |
| `src/communication-strategy.html` | The first service page and the template for the rest. **§27, §29, §30.** Eight sections; order is the client's. |
| `src/_header.html`, `src/_footer.html`, `src/_layout.html` | The shared chrome, in one place. Changing one changes **all five pages**. See §12. `_layout.html` carries `theme-color`, which tracks `--ink` (§28). |
| `src/_testimonials.html` | The whole `#proof` section — heading, badges, **the six quotes**, controls, CTA. Included by the homepage, about **and the service page** via `{{> testimonials}}` (§27). **The only place this copy is written** (§7). Carries `data-treel-view`, which is how the script finds a rail's viewport now that there is more than one (§7, §15). |
| `src/_marquee.html` | The thirteen client logos and their measured `--f` fractions. Included by the homepage's `#recognition` and the about page (§22). **It carries no comment on purpose** — an HTML comment here ships into both pages and breaks the byte-identical guarantee the extraction was checked against. |
| `shared.css`, `shared.js` | The stylesheet and script, extracted from the old inline blocks. Shared by every page. **The glow rules are the fragile part — §25, and now §29 and §33 for how their boxes must be sized.** The colour tokens are the brand book's own values (§28). |
| `build.js` | `node build.js`. Zero dependencies. Also stamps the `?v=` content hash onto `shared.css` and `shared.js` — see §12, this is load bearing. |
| `index.html`, `contact.html`, `about.html`, `process.html`, `communication-strategy.html` | **Generated — do not edit.** Committed so the site can be served as flat files. `index.html` was `premium-direction.html`. |
| `rysing brand assets/Branding-Guidelines.pdf` | **The client's 18-page brand book, and the first written source this project has had.** §3.0 settles the palette (§28). Not the same file as `Guide 3.pdf` / `Source Files/Guide.pdf`, which are one flattened page. The directory is gitignored, so this is not in the repo. |
| `src/pattern-playground.html` | **A scratch page, not part of the site.** `chrome: none`, no nav points at it. Variant A is the shipped hero as a control; variant B is whatever is being tried. **§44, §45.** |
| `pattern-shark.js` | **The current variant B** — the hero's gradient restated in a shader and warped away from the cursor. The knobs are the `K` block at the top and are live on `window.SHARK`. **Broken in Safari (§45).** |
| `pattern-fluid.js` | Configuration for the fluid simulation — the knobs. Retune here, never in the vendored file. §44. |
| `vendor-webgl-fluid.js` | **Vendored and modified**: Pavel Dobryakov's WebGL-Fluid-Simulation (MIT), with five changes marked `Rysing` and listed in its header. Re-download and re-apply them if upstream moves; do not hand-edit it to change the look. §44. |
| `playground/new-direction.html` | Previous direction. Kept as the copy baseline and for comparison. Do not edit. |
| `playground/new-direction-2.html` | **Another agent's workspace. Never open for writing.** |
| `playground/testimonials.html` | The three slider directions originally considered for §7. **None of them shipped** — the client asked for a conventional three-up rail instead. Kept as history; not part of the build. |
| `playground/rysing-comments.html` | Frozen copy/structure baseline. Read-only. |
| `playground/` (the rest) | Earlier cycles — `rysing.html`, `rysing2.html`, `rysing-v2.html`, `rysing-private.html`, `rysing-branding.html`. History only. |
| `AGENTS.md` | Settled decisions and the local testing harness, kept current with this document. **Its ACTIVE TRACK section is stale — it predates this cycle and still names `new-direction.html` as the build.** Read it for the settled decisions, not for which file to edit. |
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

**Open — the hero's cursor animation** (§44, §45)

- **IT DOES NOT WORK IN SAFARI.** Reported by the user and not yet
  diagnosed. This is the first open item on it and nothing else about the
  effect matters until it is fixed. §45 has the two candidate causes and
  the reason neither was caught.
- **Five approaches have now been built.** Four were rejected by the
  client: a CSS mask (reads as an eclipse), a particle fog with force
  repulsion (donut, and it stutters), a shader warp of the gradient's own
  lookup (reads as a tadpole, and it stutters), and a fluid simulation in
  its stock form (paints smoke rather than displacing anything). The fifth
  (§45) is on the page and **she has not seen it** — see §45 before
  proposing a sixth; three of the five look obviously right on paper.
- **The client is choosing a reference effect**, which is where this should
  have started and still has not happened. §44 has the shortlist. Nothing
  further should be built until she names one.
- **It is committed now, deliberately.** It was four untracked files, and
  §44's own closing rule is that untracked means unrecoverable — which was
  then proved again in §45 when a working set of values was lost to a
  tidy-up. `pattern-shark.js`, `pattern-fluid.js`,
  `vendor-webgl-fluid.js`, `src/pattern-playground.html` and its generated
  page. **No page of the site changed for any of it.**
- **§44 carries six findings that are not guessable** and will cost a day
  each to rediscover — the farthest-corner gradient radius, premultiplied
  canvas alpha, `gl_FragCoord` in device pixels, a transparent WebGL canvas
  removing the page's own black, pointer listeners having to bind to the
  section, and upstream's fluid demo ignoring the mouse unless a button is
  held.

**Open from this cycle** (§36–§38)

- **Not committed.** §36, §37 and §38 are all in the working tree, on top of
  the §27–§34 work that has since been pushed.
- ~~`index.html` is the last per-section page~~ — it came over in §36 and
  **the backdrop conversion is finished on every page**. `.glow-soft` is
  deleted.
- **Horizontal scrolling is live on two pages** and `html{overflow-x:clip}`
  does not stop it: `communication-strategy.html` can be pushed **400px**
  sideways into dead black, `process.html` 17–88px at 360–620. §36 has the
  fix and the homepage's worked example. This is the only item here that a
  visitor can trip over today.
- **Services points at one service page as a stopgap.** None of the `#system`
  accordion's four levels is named Communication Strategy; this wants a
  services index as soon as a second service page exists. §37.

**Blocking on the client, service page** (§29, §30, §38)

- **Two `[__]%` placeholders render at display size in `.svc-proof`.** Not
  comments — visible copy on a finished page. Nobody can fill them but her:
  they are statistics about consumers and revenue, and the honest options are
  her numbers or cutting the two columns. The middle one's own sentence says
  "over 50%", which is not a number. §38.
- **The KMU.Digital line is the first money claim on the site** — "Save up to
  €1,400" — transcribed exactly as supplied. She has to stand behind the
  amount and the eligibility. §29.
- **The faint arc in two service-page mocks is not built** — the price and
  the closing both draw one, and §27 records a thin curved line being
  rejected on this page's hero. One answer settles both. §29.
- **The filled pill no longer marks anything.** Six across four pages, three
  of them on the service page alone, all four of that page's pills saying
  "Book a call" and going to the same place. §38 has the census; §30
  undercounted and is corrected there.
- **The brand book has 17 pages nobody has acted on** — logo spacing and
  application, type usage, brand assets, print collateral. §28. It also
  states the studio's numbers in writing, which is a source for the stats §6
  lists below as unverified.
- **`--ink-deep` is now the same black as `--ink`**, so the hero's gradient
  ground is a flat fill painted by a gradient. If that darker ground is
  wanted back it cannot be a darker black. §28.
- **Three masks exist only to hide a ring that `#000` eliminated.** Two still
  do a second job; `.process-orb`'s may be reversible, which would give the
  process spheres their silhouette back. §28.

**Blocking on the client**

- **Thirteen blocks of copy have come off the about page across five
  instructed changes** (§18–§20, §24) — most of what the page said *to the
  reader*, as opposed to about the studio. Each was approved on its own; the
  total has never been put to her. The itemised table is in §19. First on the
  list because it is the only item here that is cheap now and expensive later:
  the strings still exist in git and each is a one-block revert today.
- **The homepage no longer states the HIPE award in any visible copy** — the
  only "HIPE" left in `index.html` is a source comment — and "49 reviews" and
  "4.9 / 5" are gone from both pages. §24 removed the badges that carried
  them. The about page still has its own award block in the stats section, so
  the claim survives there — but if that proof is wanted on the homepage it
  has to be rebuilt, not reverted, unless the whole testimonial head returns.
  The rail's own "Read all 49 reviews" button still says 49.
- **Four named testimonials are written down but not on the site.** Julian
  Knowle, Jennifer Djongow, Gvantsa Kikalishvili and Veneta Behar — the only
  real named quotes that have ever existed for this project, preserved in §23
  after the block carrying them was removed on instruction. The six live
  quotes are still placeholders. Replacing them is one edit to
  `src/_testimonials.html` and lands on both pages.
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
- **The about page's blue is now one light, on the studio section.** §20
  removed the blue-marked claim that §14 called the page's one cool note, and
  §25 removed the founder glow and the team glow. The `<mark>` device is still
  used on the homepage spotlight if the page ever wants the claim back.
- **The about page carries three lights in total** — conviction, studio,
  stats — after §25 deleted two that were colliding with their neighbours.
  Whether three is the right number is a design call nobody has made
  explicitly; it fell out of fixing a defect. Measured positions and the rule
  against adding a fourth next to an existing one are in §25.
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

**The send button was the first filled pill on the site** — and when this was
written it was the only one, which is no longer true: there are six across
four pages now, counted in §38. §11 removed the closing ask's red fill so
every pill became an outline. The design draws this one filled, and a form
whose commit control is as quiet as its labels reads as unfinished. Hover
inverts it rather than brightening it.

**It is also the one that uses `.btn-pill-solid`, with one hyphen.** Every
other filled pill on the site is `.btn-pill--solid`, with two. Both rules
exist, both fill the pill, and they differ only in the hover border — see
§38, because the pair is a live mistyping hazard.

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
| `.about-recog-title` | 28.4 – 32em | **30.2em** | §22 — intersection, window differs by width |
| `.about-standard-title` | 19.7 – 39.9em | **24em** | §22 — left alone, not doing work |
| `.about-closing-title` | 10.4 – 15.5em | **13em** | §22 — intersection |
| `.about-closing-note` | 33.5 – 36.9em | **35.2em** | §22 — **was wrong at 30em** |
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
| Kristina | Photographer, videographer and content creator | `kristina-verbitskaia.webp` | 1067x1600, 217KB → 92KB |
| Marc | Partner and producer | `marc-babin.webp` | **1600x1200 landscape**, 92KB → 40KB |
| Kim | Brand identity, design systems, and everything you see | `kim-brand-designer.webp` | unchanged |
| Ben | Web development, SEO, and everything web-side | `abdessamad-pic.webp` | unchanged |

**The order is the client's and was changed once** — it was Kim, Ben, Kristina,
Marc. It is set in source order on both the homepage rail and the about grid,
and the two must agree. **The `--drop` / `--rise` offsets stayed with the slot,
not with the person:** they are the layout's zigzag rhythm, and had they
travelled with each card the stagger would have broken on the reorder.

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

> **The frame around this is no longer full-bleed and the section is no longer
> pinned — see §43.** The aperture itself survives that change unaltered: same
> mark, same `MIN`/`MAX`, same `--aperture` and `--reel-progress`, still driven
> by scroll. What moved is the geometry it runs inside, and `MIN = 27` is now
> ~295px rather than ~450px because it resolves against a 1094px frame instead
> of a 1440px viewport. Everything below still holds.

**What it is now.** See-through from the first frame, opening at `MIN = 27`
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
`min(78vh,760px)`. The image is the cable-car interview frame the design
called for — `about-courage.webp`, supplied by the client and delivered at
1000×1500 from a 2:3 source, so the slot crops nothing.

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

**The closing CTA was the site's second filled pill**, and the count did not
stop there — it is six now, across four pages (§38). §11 removed the
homepage ask's red fill so every pill became an outline, and §13 records the
contact form's send button as the first filled one. The design draws this one
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

### THE RULE: no two adjacent sections may glow on the same side

Reported by the user, correctly, as something a junior designer would not do.
The team section carried a blue glow bottom-left and the studio section
directly below carried one top-left. **Sections clip independently and each is
separately masked by `.glow-soft`, so two glows meeting at a shared boundary
cannot blend — they collide**, producing one doubled blob with a dark notch
through it where the two fades meet. In the client's design that is a single
continuous light; the section boundary is an artefact of this build.

**It was in two places, not one.** After fixing team/studio I checked the rest
instead of waiting to be told again, and found the identical fault one pair
further down: courage glowed bottom-right and stats glowed top-right.

Both are fixed by deletion, not by moving: **one section carries the light,
placed to read as the whole moment.** The team glow went (the studio's is the
design's loudest); the courage glow went (the stats glow lights the figures
and the award block, and courage already has warmth from its photograph).

**Check it by measuring, not by looking.** The detector renders each page with
images hidden and text transparent, finds the centroid of every section's lit
pixels, and flags adjacent pairs that are on the same side and hugging their
shared edge. A first attempt that regex-parsed positions out of the CSS
reported "no stacked glows" for a page that had one — it had matched nothing
at all. Current state, measured: about is conviction (x50 y20), studio
(x14 y38), stats (x87 y28); index and contact unchanged. No pair flagged on
any page.

### Verified

All eleven about boundaries probed from viewport captures: max channel delta
3, no seam (§5). Zero horizontal overflow, zero console errors and zero failed
requests on all three pages at 1680/1440/1024/900/768/560/390. Each section
was looked at full size at 1440 rather than judged from a thumbnail or a
number — which is what should have happened before the first fix shipped.

## 26. The process page

`src/process.html` → `process.html`. Built from the client's supplied design
for "The spotlight brand framework". Copy is transcribed from that design and
is not ours to reword.

**It is one `<section>`, not four.** The design draws a single climb under a
single light. Four sections would each clip their own shapes at a boundary
that exists only in this build — the fault §5 and §25 keep having to repair.

### The ascent

Four modules in a grid. Two per-slot custom properties are set in the markup,
not in CSS, so they sit next to each other and are obvious to edit:

| | what it does |
| --- | --- |
| `--rise` | step count 0–3, converted to `margin-top`, which makes the ascent |
| `--spin` | the angle of that module's sphere |

**`--rise` is margin and not `transform`,** because `[data-stagger] > *` owns
`transform` for the reveal and would overwrite it the moment each module
scrolled into view. Both are bound to the slot rather than to the module, so
the rhythm survives a reorder — the team rail's `--drop` reasoning (§15).

**`--spin` angles are deliberately uneven** (-14°, 118°, 237°, 64°). The asset
has one prominent dark lobe, so unrotated copies read as the same stamp printed
four times; evenly spaced angles read as a pattern rather than as chance.
`transform` is safe on the orb because the reveal animates `.process-step`, the
parent, never the orb itself.

The rule above each number is 88% of its column, left-anchored. At full width
it ran edge to edge and read as a table rule. Left-anchored because the
gradient fades rightward and the bright end belongs with its number.

Two-up below 1040px, one-up below 620px where the climb goes flat and the
spheres alternate sides — four in a single column stacked into one continuous
red band with the body copy on top of it.

### The shapes are the brand assets. Do not draw them.

`rysing-assets/pattern-red.webp` and `pattern-blue.webp` ARE the spheres the
design draws. **This page shipped once with hand-written radial-gradients in
their place** and read as four fuzzy blobs. No gradient reproduces that
artwork, and the hours spent tuning gradient stops against §25 solved a problem
that did not need to exist. If a shape is needed, place the asset. The
convention is `.orb` in `playground/rysing-branding.html`.

**Red and blue are lit differently, deliberately.** In the design the red
shapes are objects with an edge and the blue is ambient light with none.

- **Red:** placed whole, no blend mode, `blur(3px)`, masked (below).
- **Blue:** `mix-blend-mode:screen` and `blur(46px)`. Placed whole it reads as
  a large dark ball in the corner, which is the opposite of light.

**Warm and cool must not overlap.** The blue screens, so it adds: it was tried
reaching up behind the climb and every red sphere over it turned **pink**. It
is kept below the modules for that reason — a colour rule, not a composition
preference.

### The black ring, and why the cutout does not fix it

The asset is a glow painted ON BLACK, and that black is opaque artwork rather
than a transparent surround — verified by compositing it over a bright colour,
where the ring stays solid. Against the `#141414` page it reads as an outline
drawn around every sphere.

`rysing brand assets/Pattern Assets/Brand Asset_15.png` (red) and
`Brand Asset_11.png` (blue) are the same artwork WITH alpha — mean difference
0.9 and 0.7 per channel from our webps, which are literally those files
flattened onto black. **Swapping them in changes nothing visible:** their alpha
only trims the square corners outside the disc, and the ring is inside it. Do
not spend 2.5MB an asset on it.

What works is `mask-image: radial-gradient(circle closest-side, #000 44%,
transparent 80%)`, which finishes before the black begins. **`closest-side` is
load bearing** — it makes the gradient's 100% equal the element's half-width,
which is the asset's own circle radius, so the stops are in units of that
circle. The default `farthest-corner` is 1.41x larger, lands outside the
artwork, and does nothing.

The mask costs ~20% of the visible radius, so the element was scaled up and
`left` moved from -30% to -44% to hold the centre still.

**The trade is real and was made knowingly:** the ring is gone and the spheres
are softer-edged for it, because that ring was also their silhouette. The fix
with no trade-off is an asset re-exported to fade to alpha rather than to
black. The two files above are what to ask the designer for.

### The grade was measured, not judged by eye

Eye got it wrong three times running — too fuzzy, then "weird", then "worse".
What settled it was sampling strongly-saturated orange pixels (red > 90, blue
< 45% of red, green < 75% of red) across the whole page:

| | coverage | median R | p95 |
| --- | --- | --- | --- |
| client mock | 12.6% | **158** | rgb(239,65,33) |
| first attempt | 13.0% | **209** | rgb(239,65,32) |
| shipped | 11.3% | **151** | rgb(192,57,31) |

The first attempt had **identical coverage and an identical peak** to the mock,
so neither the size nor the brightest orange was ever wrong. The fault was the
**midtone**: our spheres were flat bright orange across the disc where the
mock's hold the asset's dark internal lobe and a real falloff. That is what
made them read as solid painted rocks sitting on the page.

`brightness()` is the control. **`contrast()` is the wrong tool** — tried,
measured, discarded: the asset's interior sits above mid-grey, so contrast
pushes the midtone *up* (186 → 209 → 230) and collapses the green channel with
it, taking the peak to rgb(241,12,4) and breaking the hue. **Blur cannot do it
either** — it only widens the orange-to-black ramp, and 20px still leaves a
median of 183 while destroying the silhouette.

The copy sits over the spheres, as it does in the mock. **That is only safe
while the midtone stays down** — if these are ever brightened, read module 01's
body text before shipping.

### Section mechanics

`.process` carries its own `background` and `isolation`. Both are load bearing
and neither is decoration: the blue blends with `screen`, which only cancels
the asset's black surround if there is something to screen *against*. Without
them the surround composites toward transparency and paints a dark halo across
the page. The section clips for the same reason — a shape crossing the bottom
edge leaves that backdrop and the halo returns over the footer.

The footer keeps its own blue, which continues the one in the climb.

§25's brown problem does not arise here: nothing is composited toward the grey
`--ink`. The checks for this page are simpler — are the shapes the assets, is
anything pink, and does the orange still measure against the table above.

### How to re-measure

Headless Chrome is enough; nothing is committed, it is a few lines.

- **Glow area (§25's metric):** render with text transparent and images hidden,
  count pixels above luminance 34. Note `--force-prefers-reduced-motion`, or
  the capture catches the reveal mid-transition and every number is halved —
  that happened and sent one pass down a blind alley.
- **Orange grade:** the filter above, against the mock as the reference image.
- **Narrow widths:** headless clamps the viewport at 485px, so `--window-size=390`
  silently renders at 485 and crops. Render the page in a 390px `<iframe>`
  instead.

### Open

- **The nav calls it "Process"; the design calls it "Services".** The supplied
  mock shows this page current under a SERVICES nav item, but the built site
  already points Services at the homepage's `#system`. A new "Process" entry
  was added to the overlay rather than repointing Services and losing that
  link. One line in `src/_header.html` if the client wants it the other way.
- **The spheres' dark lobe is more exposed since they were rotated.** On 02 and
  04 it now sits against open black instead of being tucked behind a neighbour.
  Checked at full size and it reads as shading rather than as a smudge, but if
  it is ever questioned, the fix is choosing angles that turn the lobe toward
  the overlaps.

---

## 27. The services page, and the page-level backdrop

Two things happened in this cycle and the second is the important one.

1. A fifth page, `communication-strategy.html` — the first of the service
   pages, built section by section from client mocks.
2. **The background shapes stopped belonging to sections and started
   belonging to the page.** This is an architectural change to `shared.css`
   and it affects every page, not just the new one.

### Why the backdrop changed

The client's instruction: *"those shapes or patterns we are putting in the bg
shouldn't be related to sections — they should be a background for the whole
page, that way we get a more consistent design, not patterns that are cut
out."*

That is the same fault this document keeps repairing. §5 and §25 are about
hard lines at section boundaries; §26 opens by saying the process page is
written as *one* section precisely because "split them and every shape would
be clipped at a boundary that exists only in this build". The client was
asking to generalise that fix instead of repeating it per page.

**The shapes being children of sections was never the problem.** Three other
things were:

- nearly every section carried `overflow:clip` — the blade doing the cutting;
- each carried its own `isolation:isolate` plus its own `background`, making
  it a private compositing group a shape could not exist across;
- the clipping was load bearing, because of §26: a `screen`-blended shape
  crossing a section edge left its isolation group, its black surround stopped
  cancelling, and it painted a dark halo over whatever was below.

**Hoisting the group to `body` removes the cause rather than the symptom.**
With one group for the document a shape can never leave it, so the halo cannot
return and the clipping that justified it is no longer needed.

### The contract

`body` carries `isolation:isolate` and the page fill. Its background paints
first; shapes at `z-index:-1` paint on top of that fill but behind all content
— exactly the arrangement §26 already proved for a single section, moved up
one level.

**A section that hosts a shape needs `position:relative` and nothing else.**
No `isolation`, no `overflow:clip`, no opaque `background`. `position:relative`
alone does not create a stacking context, so the shape stays anchored to the
section's geometry while compositing at page level.

Anchoring to the section rather than to document coordinates is deliberate:
page coordinates break the first time a paragraph gets longer.

`isolation` creates a stacking context but **not** a containing block for
fixed positioning (only transform/filter/will-change do), so the fixed header
is unaffected. Verified.

`.site-footer` lost its `isolation` with the same change. It was a hard floor
no shape could cross — which is what stopped §26's blue "carrying on down
behind the footer and the wordmark, as one light". `.footer-light` keeps its
own `overflow:hidden`; that is unrelated to section clipping and still needed,
because those glows otherwise extend the document and add dead scroll past the
end.

**The other four pages were still on the old per-section model when this was
written. Two have come over since** — `about.html` in §31 and `contact.html`
in §32, both on the client's instruction and both keeping their lights in
place. `index.html` alone still isolates and clips (§34 took process
over): `.hero`,
`.reel`, `.spot`, `.belong`, `.fudge`, `.closing` and `.process`.

Rolling a page over is design work, not a switch: shapes that currently stop
dead at a boundary start spilling into neighbours and need re-placing and
re-grading. The client approved proving it one page at a time for exactly
that reason. §31 and §32 are the worked examples, and §33 is the bug that
comes with doing it carelessly.

### Parallax

Client asked for the backdrop to scroll slower than the content. A module at
the end of `shared.js` writes `--py` on any `[data-parallax]` element; each
shape composes that into its own transform alongside its `--spin`, so drift
and rotation never fight over the one `transform` property. Translate before
rotate, or the drift is applied along the rotated axis.

**The offset is measured from the viewport centre, not from `scrollY`.**
Driving it from `scrollY` is the obvious version and it is wrong: a shape two
screens down is handed a scroll distance of thousands of pixels and translates
clean off the document. Measured from the centre the drift is bounded by the
viewport however long the page grows.

`getBoundingClientRect` reports the box already translated, so the applied
offset is subtracted back out before each measurement — without that, every frame
compounds the last and the shape accelerates away.

`--py` defaults to `0`, so reduced motion and a failed script both leave every
shape exactly where CSS put it.

Measured: the hero sphere drifts **80px per 400px of scroll** at its declared
`0.2` rate, linear across four samples. The declared rates are the fraction of
the content's scroll speed the shape gives up.

### The page

Six sections, `src/communication-strategy.html`:

| Section | What it is |
| --- | --- |
| `.svc-hero` | Full-height, one red sphere low right, mixed-face headline |
| `.svc-intro` | Claim left, argument right, three outcomes under hairlines |
| `.svc-get` | Four lit masses with copy on them — §26's composition, flattened |
| `.svc-process` | Six-row numbered table, one blue disc behind the left column |
| `.svc-proof` | Three figures under hairlines — the `.svc-intro` device reused |
| `.svc-why` | Centred ask, star mark, filled pill — the only one *at the time*; the page has three now (§38) |
| `#proof` | **The shared testimonial rail, `{{> testimonials}}` — §7. Last.** |

**The rail is the third page to carry it** and it was included, not copied —
§7 requires the six quotes to have exactly one home. No copy was added to the
baseline and no CSS was written: `.band` already carries no `isolation`, no
`overflow:clip` and no opaque fill, so it satisfies the contract above
unaltered, and it hosts no shape of its own.

**It goes after the ask, and it was built before it and moved.** The first
placement reasoned from the homepage's order — §8's argument that proof earns
the request that follows it — and put the rail between `.svc-proof` and
`.svc-why`. The client's correction: *"why in the last page we were creating
we made the testimonials before the CTA, please follow the order I am giving
you"*.

**The order of sections on a service page is given, not derived.** This page
is built from client mocks section by section, and the same rule that makes
the copy theirs makes the sequence theirs. A design argument for a different
order is not a reason to build a different order — it is at most something to
raise. Do not move it back.

Verified at 1440 after the move: section order reads
`svc-hero · svc-intro · svc-get · svc-process · svc-proof · svc-why · band`,
the rail initialises (6 clones, 3 lit, every `[data-reveal]` at full
opacity), the `.svc-why`/`#proof` boundary is flat black with no seam, and
`node build.js` reported `unchanged` for the other four pages — no shared
file was touched.

**Two hairline rows now run back to back**, `.svc-proof`'s three and the
rail's one. It reads as one device used twice rather than two devices, which
is what §7 wanted, but nobody has looked at it next to a mock.

Nothing links to it yet. The overlay's "Services" still points at
`index.html#system`.

### The spheres are lit three different ways, and each is deliberate

This is the part most likely to be "tidied" into consistency by someone later.
Do not.

| Shape | Vignette | Why |
| --- | --- | --- |
| `.process-orb` (§26) | **masked away** | Asset's black surround met `#141414` and read as a hard ring drawn round every sphere |
| `.svc-get-orb` | **kept** | These overlap. The dark rim is the only thing separating one disc from the next — masked, the four dissolve into a single continuous red band |
| `.svc-process-blue` | **kept, no `screen`** | The design draws a disc whose circular edge sweeps through the rows. `screen` exists to dissolve exactly that edge |
| `.svc-get-blue`, §26's blue | **`screen`, heavy blur** | Ambient light with no boundary |

`.svc-get-orb` is also graded brighter (`brightness(.95)` against §26's `.84`)
because the design asks for it. The body copy sits on the lit mass. **That is
the thing to re-check if it is ever brightened further.**

Below 560px `.svc-process-blue` switches back to ambient: at that width the
whole row sits inside the disc and a hard boundary running through the
numerals reads as a stray line.

### Failures worth not repeating

- **The blue flooded `.svc-get` and turned the first sphere purple.** §26 says
  outright that `screen` adds and a red sphere over blue goes pink. It was
  placed over sphere one anyway. It is now small, deep in the corner and well
  below the row.
- **The deliverables stagger was applied to the item, not the orb.** In the
  design all four headings sit on one line and only the lights are set at
  different heights; offsetting the item stepped the copy down the row and
  lost that horizontal. `--lift` belongs to the orb.
- **The orb anchor was moved to close a gap under the title.** Wrong lever —
  it lifted every sphere clear of its heading and left the copy on bare
  ground. The gap belonged to the list's top margin; the orb offset is what
  sets the heading's position on the disc (~60% down, measured off the mock).
- **A decorative arc was added to the hero and the client rejected it.** It
  was read out of a faint curve in the mock. Removed entirely. If a thin
  curved line ever reappears on a service page, it is a bug.

### The `×`, and a CSS trap that cost three passes

`6–7×` in `.svc-proof`. The didone's `×` is a hairline, far finer than the
digits; the design's is a heavier geometric mark.

**Aileron's `×` is weight-invariant.** Regular, SemiBold and Bold render
pixel-identical marks — verified by rendering all three side by side, where
the capital X does change and the × does not. `font-weight` can never thicken
that glyph. The fix is `font-size:1.45em` with `vertical-align:middle`; at
that size it already carries the design's weight and needs no outline stroke.

The reason that took three passes is the trap, and it is general:

> **A CSS comment cannot contain the two characters that terminate one.**
> Writing that sequence inside a comment ends it early. Everything after it
> until the next terminator is parsed as declarations, is invalid, and is
> **silently dropped** — the stylesheet still parses, it just loses rules.

It happened three times in this cycle, twice from pasting prose after a
closing terminator and once from a comment that *quoted* the sequence while
explaining the bug. Each time an entire rule block went dead with no error
anywhere. `.svc-figure-x` was unparsed through the whole `×` investigation, so
the × on the page was still the serif hairline and every stroke weight
measured against it read as an improvement — a value that turned out to be a
blunt cross once the rule actually applied.

**Check after editing `shared.css`:**

```sh
node -e "const s=require('fs').readFileSync('shared.css','utf8');let i=0,c=false,l=1,b=[];
while(i<s.length){if(s[i]==='\n')l++;
 if(!c&&s.startsWith('/*',i)){c=true;i+=2;continue}
 if(c&&s.startsWith('*/',i)){c=false;i+=2;continue}
 if(!c&&s.startsWith('*/',i)){b.push(l);i+=2;continue}i++}
console.log(b.length?'STRAY at '+b.join(','):'balanced','| unclosed:',c)"
```

### Testing: headless Chrome is not enough any more

§26's harness notes still hold, plus three new ones.

- **`--virtual-time-budget` fires `requestAnimationFrame` roughly once.**
  Anything rAF-driven — the parallax, the reel aperture — appears frozen, and
  three separate attempts to measure parallax read as a bug in the code. Drive
  a real Chrome over CDP instead (`--remote-debugging-port`, Node 24 has a
  global `WebSocket`, no dependencies needed).
- **`scroll-behavior:smooth` on `html` swallows programmatic scrolling.** Set
  `document.documentElement.style.scrollBehavior='auto'` first or `scrollTop`
  silently stays at 0.
- **Full-page screenshots capture everything below the fold blank**, because
  `[data-reveal]` never intersects. Sweep the page in steps first; reveal is
  one-way, so returning to the top keeps it visible.
- Headless clamps the viewport near 500px, so a `--window-size=430` capture
  renders at 500 and crops — which reads as an overflow bug that is not there.
  §26 gives the iframe workaround; `Emulation.setDeviceMetricsOverride` over
  CDP is better.

### Verified

- No horizontal overflow at 360/390/500/760/820/900/1024/1440/1920. Read that
  as *no horizontal scrolling*, which is what matters and what was checked.
  `main`'s `scrollWidth` is genuinely wider than the viewport — 1921 against
  1425 at 1440px — because `.svc-hero-orb` reaches 1921 and nothing clips it
  any more. `html { overflow-x:clip }` is the only thing holding that, and it
  is doing so by design. The other pages report no root overflow at all, so
  this page differing is the contract working, not a defect. Do not "fix" it
  by putting `overflow:clip` back on a section.
- The hero sphere crosses the section boundary — 443px past the hero's bottom
  edge, overlapping the footer box — with no clipping.
- Parallax linear and non-compounding across four scroll positions.
- Before/after renders of index, about, process and contact: `about` is
  pixel-identical; the other three differ only in animation phase (the `drift`
  keyframes, and contact's Calendly loading dots). Spheres, blue light and
  layout intact on all four.
- `shared.css` comment terminators balanced — 277 open, 277 closed, none
  stray.

### Open

- **Nothing links to the page.** Overlay "Services" still points at
  `index.html#system`. Same unresolved question as §26's nav note.
- **Two `TODO(copy)` figures in `.svc-proof`** — `[__]%` twice. The client has
  not supplied the numbers. The second figure's own sentence says "over 50%".
- **The page mixes first person singular and plural.** "Why work with **me**",
  "**I** specialize", and process step 03's "**I** research competitors",
  against "We'll identify gaps" and "When **we're** done" — the last two
  sentences in the same section. Transcribed verbatim from the mocks; the
  client has not been asked.
- **Spelling mixes conventions** — "specialize" against "prioritise" and
  "recognise". Also verbatim.
- **Process step 05 has no closing full stop**, unlike the other five.
- **The pill arrow is the site's star mark, not the `↗` every mock shows.**
  Shared `.btn-pill` chrome, so changing it lands on every page. Left alone
  and not yet decided.
- **The hero sphere is anchored in `vh`**, so on a short laptop viewport it
  sits higher and brighter behind the headline than the mock draws it. Raised
  with the client, not yet actioned.
- **`index.html` and `process.html` are the last two per-section pages.**
  About (§31) and contact (§32) have come over. The homepage is the harder
  one — §32 lists why, and §12's 0-of-22,821,120-pixel baseline has to be
  re-taken rather than defended when it moves.

---

## 28. The brand guidelines, and the page black

The client supplied `Guidelines.pdf` — an 18-page brand book, now in the repo
as **`rysing brand assets/Branding-Guidelines.pdf`**. It is the first time
this project has had a written source for any of this. Everything before it
was measured off mocks.

**It is not the same file as `Guide 3.pdf`.** That one, and the byte-identical
`Source Files/Guide.pdf`, are a single 3935x2791pt page — one flattened
poster. The guidelines are 18 A4-landscape pages with an index.

What it settles, from §3.0 Color Palette:

| | Guideline | Site before | |
| --- | --- | --- | --- |
| Paper | `#F9F9F9` | `#f9f9f9` | already exact |
| **Black** | **`#000000`** (CMYK 75/68/67/90) | `#141414` | **changed** |
| Blue | `#3524D5` | `#3524d5` | already exact |
| Red | `#F04222` | `#f04222` | already exact |

Three of four already matched to the byte, which is worth knowing: the
palette was being followed correctly and the black was the single drift.

### The black moved to #000000

On the client's instruction to follow the document. `--ink` and `--ink-deep`
are both `#000000`, `theme-color` tracks it, and the three hand-written
`rgba(13,13,13,…)` scrims (the header gradient, the reel toggle, the contact
embed well) moved to `rgba(0,0,0,…)`. A token cannot carry an alpha, which is
why those three are literals and why they have to be found by hand.

**`--ink-deep` no longer means anything on its own.** It was "darker than the
page" — the hero's ground, which resolved into the page colour over its last
fifth, and the menu overlay. Nothing is darker than `#000`, so the hero
gradient is now a flat fill painted by a gradient. It is kept as a token
rather than deleted because it still names a distinct intent and because
collapsing ~20 call sites would have buried the colour change in noise.
**If the hero's darker ground is wanted back, it cannot come back as a
darker black** — it would have to be a lift above the page, which is the
opposite gesture and a design decision nobody has made.

### What this does to the shape work, which is the part to read

Every brand pattern asset is artwork painted on an **opaque `#000` ground** —
not a transparent surround; §26 verified it by compositing one over a bright
colour, where the ring stayed solid. Against a `#141414` page that surround
read as a ring drawn around every sphere, and **three separate masks exist
only to hide it**: `.process-orb`'s, `.svc-get-orb`'s outer feather, and
`.svc-process-blue`'s 93% stop.

At `#000` the surround and the page are the same colour and the ring cannot
occur. Those three masks are now solving a problem that no longer exists.
**Do not remove them on that basis alone** — two are doing a second job that
still matters:

- `.svc-get-orb`'s feather is also what keeps four overlapping discs from
  dissolving into one continuous red band (§27). The rim is load bearing.
- `.svc-process-blue`'s mask also shapes the disc edge the design draws
  sweeping through the rows.
- `.process-orb`'s is the one that was *only* ever about the ring. §26 says
  the vignette is what gives that shape a circular silhouette and that
  masking it away was a trade, not a win. **At `#000` that trade may be
  reversible** — the vignette could come back and read as a soft dark disc
  rather than a drawn outline. It is the one worth retesting, and it is a
  design call, so it is open rather than done.

Several comments in `shared.css` still argue from `#141414` by name. They are
left standing deliberately: they are the record of why each mask exists, and
a comment that says "this was tuned against a page colour that has since
changed" is more useful than one quietly rewritten to agree with the present.

### Verified

Before/after full sweeps of all five pages at 1440, animations pinned to
`currentTime = 0` and videos parked per §12:

- **Page heights identical on all five** — nothing reflowed.
- Peak per-pixel delta on flat ground is **64**, which is exactly the
  `#141414 → #000` shift (3 x 20, plus rounding) and nothing more.
- **Under 0.05% of pixels moved by more than 70** on every page except three
  captures, all three of which are known animation phase and not colour: the
  homepage hero (the aperture), the showreel frame, and contact's Calendly
  iframe finishing its load between runs (§27 already records that one).
- The process spheres read **better** on black: their feathered edges used to
  sit on a visibly lighter ground and now melt into the page.

### A testing trap that invalidated a whole run

**Chrome served the generated HTML from its own cache**, so an "after" sweep
measured the old page and reported the change as having done nothing — max
deltas of 5 to 9, which looks exactly like a successful no-op. It was caught
only by probing `getComputedStyle` for `--ink` and finding `#141414` still
live, with a stale `shared.css?v=` hash in the markup.

The `?v=` hash (§12) protects a *visitor* from this; it does not protect a
test run, because the cached HTML carries the old query string with it. When
measuring a CSS change over CDP, send `Network.setCacheDisabled` and reload
with `ignoreCache`, or use a fresh `--user-data-dir`. **Confirm the value you
changed is actually live in the page before trusting any comparison.**

### Open

- The guidelines have **17 more pages** than the one that has been acted on —
  logo spacing and application rules (§2.1–2.3), type usage (§4.1), brand
  assets (§5.0) and print collateral (§6.0). None has been checked against
  the build. §2.3's "Do not rotate / stretch / apply any effects / re-align /
  colour" is worth reading against `--spin` on the sphere assets, though
  those are pattern artwork rather than the logo.
- The book's own §1.0 states the studio's numbers: "more than thirty brands",
  "35+ websites", "over 3,000 pieces of content", "49 named client
  testimonials", "sixteen countries", "350 students", and the HIPE award.
  **That is a written source for the stats §6 lists as unverified and
  contradictory between the homepage and about.** Reconciling them against
  this document is now possible and has not been done.
- The type page names Kinfolk and Aileron, and links Aileron to
  open-foundry.com. It gives no download or licence for Kinfolk, so §6's
  open licence question is unchanged.

---

## 29. The price section

`.svc-price`, the seventh and last section of `communication-strategy.html`.
Headline left, one plan card right, one red light behind both. Built from a
supplied mock and transcribed from it.

**It is last on the client's instruction** — given as "the next section" when
the testimonial rail was already the final one. Same rule as the rail above
it: sequence on this page is given, not derived (§27).

**It is the first section on the site to name a figure.** €3,300 + VAT, and a
funding claim under it. Both are the client's to stand behind.

### What is in it

| | |
| --- | --- |
| Headline | Three faces by phrase, as the hero and intro set them |
| `.svc-plan` | Hairline card: name, note, price, four inclusions, funding line, filled pill |
| `.svc-price-glow` | One red light, top right |

The card is an `<article>` — a self-contained offer with its own name, price
and terms, and the element most likely to be joined by siblings when the
other service pages arrive.

**The card has no fill, and that is load bearing twice over.** The mock lights
its top right with the same light that lights the page around it, which only
happens while the card is a hairline and nothing else. An opaque panel would
also break §27's contract by making the card its own ground.

### The measure, swept rather than chosen

The design breaks the headline "Set the foundation / with a clear / message
and brand / communication". That break holds from **11 to 12.2em** at 1680,
1440 and 1200; `11.6em` is the midpoint. At 10em it falls to five lines with
"Set the" hanging alone, and at 13em it collapses to three — but only at
1680, so that end is a breakpoint-dependent edge rather than a clean limit.
In em and never ch, for §4's reason.

### The shape: built twice

**First attempt used `pattern-red.webp` placed whole**, the way
`.svc-process-blue` is, because the mock appears to draw a circular edge
sweeping down past the card. It reproduced §27's `.svc-get` failure exactly —
the lit mass flooded the section, the card sat inside it and the body copy
ended up on saturated orange. The asset is a dense object; this corner wants
light.

**The second attempt reintroduced the cropped backdrop, which is the fault
§27 exists to abolish.** It was written `inset:0` — a box exactly the size of
`.svc-price` — with the gradient centred at `92% 2%`. The light therefore
began at the section's top boundary and was cut flat across the full width of
the page. The client caught it on sight, having already given the instruction
once: *"do not put the bg patterns relative just for sections, because they
look cropped — we want them linked with the whole page"*.

**Removing `overflow:clip` was only half of §27's change. The shape's own box
is the other half.** A gradient paints only inside its own element; nothing
has to clip for it to be cut. §8's rule — a glow must reach transparent
inside its own box — is usually read as being about clipping, and it is not.
A centre at `2%` puts 98% of the light outside the element, and the element's
edge becomes a drawn line on its own.

> **`inset:0` on a decorative glow is the tell.** Size and place the element
> by the light, not by the section.

The element is now a square two-thirds wider than the viewport whose centre
is parked on the section's top-right corner, so the falloff lands inside it
on every side. It bleeds up through the testimonial rail and down behind the
card, which is what makes it read as the page's light rather than this
section's decoration — and is legal only because of §27's page-level
compositing group.

**The brand red is used directly here, and on the other glows it could not
be.** §25's brown is an artefact of compositing red toward `#141414`, a grey,
which raises the green channel relative to red — which is why `.closing-glow`
has to start at `rgba(255,40,8)` rather than at `--red`. Over the `#000` page
(§28) the composite is proportional and the hue holds. **This is the first
new glow written since the page black changed, and it is the first evidence
that §25's workaround is no longer needed.** The older glows have not been
revisited.

### Open: the arc in the mock is not built

The mock draws a large, faint circular line sweeping from the top of the
section down past the card. **It is deliberately not on the page.**

§27 records that a decorative arc was read out of a mock once before, added
to this page's hero, and **rejected by the client outright** — "if a thin
curved line ever reappears on a service page, it is a bug". Reading a second
thin curve out of a second mock is the same judgement that was already made
and already overturned, so it is flagged rather than shipped.

It needs one answer from the client, and the answer decides which way to
build it:

- if it is the **edge of a disc**, it comes back as the asset placed whole,
  the `.svc-process-blue` treatment, and the glow is replaced;
- if it is a **drawn line**, it is the thing that was rejected and stays off;
- if it is **an artefact of the mock's own export**, nothing changes.

### Verified

- Headline breaks as the design draws it at 1680, 1440 and 1200.
- No element of `.svc-price` overflows at 360/390/500/760/820/900/1024/1440/
  1920, and the card fits the viewport at every one of them.
- **No full-width hard row anywhere in the section**, by the whole-page scan
  below. The 29 rows the scan does flag on this page are all intentional 1px
  rules — the pillar and proof hairlines, the six step rules, the rail's rule
  and the footer's top border — and none of them falls between 6137 and 7263,
  which is where this section sits.

### The check that failed, and the one that works

**A single-boundary probe passed this bug.** §5's method — park the edge
mid-screen, shoot the viewport, compare the row above against the row below —
reported **3** at the rail/price boundary while a hard red line was plainly
there in a browser. Whatever the probe sampled, it was not the thing the eye
sees, and one measurement at one coordinate is too narrow a net for a fault
whose whole nature is that it runs across the entire page.

Scan every row instead, and judge by **how much of the width jumps at once**:

1. Sweep the page so `[data-reveal]` has fired, pin animations, then capture
   overlapping viewport screenshots down the whole document (§27: never a
   `fullPage` stitch for measuring).
2. For each row, sample every 8th column and count how many exceed an 8/255
   channel jump against the row below.
3. Report any row where that count passes half the width.

A glyph edge, a photograph or a soft gradient never trips it; a drawn rule
and a guillotined glow both do, and the two are easy to tell apart because a
rule is one row and sits where a rule belongs. Run it after any shape change
and diff the flagged list against the known rules.
- The other four pages differ only in the `?v=` hashes and §28's
  `theme-color` — no markup drift.
- `shared.css` comment terminators balanced.

### Open, for the client

- **The mock's pill carries `↗`; the site's carries the brand star.** Already
  §27's open item, unchanged — it is shared `.btn-pill` chrome, so it lands
  on every page at once.
- **"Save up to €1,400 with KMU.Digital financing"** is transcribed exactly
  as supplied. KMU.Digital is an Austrian federal programme; the amount and
  the eligibility are claims the studio is making, and this is the first
  money claim on the site.
- The card's right edge runs to the page gutter, where the mock leaves a
  wider margin. The page's own container convention was kept, on the grounds
  that every other section on this page runs to the same gutter and the mock
  canvas carries bleed.

---

## 30. The closing, and the page is complete

`.svc-close`, the eighth and last section of `communication-strategy.html`.
Two sentences, one pill, centred on black, with the page's only blue arriving
in the bottom-left corner. Built from a supplied mock.

**The page is now complete at eight sections:**

> hero · intro · deliverables · process · proof · **why work with me** ·
> **testimonials** · **price** · **closing**

### The headline is two block lines, not one run that wraps

"Clarify your message." and "Amplify your brand." are two sentences and the
design gives each a line. They are `display:block` spans rather than one run
left to find its own break: a measure would put the break wherever it
happened to fall and lose the pairing of "your message." against "your
brand." that the two lines are built on. Each sentence still wraps inside
itself on a narrow screen, which is what a `<br>` would not allow.

### The blue

Placed whole, vignette intact, `screen` deliberately not used — the mock
draws a disc whose circular edge sweeps up out of the bottom-left corner and
`screen` dissolves exactly that edge. Same call as `.svc-process-blue`;
§26's table is the reference.

**It reaches 600px past the section into the footer**, measured. That is the
point: §26 wanted the blue "carrying on down behind the footer and the
wordmark, as one light" and could not have it while `.site-footer` carried
`isolation`. §27 removed that. This is the first shape to actually use it.

**Its box is the disc, not the section** — anchored past two edges on
purpose. §29 is the counter-example and the reason that sentence is in this
document twice.

**Sized three times before it was right**, and both failures are the same
mistake in opposite directions:

- at `112vw` it covered the headline and the section read as a blue panel
  with type on it;
- scaled for the phone at `135vw` it did the same thing again at 390px;
- below the breakpoint at desktop values it collapsed to a ~250px blob
  sitting in the corner, which is not a disc sweeping out of it.

It is `63vw` capped at 900px above 620px wide, and `100vw` capped at 470px
below — and the breakpoint is 620 rather than 760 because at 760 the phone
values push the disc almost entirely off-canvas.

### Two filled pills now — and it is three, see §38

§27 recorded that `.svc-why`'s pill is "the only filled pill on the page,
which is what marks it as the ask". **That is no longer true** — this section
carries a second one, because the mock draws it filled and because it is the
page's actual closing. The claim in §27 stands as history; the page now has
two filled pills and one of them is no longer unique. Worth a decision:
either the closing is the only filled one, or the device has stopped marking
anything.

**This heading undercounted at the time it was written and was left standing
as the record.** `.svc-plan`'s pill (§29) was already there, so the page had
**three**, not two. Corrected in §38 along with the site-wide count.

### The arc, again

This mock draws the same faint curve top-right that the price mock does. Not
built, for the reason in §29 — it is the thing that was already rejected on
this page's hero. One answer from the client settles both sections.

### Verified

- Whole-page row scan at 1440: **30 full-width hard rows on the page and all
  30 are intentional 1px rules** — the pillar hairlines, the six step rules,
  the three proof rules, the rail's two, and the footer's top border. None in
  `.svc-close`, none at any section boundary. Method in §29.
- Headline sets as two lines at 1440 and 1024; wraps to four at 760 and 390,
  one sentence per pair, which is correct.
- The blue crosses into the footer at 1440, 760 and 390.
- Nothing in the section overflows at
  360/390/500/760/820/900/1024/1440/1920.
- `shared.css` comment terminators balanced.

**One known root-overflow, unchanged and by design:** `.svc-price-glow` and
`.svc-hero-orb` both extend past the right edge of the document, so
`document.scrollWidth` exceeds the viewport on this page. `html {
overflow-x:clip }` is what makes that safe, and §28 explains why this page
differs from the other four. Do not "fix" it by clipping a section.

---

## 31. The about page comes over to the page-level backdrop

Second of the five pages converted. The client asked for it next, and asked
that the lights stay where they are — so this is a conversion, not a
redesign, and the proof below is that the two big lights did not move at all.

### What changed

| Section | Was | Now |
| --- | --- | --- |
| `.about-hero` | `relative; isolation; overflow:clip` | `relative` |
| `.about-conviction` | `relative; isolation; overflow:clip` | `relative` |
| `.about-founder` | `relative; isolation; overflow:clip` | `relative` |
| `.about-courage` | `relative; isolation; overflow:clip` | `relative` |
| `.about-studio` | `relative; isolation; overflow:clip` | `relative` |
| `.about-stats` | `relative; isolation; overflow:clip` | `relative` |

The three glows lost `.glow-soft` and their boxes grew. **The hero's
`isolation` was the expensive one** — it made the hero a private compositing
group the conviction glow below could not reach into, which is the opposite
of what that glow is for: §25 describes it as spill from this photograph.
Neither the photograph nor its scrim needed the clip; both are `inset:0` and
cannot overflow.

### The box transform, which is exact and height-independent

Each glow was `inset:0` with `.glow-soft` hiding the cut. The element is now
larger than its section, with the gradient remapped so the light lands in
exactly the same place:

> For a box grown with `inset:-a% 0 -b% 0` — so `(1 + a + b)` times the
> section height — a gradient stays put when its vertical centre `p` becomes
> `(p + a)/(1 + a + b)` and a vertical radius `r` **expressed as a share of
> the box** becomes `r/(1 + a + b)`.

Horizontal values are untouched because the element's width does not change.

| Glow | Was | Box | Now |
| --- | --- | --- | --- |
| conviction | `34% 38% at 50% 17%` | `-25% 0 0` | `34% 30.4% at 50% 33.6%` |
| studio | `58% 94% at 4% 30%` | `-60% 0 -20%` | `58% 52.22% at 4% 50%` |
| stats | `44% 58% at 92% 24%` | `-35% 0 0` | `44% 42.96% at 92% 43.7%` |

**The overhang is per-glow, not a constant.** This shipped first as a blanket
`inset:-70% 0` on all three, which was right here by luck and wrong on
contact — §33. Each `a` and `b` is now sized to that light's own falloff:
the studio glow's vertical radius is 94% of its section, so its light reaches
53% above and 13% below and it needs the largest box; conviction and stats
both finish inside their own section at the bottom and take `b = 0`.

### Verified by measuring the rendered light, not by looking

Page height, section boundaries and all ten section positions are **byte-for-byte
identical** before and after. Then, sampling channel spread (which isolates
coloured light from white type and black ground) down the whole page at 1440:

| Glow | Peak before | Peak after |
| --- | --- | --- |
| studio | y=3532, x=56, 164 | y=3532, x=56, 162 |
| stats | y=5026, x=1320, 151 | y=5026, x=1320, 151 |
| conviction | y=1000, x=712, 64 | y=898, x=720, 87 |

Studio and stats are unmoved to the pixel. **Conviction's peak "moved" because
`.glow-soft` had been erasing its core** — §25 warns about exactly this: "a
core written at the edge is masked away". Its centre is at 17% of the section
and the mask erased the top 15%, so what was visible was the shoulder of the
light, not the light. Uncut, the core shows at its authored position and the
glow is brighter — 87 against studio's 162 and stats' 151, so it is still
comfortably the quietest warm on the page, which is what §25 asks of it. The
headline sits below the core and is not lit from behind.

The 93 rows whose colour changed are all within 100px of a section boundary,
in the two places where the light now continues instead of stopping: the
hero/conviction seam and the team/studio seam.

### Also verified

- **Whole-page hard-row scan (§29): 32 flagged rows, none on a section
  boundary.** All are intentional 1px rules — the team and studio grid
  borders, the stats grid border, the rail's two, recognition, the five
  standard rows, and the footer's top border.
- `document.scrollWidth` equals the viewport at
  360/390/500/760/820/900/1024/1440/1920 — **no root overflow at any width**,
  unlike the service page (§28), because nothing here is anchored outside
  the viewport.
- `index.html`, `contact.html` and `process.html` differ only in the `?v=`
  hashes and §28's `theme-color`.

### What this does to §25's rule

§25 says **no two adjacent sections may carry a glow on the same side**,
because "they clip independently, so they cannot share a gradient — they can
only collide". That reasoning no longer applies to this page: nothing clips,
and two neighbouring lights now blend instead of colliding. The courage
section's glow was deleted under that rule and could in principle come back.

**It has not been brought back, and the rule is left standing.** Three lights
is what the page was signed off with, the client asked for the lights to stay
where they are, and §6 already lists "whether three is the right number" as a
design call nobody has made. Reopening it belongs to a design pass, not to a
conversion.

### Still open

- **`index.html` and `contact.html` are the last two per-section pages.**
  `.glow-soft` is now marked legacy in `shared.css` and is only kept alive
  for them; delete the rule when they come over. The homepage is the
  signed-off page and the one §12 holds at 0 differing pixels, so it wants
  its own careful pass.
- `.hero`, `.spot`, `.fudge`, `.closing`, `.belong` and the `.contact-*`
  sections still carry `isolation` and `overflow:clip`.

---

## 32. The contact page comes over

Third of five. Same transform as §31, two glows, and one trap that would
have destroyed the light if the transform had been applied mechanically.

`.contact-top` and `.contact-body` are `position:relative` and nothing else.
Both glows went from `inset:0` + `.glow-soft` to a box sized to their own
light, with the gradients remapped by §31's formula.

`.calendly-panel` keeps its own `overflow:hidden`. That contains a
third-party iframe inside a drawn outline and has nothing to do with section
clipping — the same distinction as `.footer-light` in §27.

### The trap: check the unit before you divide

`.contact-top-glow` is two layers and **they do not transform the same way**:

| Layer | Vertical radius | Transform |
| --- | --- | --- |
| core | `circle 30vw` | **radius unchanged**, centre remapped |
| atmosphere | `ellipse 58% 70%` | radius ÷ 2.4, centre remapped |

A `vw` radius is absolute — it does not scale with the element — so dividing
it by 2.4 would have shrunk the core to 12.5vw and thrown away most of the
light while the surrounding haze stayed put. §31's formula applies to radii
expressed **as a share of the box**, and only to those. Read the unit first.

| Glow | Was | Box | Now |
| --- | --- | --- | --- |
| top, core | `circle 30vw at 88% 42%` | `-50% 0 -35%` | `circle 30vw at 88% 49.73%` |
| top, atmosphere | `ellipse 58% 70% at 95% 30%` | — | `ellipse 58% 37.84% at 95% 43.24%` |
| body | `ellipse 42% 46% at 2% 74%` | `-10% 0 -28%` | `ellipse 42% 33.33% at 2% 60.87%` |

(These are the corrected figures. The first pass used a blanket `-70% 0` and
broke the footer — §33.)

### Measuring this page needs Calendly blocked

A before/after sweep reported the page 99px taller and every light moved by
hundreds of pixels. None of that was real: **the Calendly iframe resolves to
a different height between loads**, which moves everything below it, and the
brightest thing on the lower half of this page is the footer's own glow, not
the section's. §27 already notes contact differing by "Calendly loading
dots"; this is the same instability with teeth.

Two fixes, both worth reusing:

1. `Network.setBlockedURLs(['*calendly.com*'])`, so the panel holds its fixed
   height and the designed fallback renders. Layout is then deterministic.
2. **Compare both formulations inside one page load** rather than across two
   runs — set the old `inset`, `mask-image` and `background` back onto the
   element from script, measure, restore, measure. The glows are
   `position:absolute`, so toggling them cannot reflow anything, and every
   other variable is held identical by construction.

### Verified

Measured that way at 1440, sampling channel spread:

| Glow | Old formulation | New |
| --- | --- | --- |
| body (blue) | peak row 746, x=384, sat 206 | **identical: 746, 384, 206** |
| top (red) | peak row 303, x=1266, sat 122 | 298, 1272, sat 122 |

The blue is unmoved to the pixel. The red's 5px shift on a 719px section is
`.glow-soft` no longer dragging the apparent peak down from a faded top
edge: its visible extent goes from rows 39–636 to **7–646**, so it now runs
behind the header and on down across the section join, which is the whole
point.

- **Whole-page hard-row scan: two flagged rows, 1886–1887 — the footer's top
  border.** Nothing at the `.contact-top` / `.contact-body` boundary.
- `document.scrollWidth` equals the viewport at
  360/390/500/760/820/900/1024/1440/1920, with zero overflowing elements.
- `shared.css` comment terminators balanced.

### Only the homepage is left

`.glow-soft` is now used by **`index.html` alone**. Delete the rule when the
homepage comes over, along with `.hero-light`'s one-sided variant of the same
idea.

The homepage is the harder one and it is deliberately last:

- it is the signed-off page, and §12 holds it at **0 of 22,821,120 differing
  pixels** as a standing regression baseline — converting it moves that
  baseline on purpose, so the number has to be re-taken rather than defended;
- it carries five glows, not two;
- `.hero`, `.reel`, `.spot`, `.belong`, `.fudge` and `.closing` all isolate
  and clip, and **the reel's is not about shapes**: it is a 260vh sticky
  stage with a masked aperture, so its stacking context needs checking rather
  than assuming;
- `.hero` also paints `linear-gradient(var(--ink-deep) 0 78%,var(--ink))`,
  which §28 flattened to a single black — that gradient is now an opaque
  fill doing nothing, and an opaque fill is the third thing §27's contract
  forbids on a section hosting a shape.

---

## 33. The footer edge, and why a blanket overhang was wrong

Reported by the client on the contact page: the footer's light stopped at a
hard horizontal line partway down, with flat black below it and the wordmark
running on past the edge.

### What it was

```
document scrollHeight : 2610
body bottom           : 2511   <- footer ends here
.contact-body-glow    : bottom 2609
```

`.contact-body` is the **last section before the footer**, and §32 gave its
glow a blanket `inset:-70% 0`. 70% of that 1112px section is 778px of
overhang, which reached 99px past the bottom of `body`. Below `body` there is
no page fill and no glow — only `html`'s flat black — so the light stopped
dead at `body`'s edge, and the extra 99px became dead scroll at the end of
the document.

**This is the exact failure §27 already documents for `.footer-light`**,
which keeps its `overflow:hidden` for this reason and no other. It was
reintroduced one page over. `.contact-body` previously had `overflow:clip`,
which is precisely what had been hiding it.

### The rule the blanket number was missing

An uncut glow needs a box bigger than its section. It also needs a box that
**stops inside the document**. Both, not either:

> 1. the box must contain the light's own falloff on every side;
> 2. the box must not reach past the bottom of `body`.

So the overhang is per-glow and asymmetric, sized from where that gradient
actually fades out, rather than one number applied to all of them. A glow
whose light finishes inside its own section at the bottom takes `b = 0`.

All five converted glows were re-sized (§31 and §32 tables carry the
corrected figures), and `.svc-close-blue` on the service page was caught by
the same check: its `width` was capped at 900px but its `bottom:-42vw` was
not, so above a 1429px viewport it kept dropping and at 1920 reached 32px
past `body`. It is `calc(-1 * min(42vw,600px))` now — **cap both or neither.**

### The check to run, which is cheap and catches all of it

```js
document.documentElement.scrollHeight === document.body.getBoundingClientRect().bottom + scrollY
```

Any gap is dead scroll and a light that stops before the page does. Run it at
several widths — this only appeared at 1920 on the service page — and list
any decorative element whose `bottom` exceeds `body`'s. Current state, at
390/768/1440/1920: **zero dead scroll on all five pages, nothing past the end.**

### A process mistake worth not repeating

The first fix was applied with sequential string replacement on a line that
was **identical in all five rules** (`inset:-70% 0;`). Each replacement hit
the first remaining match in file order, not the rule intended, so the five
boxes were scrambled across the five gradients — conviction got contact-top's
box, studio got conviction's, and so on. The gradients were keyed on unique
strings and went to the right places, which made the result look plausible
and measure wrong.

It was caught by asserting the authored position rather than eyeballing:
compute where each light's centre *should* be in document coordinates, read
where it *is*, and require the difference to be 0.

| Glow | Error after the scramble | Error now |
| --- | --- | --- |
| conviction | −32px | **0** |
| studio | +47px | **0** |
| stats | +137px | **0** |
| contact top | — | **0** |
| contact body | — | **0** |

**Edit CSS rules by selector, not by a string that repeats.** And verify a
geometric change by asserting a number you derived independently, not by
re-reading the file you just wrote.

### Re-verified after the correction

- About: page height and all ten section boundaries unchanged; studio peak
  back to y=3528 (sampling step 4) and stats to **y=5028 exactly**, both at
  their original intensity. Conviction still reads 896/84 against the
  original 1000/64 — the expected §31 change, its core no longer masked.
- Contact: both glow centres land at their authored document positions to
  **0px**; the footer light now runs to the end of the document with no edge.
- Zero dead scroll on every page at every width tested.

---

## 34. The process page comes over

Fourth of five. One section, two kinds of shape, and the conversion delivered
a thing §26 explicitly wanted and could not have.

`.process` is `position:relative` and nothing else. It gave up `isolation`,
`overflow:clip` **and** `background:var(--ink)` — all three of the things §27's
contract forbids, and this was the only section on the site still carrying the
full set.

### The note that said all three were load bearing was right, and is now wrong

§26 argued the background and the isolation could not be removed: the blue
blends with `screen`, and screen only cancels its black surround if there is
something to screen *against*. Without a backdrop the surround composites
toward transparency, stays black, and paints a dark halo over the page. The
clip followed from the same fact — a shape crossing the bottom edge leaves the
backdrop and the halo comes back over the footer.

**That was true of a page where `body` was not the compositing group.** It
is not true now. `body` carries `isolation:isolate` and `background:var(--ink)`,
so a shape at `z-index:-1` screens against the page's own black exactly as it
used to screen against the section's — the arrangement `.svc-process-blue`
already runs on. No halo appeared. The argument was sound and its premise
expired; §27 is what expired it.

### What the clip was costing

The blue was being guillotined at the section/footer boundary. Measured on the
shipped build at 1440, sampling blue excess (`B - max(R,G)`) by row:

```
row 1100 : 147     row 1120 : 0      <- the section boundary
```

Full strength to nothing in 20px, a hard row 42% of the page wide with a mean
channel delta of **57.6**. §26 wrote that the blue was "meant to carry on down
behind the footer and the wordmark, as one light" and that a clip "would cut it
flat at the footer boundary". It was describing the defect the same rule had
already shipped.

After: `1100:147  1120:148  1150:148  1200:147  1300:148  1400:150`. Continuous
across the join and on down behind the wordmark.

### The light did not get brighter, it got bigger

| | before | after |
| --- | --- | --- |
| blue peak | 148 at y=1089 | 151 at y=1358 |
| pixels with blue excess > 18 | 117,377 | **239,991** |
| pink-ish pixels | 448, first at y=451 | 470, first at y=451 |

**Peak intensity is unchanged (148 → 151).** What doubled is extent: the disc
was 71% hidden, so most of it is simply visible for the first time. Anyone
reading this as "the blue was turned up" has the wrong model of the change.

**§26's pink risk did not materialise.** Twenty-two pixels on a 2.6M-pixel
page, and the first of them is at y=451 where the blue measures 27 — they are
the red spheres' own saturated pixels, not blue contamination. The blue still
sits below the climb; its box rises to y=680 but its light does not.

### The box is capped twice, which §33 requires

`bottom:-62%` was 62% of a section that is most of the page. At 1440 that put
the box bottom at **1814 against a `body` bottom of 1799** — already 15px past
the end of the document, and further at every wider viewport. Invisible while
the section clipped; uncut it is §33's defect exactly.

It is `bottom:calc(-1 * min(62%, 540px))` now. **Cap both or neither.** 540px
lands the disc's centre on the section/footer join, which is what makes it read
as one light crossing the boundary rather than two lights meeting at one.

### Verified

- **Zero dead scroll and nothing past `body`** at
  360/390/500/620/760/820/900/1024/1040/1440/1680/1920.
- **Hard-row scan at 1440: y=1120 is gone.** What remains is the header
  border (100%), the footer top border (92%) and three display-glyph rows.
  At 390 and 760 the only high-coverage rows are the header border, the four
  `.process-step::before` hairlines (78%) and the footer border (89%) — all
  intentional 1px rules.
- **Footer text contrast over the blue: worst 9.07:1**, on "Brand, content and
  sales for founders…" against rgb(50,34,200). Every other footer string is
  9.4:1 or better. The blue is saturated but dark in luminance, which is why it
  can sit under copy at all.
- The other four pages differ **only in the `?v=` hash** — verified by
  rebuilding against the stashed stylesheet and diffing, not by assuming.
- `shared.css` comment terminators balanced (315 comments, 0 unterminated).

### A known root overflow, invisible and left alone

`document.scrollWidth` exceeds the viewport at 360/390/500/620 — 377 against
360, and so on. It is **not** a layout fault and nothing visible crosses the
edge: the brightest pixel in the rightmost three columns is **36, and it is the
header's bottom border**; only 3 pixels there exceed 24 on the whole 2131px
page.

The cause is worth knowing because it will mislead the next measurement.
`.process-orb` carries `transform:rotate(var(--spin))`, and
`getBoundingClientRect` on a rotated element returns the **axis-aligned box of
the rotated square** — a 219.6px square at 118° measures ~297px wide. The
asset's disc is inscribed in that square and the `closest-side` mask erases the
corners, so the part sticking out past the viewport carries no artwork at all.
`overflow:clip` on the section used to absorb it.

Left as is. `html { overflow-x:clip }` prevents a scrollbar, the same licence
§28 gives the service page, and the alternative is shrinking the spheres at
narrow widths to satisfy a number that corresponds to nothing on screen.
**Do not "fix" it by re-clipping the section.**

### A gap in the §29 scan, worth fixing before the homepage

**The full-width hard-row scan would not have caught this defect.** The blue
spans 42% of the page, so the cut at y=1120 covered 42% of the columns and a
scan thresholded at 90% coverage reported the page clean. It showed up only
when the threshold dropped to 25%.

A glow anchored off one side is cut across its own width, not the page's. Scan
for **a run of columns that all change together**, not for a row that changes
everywhere — or run the scan at 25% and read the geometry of each hit. The
homepage's five glows are mostly off-centre, so this matters there.

### Only the homepage is left

`.glow-soft` is used by `index.html` alone; `.hero-light` is its one-sided
variant. Delete both when the homepage comes over. The reasons it is last are
unchanged and listed in §32.

## 35. The first case study

`case-gerd-bommer.html`, the sixth page and the first of a new kind. It is
also the template: **there is deliberately no templating machinery.** A
second case study is a copy of `src/case-gerd-bommer.html` with its content
swapped, and all the layout lives in the `.case-` block at the end of
`shared.css`, so it should need no new CSS. A build-time template was
designed and rejected — this is a concept design that gets rebuilt in Divi
once it is signed off, and a data-driven page type would be thrown away at
that boundary. Do not add one back without being asked.

### The design arrived as runnable source, not as screenshots

The client supplied a folder containing 18 images, a 7-page PDF and an
11 MB zip. **The zip is the design.** It is a design-tool export carrying
`Main.dc.html` — the entire page, with the copy, the measured type sizes
and the inline geometry — plus an `assets/` folder holding her own crops of
every photograph.

Two consequences, and both cost time to discover:

1. **Use her crops, not the camera originals.** The raw files are 4–6 MB
   phone and camera frames; the export's are framed for the composition.
   Where both existed the export's won.
2. **Transcribe from the export, not from a rendering of it.** Her hero glow
   is the BLUE sphere and the closing takes blue and red. Lit at these
   brightnesses the two read alike on screen, and the first pass put red in
   the hero by eye. The asset files settle it; a screenshot does not.

Assets live in `case-studies/<slug>/`, with the originals, the PDF and the
zip under `case-studies/<slug>/_originals/` — gitignored, the same
arrangement `rysing brand assets/` has. 17 webp at 2.9 MB are in the repo;
107 MB are not.

### Three defects in the mock that are fixed rather than reproduced

**A mock's intent is the authority; its layout bugs are not.** All three
look like design decisions until measured, which is why they are listed:

| In the export | Why it is wrong | What ships |
| --- | --- | --- |
| Hero is `flex: 3 1 420px` + `2 1 300px`, no measure on the `<h1>` | At desktop widths "UNTAMED" runs under the portrait | Explicit grid columns; the text column cannot spill. A longer client name wraps instead of colliding |
| Both bike details boxed `4/3` under `object-fit:cover` | Slices the top line off the side panel — the lettering is the only reason those frames exist | Uncropped, at their own ratio |
| Logo grid sets `height:100%` on one cell against `aspect-ratio:1` on its neighbour | The two rows come out different heights, breaking the colour-swap pairing the copy describes | The bolt cell is square and the wordmark's ratio follows from the artwork (2.29:1), asserted once |

**And her hero carries `overflow:hidden`**, so her glow is cut flat at the
section seam. Ours follows §27 and runs through it. This one caused a round
trip: the cut was reported as a defect in our build and turned out to be the
mock on the other port. If a glow cut is reported, **confirm which page is
on screen before changing anything** — the two are the same page at a
glance.

### Photographs take the grade; artwork never does

`--photo-grade` pulls saturation to .62. That is right for the portrait, the
stage shot, the bike and the testimonial, which come from different cameras
and decades. It is wrong for everything else on this page: the logo
lockups, the three website screens and the three LinkedIn posts are **Gerd's
royal blue and sharp yellow**, and grading them mutes the exact thing the
section exists to present as evidence.

This is the first page on the site showing another brand's colours, so the
rule is new and easy to miss. `.case-shot` and `.case-pair img` take the
grade; `.case-trio` and `.case-logos img` must not.

### The narrative three-up is a cascade, and it is the second attempt

About, the brief and the strategy are the page's only purely verbal
stretch. As three stacked heading-left rows they ran to three screens with
nothing to look at before the first photograph.

The first rebuild made them a flush three-up on the `.svc-pillars` hairline.
**It was rejected, and the reason matters more than the verdict:** the three
run to very different lengths, so level tops left a pit of dead air under
the middle and right columns, and three short rules floated with nothing
binding them.

The columns now **step down** — the second by ~78px, the third by ~156px,
scaling with the viewport. The same inequality becomes the composition: the
block reads as a descent rather than as a grid that failed to line up. A
ruled-column alternative (vertical hairlines, flush tops) was built
alongside it and removed.

The step is bound to the **slot**, not the item, which is the rule
`.svc-get-list` already follows for its own `--lift`: the rhythm belongs to
the row, so it survives the copy being reordered. Below 980px the steps come
off with the columns — stacked, a top margin is not a cascade, it is three
different gaps between the same three things.

Numerals are **Aileron 300**, the face and weight the homepage service
numerals take (§3 of the settled decisions); the didone never sets a numeral
on this site. They are muted because a counter is not a heading. All three
remain real `<section>` elements with their own `<h2>` — the grid changed
how they sit, not what they are.

**Do not flatten the steps.** Level tops is the version that was tried and
thrown out.

### Departures from the mock that are still the client's to rule on

- **It carries the shared header and footer.** Her design drops the site
  chrome for its own small wordmark and a bare closing arrow. A case study
  is not a separate website, so the normal chrome went on and her "CASE
  STUDY" tag became the hero eyebrow.
- **The hero headline has no Aileron run.** "UNTAMED ENERGY" is set
  entirely in the didone, as she draws it — the only hero on the site
  without the alternation. Transcribed, flagged, not corrected.
- **The tags are `.case-tag`, not `.btn-pill`.** Ten outlined pills that
  look like buttons and are not would read as ten controls. Same geometry,
  hairline border, no hover.

### Open

- **The Result section still holds her own placeholder** —
  `[ONE RESULT: FOLLOWERS, REACH, BOOKINGS OR INBOUND SINCE LAUNCH]`, drawn
  dashed as she drew it. It is the page's only hard outcome.
- **Nothing links to the page.** The homepage's selected-work gallery is the
  obvious home. Two finished pages — this and the service page — are
  currently unreachable from the site.
- The hero's blue lights the second and third columns of the cascade and not
  the first. Left as is: the descent runs down into the light. Pulling the
  orb's reach up is a two-line change if it is ever unwanted.
- `gerd-runways-infographic.webp` is in the repo and unused — supplied, but
  her design does not place it.

---

## 36. The homepage comes over, and the backdrop conversion is finished

Fifth of five, last and hardest, and the reasons it was left until last
(§32) were all real. `index.html` was the signed-off page, it carried five
glows rather than two, `.reel` was the one stacking context nobody had
checked, and `.hero` painted an opaque fill that §28 had already flattened to
a single black.

**`.glow-soft` is deleted.** So is `.hero-light`'s one-sided variant of it.
No page masks a glow at its own section edge any more, and the rule is gone
from `shared.css` rather than left standing. **Do not bring it back:** a glow
that needs masking at its own edge is a glow whose box is the wrong size.

### What changed, by section

| Section | Was | Now |
| --- | --- | --- |
| `.hero` | `relative; isolation; overflow:hidden;` + opaque gradient | `relative` |
| `.reel` | `relative;` + `background:var(--ink)` | `relative` |
| `.stats` | `relative; isolation` | `relative` |
| `.belong` | `relative; isolation; overflow:clip` | `relative` |
| `.spot` | `relative; overflow:hidden;` + `background:var(--ink)` | `relative` |
| `.fudge` | `relative; isolation; overflow:clip` | `relative` |
| `.closing` | `relative; isolation; overflow:clip` | `relative` |

### The hero's three forbidden things were load bearing *together*

This is the part that would have gone wrong done piecemeal. `.hero` carried
all three of the things §27's contract forbids, and **removing the isolation
alone would have deleted the hero's lights outright.**

`isolation` made `.hero` its own stacking context, which is the only reason
its opaque background painted *under* the `z-index:-1` lights. Without it the
lights join `body`'s stacking context and paint behind every in-flow box in
it — `.hero`'s own background included. So the fill had to go in the same
edit or the hero would simply have gone black. It cost nothing: it read
`--ink-deep 0 78%, --ink 100%` and §28 resolved both tokens to `#000000`, so
it was a flat black fill painted by a gradient.

**`.reel` had to give up its `background` in the same edit, for the same
reason at the other end.** It was `var(--ink)` — the same black `body`
already paints — but an opaque fill on an in-flow box paints *above* a
`z-index:-1` shape, so the moment `.hero` stopped clipping, `.reel` took over
the cutting and the hard line stayed exactly where it was. Removing it lets
the hero's blue run ~158px down into the top of the reel and fade out there.

**And the reel's stacking context, which §32 flagged as the unknown, turns
out not to exist.** `position:sticky` creates none without a `z-index`, and
`.reel-stage`'s `overflow:hidden` is a non-section clip for the sticky
aperture — the same distinction `.footer-light` keeps. Neither touches a
child of `.hero`. The aperture, the mask and the grade are unaffected;
verified by eye at mid-opening and by the unchanged hard-row scan.

### The box transforms

§31's transform, unchanged: for a box grown `inset:-a% 0 -b% 0`, a gradient
stays put when its centre `p` becomes `(p + a)/(1 + a + b)` and a vertical
radius **expressed as a share of the box** becomes `r/(1 + a + b)`.

| Glow | Was | Reached | Box | Now |
| --- | --- | --- | --- | --- |
| `.fudge-glow` | `38% 58% at 96% 64%` | 122% | `0 0 -24%` | `38% 46.77% at 96% 51.61%` |
| `.closing-glow` | `38% 42% at 10% 76%` | 118% | `0 0 -20%` | `38% 35% at 10% 63.33%` |
| `.belong-glow` | `46% 46% at 50% 47%` | 93% | **unchanged** | **unchanged** |

**`.belong-glow` needed no box change and that is worth knowing**, because it
is the only glow on the site that was already built to §29's rule: 46%
centred at 47% reaches 1%–93% of its own box, so the light finished inside
the element and nothing was ever cutting it. Only `.glow-soft` was, at its
outer shoulders.

`.closing` is the last section before the footer, which is where §33's
dead-scroll bug lives. Checked rather than assumed: 20% of a 737px section is
147px, the footer below it is 679px, so the box ends 532px inside the
document — and that margin holds at every width because both terms scale
together.

### Two defects the conversion exposed rather than caused

Both were hidden by the mask, and both are the same shape of bug: **a value
capped on one axis and not the other.**

**1. The hero's discs were offset from the viewport height and sized from the
viewport width.** `width:min(72vw,1020px)` against `top:-24vh`;
`min(62vw,860px)` against `bottom:-30vh`. Those do not scale together, so at
a narrow viewport the offset stays large while the disc shrinks and the light
walks off the section: **at 390px the blue sat entirely below the hero**, a
242px ball floating in the top of the showreel. The mobile hero had shipped
with no blue at all, because the one-sided mask reached zero at the hero's
bottom edge and deleted it. Neither state is the composition the design
draws.

Each offset is now capped against the disc's own diameter, held in `--d`:
`top:calc(-1 * min(24vh, var(--d) * .212))` and
`bottom:calc(-1 * min(30vh, var(--d) * .314))`. **The multipliers are read
off the authored desktop values, not chosen** — at 1440x900, 24vh/1020px =
.212 and 30vh/860px = .314 — so wherever the viewport is tall enough for the
vh term to win, which is every desktop and laptop size, the result is
identical to the pixel. The cap only engages where the disc has shrunk, which
is where it was broken. §33 names the general form: **cap both or neither.**

**2. `.belong-glow` was 4.5% wider than the page at the top of its breathe.**
`inset:0` plus `scale(1.045)`. While `.belong` clipped, that was contained;
uncut it became 8px of real horizontal scroll at 1440. The box is inset
2.153% each side now — 95.694% x 1.045 = 100.0% exactly — and the horizontal
radius re-expressed as a share of the narrower box, 46 / 0.95694 = 48.07%, so
the light is the same size at rest and at full breath alike. The vertical
radius is untouched; only left and right were inset.

### `html { overflow-x:clip }` does not stop horizontal scrolling

**§27's verification of the service page says "no horizontal overflow… read
that as *no horizontal scrolling*, which is what matters and what was
checked". That does not survive measurement.** On
`communication-strategy.html` today, `window.scrollTo(400,0)` lands at
**scrollX = 400**: the page really can be pushed sideways into dead black
with a trackpad. `overflow-x:clip` suppresses the scrollbar; it does not
suppress the scroll.

The homepage's own version of this was 204px at 1440, from the uncut hero
discs. It is fixed **on the shape container, not on the section** —
`.hero-light` takes `overflow-x:clip; overflow-y:visible`, which is the same
licence `.footer-light` has to clip for its own reason. `clip` is the one
overflow value that does not coerce the other axis, so the blue still reaches
down into `.reel`; **`overflow:hidden` here would put the cut straight back.**
The cut lands exactly where the viewport already cuts, this element being
`inset:0` on a full-width section, so nothing visible changes.

`index.html` is now the only converted page with **no root overflow at all**.
`communication-strategy.html` still scrolls 400px sideways and
`process.html` 17–88px at 360–620. Not actioned — flagged below.

### Verified

Measured at 1440 against the shipped build, with the fixed header hidden for
the pixel sweep (see the harness note below):

- **Page height, `body` bottom and all sixteen section boundaries are
  byte-for-byte identical.** 14985 → 14985.
- **All eight authored light centres land at their original document
  positions, to 0px** — §33's assertion, computed from each box and its
  `at X% Y%` rather than read off the file that was just written:
  hero red (1132,294), hero blue (171,740), belong (720,11720), fudge
  (1382,13322), closing (144,14129), both footer lights, and the spot scrim.
- **Hard-row scan at 25% coverage: 162 rows before, 162 after, the same set,
  no new ones.** The only hit on a section boundary is y=3240, which is the
  reel poster's own image edge and predates this work.
- **Only 810 of 14,985 rows changed colour at all**, in exactly three runs,
  and every one is a boundary where light now continues instead of stopping:
  634–1169 (hero→reel, the big one, +32.9), 13477–13613 (fudge→closing,
  +3.1), 14203–14339 (closing→footer, +4.2).
- **Zero dead scroll, nothing past `body`, and `scrollWidth` equal to the
  viewport** at 360/390/500/620/760/820/900/1024/1280/1440/1680/1920.
- **`about.html` is pixel-identical** — zero rows differing in mean colour —
  with page height and sections unchanged, measured by stashing the cycle,
  rebuilding and re-measuring rather than by assuming. The other four pages
  differ only in the `?v=` hash. No other page uses the bare `.hero`,
  `.reel`, `.stats`, `.belong`, `.spot`, `.fudge` or `.closing` selectors;
  they are all prefixed (`about-hero`, `svc-hero`, `case-hero`).
- `shared.css` comment terminators balanced, 355 open and 355 closed.

Three light peaks rose, all for §31's conviction reason — the mask had been
erasing their cores, so they now read at the strength they were authored at:
hero blue 126 → 142, closing red 86 → **123** (§11 wrote that this glow sat
at 98% and was "buried under the bottom fade"; it was moved to 74% to escape
that mask, and now the mask is gone), belong 92 → 99. Hero red, fudge blue
and the footer are unchanged to within 1.

### A harness trap that cost two dead runs

**Opening a second tab backgrounds the first, and Chrome throttles
`requestAnimationFrame` to nothing in a background tab.** The pixel decoder
is its own target, so the page under test stopped getting frames and the
reveal sweep's `await requestAnimationFrame` never resolved — the run hung
with no output and no error. A smoke test passed because it happened to
create the decoder *after* the sweep.

`Page.bringToFront` before any rAF work or any capture is the fix; racing
every frame wait against a timeout is the belt to its braces. Worth knowing
because every measurement in §31–§34 used a single tab.

**And the fixed header smears across a document-coordinate scan.** Viewport
captures translated to document coordinates paint the header's 1px bottom
border at the same viewport offset every time, so the hard-row scan reported
**16 full-width phantom rows at y ≡ 91 (mod 900)** — 199 hits dropping to 162
once `.site-head`, `.skip-link` and `.menu-overlay` were hidden for the sweep.
§5 records the same artifact from the other direction, a `fullPage` stitch
painting the skip-link back in. Hide the fixed chrome before scanning; it
hosts no shape.

### Open

- **`communication-strategy.html` scrolls 400px horizontally**, and
  `process.html` 17–88px at 360–620. Same fix as the hero's — clip the shape
  container on the horizontal axis only, never the section. Not done here
  because this cycle was the homepage.
- **The mobile hero now shows blue where the signed-off page showed none.**
  The cap puts it where the design draws it, but the client has only ever
  seen the masked version on a phone. Worth one screenshot to her.
- **§12's regression baseline is void.** It held `index.html` at 0 of
  22,821,120 differing pixels; this cycle moves it on purpose. The numbers
  above are the new baseline and were taken the same way.
- **`.hero-light` is now the only element on the site with `overflow-x:clip`
  and `overflow-y:visible`.** If anyone "tidies" that to `overflow:hidden`
  the hero's blue is cut at the reel boundary again and the whole conversion
  is undone at its most visible point.

---

## 37. The orphan pages get wired up, and two more turn up

The open item was "nothing links to `communication-strategy.html` or
`case-gerd-bommer.html`". Auditing every local href across the six built
pages found that **`about.html` was unreachable too** — a finished page, the
one §2 calls "the live front", linked from nowhere on the site — and that the
homepage was **linking into `playground/`**.

Every local destination now resolves. `/blog` is the only 404 left and is a
pre-existing open item.

### What was wired

| Link | Was | Now |
| --- | --- | --- |
| Overlay nav, About | `{{home}}#founder` | `about.html` |
| Overlay nav, Services | `{{home}}#system` | `communication-strategy.html` |
| Work panel, Gerd Bommer | no `href` | `case-gerd-bommer.html` |
| Spotlight pill | `playground/rysing2.html` | `case-gerd-bommer.html` |

**The case-study panel was a one-attribute change and nothing else.** It
already drew "Learn more →" and already carried `TODO(link): case study page
does not exist yet`. `.work-item:focus-visible` rules were already written in
`shared.css` and could never fire, because an `<a>` with no `href` is not
focusable — the wiring was designed and left unfinished, not invented here.

### About and Services were a missed step, not a decision

§6 records that when `contact.html` was built "the nav Contact link was
repointed". The same was never done for About or Services. The evidence that
this was an oversight rather than intent is in `shared.css`:
`.overlay-nav a[aria-current="page"]` underlines the current page, `build.js`
applies that attribute by matching the href against the page being built, and
on `about.html` it **could not match**, because the link pointed at a
homepage anchor. The mechanism existed and two of the seven items never
reached it. Both underline correctly now.

**Services is a stopgap and should not be left as one.** The `#system`
accordion's four levels — Brand Building, Design & Websites, LinkedIn &
Instagram Marketing, Thought Leadership — are the real services list, and
**none of them is named Communication Strategy**. A nav item called Services
that jumps to one service page is wrong the moment the second service page
lands. It wants a services index; it has a reachable page in the meantime.
Raised and chosen deliberately, not derived.

### The homepage was linking into the archive

`.spot-copy`'s pill pointed at `playground/rysing2.html`. Every file in
`playground/` resolves its assets as `rysing-assets/…` **relative to the
repository root**, which does not work from one directory down — the 136
broken references §3 describes. So the live homepage was sending visitors to
an archived concept that renders with broken images.

It goes to the case study now. The section is headed "For keynote speakers"
and already carries Gerd's photograph, so it is the same subject, but **this
is a client's case study standing in for a service page** and the original
`TODO(link)` is kept on that basis: the section arguably wants a keynote
landing page, which does not exist.

**A consequence worth seeing before the client does.** §9 already flags that
`Gerd-Hero-Section-image.webp` appears twice on the homepage, in the
spotlight and in the case-study row. Those two places now also lead to the
same destination. If the repeat was tolerable as a repeated image, it is
weaker as a repeated image *and* a repeated link — §9's cheap fix, swapping
the row's first panel to Michael Diewald, would fix both at once.

### Verified

- **Every nav item clicked, from the homepage and from a sub-page**, not just
  fetched: all six land on the right document, the overlay closes, the
  `body` scroll lock is released, and `aria-current` lands on the right item.
  A 200 from `fetch` would not have caught a click handler swallowing the
  navigation — the overlay binds a listener to every `a` in it. It only calls
  `closeMenu()`, with no `preventDefault`, so navigation proceeds.
- Both content links clicked through to `case-gerd-bommer.html`, **no broken
  images** on arrival.
- Every local href on all six pages resolves 200, `/blog` excepted.
  `playground/` is no longer referenced from any built page.
- The five pages that were not the subject of this change differ only in the
  nav line, the partial's comment and the `?v=` hash.

**`src/_header.html` ships into all six pages, so its comments ship six
times.** The reasoning above is deliberately here rather than in that file,
which carries a five-line pointer. Same discipline `_marquee.html` keeps,
for the same reason.

### Still open

- **Services wants a services index**, not the one service page. See above.
- **The header's two "Apply to work with us" pills still point at
  `{{home}}#contact`**, the homepage's closing section, not at
  `contact.html`. §6 records that this was left deliberately because moving
  them changes the homepage's behaviour. Unchanged here; it is now the only
  chrome link still aimed at an anchor where a page exists.
- **The nav's Blog link still points at `/blog`**, which 404s on every page.
- **Four work panels still have no `href`** — OPS Detox, Finer Things,
  U4Success and Finance Consultancy — each with a `TODO(link)` saying the
  case study does not exist. They are the next case studies.
- **`#founder` and `#system` have lost their nav entries.** Both are still
  real section ids and still carry `scroll-margin-top`; nothing else links to
  them.

---

## 38. The filled-pill census, and what is actually left on the service page

No code changed in this entry. It exists because "clear the service page's
remaining markers" turned out to describe two unrelated things, one of which
nobody here can do, and because the running count of filled pills that §13,
§24 and §30 each added to had drifted from the page.

### The two `[__]%` are visible copy, not code markers

This is the part worth being plain about. `.svc-proof` sets three figures at
display size and **two of them render as literal `[__]%`** to anyone who
opens the page. They are not HTML comments and not a build-time token — the
build would fail on an unresolved `{{token}}` (§12); it has no opinion about
a bracket someone typed.

| Figure | State |
| --- | --- |
| `6–7×` | real, with its own `.svc-figure-x` story in §27 |
| `[__]%` | placeholder. Line beside it: "Over 50% of consumers recognise AI-written texts…" |
| `[__]%` | placeholder. Line beside it: "increase in revenue thanks to consistent brand presentation…" |

**Neither can be filled from this side.** They are statistics about consumer
behaviour and revenue on a studio's own marketing page; inventing either is
fabricating a claim the client would be standing behind. The second one's
supporting sentence already says "over 50%", which reads like a hint and is
not a number — do not round it into the bracket.

The honest options are her figures, or cutting those two columns and letting
`6–7×` stand alone. **Do not ship the brackets to a client review**; they are
the most visible unfinished thing on the site.

The third `TODO(copy)` on the page, `.svc-plan`'s "Save up to €1,400 with
KMU.Digital financing", is different in kind: it is transcribed exactly as
supplied and needs confirming, not writing. It is still the first financial
claim anywhere on the site.

### The filled pill has stopped marking the ask

§27 set the rule — one filled pill, and it marks the ask. The count has been
added to three times since, each time correctly and each time locally, and
nobody has stood back and counted. **Six, across four pages:**

| Page | Pill | Class |
| --- | --- | --- |
| `contact.html` | Send message (form submit) | `.btn-pill-solid` |
| `about.html` | Apply to work with us | `.btn-pill--solid` |
| `communication-strategy.html` | Book a call — `.svc-why` | `.btn-pill--solid` |
| `communication-strategy.html` | Book a call — `.svc-plan` | `.btn-pill--solid` |
| `communication-strategy.html` | Book a call — `.svc-close` | `.btn-pill--solid` |
| `case-gerd-bommer.html` | Book a call | `.btn-pill--solid` |

**§30's "two filled pills now" undercounted at the time it was written** —
`.svc-plan`'s pill from §29 was already on the page, making it three. That
heading is left standing with the correction beside it.

The service page is the sharp end: **four pills, three of them filled, all
four captioned "Book a call" and all four pointing at `contact.html`.** A
device used on three of four controls is not marking one of them.

This is a design decision and it is the client's, because her mocks draw them
filled — "fix" may well mean retiring the rule rather than changing the page.
Raised, not actioned.

### `.btn-pill-solid` and `.btn-pill--solid` both exist

One hyphen and two. Both fill the pill; they differ only in the hover border
— `rgba(249,249,249,.4)` on the double, `var(--paper)` on the single — and
the single also sets `cursor` and `font-family`, because it dresses a
`<button>` rather than an `<a>`.

`.btn-pill-solid` is used once, on the contact form's submit. Everything else
uses the double. **Nothing warns you if you reach for the wrong one**: the
pill still fills, and the only symptom is the wrong hover a few months later.
Worth collapsing into one rule plus a `button` selector next time this
corner is open — not done here, because it touches a signed-off form on a
page this cycle had no other reason to open.

### What the client needs to be asked, in one message

These four have been accumulating across §29, §30 and this entry, and each is
cheap to answer and blocking on its own:

1. The two `.svc-proof` percentages — or permission to cut those columns.
2. The €1,400 KMU.Digital claim — confirm amount and eligibility.
3. The faint arc the price and closing mocks both draw — one answer settles
   both sections, and a thin curved line was already rejected on this page's
   hero (§27).
4. Three filled "Book a call" pills on one page — keep, or let the closing be
   the only one.
---

## 39. The holding page

A one-screen page served **at** the domain **instead of** the site, while the
site is finished. `src/coming-soon.html`, built to `coming-soon.html`. It is
linked from nowhere and must not be: it is not a page of the site.

**It is the only page here with no header and no footer**, and the only one
that does not scroll.

**Three were built and one was chosen.** This section describes the one that
shipped; §41 records the two that were deleted, because two of the lessons
they produced are about this page's own lights and curves.

### What it is

The star climbs into frame from below, decelerating hard, and the wordmark is
uncovered by an edge travelling **upward** behind it — so the name is lit
from underneath as the star passes rather than appearing in place. The
studio's own verb, performed by its own mark. One gesture, once, then
stillness. ~4.3s.

**The order is causal and the timings exist to keep it that way.** The sweep
starts only once the star has climbed past the wordmark's line. Run them
together and they read as two animations that happen to overlap, which is
the difference between a logo revealed *by* something and a logo that merely
faded in near it.

**All of it is CSS. No script runs the sequence**, so it plays with
JavaScript off and cannot half-start — which matters more here than anywhere
else on the site, because on a holding page the animation *is* the page.
`prefers-reduced-motion` gets the settled frame outright, wordmark unmasked,
rather than a degraded version of the opening.

### Why it is allowed to be nothing

§1's thesis is that the work this borrows from spends most of its length
near-silent so a few moments can detonate. Every other page has to earn its
silence against content it owes the reader. **This page owes nothing**, so it
can be entirely silence — and the risk inverts. With nothing to hide behind,
one object too many and it reads as a parked domain.

**There is deliberately no countdown, no percentage bar and no social row.**
That trio is most of what `new-direction-comments.md` ranked as the reason
the previous direction read as a very good template. A studio selling 20–30k
engagements does not put a progress bar on its own launch.

### `chrome: none` — a front-matter key added for this page

`_layout.html` hardcoded `{{header}}` and `{{footer}}` into every page.
`build.js` now takes `chrome:` (`full` by default, or `none`), and a `none`
page gets neither, and is not required to declare `home` or `skip` — only the
header and footer ever read those, so a bare page declaring a skip target
nothing points at would be dead front matter.

**Anything other than those two values is a hard failure.** `chrome: non`
silently shipping a full header is the class of bug the unresolved-`{{token}}`
check exists to stop.

**This is the only legitimate use of it.** A page that is part of the site
carries the site's chrome; `aria-current` and the skip-link both stop working
without it. It is justified here only because the page replaces the site.

### The sweep moves a mask, it does not redraw one

The mask is 3× the wordmark's height and its **position** is animated, which
walks the gradient's edge up through the box. Done this way rather than by
animating the gradient's own colour stops: `mask-image` is not interpolable
in every engine that supports masks at all, but `mask-position` always is.
Same reason the marquee translates a track instead of restating its
background.

Reading the positions: the gradient runs black at its bottom to transparent
at its top. At `0 0%` the box sees the mask's top third and the wordmark is
hidden; at `0 100%` it sees the bottom third and the wordmark is solid. So
`0% -> 100%` walks the lit edge upward.

**The soft band is 18%–42%, not 34%–66%.** At the wider setting the fade was
most of the mask's height, so the whole wordmark lightened at once and the
sweep read as a dissolve. A tighter band keeps a travelling **edge**, which
is the thing that reads as a rise.

The wordmark also travels 18px as it is uncovered. Without it the letters
light up in a box that is plainly standing still, and the sweep reads as a
gradient passing over a logo rather than a logo rising into light.

### Two things were built wrong first

**1. The headline was removed.** Built with "Something is rysing" set large
above the lockup, and the two fought — that line is the loudest thing on any
page it appears on, so the wordmark it was meant to introduce became a
caption under it. The brief is *the logo revealed*, so the logo is the only
thing at size.

**2. The light was a fog.** `min(104vw,1180px)` anchored at the bottom put a
1180px disc with its centre two thirds up the screen — not light rising but
a red-brown haze over everything, with the star floating in it. Same failure
as the deleted still version's first build and the same rule from §8: spread
wide enough, a glow stops being an object. It is pushed most of the way off
the bottom (`bottom:-34vh`) and blurred hard (44px) now, so what lights the
page is the disc's **top arc** and never its circumference. **If it ever
reads as a disc with an edge, it has drifted.**

### Verified

- **One screen, both axes, at twelve sizes** — 360/390/500/620/768/1024/
  1280/1440/1680/1920 plus 1440x700 and 900x480 (landscape phone).
  `scrollWidth == innerWidth` and `scrollHeight == innerHeight` at every one;
  `scrollTo(9999,9999)` lands at 0,0. **Zero dead scroll.** Probed with
  `Emulation.setDeviceMetricsOverride`, not `--window-size` — headless clamps
  near 500px and a 390 capture renders at 500 and crops, which looks exactly
  like horizontal overflow.
- **The sequence was read at fixed timestamps, not caught in flight.** §5's
  technique: pause every animation via `getAnimations()` and set an explicit
  `currentTime`, then capture. A round trip is 300ms–1s, so "screenshot
  during the animation" returns near-arbitrary frames. `Page.bringToFront`
  first, per §36.
- **The six site pages are untouched**: zero changed lines that are not the
  `?v=` hash. `shared.js` is **byte-identical to HEAD**, and `shared.css` is
  a pure append (0 deleted) whose only other hunks are §37's nav stagger and
  the fudge-button font, both of which predate this work.
- `shared.css` comment terminators balanced, 369 open and 369 closed;
  `node --check shared.js` passes.

### Open

- **All the copy is placeholder and the client writes it.** One line:
  "Something is rysing — coming soon". Provisional, compositionally correct,
  and **not approved copy**. Deliberately plausible rather than bracketed —
  §38 records two `[__]%` rendering at display size on a finished page, and
  the lesson is that a visible bracket is the most damaging thing on a page
  a client is looking at.
- **This page captures nothing.** It is a sign, not a list. The deleted still
  version carried an email field; this one does not, and that was the
  trade-off in choosing it. If capture matters, the field has to be added —
  and the newsletter's missing backend (§6) would have to be wired first,
  because a holding page that reports a false success is worse than one that
  collects nothing.
- **The wordmark's white orb artifact is worst on this page of anywhere on
  the site.** The lockup is the hero at up to 356px and the blob sits
  directly left of the star. It is in the supplied artwork
  (`rysing-logo-lockup-light.webp`), not a rendering fault — §6. It was
  deliberately **not** cropped out: it is the client's logo, and a crop
  guessed from a pixel profile risks clipping the star's own left arm. Clean
  artwork is the fix and this page is the strongest argument for it.
- **The page is unlinked by design** and `build.js` will keep emitting it. It
  must not be added to the nav, and whoever points the domain at it should
  know the rest of the site stays reachable by filename.

---

## 41. The two holding pages that were deleted

Three were built so the choice could be made by looking. One shipped (§39);
these two were **deleted outright at the client's instruction** — sources,
generated pages, CSS and the one JS handler. They are not in `playground/`
and they are not in git. This section is all that remains of them, and it
exists because three of the lessons are not about those pages.

| Deleted | What it was |
| --- | --- |
| the still | Star held shut, one line, an email field. The quiet extreme. |
| the aperture | The showreel aperture played on a timer until the footage filled the screen. |

### What is worth keeping from them

**1. The lights were built at the hero's strength and it was wrong — twice.**
Both deleted pages and the first build of the one that shipped made the same
mistake: the hero's own ramp (`.95` core on a ~900px disc) produced a red
and blue wash with almost no black left, on pages whose whole argument is a
black ground. §8 names it — spread wide enough and a glow stops being an
object and becomes a panel the words sit on.

**It is worse on a holding page than anywhere else for a structural
reason.** On the homepage the hero's lights are read against fourteen more
screens of near-black below them, so the page corrects them. A holding page
is one screen: **whatever the lights do IS the page**, with nothing after it
to restore the ratio. That finding is why §39's light is where it is.

**2. A grade cannot be centred on the element when the thing it grades
moves.** The aperture's footage was darkened by a radial vignette centred on
the element — the viewport — while the star came to rest off-centre at 66%.
So the one object that had to stay legible sat in the darkest part of its own
grade and read as a hole rather than as footage. A **flat** scrim fixed it.
Any mask whose position is animated has the same trap.

**3. `mask-size` in per cent resolves against the element's WIDTH, so a
constant breaks both ends at once on a phone.** A 15% rest is 216px at 1440
and 58px at 390 — too small to read as having footage in it — and the same
constant at the other end did not cover a frame 2.2× taller than it is wide.
The fix was to author one number and make every other stop a fixed multiple
of it, so a media query moves the whole curve together and cannot put it out
of proportion. **Also §7 again:** `mask-size` interpolates linearly and the
star stops being star-shaped at ~250%, so the stops have to multiply, not
add, or the mark is a star for the first 1.5% of the opening and crawls
invisibly for the rest.

### Why the aperture version was not chosen

Worth recording, because it will be proposed again. The move itself — the
site's signature aperture driven by time instead of scroll — was the
strongest thing in any of the three. **The footage is what sank it.**

AGENTS.md has flagged the reel as off-brand since before these pages existed.
At full bleed the end frame was a screen recording of a browser window on
bright yellow, showing another client's website, under a Rysing wordmark. On
the homepage the aperture opens and the reader scrolls on; on a holding page
the opened frame is the **terminal state** and the page rests on it for as
long as anyone looks. It also loaded **13MB** of video on the first thing
anyone sees.

**If the reel is ever re-cut, this idea is worth rebuilding.** It is not a
rejected design; it is a design waiting on an asset.

---

## 42. The open service row stands on brand blue

Client instruction. The section was four white numerals on black and a 38px
`+` circle was the only thing carrying open/shut state, so the fill is doing
work the plus was doing alone.

**Three decisions make it a band of the page rather than a card.**

1. **It full-bleeds.** The fill is `.system-item::before`, pulled to the
   viewport edges with `left/right: calc(var(--gutter) * -1)`. Boxed inside
   the gutter it read as a panel floating on black. §4's rule again — a
   left/right cut at the viewport edge is invisible.
2. **It wipes, it does not fade.** `scaleY` from `transform-origin:top` on
   `--t-weight`/`--ease-weight`, the same duration and curve as the panel's
   own `grid-template-rows` growth, so the ground arrives under the detail at
   exactly the speed the detail opens. One gesture, not two. A cross-fade here
   read as a hover state misfiring.
3. **No radius, no shadow.** The row hairlines stay the only edges in the
   section.

**The fill is per-row and not one shared element that travels.** Closing one
row against opening another then runs a scale-out into a scale-in, which reads
as the blue handing off down the list. A single travelling element would have
to animate position as well, and §41's second lesson applies — a thing whose
position is animated drags every grade and mask centred on it.

**Hover on a closed row** gets the same colour at 9% through a second
pseudo-element (`::after`), on `--t-detail`. The fill then looks like it was
already there waiting rather than switched on.

**Contrast had to be lifted inside the open row, and this is the part that is
easy to miss.** The tag borders (`rgba(249,249,249,.3)`), the `STAGE OUTCOME`
label (`--muted`, `#9a9a9a`) and the `system-for` bullet were all graded
against black. On `#3524d5` they go muddy and the open row reads as *lower*
contrast than the shut rows above it, which is backwards — the open row should
be the loudest thing in the section. Four overrides under
`.system-item.is-open` fix it. **If another alpha-on-paper detail is ever added
to a row, it needs the same treatment.**

**Reduced motion keeps the colour and drops the wipe.** The fill is state, not
decoration; losing it would lose which row is open.

### Note

- The first row is `is-open` on load (§12's reasoning — with every row shut the
  section is four numerals and a column of air), so the section now greets the
  reader with a blue band. That is a bigger entrance than before. Flagged to
  the client; not yet decided.
- The row hairlines vanish where the blue runs. Intentional at full width, but
  it reads as a missing line if you are looking for it.

---

## 43. The reel is contained and unpinned, and the star survived it

Client instruction, after a reference they sent (Collins). Two asks: the video
should not be full width and height, and there should be **no "stop
scrolling"**. This took four passes and three of them were wrong, so the
failures are the useful part.

**What it is now.** `.reel` is an ordinary section, ~724px tall at 1440x900.
`.reel-stage` is `position:relative` with `max-width:1340px`; the section's
inline padding is `clamp(20px,12vw,300px)`. `.reel-frame` is `16/9` with
`border-radius:clamp(9px,.9vw,17px)`. That lands at **76% of viewport width at
1440 and 67% at 1999**, measured against the reference screenshot's own 76% /
12.9% margins. Under 640px the inset drops back to `var(--gutter)`.

**What went.** The `260vh` section and the `position:sticky` full-viewport
stage. That pin is the entire "stop scrolling" — it held the viewport for two
and a half screens before releasing it.

### Mistake 1: the pin and the scroll link are not the same thing

The first pass removed the star outright, on the reading that "no stop
scrolling" meant the whole pinned reveal. It did not. **The opening was never
the problem and neither was scroll driving it.** The pin existed only to
MANUFACTURE scroll distance; the frame already travels about 1.5 screens just
by being scrolled past, which is plenty to open a mask over and costs the
reader nothing.

### Mistake 2: the original easing does not survive the shorter distance

A pass that rebuilt the opening on a CSS animation — time instead of scroll —
was also wrong, but it produced the finding that matters. `1-(1-p)^2.6` is the
original curve and it is heavily front-loaded: **83% open at the halfway
point**. That only read as an opening because the pin gave it 260vh to spend —
its first third alone was two screens of scrolling. Replayed against anything
shorter the same shape is a flash: on a clock it blew the star open in about a
tenth of a second, and across the frame's own travel it measured **402% when it
should still have been a star**.

The curve is now `smoothstep(p)^1.8` — holds the mark small and legible through
the first half, then blooms, keeping smoothstep's ease-out at the top so it
settles rather than snapping, which is the one thing the old curve got right.
**The exponent is tuned against §41's measurement that the mark stops being
star-shaped around 250%**, not against how the number feels.

### Mistake 3: the mark is centred in the frame, so anchor on the CENTRE

Progress was first measured on the frame's **top** edge starting just below the
fold. Every sampled value was correct and the star was still invisible: the
whole opening ran while the frame was mostly under the bottom edge, so by the
time the reel was on screen the mask was already past frame-filling. All that
was ever visible was a star tip rising past the bottom of the window.

**The mark is centred in the frame, so the frame's centre is where the star
actually is.** Progress is measured on that centre against the viewport. A
first correction still started at the bottom edge (`1.02`), which put the
opening on screen but not its first third — and the smallest sizes are exactly
the ones worth seeing.

### Mistake 4: correct at every sampled point and still too fast

`0.82 -> 0.32` was right in every measurement and wrong in use: half a screen
is about **five wheel notches**. **Sampling scroll positions with `scrollTo`
cannot tell you this — drive it with `mouse.wheel` and count the notches.**

`START = 0.98, END = 0.12` on the frame's centre is ~775px at 1440x900. Opening
spans roughly 800px of scroll, with the mark still readable as a star for the
first ~400px of it. Verified under real wheel scroll at 1440, 1999 and 390: the
star's centre is inside the viewport across the whole range, and the small 27%
state reaches the screen rather than opening below it.

### Still true, and still the real problem

**§16 stands.** The footage is a montage of title cards and client logo plates,
so a see-through aperture is a random crop and the worst frame is the first
one. Removing the full-bleed stage did not change that; it is still waiting on
a re-cut. **Do not reach for `MIN`.**

### Open

- `data-reveal` was briefly added to `.reel-stage` and has been removed again.
  The star opening *is* this section's arrival, and the reveal was fading the
  frame across exactly the stretch the star opens over — two arrivals fighting
  on one element. It also held the frame at `translateY(14px)`, which made the
  aperture start at 47% instead of 27%. **Do not re-add it.**
- Mobile is 346x195 at 390px wide. Honest 16:9 and what the reference does, but
  small. A taller crop (4:5, `object-fit:cover`) would cost the sides of the
  frame. Put to the client; not decided.

---

## 44. The pattern playground, and four rejected attempts at cursor avoidance

**Nothing in this section is part of the site.** It lives on a scratch page
and no page of the site changed. Read §3's new rows before touching any of
it, and read the rejection list before proposing anything — four approaches
have already been built and turned down, and three of them look obviously
right on paper.

### What the client asked for

Two things, on the homepage hero's **orange** light only (§2's
`.hero-light::before`):

1. **Ambient motion** — "rotating or something like this".
2. **Cursor interactivity**, described as *a shark entering a group of
   sardines*: the cursor opens a clean gap, the orange gets out of its way,
   there is **no orange where the cursor is**, and it closes again behind.

Later sharpened, after the first attempts: it must read as **material
moving**, never as a shape being drawn; it must be smooth; and the hero must
still look like the hero. The cursor **removes**, it does not add.

### The scratch page

`src/pattern-playground.html` → `pattern-playground.html`, `chrome: none`,
so no header, no footer, and nothing in the nav points at it (§12 documents
that key). It carries two heroes: **variant A is the control**, the shipped
hero copied verbatim under `.pp-*` names, and variant B is whatever is being
tried. The CSS is copied into the page rather than reused, because
`shared.css` reaches every page and experimenting there would edit the
signed-off homepage.

Keep the control. Three of the four rejections below were only obvious
against it.

### The four attempts, all rejected by the client

**1. A CSS mask punching a hole.** The only way to make a hole in a DOM
gradient. A mask is geometry, and a circle stamped out of a cloud reads as
exactly that — the client's words were "that's a black hole, not an
animation". **Do not reach for a mask here again.**

**2. A canvas fog of ~1700 additive particles with force-based repulsion.**
Rebuilt the glow out of movable bodies so they could flee. Two faults: the
cleared centre left the surrounding fog as a **bright ring** — a donut — and
the motion stuttered, because every body independently chases a moving
target. Rejected as "looks like shit".

**3. A WebGL fragment shader warping the gradient's own lookup** (the
area-preserving map: a pixel at `d'` samples the source at
`sqrt(d'² - r²)`, brightened by the compression `d'/ds`, along a trail of
recent cursor positions). Technically the most correct of the four and it
produced genuine bright walls either side of a gap — but the trail of
shrinking radii reads as a **tadpole dragged behind the pointer**, and it
stuttered. Rejected as "like a sperm and it's stuttering".

**4. A vendored fluid simulation** — Pavel Dobryakov's
WebGL-Fluid-Simulation (MIT). Shipped first in its stock form, where the
cursor injects *colour*: that is a paint toy, it adds glowing smoke rather
than displacing anything, and the client correctly called it "a fire
animation". Then modified so the cursor injects **velocity only** and the
orange exists as dye already — which does finally displace the glow and let
it flow back. **The client has not judged this version.**

### Why all three hand-written attempts stuttered, which is the real finding

Each one recomputed a **shape** every frame — a masked circle, a repelled
particle field, a warped lookup — from the cursor's current position. A
shape derived that way has no memory of the frame before it, which is both
the stutter and the reason it reads as a shape being dragged around.

A fluid solver **advects**: each frame carries the previous frame's material
forward along a velocity field, so continuity is structural rather than
something to be tuned. If this is attempted again by hand, that is the
property to reproduce — not smoother easing.

### A geometric fact that killed two attempts

**Removing light from the middle of a radial glow always leaves a ring.**
Whatever is not cleared stays exactly as bright as it was, so a cleared
centre is a donut by construction. No amount of feathering fixes it; it only
changes the donut's softness. Light has to be **displaced**, not deleted —
which is what the fluid does and what none of the other three did.

One corollary, learned the expensive way: making the cloud out of a few
**large** bodies so the light could be displaced is worse, not better. Large
bodies are pushed aside by their own large radius, so they clear an enormous
centre and pile everything into a rim.

### Technical findings worth keeping

These cost real time and none of them are guessable.

- **A CSS `radial-gradient(circle at 50% 50%, …)` with no size keyword is
  FARTHEST-CORNER.** The stops are percentages of `halfWidth × √2`, not of
  `halfWidth` — so the hero's 74% stop lands *outside* its own element,
  where `border-radius:50%` clips it and `filter:blur(30px)` softens the
  cut. Reading the radius as the half-width draws the glow at about a third
  of its real size. Any attempt to reproduce this gradient must model both
  halves.
- **A WebGL canvas is premultiplied by default.** Writing straight colour
  with `vec4(colour, a)` makes alpha apply twice and the result renders at
  roughly a third of its brightness. Either write `vec4(colour * a, a)` with
  `blendFunc(ONE, ONE_MINUS_SRC_ALPHA)`, or turn premultiplication off.
- **`gl_FragCoord` is in DEVICE pixels** while layout uniforms are in CSS
  pixels. Missing the divide works perfectly at dpr 1 and halves the effect
  on every Retina screen.
- **A transparent WebGL canvas composites as a transparent layer and takes
  the page's black out from under itself.** The whole hero rendered
  see-through. The canvas has to be opaque — which then means every light in
  the section has to live *inside* the simulation, because anything left in
  CSS underneath is covered. That is why the blue became a second dye.
- **Pointer listeners must bind to the SECTION.** Every shape layer here is
  `pointer-events:none`, so a listener on the canvas or any of its parents
  receives nothing at all, silently. This broke twice: once when a wrapper
  element was introduced, and it threw no error either time.
- **A particle's size must be a fraction of the cloud's radius, never px.**
  The disc is sized `min(72vw,1020px)`, so it shrinks with the viewport
  while a px body size does not; at 390 the same bodies packed into a
  quarter of the area and the additive core blew out to near-white.

### Findings specific to the vendored fluid simulation

`vendor-webgl-fluid.js` is Pavel Dobryakov's `script.js` (MIT), **vendored
and modified** — five changes, all marked `Rysing` in the body and listed in
its header. Do not hand-edit it to retune the look; the knobs are in
`pattern-fluid.js`.

- **Upstream's `mousemove` handler returns unless the mouse button is held.**
  Its demo is a drawing toy. That single line is why the simulation appeared
  completely dead on hover no matter how it was tuned — hours went into
  tuning a simulation that was never receiving input. The guard is removed
  and the first move primes the pointer.
- **`SPLAT_RADIUS` is sigma² × 100**, not a fraction of the canvas — the
  shader is `exp(-dot(p,p)/radius)` and the caller divides by 100. Upstream's
  `0.25` is a sigma of 0.05. Passing a fraction of the viewport directly
  makes a blob ~100× too wide and floods the hero to white.
- **Dye settles at `rate / DENSITY_DISSIPATION`.** That ratio is both the
  resting brightness and, through the dissipation term, the reform time. Set
  the ratio under 1 or the orange climbs past full scale and turns white.
- **The source term fights the cursor.** Dye topped up at the glow's centre
  refills faster than the cursor can push it away, so the displacement is
  invisible unless the push is decisively stronger than the top-up.
- Upstream's "Mobile promo section", dat.gui panel, analytics calls and
  random load-time splats are all removed. The promo block **throws on load**
  on any page that is not the demo.

### Where it stands

Everything is **untracked and uncommitted**; `git stash` or deleting the four
files returns the repo to where it was. The client is currently choosing from
a researched list of reference effects rather than from another attempt, which
is the right order and should have happened first:

| Family | What it does | Reference |
| --- | --- | --- |
| Fluid | the glow is pushed and flows back | `paveldogreat.github.io/WebGL-Fluid-Simulation`, reactbits.dev (Liquid Ether) |
| **Flowmap deformation** | the cursor dents the gradient; no particles | Codrops *Mouse Flowmap Deformation with OGL*; Codrops *Bulge Distortion* |
| Fleeing crowd | literal sardines, reads as dots | Justin Windle *30,000 Particles*; Codrops *Interactive Particles* |
| Metaballs | blobs that drift and lean away | `ui.zyeon.ai/docs/backgrounds/metaball-blobs` |
| Liquid gradient | a whole cursor-reactive gradient hero | madebybeings.com Three.js tutorial |

**Flowmap deformation is the one to look at first** if the client does not
pick: it keeps the gradient looking like the gradient and only displaces it,
which is the one property every rejection had in common.

### Process, recorded because it was the actual failure

The client asked for avoidance in her first message. Four builds later she
still did not have it, because each attempt delivered something *adjacent* —
a hole punched in the glow, a ring brightening around a gap, smoke painted by
the cursor — that moved when the cursor moved but was not the orange getting
out of the way. Worse, the fluid version was handed over with its central
shortcoming named in the covering note and a question attached, instead of
being finished.

**Two rules for the next agent.** Research the reference before building, not
after four rejections. And do not delete an experiment the client has not
abandoned: two untracked scripts were deleted for tidiness one message after
she asked for a change to one of them, and untracked means unrecoverable.

---

## 45. Attempt five: the gradient, warped away from the cursor

**Nothing in this section is part of the site.** It is variant B of the
scratch page (§44), and no page of the site changed for it. The client has
**not seen it**, and **it does not work in Safari** — that is the first open
item and the rest of this section is subordinate to it.

`pattern-shark.js` is the whole of it. Variant A above it is still the
shipped hero as a control; keep it.

### What it is

The orange is **still the authored CSS gradient** — not particles, not dye,
not smoke. Both discs are restated analytically in a fragment shader, and a
field of displacement vectors in a texture makes every pixel read that
gradient at a different point of itself. Nothing is added, nothing is
deleted, nothing is drawn. The light is only ever moved.

That is the one property all four earlier attempts lacked, and §44 names it
outright: *"light has to be displaced, not deleted"*. The map is
`sqrt(d² - R²)` — a pixel at distance `d` from the cursor reads the gradient
at a smaller radius, so the content that was at `s` is displayed at
`sqrt(s² + R²)`, pushed outward by exactly the area of the gap.

**Get that sign backwards and it is a pinch, not a parting.** `+` instead of
`-` sucks material toward the cursor and swallows a disc of the picture,
which is §44's attempt one — "a black hole, not an animation" — in a new
coat. It was built that way first and looked plausible on screen. Both signs
produce a dark patch under the cursor and only one of them is material
getting out of the way.

**The map is area-preserving**, which matters before anyone tries to tune a
compression wall into it: adding a constant to `r²` moves every ring outward
without changing its density, so material does not pile up on its own. The
rim brightens only because the gradient is sampled nearer its own core,
which is asymmetric — brighter toward the disc's centre, dimmer away from
it. That asymmetry is wanted. A symmetric bright rim around a cleared centre
is §44's donut, and avoiding it is most of the design.

### Three fields, and why the gap is not the warp

| Channel | What it carries |
| --- | --- |
| `.xy` | the displacement, scaled by **speed** |
| `.z` | the void — the gap itself, **constant** |
| `.w` | the pile — a bow wave, ahead of travel only, scaled by speed |

**The split is the most important idea in the file.** They were tied
together first, both driven off speed, and that is wrong at both ends. A
parked cursor then had almost no gap at all, which fails the client's own
sentence about there being no orange where the cursor is — measured, a
stationary cursor read **+8 brighter** than rest once the warp's rim
brightening was accounted for. Tying them the other way is worse: with no
travel to bias it, the warp's brightening is perfectly symmetric, so a still
cursor sits on the page inside an even bright ring, doing nothing.

Constant gap, speed-scaled displacement. Stop, and you get a clean soft gap
with no ring. Move, and the material visibly flows around it.

**The gap is a super-Gaussian, `exp(-(d/a)³)`, never a `smoothstep`.** A
smoothstep between two radii still has two radii in it and the eye finds
them; built that way it read as an eclipse, which is the exact phrase the
client used about attempt one. The super-Gaussian is flat across the middle
and trails off with no radius anywhere in it.

**The pile is keyed to the leading edge alone, outside the sub-step loop.**
Inside it, the pixel at the cursor's current position lies ahead of every
earlier sub-step centre, so `dot(dir, travel)` is +1 there and the
brightening landed *on* the cursor — measured as the gap reading brighter
than rest when it should have been most of the way to black.

### Smoothness is not a tuning problem

§44 blames the three earlier stutters on each attempt recomputing a *shape*
every frame with no memory of the frame before. That is right and
incomplete. **Pointer events do not arrive once per frame.** They come in
irregular bursts, several in one frame and none in the next, and a handler
driven straight off the event position gives a jump, a hold, a jump — which
is visible as stutter no matter how good the maths behind it is.

Two fixes, both load bearing, neither visible as a setting:

- the pointer runs through an exponential filter with a real time constant,
  so what the effect follows is continuous even when the events are not;
- injection is **sub-stepped along the segment** between last frame's
  position and this frame's, so a fast flick lays down a continuous furrow
  instead of a dotted line of splats.

Measured at 1440x900 under continuous motion: **median 16.7ms, p95 17.7ms,
max 18.1ms, zero frames over 32ms.** Locked 60fps.

### THE BUG THAT COST THE MOST: the field was mirrored

`vUv.y = 0` at the top is natural because every rect read from the DOM
measures that way, and flipping it in the vertex shader is the obvious
move. **It is wrong, silently.**

> A framebuffer's texel row 0 is the BOTTOM of clip space. Flip `vUv` in the
> vertex shader and the field pass WRITES the value it computed for
> `vUv.y = V` into the row that reading `vUv.y = V` returns as `1 - V`. Every
> read of the field is vertically MIRRORED.

Nothing errors. The picture still moves when the cursor moves, because a
mirrored field still has a disturbance in it — it is just in the wrong half
of the canvas, and if the cursor happens to be near the vertical midpoint it
looks almost right. Measured, **the gap's own strength at the cursor read
0.04 where it should have been 1.0**, and three passes went looking for a
bug in the solver instead.

The flip now lives in **one** place, on the way in: the two y values that
come from the DOM are converted with `1 - y`. If a third ever arrives,
convert it there too, never in the vertex shader.

### Other findings worth keeping

- **A `<canvas>` is a REPLACED element.** Absolutely positioned with
  `width:auto` it takes its intrinsic 300x150 and **ignores `right` and
  `bottom` as over-constrained**, so `inset:-34vh -22vw` positioned a
  300x150 canvas in the corner and the variant rendered nearly blank, with
  no error. The size is written out as `calc(100% + 44vw)` /
  `calc(100% + 68vh)` for that reason.
- **The canvas overhangs the hero, and that is §29/§33 rather than a safety
  margin.** A transparent canvas still paints only inside its own box, so a
  canvas at `inset:0` cuts both discs flat where the section ends.
- **A backtick inside a shader template literal ends the literal**, and the
  page then dies on a JavaScript syntax error. This is §27's CSS comment
  terminator wearing a different coat and it happened **twice**. There is a
  check for it:
  ```sh
  python3 -c "
  s=open('pattern-shark.js',encoding='utf-8').read()
  for t in ('const VERT =','const FIELD =','const DRAW ='):
      a=s.index(t); o=s.index(chr(96),a); c=s.index(chr(96)+';',o+1)
      print(t, s[o+1:c].count(chr(96)))"
  ```
- **Clear the field to zero on ALL FOUR channels.** The habitual
  `clearColor(0,0,0,1)` put a full-strength bow wave everywhere, because
  alpha is not spare here — it carries the pile.
- **Size the field from `canvas.width/height`, not from a measured rect.**
  The rect is a float that wobbles in the last place as the discs drift, and
  rounding off it flipped the field's height between 235 and 236 every few
  seconds — each flip replacing both textures, wiping the field mid-gesture
  and leaking the old pair.
- **`dt` can be zero** and `travelled / 0` is NaN. The field feeds itself, so
  one zero-length frame poisons it permanently with no error. Guarded.

### Measuring it, which went wrong twice before it went right

- **A capture round trip is 300ms–1s and the field relaxes in 0.62s**, so
  sampling after the last pointer move reads a half-decayed field and
  reports the effect as roughly absent. Drive the pointer from a loop that
  keeps running while the screenshot is taken.
- **A linear sweep cannot measure the gap**, because by the time the capture
  lands the cursor is somewhere else. Park it, or orbit it in a 9px circle
  so it has real speed and stays at the sample point.
- Pause the discs' 28s drift before any before/after pair or the geometry
  moves between the two frames and every number carries it as noise.

Final numbers at 1440x900, cursor against rest: gap **208 → 37**, material
thrown **+92 ahead** and **−62 behind** while orbiting, and **+1/+2 either
side when parked** — no donut. The shader's gradient against the real CSS
one: **mean delta 1.24, worst 16, 0.07% of pixels over 10**, so the hero
still looks like the hero. Zero horizontal scroll and zero dead scroll at
360/390/500/768/900/1024/1440/1680/1920.

### Open — Safari

**It does not work in Safari.** Reported by the user; not diagnosed, because
the session ended there. Two candidates, both cheap to check:

1. **WebGL2 float render targets.** The field is `RGBA16F` and the script
   returns early unless `EXT_color_buffer_half_float` or
   `EXT_color_buffer_float` is present. If Safari refuses the format, the
   variant falls back to the CSS gradient. **The fallback is now loud** — it
   logs `[shark] shader failed…` — but it was silent at the time it was
   seen, which is why the report came back as "it looks broken" rather than
   "it did not start".
2. **`overflow-x:clip` with `overflow-y:visible` on `.pp-light`.** §36
   already flags this as the one combination the whole backdrop conversion
   rests on, and the user's screenshot showed the page **scrolled sideways
   by ~150px**, which is what that pair failing would produce.

**Neither was caught because every measurement in this section was taken in
Chrome.** There is no Safari in the harness and nothing in §26, §27 or §36's
testing notes mentions one. That is the gap, not the code.

### Tuning

The `K` block at the top of `pattern-shark.js` is the whole control surface
and is read fresh every frame, so `window.SHARK` lets it be tuned live in
the console with no reload:

```js
SHARK.REACH = 0.6     // how far the push spreads   <- the big one
SHARK.RELAX = 2.0     // how long the wake stays open, seconds
SHARK.FORWARD = 1.2   // how hard material is thrown ahead
SHARK.HOLE = 0.14     // gap size
SHARK.VOID = 0.9      // how dark the gap goes, 0-1
SHARK.PILE = 0.8      // brightness of the bow wave
```

### The process failure, recorded because it is the one that cost the day

The effect was working and broad, and **it was then tuned until it was
not**. Four changes, each defensible on its own — the warp throttled to 30%
at low speed, `OPEN` cut from 0.075 to 0.022, `HOLE` and `VOID` reduced, the
bow wave narrowed from a sweep to a thin ring — and together they shrank a
glow that visibly parted into a small dark blob near the cursor. The user's
words were that it had gone back to zero, and they were right.

**All four were made chasing §44's donut warning, which was an inference
from this document rather than anything the client had said.** They had
looked at the broad version and said it worked. **A judgement already given
about how it looks outranks a rule derived from an earlier attempt.**

And the backups were deleted in the same tidy-up — the exact thing §44's
closing rule warns about, one message after it mattered. The values were
reconstructible only because they were all in the edit history of the
session. **Commit the scratch work; that is why it is committed now.**

---

## 46. Variant C: the brand mark as a pattern, repelled by the cursor

**Nothing in this section is part of the site.** It is a third section on the
scratch page (§44), below the two heroes, and no page of the site changed for
it. `pattern-stars.js` is the whole of it.

### What the client asked for

The footer's logo lockup, **at about half the footer's size**, with the brand
star repeated around it as a pattern — "a lot of them in a very nice way" —
animated with the behaviour in CodePen **`rkgttr/pen/ZGZzJG`**, which they
sent. The layout question (lattice vs scatter) was put to them and they chose
a **jittered grid**.

Looked at on the page the lockup read small against the field and they asked
for it bigger, so the value is **`min(54vw,760px)`** rather than the
`min(44vw,620px)` that half the footer measure works out to. It stays a
viewport measure: the clear space is read from this element's rendered box,
so a logo that stopped scaling would eat a different fraction of the pattern
at every width.

### The reference, since CodePen will not serve it to a fetch

`codepen.io/...` returns 403 behind Cloudflare. **`cdpn.io`'s fullpage mirror
does serve it** — `https://cdpn.io/<user>/fullpage/<slug>` — with the pen's
real source inside the `srcdoc` attribute of the result iframe. That is how
to read a pen the client sends.

It is called *"Particles repulsion"*: a 10×10 grid of SVG `<circle>`s; each
frame every dot is pushed directly away from the cursor by `strength / dist`,
then pulled back toward its home by 10%. Twenty-five lines, no library.

### Why this one is worth copying, in this document's terms

**Every point carries its own `x` and `y` forward and is only ever nudged.**
§44's post-mortem blames all three hand-written stutters on recomputing a
*shape* every frame from the cursor's current position with no memory of the
frame before; this has that memory structurally, the same property advection
gave the fluid.

### §44's RULES DO NOT BIND THIS SECTION, and the distinction matters

§44 and §45 are about the hero's **glow** — a continuous field of light, where
the governing fact is that clearing the middle of a radial gradient always
leaves a ring. **That is a fact about deletion from a cloud.** These are
discrete marks on a lattice, each with a home. A hole in a lattice of marks
reads as marks getting out of the way, because nothing sums into a cloud.
There is no donut here to design around, and no need for the analytic warp
§45 exists to provide. Do not import those constraints into this file; §45's
own closing lesson is that a rule inferred from an earlier attempt can be
applied where it does not belong and cost a day.

### Four changes to the pen, each of which it needs to survive being scaled up

- **`strength / dist` diverges at the cursor.** At `dist → 0` the push is
  unbounded, so a star passed over directly is thrown hundreds of px in one
  frame and snaps back over the next ten. On the pen's hundred dots that
  reads as liveliness; at this density it is a visible flick.
  `STRENGTH / (dist + SOFT)` is the same curve everywhere that matters and
  simply tops out underneath the cursor. There are **three limits, not one**,
  because each catches a different gesture: `SOFT` for hovering, `MAXPUSH`
  for a flick between two frames, `RANGE` for a sustained shove.
- **`setAttribute('cx', …)` per element per frame is layout work.** The write
  path here is a `translate3d` on an outer box, with scale, rotation and the
  twinkle parked on an inner `<b>` so the per-frame write is one short string
  and nothing else has to be rebuilt to go with it.
- **The pointer runs through an exponential filter** — §45's "smoothness is
  not a tuning problem". The pen has this fault and gets away with it because
  its dots are tiny and its spring is slack.
- **The lattice has a hole in it for the wordmark**, read from the lockup's
  *rendered* box rather than derived a second time (§33), and an ellipse
  rather than a rect — a rectangular gap in a star field reads as a card
  sitting on top of the pattern.

### Two things that are not obvious and are not taste

- **THE GAP IS DERIVED FROM AN AREA, NOT WRITTEN AS A LENGTH.** A fixed px
  gap gives ~90 stars on a phone and ~900 on a 27" display. Solving
  `gap = sqrt(area / DENSITY)` holds the count roughly constant: measured,
  **386 at 390×844 and 357 at 1920×1080**. The star is then sized as a
  *fraction of the gap*, which is §44's last technical finding in different
  clothes.
- **The jitter is a third of a gap and that is a ceiling, not a default.**
  What the eye reads during repulsion is a *regular* spacing being deformed.
  Push the jitter past about half a gap and the lattice stops being legible,
  and the cursor is just moving some dots around.

### THE REAL FINDING: the new section was about to be blamed for §45's cost

Measured at 1440×900 with everything on the page running, the star section's
frame time was a **median of 116.7ms**. Isolating it showed the star field
costs *nothing* — removing `pattern-shark.js`'s canvas alone took it to a
locked 16.7ms, and turning off the twinkle, the masks and finally every star
changed nothing further.

**A WebGL simulation two sections up was consuming the whole frame budget of
a section it is not visible in.** `pattern-shark.js` now drops its rAF loop
when its hero leaves the viewport, and `last` is reset on resume so it does
not come back to a dt of several seconds. Nothing about the shader, the field
or the tuning changed.

> **No `rootMargin` on that observer.** 120px looks like a courtesy against a
> restart hitch and is the bug: the star section begins exactly where the
> shark hero ends, so the margin kept the canvas grinding through the whole
> of the section below it and the frame time stayed at 83ms. The restart
> costs one frame.

**This is the §44 process rule, not a performance note.** Variant C would
have been judged as stuttering, and the stutter was not in it.

### Numbers

Stars section, continuous pointer motion, after the gate: **median 16.7ms at
390, 768, 1440 and 1920**, zero frames over 32ms at 390 and 768; zero
horizontal scroll and zero dead scroll at all four. Orbiting at 1440, **4
stars remain within 160px of the cursor** — against a lattice gap of 62,
which puts about twenty there at rest — with a maximum displacement of
**109px** against a `RANGE` ceiling of 148.

### Measuring it

The first capture showed **no repulsion at all** and the effect looked dead.
The cursor had been parked at 30% of the section's width, which is inside the
wordmark's clear space — there are no stars there to move. Sample in open
field, and freeze the twinkle before any before/after pair so the two frames
differ only by displacement.

§45's other two measurement rules carry over unchanged: drive the pointer
from a loop that keeps running while the screenshot is taken, because a
capture round trip is longer than the relaxation; and orbit rather than
sweep, so the cursor has real speed and is still at the sample point when the
frame lands.

### Tuning

`window.STARS`, read fresh every frame, same arrangement as §45's `SHARK`:

```js
STARS.DENSITY  = 340   // target star count; the gap is solved from it
STARS.STRENGTH = 2600  // push     <- the big one
STARS.SOFT     = 54    // px; force peaks at STRENGTH/SOFT
STARS.RANGE    = 2.4   // how far a star may be driven from home, in gaps
STARS.EASE     = 0.10  // return per 60Hz frame — the pen's own value
STARS.RED      = 7     // one star in RED is brand red (§11: red is scarce)
```

`DENSITY` and `RED` only take effect on the next rebuild, which a resize
triggers.

### Open

The client has not seen it. **It has not been checked in Safari**, which is
§45's open item and the same gap — there is still no Safari in the harness.
