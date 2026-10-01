# Rysing — Client Revision Brief

**Target file: `rysing-comments.html` (and only that file).**
It is a byte-for-byte copy of `rysing-v2.html`. Do not touch `rysing.html`, `rysing-v2.html`,
`rysing2.html`, or `rysing-private.html`. `rysing-v2.html` is the rollback copy.

---

## 0. Read this first

### 0.1 The client's screenshots are from two different builds
Several review screenshots were taken against the **older** `rysing.html`, not against v2.
In `rysing.html` the service titles and final CTA are heavy uppercase sans; in v2 they are
serif sentence case. **Implement the client's intent, not a pixel match to the screenshot.**
Where a comment says "make X red/bigger/black", apply that to whatever v2 currently renders.
Never reintroduce the heavy uppercase sans treatment.

### 0.2 Global rule — maximum 2 lines per heading
This is the highest-priority constraint in this brief. Every `h1/h2/h3` must render on
**2 lines or fewer** at every breakpoint (360px, 768px, 1024px, 1440px, 1920px).

- The hero H1 is the **single documented exception** — 3 lines is accepted there. Nothing else.
- v2 already sizes headings off `max-width` in `ch`. Tune those `ch` values (and the size
  tokens) to enforce the rule. Do not enforce it by adding `<br>` tags.
- Verify by actually measuring rendered line boxes, not by assuming.

### 0.3 Do not invent content
Every piece of copy in this brief is quoted verbatim. Use it exactly. Where an asset or
link is unavailable, follow the placeholder convention in §12 — do not make up client names,
stats, awards, or URLs.

---

## 1. Typography — the headline fix

**The problem:** `.hero-copy h1` (line ~137) is the only headline on the page that is not
`.display`. Every other heading uses Instrument Serif via `.display`; the hero alone is
Instrument Sans 400 at `clamp(24px,2.35vw,40px)`, line-height 1.24. The client called this
out directly: the hero font and the next section's font look unrelated.

**Tasks:**

1.1 Add `class="display"` to the hero `<h1>` so Instrument Serif carries **every** headline
    on the page with no exceptions.

1.2 Add a new size token to the `:root` scale, between `--d-section` (58px) and
    `--d-moment` (78px):
    ```
    --d-hero: clamp(28px,3.1vw,54px);
    ```
    Apply it to `.hero-copy h1`. Set `line-height:1.06` (serif tolerates far tighter than
    the current 1.24) and `letter-spacing:-.03em`. Set `max-width` to about `40ch` —
    **not** the current `26ch`. The new headline is ~118 characters; at 26ch it would run
    to five lines, at 40ch it lands on the three lines approved in §2.2.
    Rationale: the hero currently caps at 40px against the statement's 104px — a 2.6x drop
    that reads as timid rather than hierarchical. This closes it to ~1.9x.

1.3 Promote the red-italic accent from `.statement h2 em` (line ~158) to a general
    `.display em` rule, so the device works in any headline:
    ```
    .display em { font-style:italic; color:var(--red); }
    ```
    Then delete the now-redundant `.statement h2 em` rule.

**Acceptance:** no headline anywhere on the page renders in a sans-serif family.

---

## 2. Hero section

2.1 **Eyebrow.** `.hero-copy .kicker` is currently empty. Fill it with exactly:
    > Branding & visibility studio for courageous brands

    It must sit **above** the H1. Style it with the existing `.label` treatment.

2.2 **Headline.** Replace the H1 text with exactly:
    > Rise into visibility, authority and `<em>`impact`</em>` with a clear strategy, differentiated brand and thought leadership content

    The word **impact** is wrapped in `<em>` and renders red italic serif via the §1.3 rule.
    This copy is ~118 characters and will run to 3 lines — that is accepted and approved
    (see §0.2). Do not shorten it.

2.3 **Remove the scroll indicator entirely.** Delete the `<span class="scroll label">Scroll</span>`
    markup and the `.scroll`, `.scroll:before` CSS rules, plus the `scrollPulse` keyframes
    if nothing else references them.

2.4 **Replace the nav.** The current `.nav-links` inline link list is removed from the header
    bar. The header becomes exactly three elements:
    - the `RYSING®` wordmark (left, unchanged)
    - an "Apply to work with us" button (right) — **solid red**, using the `.btn-primary`
      token defined in §8
    - a hamburger toggle button (right of the button)

    The hamburger is a real `<button>` with `aria-expanded`, `aria-controls`, and an
    accessible label. Not a `<div>`.

