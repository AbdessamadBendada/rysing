# WordPress / Divi port — handoff

The running state of the Divi 5 port. **Update the Status board at the bottom of
every work batch**, before the context gets cleared. A new session should be
able to read this file alone and carry on.

The root `HANDOFF.md` governs the static site and the design itself. This file
only covers the WordPress port. Where they disagree about copy, structure or
section order, **the root file and the client win** — the port follows the
static source, never the other way round.

---

## 1. Status

| | |
|---|---|
| **Homepage** | Ported, verified pixel-identical, live at `http://rysing.local/` |
| **Media** | All 32 content images/videos in the Media Library; no content image served from the theme |
| **Header + footer** | Global Divi Theme Builder templates — every future page inherits them |
| **Other 5 pages** | Not started |
| **Milestone** | *Visually converted.* **Not production-ready** — see §7 |

Last verification: `PASS` — all four gates. 0px height difference at all 8
viewports, every item grid pixel-identical, 0 horizontal overflow, 0 console
errors; no Divi section padding leaking; all 43 authored pseudo-elements
generated and painting. Additionally: 332 authored element boxes compared at
5 widths with 0 differences, and a **rendered-pixel** comparison at 12 scroll
positions — 10 of 12 byte-identical, 5 differing pixels in 15.5M, worst
channel delta 12. Button-module
pills additionally asserted in text — resting and hover colour, fill, border and
star transform all match the static source (see the three pill traps in §6).
Media audit: `PASS` — 32 attachments, 265 responsive sizes, 0 theme-asset URLs
in content, all uploads URLs resolve.

---

## 2. Environment

| | |
|---|---|
| Local site | `rysing` → `~/Local Sites/rysing/app/public`, site id `mDtIZHnnu` |
| URL | `http://rysing.local/` |
| WordPress | 7.1.3 · **Divi 5.0.1** (block format is pinned to this — re-verify after any Divi upgrade) |
| Active theme | `rysing-divi-child` (parent: Divi) |
| Homepage | page ID **8**, slug `home`, set as the static front page |
| Admin | user ID 1 |

The Local site must be **running** — the scripts talk to its MySQL socket.

---

## 3. Commands

Everything runs from the repo root.

```sh
wordpress/wp <any wp-cli command>            # WP-CLI, preconfigured for this site
wordpress/sync-theme.sh                      # deploy Git source -> live theme
wordpress/wp eval-file wordpress/create-home-page.php
wordpress/wp eval-file wordpress/create-theme-builder.php

wordpress/wp eval-file wordpress/import-media.php          # assets -> Media Library
wordpress/wp eval-file wordpress/rewrite-media-urls.php     # content -> uploads URLs
wordpress/wp eval-file wordpress/rewrite-media-urls.php dry-run
wordpress/wp eval-file wordpress/verify/audit-media.php     # media gate
```

**Run `import-media.php` before any generator on a fresh database.** The
generators resolve media through the Media Library and hard fail if an
attachment is missing — by design, so a re-run can never restore a theme URL.

Both generators are **idempotent** — re-running is a verified no-op, never a
duplicate. Run them after any change to the page structure.

### Verification gate

```sh
python3 -m http.server 8777 --bind 127.0.0.1 &   # serve the static source
npm i playwright && npx playwright install chromium
node wordpress/verify/compare.js                 # add --shots for images
node wordpress/verify/section-padding.js         # Divi section padding leak
node wordpress/verify/pseudo-elements.js         # authored ::before/::after
```

Exits non-zero on any regression. **Run all three at the end of every
batch**, plus the media audit above.

**`compare.js` measures section HEIGHTS and cannot see a section whose
contents are shifted inside a correctly-sized box.** Its own header says a
layout can "measure perfectly while being completely wrong to look at", and
that is exactly what happened to `.reel` — see the Log entry below.
`section-padding.js` closes that one hole; it is not a general cure. When a
new page is ported, also compare element geometry directly, not only heights:
every authored element's x/y/width/height, keyed by authored class name,
because Divi's DOM shape differs and any path-based key mismatches by
construction.

### After changing CSS or PHP

```sh
wordpress/sync-theme.sh
rm -rf ~/Local\ Sites/rysing/app/public/wp-content/et-cache
```

Divi caches aggressively; a stale `et-cache` makes fixes look like they failed.

---

## 4. Layout of the work

