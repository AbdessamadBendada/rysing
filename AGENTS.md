# Rysing Website Agent Handoff

## Project purpose

Rysing is a founder-led branding and visibility studio for courageous brands,
ambitious founders, speakers, and recognised experts. The website must feel
premium, bold, warm, editorial, strategically credible, and visually distinctive.
It should present Rysing as a close interdisciplinary studio, not a generic agency,
mass-market coaching funnel, or conventional luxury template.

## ACTIVE TRACK — read this before anything else

**`HANDOFF.md` is the authority. Read it first.** This file carries project
purpose, voice and collaboration style; `HANDOFF.md` carries the build, and it
is current. Where the two disagree, `HANDOFF.md` wins.

The active build is a **five-page static site generated from `src/`**. Every
HTML file at the repository root is generated output — editing one is thrown
away on the next build.

```sh
node build.js        # no dependencies, no install step
```

### File roles for this track

| File | Role |
| --- | --- |
| `src/*.html` | The active build. **The only HTML to edit.** |
| `src/_layout.html`, `_header.html`, `_footer.html`, `_marquee.html`, `_testimonials.html` | Shared chrome and partials — a change here lands on every page. |
| `shared.css`, `shared.js` | Shared by all five pages. Same warning. |
| `build.js` | Stitches `src/` into the root pages. `HANDOFF.md` §12. |
| `index.html`, `about.html`, `process.html`, `contact.html`, `communication-strategy.html` | **Generated. Never edit.** |
| `playground/` | Every earlier concept, kept as history. Do not edit. |
| `playground/rysing-comments.html` | Frozen baseline for copy and section order. Read-only reference. |
| `playground/new-direction-2.html` | **Codex's playground. Never edit or read-modify it.** The user has said this explicitly. |

Anything below the "Source-of-truth order" heading describes the earlier
`rysing-comments.html` cycle and is retained as history — do not act on it
unless the user reopens that track. In particular it names Instrument Serif /
Instrument Sans; the live build uses **Kinfolk and Aileron**.

### The current page set

`index.html` (homepage) · `about.html` · `process.html` (the Spotlight
framework) · `contact.html` · `communication-strategy.html` (the first
service page) · `case-gerd-bommer.html` (the first case study, newest).

Case-study images live in `case-studies/<slug>/`, with the camera originals
and the client's design export in `case-studies/<slug>/_originals/` —
gitignored, same arrangement as `rysing brand assets/`. **The export zip is
the copy source**: it carries a `Main.dc.html` with the full page, the
measured type sizes and the designer's own crops. Use those crops; they are
framed, and the raw files are not.

There is NO case-study templating machinery, deliberately. The second case
study is a copy of `src/case-gerd-bommer.html` with its content swapped — the
decision was that a build-time template is not worth it for a concept design
that gets rebuilt in Divi. All the layout lives in the `.case-` block at the
end of `shared.css`, so a second case study should need no new CSS.

### Backgrounds belong to the page, not to sections

The newest architectural rule, and the one most likely to be broken by
accident. `body` is the single compositing group; a section hosting a
background shape carries `position:relative` and **nothing else** — no
`isolation`, no `overflow:clip`, no opaque `background`, or the shape is cut
at the section boundary again.

| Page | Backdrop model |
| --- | --- |
| `communication-strategy.html` | page-level (§27) |
| `about.html` | page-level (§31) |
| `contact.html` | page-level (§32) |
| `process.html` | page-level (§34) |
| `case-gerd-bommer.html` | page-level (§35) |
| `index.html` | page-level (§36) — the last one, now done |

**`.glow-soft` is deleted**, and so is `.hero-light`'s one-sided variant of
it. No section on the site isolates or clips. Do not reintroduce either rule:
a glow that needs masking at its own edge is a glow whose box is the wrong
size. **Read `HANDOFF.md` §27, §29, §33, §34 and §36 before adding or moving
any background shape on any page.**

**`html { overflow-x:clip }` does not stop horizontal scrolling** — it hides
the scrollbar only. Measured (§36): `communication-strategy.html` can still
be pushed 400px sideways into dead black, and `process.html` 17–88px at
narrow widths. When a shape overhangs the viewport, clip the **shape
container** on the horizontal axis alone — `overflow-x:clip;
overflow-y:visible`, as `.hero-light` does — never the section, and never
`overflow:hidden`, which coerces the vertical axis and puts the section cut
straight back.

**Removing `overflow:clip` is only half of it. The shape's own box is the
other half, and it is the half that keeps getting broken.** A gradient only
paints inside its own element — nothing has to clip for it to be cut. Two
rules, and both have already been broken once each:

