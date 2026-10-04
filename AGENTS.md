# Rysing Website Agent Handoff

## Project purpose

Rysing is a founder-led branding and visibility studio for courageous brands,
ambitious founders, speakers, and recognised experts. The website must feel
premium, bold, warm, editorial, strategically credible, and visually distinctive.
It should present Rysing as a close interdisciplinary studio, not a generic agency,
mass-market coaching funnel, or conventional luxury template.

## ACTIVE TRACK — read this before anything else

The active build is **`new-direction.html`**. It is a ground-up rebuild against a
new design reference and is *not* a revision of `rysing-comments.html`. Everything
below the "Source-of-truth order" heading describes the earlier
`rysing-comments.html` cycle and is retained as history — do not act on it unless
the user reopens that track.

### File roles for this track

| File | Role |
| --- | --- |
| `new-direction.html` | The active build. The only file to edit. |
| `new-direction-2.html` | **Codex's playground. Never edit or read-modify it.** The user has said this explicitly. |
| `rysing-comments.html` | Frozen baseline for copy and section order. Read-only reference. |
| `~/Downloads/Homepage-html/Main.dc.html` | The design reference mockup (a design-tool export). Replicate its values in our own system; never copy its markup or its `support.js`/`vendor/` runtime. |

### Non-negotiables

- **Copy and section order are frozen.** Lift copy verbatim from
  `rysing-comments.html`. Do not reword, add, or drop visible copy without asking.
- **The client dislikes heavy black** in the *older* light-sectioned build. The new
  direction is deliberately black-first because the reference is — this is an
  approved exception, not a contradiction. Do not "fix" it.
- Push directly to `main`; no feature branches on this project.
- Nothing is committed yet for this track at time of writing.

### The design language

- One continuous black ground for the whole page. The reference never cuts to a
  light, red, or blue full-bleed panel and neither do we. An earlier pass
  transplanted `rysing-comments.html`'s paper/red/blue sections and it was wrong.
- Kinfolk (didone, caps-only) and Aileron (grotesque) **alternate inside a single
  headline**. `.display` is the Kinfolk default; `.display .alt` flips a run back
  to Aileron 600. This alternation is the signature of the direction.
- `.label` is the universal micro-label (11px/600/.17em/uppercase).
- `.btn-pill` is the only button, outlined, with the star-mark arrow.
- Tokens: ink `#141414`, ink-deep `#0d0d0d`, paper `#f9f9f9`, red `#f04222`,
  blue `#3524d5`. Grain is generated in CSS, not loaded (the supplied plate is
  4.3 MB and does not tile).

### Section order as built

Header · hero · showreel aperture · stats · services accordion · selected work ·
manifesto · founder plate · founder copy · team roster · recognition marquee ·
testimonials · spotlight · newsletter · final CTA · footer.

### Decisions already settled — do not silently reverse

1. **The showreel aperture stays.** A 260vh sticky section where the brand star
   opens on scroll (`--aperture`) to full bleed. It was once removed for being
   off-brand and the user asked for it back; that was the agent's mistake, not a
   design change. The star begins as a solid paper mark and crossfades to footage
   via `--reel-reveal`, because the reel's opening second inverts to near-white
   and a small mask was filling with a white blob. `--reel-progress` drives a
   grade that clears before the reel fills the frame.
2. `reel-03.jpg` is the poster — the only dark frame in the set.
2b. **The reel must keep playing.** Two things were stopping it. The
   IntersectionObserver watched the *video*, whose box sits inside the sticky
   stage and therefore leaves the viewport the moment the stage releases — so
   the pause boundary landed mid-scroll and nudging across it stopped and
   started the reel repeatedly. It now watches the `.reel` section with
   `rootMargin:'100% 0px'`, so it only stops a full viewport clear of the
   section. Separately, compositing a full-viewport masked *and* filtered video
   every scroll frame cost ~22% of playback rate; `.reel.is-revealed` drops the
   mask and filter once `eased >= 0.92`, where both are already no-ops. Verified
   pixel-identical across the toggle and 100% playback rate after. Do not
   reintroduce a tighter pause boundary.
3. **Services:** the numeral is a grid sibling of the body, *not* inside the
   button. Putting it inside made the numeral set the row height and left ~170px
   of dead air under the name. The whole row is clickable (the numeral is half
   the row and was dead to the pointer); the button remains the keyboard control.
   Closed rows show the name at display size, opening demotes it. Row 01 opens on
   load. Numerals are Aileron 300, matching the reference — not the didone.
4. **Measures are set in `em`, never `ch`.** `ch` is the resolved font's zero
   width: Kinfolk's is 0.70em, the macOS Didot fallback's is 0.52em, so a
   `ch` measure silently narrows by a quarter whenever the webfont is late. This
   is what made the manifesto wrap to seven lines instead of five, and it
   reflowed on every cold load under `font-display:swap`.