```
wordpress/
  wp                      WP-CLI wrapper (Local's PHP + the site's php.ini)
  sync-theme.sh           Git -> live theme; verifies the asset path rewrite
  lib/blocks.php          Divi 5 block builders, shared by both generators
  lib/assets.php          Media manifest (title + alt) and rysing_asset_url()
  import-media.php        Idempotent import into the Media Library
  rewrite-media-urls.php  Repoints existing content at /wp-content/uploads/
  verify/audit-media.php  Media gate: no theme URLs, complete attachments
  create-home-page.php    The homepage: 15 sections, frozen order
  create-theme-builder.php  Global header, menu overlay and footer
  verify/compare.js       The fidelity gate
  rysing-divi-child/      The child theme (Git source of truth)
    functions.php         Enqueues, page-role helper, head tags, Divi overrides
    assets/css/divi.css   The adapter — every rule says why it exists
    assets/css/divi-home.css
```

**Never edit the live theme.** Edit here, then `sync-theme.sh`.

`base.css`, `main.js` and `assets/rysing-assets/` are **derived** at sync time
from the repo root's `shared.css`, `shared.js` and `rysing-assets/`. They are
deliberately not committed under the theme — one source of truth, and `base.css`
stays byte-identical to `shared.css` apart from one asset-path rewrite, which is
what lets a diff show exactly what Divi cost us.

---

## 5. Architecture — the decisions that matter

**Page content lives in the database, not in Git.** Deploying the theme does
*not* deploy the pages. The generators are how pages get rebuilt.

1. **`display: contents` on Divi's wrappers** restores the source's DOM shape so
   `shared.css` applies unchanged. Disabled inside the Visual Builder
   (`body:not(.et-fb)`) so modules stay selectable and editable.
2. **Design classes go on sections and columns, never rows.** Divi paints rows
   heavily and at specificity the design cannot beat. `r_grid()` in
   `lib/blocks.php` exists for this.
3. **Adapter rules use `:where()`** (zero specificity) so any design rule wins —
   *except* where Divi declares something the design never does, or ships
   `!important`. Each exception is marked in `divi.css`.
4. **Text modules for prose, Code modules for structure.** Divi's Text module
   runs `wpautop`, which injected 110+ paragraphs and broke the child-combinator
   selectors the work gallery depends on. Every heading, paragraph, eyebrow and
   CTA is still a native module the client edits normally.
5. **Content media lives in the Media Library, never the theme.** The client
   can see and swap every logo, portrait and work image in WP admin, and
   WordPress generates responsive sizes for them. `lib/assets.php` is the single
   source of truth for each file's title and alt text, read by both the importer
   and the generators. Attachments are keyed by `_rysing_source_asset`, not by
   filename — WordPress renames colliding uploads, so the filename is not stable.
   **Only these may stay in the theme:** `pattern-blue/red.webp` (fixed
   decorative backdrops, referenced solely from `base.css`), the five `.woff2`
   faces, and the favicons. `verify/audit-media.php` enforces that list.
6. **Divi's critical CSS and static CSS file are disabled site-wide** — they
   re-declared `.et_pb_section` padding *after* the design stylesheet.

---

## 6. Traps already paid for

Each cost a measurement cycle. All are documented in situ; this is the index.