---

## 3. Overlay menu (new)

Full-viewport overlay panel, `100vw` x `100svh`, sliding in **from the right**.

3.1 **Behaviour**
   - Toggled by the §2.4 hamburger. Close via an X in the same position, `Escape`, or
     clicking a nav link.
   - Trap focus while open; restore focus to the hamburger on close.
   - Set `overflow:hidden` on `<body>` while open, and restore it on close.
   - Respect `prefers-reduced-motion` — no slide transition when it is set.

3.2 **Nav items** (large, right-aligned, one per row, serif `.display`):
    `Home` · `About` · `Services` · `Portfolio` · `Blog` · `Contact`

    Link targets — anchor what exists, stub what does not:
    | Item | href |
    |---|---|
    | Home | `#top` |
    | About | `#founder` |
    | Services | `#system` |
    | Portfolio | `#work` |
    | Blog | `/blog` (stub — page does not exist yet, do not repoint it at any existing section) |
    | Contact | `#contact` |

3.3 **Bottom-left: trust signals.** A horizontal row of **exactly four** award lockups, each
    being a logo mark plus two lines of text, separated by thin vertical rules — matching
    the density of the client's reference image.

    ⚠️ **The awards in the reference screenshot belong to another agency (RIVYL) and must
    not be copied.** Build all four as **empty logo placeholders** — the client has her own
    logo files and will drop them in. Each slot needs a neutral mark frame plus two
    bracketed text lines (`[ Award name ]` / `[ Detail ]`) per §12.

    Give each `<img>` a `data-final-src` of `trust-01.svg` … `trust-04.svg` so the swap is
    mechanical. Do not populate any slot with invented award names.

3.4 **Bottom-right: social icons.** Inline SVG only (no icon font, no external requests):
    Instagram, Facebook, LinkedIn, Telegram. `href="#"` placeholders, each with an
    `aria-label`.

---

## 4. Statement section (`#approach`)

4.1 **Highlight `impact`.** The heading currently reads:
    > For courageous brands and ambitious founders who want to build a `<em>`legacy`</em>` and create a lasting impact

    Wrap the final word so it becomes `...a lasting <em>impact</em>`. Both `legacy` and
    `impact` now render red italic serif.

4.2 **Remove the rule below the heading.** Delete the entire `.statement-bottom` block —
    both the horizontal `border-top` rule and the `01 / 06` counter inside it — along with
    the `.statement-bottom` and `.statement-number` CSS rules.

---

## 5. Selected work (`#work`) — expand 3 → 6

5.1 **Layout: two rows of three.** `.work-list` is *already* a CSS grid —
    `grid-template-columns:repeat(3,1fr)` (line ~168) with `aspect-ratio:3/4` frames.
    Adding three more `<article class="project">` elements produces the 3+3 layout
    automatically. **Do not restructure the grid and do not add a flex hover-expand
    effect** — that treatment belongs to the older `rysing.html` and is not part of v2.

    **Preserve the existing hover behaviour exactly as built:** the image un-zooms
    (`scale(1.04)` → `scale(1)`) with a saturation lift, and the red rule under the frame
    wipes in via `transform:scaleX(0)` → `scaleX(1)`.

    Responsive: 3-up above 1024px → 2-up at 840px → 1-up at 560px.

    Note `.project:nth-child(1)` and `:nth-child(2)` carry bespoke `object-position` values.
    Re-check those once the real photos land; they are tuned to the current placeholders.

5.2 **Headline rule applies.** Project titles must not exceed 2 lines (§0.2). The titles
    below are long; size `.project h3` and its `max-width` accordingly.

5.3 **The six projects.** Replace the three `Project One/Two/Three` placeholders with:

| # | Title | Client site / case study |
|---|---|---|
| 01 | Speaker and Investor Persona Brand — Gerd Bommer | _no URL supplied_ |
| 02 | Luxury design studio for the finest hotels in the world | _no URL supplied (client "Alex")_ |
| 03 | Speaker and Business Coach | https://clemensdoppler.com/ |
| 04 | AI and Law Consultancy Brand | https://futurfai.com/ |
| 05 | Wealth Manager Expert Brand | https://jenniferdjongow.com/ |
| 06 | Elite Tennis Coach and Speaker Brand | https://julianknowle.com/ |

