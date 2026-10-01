# Rysing Website Agent Handoff

## Project purpose

Rysing is a founder-led branding and visibility studio for courageous brands,
ambitious founders, speakers, and recognised experts. The website must feel
premium, bold, warm, editorial, strategically credible, and visually distinctive.
It should present Rysing as a close interdisciplinary studio, not a generic agency,
mass-market coaching funnel, or conventional luxury template.

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