| Symptom | Cause |
|---|---|
| Blank page, no error | No admin user set → KSES encodes block comments |
| Page renders but all chrome missing | `page-template-blank.php` **disables Theme Builder header/footer** — use `default` |
| Header/footer never appear | Template not attached to the live `et_theme_builder` container via `_et_template` meta |
| Whole page blank, header fine | Body layout meta set to id 0 **and disabled** — must be id 0 **enabled** |
| White plates, grey headings | Divi's `.et_pb_section` white + `h1–h6 {color:#333}` — geometry still measures perfect |
| Grids collapse, text 1 char wide | Divi's `float:left` on a `display:contents` column → every `fr` track resolves to 0 |
| Gutters vanish above 1350px only | Divi's critical/unified CSS loading after the design stylesheet |
| Section ~54px too tall | `.et_block_row { padding: 2% 0 }` — note it is a *second* class on the row |
| Hand-set offsets lost | `>` and `:last-of-type` need real siblings; `display:contents` does not provide them |
| Lists 33px too tall | Divi's `.et-l--body ul` padding + `line-height: 26px` |
| Pills 23px narrow | Divi positions its button `::after` absolutely → no width in the flex line |
| Overlay transparent | The one section the design paints; excluded from the background reset |
| Import fatals immediately | `wp_handle_sideload()` takes `$file` **by reference** — cannot be passed an inline array |
| Import says "0 attachments" after creating 32 | A lookup helper that caches MISSES; only ever cache hits |
| Attachments import with no responsive sizes | `wp-admin/includes/image.php` not required — CLI does not load it, and it fails silently |
| `wp eval-file ... --flag` rejected | `eval-file` forwards **positional** args only; use `dry-run`, not `--dry-run` |
| Header/footer images still on theme URLs | A rewrite that walks only `page` — Divi chrome lives in `et_header_layout` / `et_footer_layout` |
| Pills and their stars render Divi blue | `.et_pb_bg_layout_light.et_pb_module.et_pb_button { color:#2ea3f2 }` is **(0,3,0)** and beats base.css's `a { color:inherit }`. The star is `background:currentColor`, so it takes the wrong colour too. Header/footer pills are real anchors, not Button modules, so they look fine — **the chrome being correct is not evidence the body pills are** |
| The star rides ~5px high in a pill | `.et_pb_button::after { top:50%; transform:translateY(-50%) }`. Resetting `top`/`position` is not enough — the transform is a separate declaration and survives alone. Half the glyph's 11px height |
| Pill does not fill paper on hover | `.et_pb_button:hover { background-color:rgba(0,0,0,.05); border-color:transparent }` outranks `.btn-pill:hover` at (0,2,0) |
| Pill visibly narrows under the cursor | `.et_pb_button:hover { padding:.3em 2em .3em .7em }` — Divi opening a gap for its sliding glyph. At 11px that is `3.3px 22px 3.3px 7.7px`: left padding collapses 22px → 7.7px, **−12.3px of width on hover**. The right side only looks untouched because 2em at 11px coincidentally equals the design's 22px |
| Pill grows 2px on hover | Divi also takes the border 1px → 2px. Shrink-to-fit under `border-box` makes that real width. **A `border-color`-only override does not catch it** — use the `border` shorthand |
| Body copy renders a step bold | Divi's customizer emits an **inline** `body { font-weight:500 }`; the source sets 400. 30 text runs affected — stat captions, all four `.system-for` lines, `.band-note`. Headings are immune (explicit weights), so it reads as "the small print looks slightly bold". Inline beats an external sheet on origin, so this needs `!important` |
| Showreel aperture starts 57px low and loses 57px of scroll travel | `.et_pb_section { padding: 4% 0 }` (`50px 0` below 981px) at **(0,1,0)** beats `divi.css`'s deliberately zero-specificity `:where(...) { padding: 0 }`. Every other section escapes only because it declares its own padding and wins on order; **`.reel` declares none** (`position:relative; height:260vh` and nothing else). **Invisible to `compare.js`** — `.reel` has a fixed height so the padding is absorbed, not added: the section measured 2340px on both sides and the gate passed at 0px across all eight viewports. What moved was the sticky `.reel-stage` inside it. Fixed by name at (0,2,0); `verify/section-padding.js` now guards it |
| An absolutely positioned element ignores its `right` inset | `.et_pb_gutters3 .et_block_row .et_pb_column_4_4 { width:100% }` at **(0,3,0)** beats the port's `body.rysing .et_pb_column { width:auto }` at (0,2,0). Harmless for a column in normal flow (auto and 100% land identically), **but not for `.spot-copy`**, which is `position:absolute` with left *and* right insets and no width — forced to 100% the right inset is ignored and the box came out 112px wide of the source. Nothing visible moved, because its children are all left-aligned and self-measured. Fixed **by name**: `body.rysing .et_block_row .et_pb_column { width:auto }` matched but **broke the founder section** (`.founder-title` 35px narrower, headline +1 line) — `width:auto` only equals `100%` for a block in normal flow |
| An adapter rule deploys, parses, and silently does nothing | Divi puts `et_pb_gutters3` on **`<body>`**, not on the section or row, so `body.rysing .et_pb_gutters3 …` (descendant) can never match. A mis-scoped rule is indistinguishable from a working one by reading the file — confirm with `CSS.getMatchedStylesForNode`, which simply omits rules that do not match |
| **The spotlight photograph lost its scrim** | `divi.css` kills Divi's row/column clearfix with `content: none !important`, on the stated belief that "no source rule competes for these". **An element has only one `::after`.** `.spot` is a Divi row, so the authored `.spot::after` — the gradient that darkens the lower half of the photograph so the white copy over it holds — *is* the clearfix pseudo-element, and was deleted with it. **No geometry moved** (`position:absolute; inset:0`, paints only a gradient), so `compare.js` passed at 0px across eight viewports and an element audit found 332/332 boxes identical. Caught only by diffing rendered pixels. `verify/pseudo-elements.js` now guards all 43 instances |
| Restoring `content` on a clearfix pseudo-element still paints nothing | Divi's clearfix is **five declarations** — `content:""; display:block; clear:both; visibility:hidden; height:0; line-height:0` — at the same (0,1,1) as `base.css`. base.css loads later and wins the properties it *names*; it never names `visibility`, `height`, `width` or `line-height`, so those survive. The restored scrim had the right gradient and the right `inset:0` and was still `visibility:hidden`, `height:0`, `width:0`. **Check the computed box, not just `content`** — this took three passes |