5.4 **Each project gets a "Learn more" link** that should eventually point at its case study.
    Those case-study pages do not exist yet. Point each at the client site URL above where
    one is supplied; use `href="#"` for 01 and 02. Mark all six per §12 so they are easy to
    find and rewire later.

5.5 **Images: placeholders for now.** The client's photos live in auth-walled Google Drive
    and are not retrievable. Cycle the existing files in `rysing-assets/` (`anzhelika-office.webp`,
    `anzhelika-chair.webp`, `reel-01.jpg` … `reel-06.jpg`) as stand-ins.

    **Write the markup so swapping is trivial:** give each `<img>` its intended final
    filename in a `data-final-src` attribute, using this manifest —
    `project-01-bommer.webp`, `project-02-alex.webp`, `project-03-doppler.webp`,
    `project-04-futurfai.webp`, `project-05-djongow.webp`, `project-06-knowle.webp`.
    Keep every `alt` descriptive and accurate to the *intended* photo, not the placeholder.

---

## 6. Programs / services (`#system`)

6.1 **Section heading.** Currently `.system-head h2` has `max-width:13ch`, which wraps
    "We can grow your brand on four levels" onto 3 lines. The client wants it on **one line**,
    with the subheading below it, and the subheading **larger — it is currently unreadable**.
    - Widen the heading `max-width` so it sits on one line on desktop (2 lines max on mobile).
    - Move the `We are based in Vienna, Austria and we operate across Europe.` paragraph
      **below** the heading rather than beside it, and raise its size from `--body-sm`/muted
      to at least `--body`, with stronger contrast than `var(--muted)`.

6.2 **Row dividers.** Currently the open row gets a red top border while the others are faint
    grey. The client wants: **all dividers fully red and thicker** — not part-white/part-red.
    On hover, the full width of the divider is red. Increase the border weight (roughly 1px → 2px).

6.3 **Numerals bigger.** `.system-toggle > b` is `clamp(22px,2vw,30px)`. Increase it
    noticeably — roughly `clamp(34px,3.2vw,52px)` — keeping `font-variant-numeric:tabular-nums`.

6.4 **Text black on red.** Inside the expanded red `.system-detail` panel, the text is
    currently white. Change it to **black** (`var(--ink)`) — the stage-outcome label, the
    `.system-phrase`, and the `.system-tags` pills (borders included).

    This is not only a style request: white on `#f04222` measures **~3.8:1 and fails AA**,
    while near-black on the same red measures **~5.0:1 and passes**. The client's
    instruction fixes an existing accessibility defect. Apply the same rule to the About
    section (§7.2). Do not let any text on red drop below 4.5:1.

6.5 **Row 02 (Design & Websites) — replace the tags with exactly:**
    `Brand design` · `Website design` · `Website development` · `SEO & GEO` · `Videography`

6.6 **Row 03 (LinkedIn & Instagram Marketing) — replace the tags with exactly:**
    `Content strategy` · `Content automations` · `Content creation` · `Social media management` ·
    `Content shooting` · `Content editing` · `Reels and shorts` · `Performance analysis`

    Remove the existing `Thought leadership` tag.

6.7 **Row 04 (Lead Gen & Sales):**
    - Replace the description with exactly:
      > For those ready to make a big, lasting impact.
    - Replace the tags with exactly:
      `Podcast` · `Videocast` · `YouTube channel` · `Long form content` · `Production` ·
      `Post-production` · `Keynote writing`

    Note rows 03 and 04 now carry 8 and 7 tags. Make sure `.system-tags` wraps gracefully
    and the expanded panel height still animates cleanly.

---

## 7. New and reordered sections

### 7.0 Final page order
```
Hero → Statement → Work (6) → Programs → Logo carousel → About → Team → Testimonials
     → Keynote → Newsletter → Final CTA → Footer
```
Note this moves **Testimonials (`.proof`) to after About**, and moves the logo wall up to
sit directly beneath Programs.

### 7.1 Logo carousel (replaces `.trust` / `#recognition`)
Sits **directly below the Programs section**.

- **White background** — explicitly not the current dark treatment.
- A continuously scrolling marquee of client logos.
- Pause on hover, and freeze entirely under `prefers-reduced-motion`.
- Duplicate the track for a seamless loop; mark the duplicate `aria-hidden="true"` so
  screen readers announce each logo once.
