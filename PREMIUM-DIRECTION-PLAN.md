# Brief: build `premium-direction.html`

## Goal

Rysing sells 20–30k projects. The page must carry that before anyone reads a
word. `new-direction.html` is competent but reads as a very good template, not
as a studio operating at that level. The diagnosis is in
`new-direction-comments.md` — read it first.

The core problem: every device is used at full strength, everywhere, at once.
The work this direction borrows from spends most of the page near-silent so two
or three moments can detonate. We inverted that ratio. Fixing the ratio is the
job.

## Hard rules

- Work **only** in `premium-direction.html`.
- **Never** touch `new-direction-2.html` (another agent's workspace),
  `new-direction.html`, or `rysing-comments.html`.
- Copy is lifted verbatim from `rysing-comments.html`. Do not reword.
- **Never invent** project names, metrics, results, testimonials, awards, or
  URLs. Where new copy is needed, build the slot and mark it `TODO(copy)`.
- Do not delete anything not explicitly approved below. If something else looks
  like it should go, list it and stop.
- Preserve every settled fix listed under "Carry forward".

## Starting point

Copy `new-direction.html` to `premium-direction.html` and transform it. Do not
rebuild from scratch — the copy is already verbatim and a rebuild risks drift.

## Carry forward unchanged

These are settled. Full reasoning in `AGENTS.md`.

- The showreel aperture, the solid-mark crossfade (`--reel-reveal`), the
  `--reel-progress` grade, `reel-03.jpg` as poster, the transport control, the
  self-resume, and the `.is-revealed` compositing drop. **The reel is parked —
  no changes to it or its content.**
- Services: numeral as grid sibling (not inside the button), whole row
  clickable, closed row shows the name at display size, first row open on load,
  numerals in Aileron 300.
- Measures in `em`, never `ch`.
- Logo marquee `--f` content-fraction scaling and `brightness(0) invert(1)`.
- `html { overflow-x: clip }`, `scroll-margin-top:112px` on `section[id]`.
- Reduced-motion and no-JS fallbacks.

---

## Content changes — ALL ON HOLD

> **Status: none of these are to be executed.** The user's instruction is "keep
> the copy as it is". Every item below removes or adds visible copy, so all are
> parked until explicitly reinstated. Do not act on this section.
>
> This leaves Phases 0–6, which require no copy changes whatsoever. Do those.

## Approved content changes (PARKED — see above)

### 1. Sunday Fudge comes off the homepage

Remove the full section. Preserve the signup as a compact footer row: the email
field, the submit control, and "No spam. Unsubscribe anytime."

Copy that stops appearing on the homepage — flag if this is wrong:
- "Get free access to my business and marketing mini-courses"
- "Join 2,000 founders and experts reading Sunday Fudge…"
- "Sharp perspective" / "Useful prompts" / "Sunday delivery"
- The cover card: "Sunday edition", "Rysing Studio", "Fudge for founders.",
  "People branding. Without the fluff."

Keep the markup in a commented block at the bottom of the file so nothing is
lost.

### 2. "Apply to work with us" drops from 5 instances to 2

Keep: the header pill, and the final CTA. Remove from the manifesto, the
founder block, and the footer nav list.

### 3. Three projects on the homepage, not six

Keep **02 (Alex, luxury hotels)**, **03 (Doppler)**, **04 (FuturfAI)** — the
three sharp images. Remove 01 (Bommer), 05 (Djongow), 06 (Knowle) from the
homepage and keep their markup commented at the bottom of the file.

Gerd Bommer is still present on the page via the logo marquee and the spotlight
image, so the name is not lost.

This ordering is **interim and by image quality, not significance**. When new
photography arrives, re-sort by actual project importance.

### 4. Outcome slot per project

Add a line beneath each project title for the result. **Do not write it.** Mark
each `<!-- TODO(copy): outcome line pending from client -->` and render a
visible placeholder so the layout is correct and the gap is obvious.

### Explicitly rejected — do not do

- **Do not reorder sections.** Services stays above Selected Work.
- **Do not change testimonial names.** "Marcus H.", "Elena V." etc. stay as they
  are.
- **Do not add, remove, reword or reorder any visible copy anywhere.** All six
  projects stay. The Sunday Fudge section stays in full. Every existing
  "Apply to work with us" stays. The flattened visible text of
  `premium-direction.html` must remain identical to `new-direction.html`.

---

## Phase 0 — Interim asset handling

New photography is coming from the client. Until it lands:

- Keep every current asset. Delete nothing.
- Every image slot gets a fixed `aspect-ratio` and an `object-position`
  custom property, so swapping a file is a one-line change with no layout work.
- One unified grade across every photograph on the page. Push contrast slightly
  so quality differences between sources flatten.
- Weak images get the smallest slots and the tightest crops.
- Produce **`ASSET-SPEC.md`**: per-slot pixel dimensions, aspect ratios, crop
  guidance, and a shot list, so delivered files drop straight in.

## Phase 1 — Dynamic range

The highest-value change. No copy impact.

- Define three loud moments: hero, showreel, final CTA. Nothing else competes.
- Everything else drops a tier. Team, recognition, proof, founder body all get
  materially smaller display type than they have now.
- Section padding stops being uniform `clamp(104px,13vh,170px)`. Vary it hard so
  the page has long quiet stretches and a few detonations.
- Introduce at least one near-empty full-bleed moment. Empty space is the most
  expensive thing a page can contain and there is currently none.

## Phase 2 — Work as the spine

- Panel size encodes significance. Flagship large, supporting small.
- Current arbitrary offsets are replaced by a deliberate hierarchy.

## Phase 3 — Restraint on devices

- **One rule for the font alternation**: Kinfolk is reserved for the noun being
  elevated; Aileron carries everything else. Apply consistently. Some headlines
  should be set in a single face so the device recovers its meaning.
- Stats: one hero figure, the other three as footnotes. Not four equal numbers.
- Service numerals: either quiet index marks, or the single loud element in that
  section. Not both.

## Phase 4 — Colour discipline

- Cut the ambient blurred glows back to one on the whole page.
- Introduce red once or twice as a hard element — a flooded surface or ink —
  rather than haze.
- Blue stays as the single spotlight highlight.

## Phase 5 — Craft layer

- Figure numbering and editorial captions.
- A visible, designed grid.
- Micro-typography: optical tracking at display sizes, hanging punctuation,
  tighter leading on large type.
- Differentiated motion. Not one uniform `.45s` ease on everything.
- Considered hover and cursor states on media.

## Phase 6 — Proof and selectivity

- Fewer, larger testimonials with more attribution weight. Names unchanged.
- One qualified CTA rather than a repeated ask.

---

## Verification before reporting done

- Render at 390, 768, 1024, 1440, 1920.
- No horizontal scroll at 390.
- Unique ids, no dangling `aria-labelledby` / `aria-controls` / fragment links.
- Balanced tags.
- Accordion: one row open at a time, whole row clickable, keyboard operable.
- Reel: plays, self-resumes, stops only when well clear of the section.
- Reduced-motion and no-JS paths both render the reel without a blank panel.
- Every piece of copy still matches `rysing-comments.html` verbatim.

### Local harness

- Serve threaded — single-threaded `http.server` dies on the 13 MB reel:
  `python3 -c "from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer; ThreadingHTTPServer(('127.0.0.1',8765),SimpleHTTPRequestHandler).serve_forever()"`
- Drive with `puppeteer-core` against
  `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.
- Abort `.mp4` requests; wait on `domcontentloaded` + `document.fonts.ready`,
  not `networkidle0`.
- Marquee images are lazy — set `loading='eager'` and await `decode()` before
  screenshotting.
- Measure performance interleaved and repeated. A first run is always cold and
  will report false frame drops.

## Report back

- What changed, per phase.
- Anything you wanted to delete but did not.
- Every `TODO(copy)` / `TODO(asset)` left open.
- Screenshots at 1440 and 390.