**Divi's hover state is four declarations, not one.** `color`, `background-color`,
`border` (width *and* colour) and `padding` all change. Overriding one at a time
produced three rounds of "fixed it, now something else moved" — the pill is only
stable once all four are restated. Assert **resting == hover** for width, height,
padding and border-width on every pill, not just the first.

**All three above are invisible to `compare.js`.** Colour does not move a box and
neither does a transform, so the page measured 0px at all 8 viewports while the
pills were blue with a crooked star. §10's "assert colour in text" exists for
exactly this; it now covers headings and section backgrounds but **not pills** —
the probe that found this read `.btn-pill` computed `color`, the `::after`
`backgroundColor` and its resting `transform`, against the static source. Worth
folding into the gate.

**Overriding a colour in the adapter means owning its hover too.** `color:inherit`
at (0,3,1) also outranks base.css's own `.btn-pill:hover { color:var(--ink) }` at
(0,2,0) — fixing the resting colour alone would have left black-on-black.

---

## 7. Open — blocks "production ready"

**Introduced by the port, and the one open item that is not inherited: the page
has no `<section>` and no `<main>`.** Divi emits `div.et_pb_section`, and the
`display:contents` trick restores the *CSS* shape, not the semantics. Measured
against the source:

| | static | port |
|---|---|---|
| `<section>` | 15 (14 with `aria-labelledby`) | **0** |
| `<main>` | 1 | **0** |
| `header` / `footer` / `nav` | 1 / 1 / 3 | 1 / 1 / 3 |
| `[role=region]` | 4 | 4 |
| `<h1>` / `<h2>` | 1 / 10 | 1 / 10 |

So the heading outline and the chrome landmarks survive, but a screen-reader
user loses the main landmark and the 14 labelled regions — they cannot jump
between sections. `AGENTS.md`'s verification list asks for semantic landmarks
explicitly, so this is a real gap, not a nitpick.

Not fixed here because it is an architecture decision, not a defect: the
cheapest answer is probably `role="region"` + `aria-label` emitted by
`lib/blocks.php`, with a `<main>` wrapper from the theme. **Raise it before the
remaining five pages are ported** — whatever is decided wants doing once, in
the shared builder, not five more times.

---

The rest are inherited from the static source, none introduced by the port.

- 6 × `TODO(link)` — case studies that don't exist, client-site stand-ins
- `[ Award name ]` / `[ Detail ]` placeholders ×4 in the menu overlay
- 6 placeholder testimonials sharing one stand-in portrait
- Unverified figures: "Read all 49 reviews", "Join 2,000 founders"
- Neither form has a backend
- **Header and footer link to `/about/`, `/process/`, `/contact/`,
  `/communication-strategy/`, `/blog/` — these 404 until those pages are ported**
- Legal pages (Imprint, Privacy, Terms, Cookie) are `#`

---

## 8. Next

1. Port the remaining 5 pages — `about`, `process`, `contact`,
   `communication-strategy`, `case-gerd-bommer`. They inherit the global header
   and footer, so each is one generator script plus a page-scoped adapter.
   `create-home-page.php` is the pattern.