- **Images unavailable** (Drive is auth-walled). Build the carousel with the existing
  placeholder `<span>` wordmarks, structured so real `<img>` logos drop straight in.
  Source folder for later: the client's Drive logo folder — **`18.png` in that folder is
  not a logo and must be skipped.**
- Delete the `.trust-note` placeholder disclaimer paragraph.

### 7.2 About section (rework the existing `.founder` block)
Keep the section, replace its content. **Background: brand red (`var(--red)`), full-bleed.**

⚠️ **Text colour on this section is near-black (`var(--ink)`), not white.**
White on `#f04222` measures **~3.8:1 and fails WCAG AA** for body text — and this section
carries two long paragraphs, so it is the worst place on the page to fail it. Near-black on
the same red measures **~5.0:1 and passes**. This also makes black-on-red a consistent
system across both red surfaces, matching the accordion treatment the client asked for in
§6.4, rather than a one-off. Do not use white body text anywhere on the red background.

- **Headline** (exactly):
  > The studio exists to give voices to people who want to make a real impact.

- **Body** (exactly, two paragraphs):
  > A courageous brand refuses to conform. It belongs to someone who would rather be disliked than ignored. Who says the thing their industry is not ready to hear, and says it anyway. Who left the safe path, took the unpopular position, built what nobody asked for and who is building something meant to outlast them.

  > Most people carry a version of this inside them and never let it out, because they are afraid of repelling somebody. Courage is staying true to what you believe while you are still scared.

- **Pull-quote / attribution block** (exactly):
  > Led by Anzhelika and delivered by an interdisciplinary team, Rysing Studio translates a founder's courage and ambition into a differentiated, visible brand.

- **Stats row** — four figures, on a **white/paper panel inset within the red section**:

  | Figure | Label |
  |---|---|
  | 35+ | personal brands built |
  | 350+ | students taught |
  | 3000+ | content pieces published |
  | 50k+ | followers and subscribers over all platforms |

  Note: the client's screenshot reads "publsihed" — that is a typo in her annotation.
  Use the correct spelling **published**.

- **Add a "Learn more" button** below the content, using the `.btn-secondary` token (§8).
  The client said it should "lead to the website" — no target was specified, so use
  `href="#"` and mark it per §12.

- **Remove the `.proposed-flag` block** (the "Proposed new section / new copy for review"
  banner). The section is now approved.
- Keep the existing portrait image (`anzhelika-portrait.png`) — ensure adequate contrast
  against the red background.

### 7.3 Team section (new)
Sits **between About and Testimonials**, on paper background — a deliberate breather after
the full-red About block, and it immediately substantiates the "interdisciplinary team"
claim the About section closes on.

**Design intent — read before building.** This is not a vanity portrait row. The studio
sells *"we can grow your brand on four levels"* and *"an interdisciplinary team"*. So each
member is presented as **a discipline with a face attached**, not a face with a job title.
The disciplines should echo the Programs (§6) language, so this section retroactively
substantiates the Programs section: the four levels are not a menu, they are staffed.

Layout: three members in a row — portrait, name, discipline. 3-up on desktop, 1-up below
560px. Keep the portrait frames consistent with `.project-frame` (same aspect ratio and
image treatment) so the section reads as part of the existing system.

**Members — use these names verbatim:**

| # | Name | Discipline |
|---|---|---|
| 01 | Abdessamad Bendada | Web development, SEO, and everything web-side |
| 02 | Kritina | `[ Discipline ]` — placeholder |
| 03 | Marc | `[ Discipline ]` — placeholder |

- Member 01's discipline line is confirmed — write it as supplied.
- Members 02 and 03: names are confirmed, **disciplines are not**. Use a bracketed
  `[ Discipline ]` placeholder per §12. Do not invent roles for them.
- ⚠️ "Kritina" is spelled as the client supplied it. It may be intended as "Kristina" —
  leave it exactly as written and flag it in your summary rather than silently correcting.
- **No photos have been supplied for any of the three.** Use neutral portrait frames with
  `data-final-src` values `team-01-abdessamad.webp`, `team-02-kritina.webp`,
  `team-03-marc.webp`.
- **Anzhelika does not appear in this row.** She is the founder portrait in the About
  section (§7.2) and stays there. This row is the three-person team beneath her.
- No LinkedIn or social links on team members in this pass.

---

## 8. Buttons — normalise site-wide