> **1. The box must contain the light's falloff on every side.** A glow
> written `inset:0` has a box exactly the size of its section, so a gradient
> centred near that box's edge begins AT the section boundary and draws a
> hard line across the page (§29).
>
> **2. The box must not reach past the bottom of `body`.** There is no page
> fill below it, so the light stops at a hard edge there too — and the
> overhang becomes dead scroll at the end of the document (§33).

So size and place the element **by the light**, per shape, asymmetrically —
never one blanket overhang for every glow. And watch the units: a radius in
`vw` or `px` does not scale with the box and must not be rescaled with it
(§32). Cap an offset wherever you cap a width, or neither (§33).

Three checks, all cheap, each one added because looking at the page missed
the bug:

| Check | Catches |
| --- | --- |
| whole-page scan for full-width hard rows | a glow cut at a section edge |
| `scrollHeight` vs `body` bottom, at several widths | a glow past the end of the page; dead scroll |
| assert each light's centre against its authored position | a light that moved when it should not have |

A single-boundary probe and a `fullPage` screenshot have each passed a defect
that was plainly visible in a browser. Do not rely on either.

**And the hard-row scan has a blind spot (§34).** A glow anchored off one
side is cut across *its own* width, not the page's. The process page's cut
spanned 42% of the columns and a scan thresholded at 90% coverage reported
the page clean. Scan for a run of columns changing together, or threshold at
25% and read the geometry of every hit.

**Edit CSS rules by selector, never by a string that repeats across rules.**
Five glows shared one identical `inset` line; sequential replacement
scrambled the boxes across the gradients and still looked plausible (§33).

### Non-negotiables

- **Copy and section order are frozen.** For the pages that came from it, lift
  copy verbatim from `playground/rysing-comments.html`. Do not reword, add, or
  drop visible copy without asking.
- **Section order on a service page is given, not derived.** The client
  supplies these pages section by section and says where each one goes. A
  design argument for a different order — even a correct one, even one this
  document makes elsewhere — is something to raise, never a reason to build
  it differently. The testimonial rail was placed before the closing ask on
  exactly that reasoning and had to be moved. `HANDOFF.md` §27.
- **For the service pages, the client's mocks are the copy source** and the
  same rule applies: transcribe verbatim, including inconsistencies. The
  communication-strategy page mixes "I" and "we", mixes -ize and -ise
  spellings, and drops a full stop in one row. All of it was left as supplied
  and flagged to the client rather than silently corrected. See `HANDOFF.md`
  §27 "Open".
- **The client dislikes heavy black** in the *older* light-sectioned build. The new
  direction is deliberately black-first because the reference is — this is an
  approved exception, not a contradiction. Do not "fix" it.
- Push directly to `main`; no feature branches on this project.
- Do not commit, push or deploy unless the user asks.

### The design language

- One continuous black ground for the whole page. The reference never cuts to a
  light, red, or blue full-bleed panel and neither do we. An earlier pass
  transplanted `rysing-comments.html`'s paper/red/blue sections and it was wrong.
- Kinfolk (didone, caps-only) and Aileron (grotesque) **alternate inside a single
  headline**. `.display` is the Kinfolk default; `.display .alt` flips a run back
  to Aileron 600. This alternation is the signature of the direction.
- `.label` is the universal micro-label (11px/600/.17em/uppercase).
- `.btn-pill` is the only button, and it carries the star-mark arrow — the
  mocks all draw `↗` instead, which is still undecided and is shared chrome,
  so changing it lands everywhere at once.
  **"The only filled pill marks the ask" has stopped being true.** There are
  **six filled pills across four pages** — contact's submit, about's closing,
  Gerd's closing, and three on `communication-strategy.html` alone, where all
  four pills say "Book a call" and all four go to `contact.html`. §30 said
  two and undercounted; the census is `HANDOFF.md` §38. A decision for the
  client, since her mocks draw them filled — retiring the rule is as valid an
  answer as changing the page.
  **Two classes do this job**: `.btn-pill--solid` (two hyphens, used
  everywhere) and `.btn-pill-solid` (one, used once on the contact form's
  submit). Both fill; they differ only in hover border. Reach for the wrong
  one and nothing warns you. §38.
- **The brand pattern assets (`pattern-red.webp`, `pattern-blue.webp`) are the
  background shapes. Do not draw them as gradients** — that shipped once and
  read as fuzzy blobs. `HANDOFF.md` §26. The same asset is lit three different
  ways across the site on purpose; §27 says which and why.
  **The exception is ambient light with no edge.** Where a mock draws a wash
  rather than a disc — the service page's price corner — the asset floods the
  section and a gradient is correct; §29 records that attempt and why it was
  reversed. If the design shows a circular boundary, it is the asset.