2. Replace the placeholders in §7 as the client supplies them.
3. Performance pass before launch (see the skill's `performance-and-launch.md`).

---

## 9. Working protocol

Work in **batches small enough to finish and verify inside one context.** At the
end of each batch, in this order:

1. `wordpress/sync-theme.sh` and re-run any generator that is affected
2. `node wordpress/verify/compare.js` — must `PASS`
3. Update §1 Status and §7/§8 here, and add any new trap to §6
4. Commit, or report that it is ready to commit

Then the context can be cleared safely. Anything not written here is lost.

---

## 10. Token discipline

The homepage batch was expensive, and the reasons are specific and avoidable.
Page 1 paid for the whole system — the child theme, the adapter and all twelve
traps in §6 already exist. Pages 2–6 only have to add a generator and fix what
is genuinely page-specific. Keep it that way by working like this.

**Start every session by reading §6 and applying all of it up front.** Most of
the homepage's cost was re-discovering those traps one at a time. They are not
hypothetical; they will all recur on a new page.

| Do | Instead of |
|---|---|
| One diagnostic script dumping every suspect value at once | One probe per symptom, serially — this was the single biggest cost |
| Print **only mismatches**; blank output means identical | Printing both sides in full every time |
| Assert colour/background in text (`background must not be white`, `heading must not be #333`) | Reading screenshots to spot it — images are the most expensive single read |
| Fix a cluster, then verify once | fix → verify → fix → verify |
| `grep` narrow patterns, `wp ... --field=` | Dumping whole files or full `post_content` |
| Screenshots at batch end only, one viewport | Screenshots as a debugging tool |

**The cheap check that would have saved the most:** every ported page should
assert, in text, that no section computes a white background and no heading
computes `#333`. Divi's two signature defaults are invisible to geometry
measurement — the page measured pixel-perfect while being white-on-white — and
catching them costs almost nothing compared with looking at an image.

### Batch size

**One page per session.** The remaining five are independent and each inherits
the global header and footer, so none of them needs the others loaded:

`contact` (smallest, start here) → `process` → `about` →
`communication-strategy` → `case-gerd-bommer`

Finish the batch, run the gate, update §1/§6/§7/§8 and the Log, commit. Then
clear. Do not carry two pages in one context.

---

## Log

| Date | Batch | Result |
|---|---|---|
| 2026-10-21 | Child theme, homepage generator, Theme Builder header/footer/overlay, full fidelity pass | `PASS` — pixel-identical at 8 viewports, 0 overflow, 0 console errors |
| 2026-10-22 | Media Library migration: 32 assets imported, content + Theme Builder layouts repointed, generators rewired, audit gate added | `PASS` — fidelity still 0px; media audit clean; second run creates 0, updates 0 |
| 2026-10-22 | Button-module pills: Divi blue text + star, star 5.5px high, and a hover state that never filled, narrowed the pill 12.3px and grew its border 2px. All in `divi.css`; no generator or content change | `PASS` — both gates; all 7 pills asserted resting == hover on width, height, padding and border, and identical to the static source on colour, fill, star colour and star transform |
| 2026-10-22 | Full health audit of the ported homepage: runtime, interaction and a computed-style parity sweep (43 selectors × 22 properties) against the static source. Fixed `body` font-weight 500 → 400; found the landmark gap in §7 | `PASS` — both gates. Style diffs 73 → 10, all 10 benign (icon-only buttons with no text, and a `display` difference measured to produce identical geometry). Accordion, both rails, overlay + focus trap + scroll lock, reel aperture, stats, work film and newsletter all behave identically to the source |
| 2026-10-22 | Testimonial stars rendered as `? ? ? ? ?`. Cause was **not** WordPress, Divi, fonts or the DB: `r_inline()` in `lib/blocks.php` ran `preg_replace('/\s*\R\s*/')` **without `/u`**, and in 8-bit mode PCRE's `\R` matches the bare byte `0x85` — which is the third byte of `★` (U+2605 = `E2 98 85`). It ate that byte from every star, leaving the invalid pair `E2 98`, which WordPress substituted with `?` on the way to the database | `PASS` — one character (`/u`). 30 stars stored, 0 `?`, content valid UTF-8; both gates pass. **The pixel gate could not have caught this** — `?` and `★` occupy the same line box, so it passed at 0px delta before and after. Any character whose UTF-8 encoding ends in `0x85` was exposed the same way |
| 2026-10-22 | Offset audit of the homepage, prompted by "does it look right / is anything offset". **Three** real divergences found that **every existing gate passed through** — the reel's leaked section padding, `.spot-copy` ignoring its `right` inset, and the spotlight scrim being deleted outright. All fixed in `divi.css`; `verify/section-padding.js` and `verify/pseudo-elements.js` added, each confirmed to exit 1 when its bug is reintroduced | `PASS` — all four gates. 332 authored element boxes compared at 5 widths, 0 differences. All 7 pills render exactly one arrow at identical coordinates. **Rendered-pixel comparison at 12 scroll positions: 10 of 12 byte-identical, total 5 differing pixels of 15,552,000, worst channel delta 12** (one 1px hairline). The scrim was found by that pixel pass and by nothing else |