The client: *"I'd normalise how the buttons look throughout."* There are currently four
unrelated treatments — `.conversation` (underline), `.source-link` (underline),
`.spotlight-cta` (underline), `.final-cta-button` (lift/fill).

Define exactly three reusable classes and convert **every** call-to-action on the page to one
of them. Preserve each existing hover/focus feel where possible, but unify geometry,
padding, type size, and transition timing.

| Token | Look | Used by |
|---|---|---|
| `.btn-primary` | Solid red pill, white text | Nav "Apply to work with us" (§2.4), final CTA, newsletter submit |
| `.btn-secondary` | Outlined, inherits current colour | About "Learn more" (§7.2), keynote "Learn more" (§9) |
| `.btn-tertiary` | Text + arrow with underline rule | "Read all 49 reviews", in-section links |

Each must have a visible `:focus-visible` state and a minimum 44x44px hit area.
Remove the old rules once nothing references them.

---

## 9. Keynote / spotlight section (`#spotlight`)

9.1 **New brand colour.** Add a third colour token alongside `--red`:
    ```
    --blue:#0044ff;
    ```
    (Client note: "My brand will have one more colour, blue — use this for now.")

9.2 **Background becomes blue.** Replace the current black + red treatment of this section
    with `var(--blue)`. Check every piece of text in the section for contrast against
    `#0044ff` — white on this blue is **~6.4:1**, which passes AA. Do not leave any
    mid-grey text (`--muted`, `--muted-dark`) sitting on blue; promote it to white.

9.3 **Replace the image.** Swap `anzhelika-cutout.webp` for a speaker photo — a speaker
    on stage, mid-gesture, wearing a headset mic. No such asset exists in `rysing-assets/`.
    Use `reel-03.jpg` (stage shot) as the placeholder and mark it per the convention below,
    with `data-final-src="keynote-speaker.webp"`.

9.4 **"Learn more" target.** Link it to **`rysing2.html`** — confirmed by the client.

    ⚠️ **Do not open, edit, or modify `rysing2.html` in any way.** Create the link only.
    The client has explicitly asked that this file be left untouched. Its copy will be
    adapted toward speaking in a separate, later task — not in this pass.

---

## 10. Final CTA (`#contact`)

10.1 **Replace the heading** with exactly:
     > Turn your vision into a courageous brand and thought leader reputation.

10.2 Convert `.final-cta-button` to `.btn-primary` per §8.

---

## 11. Footer housekeeping

11.1 Remove the duplicated `Sunday Fudge` link — it currently appears twice in the same list.
11.2 Remove or populate the empty footer column (an `<h2></h2>` with an empty `<ul>`).
11.3 Leave the legal links (`Imprint`, `Privacy Policy`, `Terms & Conditions`, `Cookie Policy`)
     as `href="#"` — those pages do not exist yet.

---

## 12. Placeholder convention

Anything that is a stand-in — unavailable image, unconfirmed link, missing copy — must be
marked so it can be found with a single grep:

```html
<!-- TODO(asset): real logo files pending from client Drive -->
<!-- TODO(link): case study page does not exist yet -->
<!-- TODO(copy): team member names and roles not supplied -->
```

Use `TODO(asset)`, `TODO(link)`, or `TODO(copy)`. Do **not** ship any user-visible
"this is a placeholder" disclaimer text in the rendered page — the client saw those in the
last round (`.trust-note`, the testimonial footer note, the `.proposed-flag`) and they read
as unfinished. Remove all three.

Placeholder *content* that is visible (e.g. team names) should read as a neutral bracketed
slug like `[ Name ]`, matching the existing `[ Years in practice ]` style already in the file.

---

## 13. Verification before reporting done

1. **Every heading is 2 lines or fewer** at 360 / 768 / 1024 / 1440 / 1920px. Hero H1 may be 3.
   This is the client's most emphatic note — check it last, after all copy is final.
2. No headline renders in a sans-serif family.
3. No horizontal scroll at any width down to 360px.
4. The overlay menu opens, traps focus, closes on Escape, and restores body scroll.
5. The accordion still opens/closes and still auto-closes siblings.
6. Text contrast: no text anywhere on `#f04222` is white (§6.4, §7.2); white on `#0044ff`
   is fine (§9.2). Every text/background pair on the page clears 4.5:1.
7. `prefers-reduced-motion` disables the marquee and the overlay slide.
8. No external network requests beyond the existing Google Fonts import.
9. The page still opens correctly as a plain local file (`file://`).