- Tokens: ink `#000000`, ink-deep `#000000`, paper `#f9f9f9`, red `#f04222`,
  blue `#3524d5` — all four now the brand book's own values, see
  `rysing brand assets/Branding-Guidelines.pdf` §3.0 and `HANDOFF.md` §28.
  The black was `#141414` until the client asked for the document to be
  followed; `--ink-deep` was a darker tone and nothing is darker than `#000`,
  so it is the same black and the hero's gradient ground is now flat. Grain
  is generated in CSS, not loaded (the supplied plate is 4.3 MB and does not
  tile).

### Section order as built

**Homepage:** header · hero · showreel aperture · stats · services accordion ·
selected work · manifesto · founder plate · founder copy · team roster ·
recognition marquee · testimonials · spotlight · newsletter · final CTA ·
footer.

**`about.html`** (`HANDOFF.md` §22, §31): hero · conviction · founder · team ·
studio · courage · stats · testimonials · recognition · the standard ·
closing.

**`communication-strategy.html`** — the service-page template, complete at
eight sections (`HANDOFF.md` §27, §29, §30): hero · intro and three outcomes ·
four deliverables on spheres · the six-step process table · three figures ·
"why work with me" · **testimonials** · **price** · **closing**.

That order is the client's, given section by section.

**`case-gerd-bommer.html`** — the case-study template, thirteen sections
(`HANDOFF.md` §35): hero · **about / the brief / strategy as one cascading
three-up** · the brand line and "the line and the G" · logo · speaking
T-shirts · the bike · website · social · result · testimonial · closing.

Her design stacks the first three as separate rows; they are one three-up
here because as rows they ran to three screens of text before the first
photograph. That is a layout change, not a change of order or copy. The rail sits after the
ask because she said so, not because it reads better there.

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
9. **The case study's narrative three-up is a cascade, and the flush
   version was already tried.** About / the brief / strategy step down by
   ~78px and ~156px. Level tops left a pit of dead air under the middle and
   right columns because the three run to very different lengths, and the
   short rules floated with nothing binding them. A ruled-column variant was
   built alongside and removed. Do not flatten the steps. `HANDOFF.md` §35.
10. **On the case study, photographs take `--photo-grade` and artwork never
   does.** The logo lockups, the website screens and the LinkedIn posts are
   another brand's royal blue and yellow; the grade pulls saturation to .62
   and mutes the thing the section exists to show. First page on the site
   where this applies. `HANDOFF.md` §35.

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
  The client's service-page mocks show an inline nav (HOME / ABOUT / SERVICES
  / PORTFOLIO / BLOG / CONTACT) where the live header has mark + ask + burger.
  Not actioned — it would change every page.
- ~~Nothing links to `communication-strategy.html`~~ — wired in §37. The
  overlay's "Services" points at it, **as a stopgap**: the `#system`
  accordion's four levels are the real services list and none of them is
  named Communication Strategy, so this wants to become a services index the
  moment a second service page lands.
- ~~Nothing links to `case-gerd-bommer.html` either~~ — wired in §37 from two
  places: its own work panel (which already drew "Learn more" and already had
  the `TODO(link)`) and the spotlight pill, which until then pointed at
  `playground/rysing2.html` and rendered with broken images. **`about.html`
  turned out to be unreachable too** and was repointed with them.
  Both homepage links now lead to the same page, which sharpens §9's note
  that Gerd's photograph is already on the homepage twice.
- The case study carries the **shared header and footer**, where the client's
  mock drew its own small wordmark and a bare closing arrow instead. A case
  study is not a separate website; raised with the client, not yet answered.
- Its hero headline is **the one hero on the site with no Aileron run** —
  the mock sets "UNTAMED ENERGY" entirely in the didone. Transcribed as
  drawn and flagged, not corrected.
- `case-gerd-bommer.html` **grades photographs and never artwork**. Gerd's
  royal blue and yellow are another brand's colours, and `--photo-grade`
  pulls saturation to .62 — running it over the logo lockups, the website
  screens or the LinkedIn posts mutes the exact thing the page is presenting
  as evidence. See the note at the top of the `.case-` block.
- Its Result section still holds **the client's own bracket** —
  `[ONE RESULT: FOLLOWERS, REACH, BOOKINGS OR INBOUND SINCE LAUNCH]`, drawn
  dashed as she drew it. It is the page's only hard outcome and she has to
  supply the number.