5. **Logo marquee:** the supplied marks are black artwork on transparency inside
   square canvases, with the mark filling 16%–80% of the canvas depending on the
   file. Each `<img>` carries its measured content fraction as `--f`, and is
   `transform:scale(calc(.48 / var(--f)))` so every mark lands on the same optical
   height. Scaling rather than sizing is deliberate: growing the canvas made tall
   ones overflow the row box, and overflowing items stop centring. Colour is
   forced to flat white with `brightness(0) invert(1)` (a plain `invert()` leaves
   greys as mud). Two marks are already light artwork and carry `data-light`,
   which takes the grade without the flip.
6. `html { overflow-x: clip }` — the stats glow drifts ~4px past the viewport by
   design and the section deliberately avoids `overflow:hidden` (clipping a soft
   glow leaves a hard edge). `clip` stops the scrollbar without making the root a
   containing block for the fixed header.
7. `scroll-margin-top:112px` on every `section[id]`, because the header is fixed
   at 92px.
8. The footer carries the same drifting red/blue lights as the hero.

### Known problems that need the client, not code

- `logo-clemensdoppler.webp` has a **semi-transparent halftone circle over the
  wordmark in its alpha channel**. No filter can rescue it; it needs clean
  artwork. It is visibly mottled in the marquee today.
- `logo-jenniferdjongow.webp` carries small chart icons that read as clutter at
  marquee size.
- **The showreel footage is off-brand** — brush-script and neon cards, unrelated
  to the restrained black/Kinfolk page. Framing it contained the damage; it needs
  a re-cut or re-grade.
- **Work gallery image quality is uneven**, and this is the biggest remaining
  weakness on the page. `project-01-bommer.webp` holds the lead panel and is a
  blurry phone snapshot of a banner on asphalt with a shoe in frame. `05` and
  `06` are soft. `02` and `04` are crisp. Offered to reorder so a strong image
  leads; the user has not answered yet.
- No landscape founder photograph exists. Every supplied shot is portrait and
  `anzhelika-portrait.png` is a cut-out that floats in black at full width, so
  the wide plate runs `anzhelika-office.webp` at 16/8 with a tuned crop.
- Kinfolk's web licence is **not cleared**. Aileron is public domain. Qualy, the
  logo face, is never loaded — the wordmark ships as artwork.

### Next up

- The user has said the header will be reworked later; it is untouched for now.
- Awaiting the user's remaining round of comments. They work section by section.
- Still carrying `TODO(link)`, `TODO(copy)` and `TODO(asset)` markers throughout.
- Newsletter form is still a prototype with no backend.

### Local testing harness

- Serve with a **threaded** server — the single-threaded `python3 -m http.server`
  stalls and dies on the 13 MB showreel:
  `python3 -c "from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer; ThreadingHTTPServer(('127.0.0.1',8765),SimpleHTTPRequestHandler).serve_forever()"`
- Drive with `puppeteer-core` against the installed Chrome at
  `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.
- **Abort `.mp4` requests and wait on `domcontentloaded` + `document.fonts.ready`,
  not `networkidle0`** — the video otherwise times out every navigation.
- Marquee images are lazy; set `loading='eager'` and await `decode()` before
  screenshotting them, or they capture blank.
- A 404 for `rysing-showreel-web.mp4` in logs is the dev server refusing Range
  requests. The file exists. Not a bug.

## Source-of-truth order

For the current client-revision build, use this order when instructions conflict:

1. The user's latest explicit instruction.
2. `RYSING_REVISION_2.md`.
3. `RYSING_COMMENTS_BRIEF.md`.
4. `RYSING_PROJECT_DIRECTION.md` for broader brand history and decisions.
5. Earlier HTML concepts as visual or implementation references only.

Read both revision briefs completely before changing the active page. Record any
new approved design, content, positioning, or interaction decision in
`RYSING_PROJECT_DIRECTION.md`. Never silently reverse a logged decision.

## Current files

- `rysing-comments.html` is the active client-revision build and the only page to
  edit for the current revision cycle.
- `rysing.html` is the controlling visual reference for the current revision.
- `rysing-v2.html` is the rollback copy from which `rysing-comments.html` was
  originally duplicated.
- `rysing2.html` is the separate premium private-client concept previously
  refined and published for review.
- `rysing-private.html` is the first private-client concept retained for
  comparison.
- `RYSING_COMMENTS_BRIEF.md` contains the first client-revision specification.
- `RYSING_REVISION_2.md` contains the later corrections and wins when it conflicts
  with the first brief.
- `RYSING_PROJECT_DIRECTION.md` is the long-term design and implementation log.
- Shared media lives in `rysing-assets/`.

Do not edit `rysing.html`, `rysing-v2.html`, `rysing2.html`, or
`rysing-private.html` while implementing the current client revision. Never
overwrite or delete one concept merely because another is preferred.

## Active direction for `rysing-comments.html`

### Positioning and voice

- Position Rysing as a branding and visibility studio for courageous brands and
  ambitious founders.
- Lead with visibility, authority, impact, differentiation, legacy, and thought
  leadership.
- Keep the voice direct, assured, and energetic without generic agency claims or
  manufactured exclusivity.
- Preserve supplied client copy exactly when a brief marks it as verbatim.
- Never invent project names, metrics, testimonials, awards, results, URLs, or
  team credentials.

### Visual language

- Instrument Serif carries all display headings.
- Instrument Sans carries body copy, labels, navigation, buttons, and the
  RYSING wordmark.
- Red `#f04222`, warm paper, near-black, white, and the approved keynote blue are
  the active palette.
