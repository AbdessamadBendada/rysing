# Rysing — Revision 2 (corrections to the first pass)

**Target file: `rysing-comments.html` only.** Do not touch `rysing.html`, `rysing-v2.html`,
`rysing2.html`, or `rysing-private.html` — all four are read-only references.

Read this together with `RYSING_COMMENTS_BRIEF.md`. Where the two disagree, **this file wins.**

---

## R0. The reference design is `rysing.html` — not `rysing-v2.html`

The first pass used `rysing-v2.html` as the design reference. That was wrong.
**`rysing.html` is the visual reference for this project.**

- Keep working **in `rysing-comments.html`** — do not start over. It holds correct new work
  (overlay menu, team section, blue keynote, button tokens, six projects, About section)
  that must be preserved.
- But wherever a section's *visual treatment* differs between the two, **port the
  `rysing.html` treatment.** Read `rysing.html` and match it.
- This applies most urgently to §R3 (work/projects) and §R8 (newsletter).

---

## R1. Undo the type-scale damage — this is the biggest regression

To satisfy the two-line rule, the first pass shrank headings until they fit. That was the
wrong lever and it wrecked the page. Current state:

```
--d-manifesto: clamp(14px,3.3vw,64px)    /* comment says "locked to two lines" */
.statement h2 { font-size:14px; }        /* inside @media (max-width:560px) */
.hero-copy h1 { font-size:18px; }        /* inside @media (max-width:560px) */
```

A 14px manifesto and an 18px hero are not acceptable at any viewport.

**Fix:**

R1.1 Restore `--d-manifesto` to the `rysing.html` statement scale:
     `clamp(50px,6.5vw,112px)`. The statement is the loudest type on the page.

R1.2 **Delete** the `@media (max-width:560px)` overrides `.statement h2 { font-size:14px }`
     and `.hero-copy h1 { font-size:18px }` entirely. The `clamp()` floors already handle
     small screens. Never set a display heading below its clamp floor.

R1.3 **Never shrink type to satisfy a line-count rule.** If a heading runs long, adjust
     `max-width` in `ch`, or report it back — do not reduce `font-size`.

---

## R2. The two-line rule — corrected scope

The rule was written too broadly. It applies to **short, structural headings only**:

| Applies to | Does NOT apply to |
|---|---|
| Project titles (`.project h3`) | **Hero H1** — 3 lines fine |
| Service names (`.system-toggle h3`) | **Statement H2** — 3 lines or more is fine, it is the manifesto |
| Section headings (`.system-head h2`, `.trust h2`, `.proof h2`) | **Final CTA H2** — 3 lines fine |
| Team names | Body copy, intros, descriptions — never applied |

For the three exempt headings, **line count is not a constraint at all.** Size them for
impact. The client explicitly said of the statement: *"this one can be 3 lines or even
more because it's the statement."*

---

## R3. Work / projects — port the hover-expand strip from `rysing.html`

The first pass kept v2's static 3-column card grid. **Wrong.** The client wants the
`rysing.html` treatment: a single horizontal strip of panels where **the hovered panel
widens** and its siblings compress.

In `rysing.html` this is:
```css
.work-list { display:flex; ... }
.project   { flex:1; transition:flex .65s cubic-bezier(.2,.7,.2,1); }
.project:hover, .project:focus-within { flex:2.3; }
```
with the title, number and type overlaid *on* the image rather than sitting beneath it.

**Port that structure and that interaction into `rysing-comments.html`**, adapted to six
projects. Keep the six titles, links and `data-final-src` values already in the file.

Layout for six: **two strips of three** (each strip its own flex row with its own
hover-expand), not one strip of six — at six across, a resting panel is ~16% wide and the
overlaid titles become unreadable slivers.

Responsive: below 840px the expand effect is dropped and panels stack — expanding on touch
has no hover state to drive it.

⚠️ **Titles must not be clipped.** Verify the full title renders in the widened panel and
at rest — `Speaker and Investor Persona Brand — Gerd Bommer` and `Luxury design studio for
the finest hotels in the world` are the two long ones. No `overflow:hidden` may cut them.

---

## R4. Services — the whole row goes red when open

Currently only the detail panel (stage outcome + tags) turns red. The client is explicit:
**the entire row must be red while open** — the number, the service name, the short
description, the toggle icon, and the detail panel, as one continuous red block.

R4.1 Apply the red background to the whole `<details class="system-item">` when `[open]`,
     covering the `summary` as well as `.system-detail`.

R4.2 All text and the toggle icon inside the open row must read clearly on red.
     Currently the open row's number is red-on-paper, which will vanish on a red background.