- ~~`index.html` is the last per-section page~~ — came over in `HANDOFF.md`
  §36, and the backdrop conversion is finished. `.reel` turned out to have no
  stacking context at all. **§12's 0-of-22,821,120-pixel baseline is void**;
  §36 carries the new one. Two defects the mask had been hiding were fixed
  with it: the hero's discs were offset in `vh` while sized in `vw`, so at
  390px the blue sat entirely below the hero, and `.belong-glow` was 4.5%
  wider than the page at the top of its breathe.
- **The mobile hero now shows blue where the signed-off page showed none** —
  the old mask deleted it outright at narrow widths. Worth one screenshot to
  the client.
- **Horizontal scrolling is still live on two pages** —
  `communication-strategy.html` 400px, `process.html` 17–88px at 360–620.
  Same fix as §36's.
- More service pages are expected; this one is the template. **Their section
  order comes from the client, section by section.**
- **Nothing from this cycle is committed** — `HANDOFF.md` §36, §37 and §38
  are all in the working tree. The §27–§34 work behind them has been pushed.
- **Two `[__]%` placeholders render at display size on
  `communication-strategy.html`** — visible copy on a finished page, not code
  markers. Only the client can fill them: they are statistics about consumers
  and revenue. **Do not send that page to review with the brackets in it**,
  and do not invent the numbers — the second one's own sentence says "over
  50%", which is a hint, not a figure. `HANDOFF.md` §38.
- **Four things on that page want one message to the client**, listed
  together at the end of §38: the two percentages, the €1,400 KMU.Digital
  claim, the faint arc both mocks draw, and the three filled "Book a call"
  pills.
- Awaiting the user's remaining round of comments. They work section by section.
- Still carrying `TODO(link)`, `TODO(copy)` and `TODO(asset)` markers
  throughout. The ones that render to the reader rather than sitting in a
  comment are the two `[__]%` above and the case study's
  `[ONE RESULT: …]` bracket.
- Newsletter form is still a prototype with no backend.

### Local testing harness

- Serve with a **threaded** server — the single-threaded `python3 -m http.server`
  stalls and dies on the 13 MB showreel:
  `python3 -c "from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer; ThreadingHTTPServer(('127.0.0.1',8765),SimpleHTTPRequestHandler).serve_forever()"`
- **There is no Puppeteer or Playwright installed, and none is needed.** Drive
  the installed Chrome at
  `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` directly —
  `--headless --screenshot` for a quick look, or CDP over
  `--remote-debugging-port` for anything that needs real frames. Node 24 has a
  global `WebSocket`, so a CDP client is about 20 lines with no dependencies.
- **`--virtual-time-budget` fires `requestAnimationFrame` roughly once**, so
  anything rAF-driven (the parallax, the reel aperture) looks frozen and reads
  as a bug that is not there. Use CDP for those.
- **`scroll-behavior:smooth` on `html` swallows programmatic scrolling** — set
  `scrollBehavior='auto'` first or `scrollTop` silently stays at 0.
- **Full-page captures come out blank below the fold**, because `[data-reveal]`
  never intersects. Sweep the page in steps first; reveal is one-way.
- **Headless clamps the viewport near 500px.** A `--window-size=390` capture
  renders at 500 and crops, which looks exactly like a horizontal-overflow
  bug. Use `Emulation.setDeviceMetricsOverride` over CDP.
- **Chrome serves the generated HTML from its own cache**, so a CSS change can
  measure as a perfect no-op while the old page is on screen — the stale
  `?v=` hash rides along inside the cached markup. Send
  `Network.setCacheDisabled` and reload with `ignoreCache`, or use a fresh
  `--user-data-dir`, and **confirm the value you changed is live in the page
  before trusting any comparison** (`HANDOFF.md` §28).
- **Two servers means two near-identical pages.** The client's design export
  (`case-studies/<slug>/_originals/…zip`) renders as its own page and looks
  like our build at a glance. A glow cut reported against our page turned out
  to be hers on the other port — her sections carry `overflow:hidden`, ours
  do not. **Confirm which URL is on screen before changing anything.**
- **Block `*calendly.com*` when measuring the contact page.** The iframe
  resolves to a different height between loads, which moves everything below
  it and makes before/after numbers meaningless (§32).
- **To compare two CSS formulations, toggle them inside one page load** rather
  than across two runs — set the old values back onto the element from
  script, measure, restore, measure. Decorative glows are
  `position:absolute`, so toggling cannot reflow anything, and every other
  variable is held identical by construction (§32).
- Full detail and the rest of the gotchas: `HANDOFF.md` §26, §27, §29 and §33.
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