- Red is a decisive brand signal, not the background of every section.
- Red italic emphasis inside display headings is an approved device.
- Use large editorial typography, strong photography, controlled negative space,
  and expansive compositions.
- Avoid excessive cards, generic grids, fake luxury effects, astrology, glitter,
  and decorative diagrams without meaning.

### Heading rules

- Short structural headings should render in no more than two lines.
- The hero H1, manifesto statement, and final CTA are exempt and may use three or
  more lines where the composition needs it.
- Never shrink display type below its clamp floor merely to meet a line count.
- Adjust the text measure or report a conflict instead.

### Current page structure

1. Showreel hero with wordmark, red application CTA, accessible menu, eyebrow,
   and Instrument Serif headline.
2. Large positioning manifesto.
3. Six selected projects in two hover-expanding strips of three.
4. Four service levels using expandable rows; the complete open row turns red.
5. Client/recognition strip.
6. Founder-led About section.
7. Four-person studio roster.
8. Testimonials and proof.
9. Blue Spotlight/keynote feature.
10. Sunday Fudge newsletter section.
11. Full-red final CTA.
12. Site footer.

### Interaction and accessibility

- The full-screen menu opens from the right, traps focus, closes with Escape or a
  selected link, restores focus, and prevents background scrolling.
- Desktop project panels expand on hover or focus; the layout stacks without the
  expansion effect below 840px.
- Important information must never depend on hover alone.
- Preserve visible focus states, semantic landmarks, valid labels, useful alt
  text, mobile layouts, and `prefers-reduced-motion` support.
- Content must remain readable if JavaScript fails.

## Verification before reporting completion

- Test at 360px, 768px, 1024px, 1440px, and 1920px.
- Confirm there is exactly one H1 and no display heading falls below its clamp
  floor.
- Confirm the manifesto is the page's largest typography.
- Confirm project panels expand and no project title is clipped.
- Confirm the full open service row is red and its text contrast passes 4.5:1.
- Confirm the final CTA button is clearly visible on red.
- Confirm DOM order matches visual order and no `order:` declarations remain.
- Confirm the overlay menu is keyboard operable and its mobile trust signals are
  visible.
- Confirm all fragment links resolve, IDs are unique, and local assets exist.
- Confirm there is no horizontal scrolling at 360px.
- Keep below-the-fold imagery lazy-loaded and asynchronously decoded.

## Content and production cautions

- Placeholder testimonials, metrics, awards, URLs, and team details must remain
  visibly identified until verified.
- Kristina's discipline is still marked “to be confirmed.”
- Several case-study destinations remain temporary or unavailable.
- The newsletter form is a visual prototype and needs a real subscription
  backend before launch.
- Final legal, privacy, social, and contact destinations still require approval.
- Production self-hosting of the Instrument font files remains open.

## GitHub repository

- Repository: https://github.com/AbdessamadBendada/rysing.git
- Default branch: `main`.
- The repository previously received `rysing.html`, `rysing2.html`, and the assets
  required by those pages.
- Do not assume `rysing-comments.html` or the Markdown documentation has been
  pushed merely because it exists locally.
- Do not push `rysing-private.html`, the original MOV, screenshots, `.DS_Store`,
  `rysing-assets/_originals/`, or other working files unless explicitly asked.
- Before pushing, fetch the remote branch, preserve remote changes, stage only the
  requested files, and verify the remote commit afterward.

## Current open work

> Superseded for the active track — see "ACTIVE TRACK" at the top of this file.
> The list below belongs to the earlier `rysing-comments.html` cycle.

- Continue revisions only in `rysing-comments.html` unless the user changes the
  target explicitly.
- Validate the current build against every item in `RYSING_REVISION_2.md` and its
  verification checklist.
- Replace placeholders and temporary case-study links only with approved facts.
- Confirm Kristina's role and final team content.
- Connect the newsletter form to an approved backend.
- Confirm legal, privacy, social, case-study, and contact destinations.
- Self-host the final Instrument font files for production.

## Collaboration style

- The user prefers fast, conversational, section-by-section iteration.
- Be candid when a visual treatment is not working.
- Lead with the visible outcome, not implementation details.
- Preserve prior versions while exploring alternatives.
- Do not push, deploy, or publish changes unless the user asks.