R4.3 **Readability licence.** The client said: *"if you think that the black is not readable
     on red we can change it."* Near-black on `#f04222` is ~5.0:1 (passes AA) but is visually
     heavy across a full row. You may **darken the red for the open-row state only** —
     something in the `#d2331a`–`#c22d14` range lifts black text to ~6.5–7.5:1 and reads
     richer. Pick one, apply it consistently, and say in your summary which you chose and why.
     Do not use white text on `#f04222` — that is ~3.8:1 and fails AA.

---

## R5. About — reposition the stats

The stats (`35+ / 350+ / 3000+ / 50k+`) are currently a full-bleed white band spanning the
whole section. The client wants them **in the side column, below the text, alongside the
image** — not as a full-width band across the section.

Move `.founder-stats` inside the copy column, directly beneath the body copy and the
"Learn more" button, so the portrait image sits beside the whole stack. A 2x2 grid will
likely sit better than 1x4 in the narrower column — use your judgement, keep the figures
legible, and keep them on a light panel so they stay readable against the red.

---

## R6. Keynote / spotlight — bigger type, close the dead space

R6.1 **Increase the heading and intro size.** `.spotlight h2` and `.spotlight-intro` are
     both too small for a full-viewport section. Take the heading to at least `--d-moment`
     and raise the intro to `--body` or above.

R6.2 **Close the vertical gap.** There is currently a large empty void between the intro
     paragraph and the "Learn more" button, caused by `margin-top:auto` on the button
     pushing it to the bottom of a tall flex column. Group the copy so the section reads as
     one block rather than content stranded at the top and bottom.

R6.3 The speaker photo is a placeholder and is not a speaker image — leave the
     `TODO(asset)` marker in place, but pick the closest available stand-in from
     `rysing-assets/` (`reel-03.jpg` or `reel-01.jpg`).

---

## R7. Newsletter — restore the `rysing.html` treatment

The client did not ask for changes to this section: *"the content fudge I didn't tell you
to change it — make it the same as in rysing.html."*

Read the `.fudge` section in `rysing.html` — markup **and** CSS — and restore it to match,
including the `.fudge-orbit` element that was dropped and the `Newsletter — Sunday Fudge`
label (em dash, not a colon).

Only exception: keep the submit button on the `.btn-primary` token so §8 button
normalisation holds.

---

## R8. Final CTA

R8.1 **Remove the horizontal rule.** Delete `border-top:1px solid rgba(255,255,255,.62)`
     and the `padding-top:24px` from `.final-cta-bottom`. The client was explicit.

R8.2 ⚠️ **The button is invisible.** `.btn-primary` is a red pill on the red CTA background.
     On this section only, switch the CTA button to a treatment that actually reads against
     red — near-black fill with light text is the natural fit and echoes the black-on-red
     system used elsewhere. Keep the shared geometry from the `.btn-primary` token; only
     the colours change.

R8.3 Confirm the heading clears the left gutter — it currently appears to sit flush against
     the viewport edge. Check `.final-cta` horizontal padding actually applies.

---

## R9. Carried over from the first pass — still unfixed

R9.1 **`.award-lockups { display:none }` at ≤560px.** The overlay trust signals the client
     asked for are deleted on mobile. Do not hide them — wrap them to a 2x2 grid.

R9.2 **Section order is CSS-only.** The first pass reordered via `main { display:flex }`
     plus `order:` values, so the DOM still reads `.proof` → `.founder` → `.team` while the
     page displays About → Team → Testimonials. Keyboard and screen-reader order is
     therefore wrong (WCAG 2.4.3).
     **Fix by physically moving the `<section>` blocks in the DOM** into final order, then
     delete the entire `order:` rule block. Do not rely on `order` for page sequence.

Final DOM order:
```
hero → statement → work → system → trust → founder → team → proof
     → spotlight → fudge → final-cta
```

---

## R10. Verification

1. No heading anywhere uses a `font-size` below its clamp floor, and no `@media` block
   overrides a display heading down to a body-text size.
2. The statement heading is the largest type on the page.
3. Hovering a project panel widens it and compresses its siblings; no title is clipped.
4. An open service row is red across its full width, including the summary; all text in it
   clears 4.5:1.
5. The CTA button is clearly visible against the red background.
6. No `order:` properties remain; DOM order matches visual order.
7. Overlay trust signals are visible at 360px.
8. No horizontal scroll at 360px.

**If any instruction here cannot be satisfied without shrinking type below its clamp floor,
stop and report it instead of shrinking.**
