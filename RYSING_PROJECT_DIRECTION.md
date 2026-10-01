# Rysing Studio Website — Project Direction & Decision Log

## Purpose

This is the living source of truth for the Rysing Studio website prototype.
It records the approved vision, reference influences, design and motion decisions,
rejected directions, open questions, and material implementation changes.

Update this document whenever a decision is approved or the prototype changes in
a meaningful way. Do not silently replace an approved direction.

## North-Star Principle

> Rysing does not create the expertise. The expertise already exists. Rysing
> makes the world see it.

Core transformation:

**Unknown → Visible → Recognised → Trusted → Chosen**

## Confirmed Brand Direction

- Premium boutique people-branding studio.
- Founder-led editorial authority, supported by a multidisciplinary studio team.
- Strong portfolio and case-study emphasis.
- Real founder and client photography is prioritised.
- Primary brand accent: `#f04222`.
- Warm ivory, black, and midnight provide the main neutral foundation.
- Real celestial stars represent recognition, visibility, authority, and rising.
- The site must feel premium, bold, warm, stylish, confident, and authoritative.
- The site must not resemble a generic agency, solo coaching site, astrology site,
  or science-fiction experience.

## Reference Roles

The references are influences, not templates to copy.

- **COLLINS:** strategic confidence, concise positioning, programs, and work as proof.
- **Wolff Olins:** editorial authority, hierarchy, scale, and case-study storytelling.
- **Rivyl:** immediate portfolio energy and visual commercial impact.
- **Bandit:** bold personality and proprietary process presentation.
- **Be Seen Socials:** content energy and approachable social proof, used sparingly.
- **Studio Ardē:** clarity around under-recognition and becoming the clear choice.

Recommended influence balance:

- 40% Wolff Olins editorial authority
- 25% COLLINS strategic confidence
- 15% Rivyl portfolio energy
- 10% Bandit personality
- 10% Rysing's founder-led celestial narrative

## Colour Decision

Many reference sites rely heavily on black and white. Rysing will use full red
background sections as a deliberate point of distinction.

Red sections must be intentional, not constant. They should mark important
moments such as a major transition, result, proprietary framework, or call to
action. The rest of the experience should retain enough ivory, black, and
midnight space for the red to remain memorable and premium.

Working colour balance:

- 50–60% warm ivory / off-white
- 20–30% black / midnight
- 10–15% Rysing red, including selected full-background moments
- Remaining area: photography and supporting neutrals

## Current Homepage Narrative

The active client-revision build uses this order:

1. **Showreel Hero** — Work-led opening with the application action, accessible
   overlay menu, positioning eyebrow, and impact-led headline.
2. **Positioning Statement** — Large editorial manifesto for courageous brands
   and ambitious founders.
3. **Selected Work** — Six projects in two hover-expanding desktop strips.
4. **The Rysing System** — Four expandable service levels covering brand,
   identity/web, content/visibility, and lead generation/sales.
5. **Recognition** — Compact trust and client-logo signal.
6. **Founder & Studio** — Anzhelika's vision, supporting facts, and the studio's
   close-working model.
7. **Team** — Four-person interdisciplinary roster.
8. **Testimonials & Proof** — Client words and approved recognition.
9. **Spotlight** — Blue keynote and speaker-brand feature.
10. **Sunday Fudge** — Newsletter proposition and subscription form.
11. **Final CTA** — Full-red application invitation.
12. **Footer** — Company, contact, and required destination links.

### Work versus case studies

- **Selected Work** creates immediate visual impact and range.
- **Case Studies** explain the strategic transformation and business outcome.

They must not repeat the same content in two formats without adding meaning.

## Motion System

Motion principle:

> Elements rise, reveal, sharpen, expand, or become more visible.

Current motion direction:

- Preserve smooth native scrolling and lightweight entrance reveals.
- The full-screen menu slides in from the right, with motion removed under
  `prefers-reduced-motion`.
- Selected-work panels widen on hover or keyboard focus while their siblings
  compress; mobile receives a static stacked layout.
- Service details expand within the full-width row, which becomes a continuous
  red surface while open.
- Use GPU-friendly transforms and opacity where animation is needed.
- Important information must not depend on hover.
- `prefers-reduced-motion` must be supported throughout.
- Content remains readable if JavaScript fails.

The earlier “One Among Millions” pinned rising-star sequence remains part of the
historical prototype exploration, not the active `rysing-comments.html` build.

## Content and Evidence Rules

- Do not publish metrics, testimonials, awards, guarantees, client names, or
  results without verification and permission.
- Use transformation language rather than generic service labels.
- Present services as one connected authority-building system.
- Present the 95 Days offer as proprietary intellectual property, not a pricing card.
- Clarify whether the Spotlight Framework and 95 Days are separate offers or
  whether one sits inside the other.

## Rejected Directions

- Generic agency layouts and disconnected service-card grids.
- Abstract SVG people or geometric fake portraits.
- Asterisks, sparkles, or decorative symbols pretending to be celestial stars.
- Cheap cosmic, glitter, astrology, or horoscope aesthetics.
- Red on every section; red must retain hierarchy and impact.
- Excessive rounded cards.
- Random stock-office photography.
- The previously rejected AI-generated fake website mockup.
- Choppy scroll effects, long preloaders, and blocked page access.
- Hover-only access to important content.
- Generic agency copy.
- Making Rysing appear to be a solo coaching business.

## Open Decisions

- Production self-hosting of the approved Instrument font files.
- Final portfolio permissions, results, and permanent case-study destinations.
- Final verified testimonials, awards, client logos, and audience metrics.
- Kristina's confirmed discipline and final team biographies.
- Newsletter subscription backend and success/error behaviour.
- Final legal, privacy, social, blog, and contact destinations.

## Prototype Deliverable Rules

- Fully responsive across desktop, tablet, and mobile.
- Semantic, accessible HTML with appropriate contrast and alt text.
- Optimised imagery and lazy loading below the fold.
- No missing assets, broken paths, or stuck preloaders.
- The prototype must be delivered as either a self-contained file or a complete
  package with all referenced assets included.

## Decision Log

### 2026-08-19 — Initial direction consolidated

- Adopted founder-led editorial authority plus a rising-star narrative.
- Confirmed work-led hero, positioning, work, system, proof, case studies,
  Spotlight Framework, founder/studio, journal, newsletter, and final CTA.
- Confirmed One Among Millions as the signature pinned interaction.
- Confirmed that selected work and case studies serve different purposes.
- Assigned specific roles to the six shared website references.
- Established motion rules based on rising, revealing, sharpening, and visibility.

### 2026-08-19 — Red-background differentiation

- Client observed that the references are largely black and white.
- Approved intentional full-red background sections to make Rysing distinctive.
- Red sections will punctuate high-value moments and will not become the default
  background throughout the website.

## Implementation Log

### 2026-09-20 — Client revision build and handoff consolidated

- Confirmed `rysing-comments.html` as the active client-revision build. The
  current cycle must not modify `rysing.html`, `rysing-v2.html`, `rysing2.html`,
  or `rysing-private.html`.
- Established the instruction hierarchy: the user's latest direction first,
  then `RYSING_REVISION_2.md`, then `RYSING_COMMENTS_BRIEF.md`, with this document
  retaining the broader design history.
- Confirmed `rysing.html` as the controlling visual reference and
  `rysing-v2.html` as the rollback copy.
- Standardised the active typography around Instrument Serif for every display
  heading and Instrument Sans for interface and body text. Restored the
  manifesto to the largest type scale and prohibited shrinking display type to
  force arbitrary line counts.
- Narrowed the two-line rule to short structural headings. The hero, manifesto,
  and final CTA remain exempt so they can retain visual impact.
- Rebuilt the header around the RYSING wordmark, a red application action, and an
  accessible full-screen menu that slides in from the right.
- Expanded selected work to six projects arranged as two hover-expanding strips
  of three on desktop, with a stacked mobile layout.
- Revised the Rysing System so the entire expanded service row becomes one red
  surface, including its summary and detail content.
- Added or refined the recognition strip, founder-led About section, four-person
  studio roster, testimonials, blue Spotlight feature, Sunday Fudge newsletter,
  red final CTA, and footer.
- Normalised buttons and interaction states across the page while retaining
  keyboard access, focus management, mobile fallbacks, and reduced-motion
  behaviour.
- Left unverified information clearly unresolved: Kristina's discipline,
  permanent case-study links, final proof claims, newsletter integration, and
  legal/social destinations still require client approval or production work.

### 2026-09-18 — Revision 2 corrections applied

- Corrected the first client-revision pass after visual review showed that its
  heading scale and several section treatments had drifted from the intended
  reference.
- Restored the expansive display scale rather than sacrificing typography to a
  universal two-line constraint.
- Ported the selected-work hover expansion and Sunday Fudge treatment from
  `rysing.html` while preserving the new content and accessibility work already
  present in `rysing-comments.html`.
- Strengthened the service, About, Spotlight, and final CTA compositions in line
  with the second revision brief.

### 2026-09-17 — First client-comment revision pass created

- Created `rysing-comments.html` as a protected working copy of `rysing-v2.html`
  for client-requested changes.
- Added the revised hero hierarchy, application CTA, overlay navigation, six
  projects, expanded service content, About and team content, button system,
  keynote treatment, newsletter updates, final CTA, and footer housekeeping.
- Preserved missing or unverified content as explicit placeholders instead of
  inventing claims, links, or credentials.

### 2026-09-12 — Private-client visual concept v2 created

- Created `rysing2.html` as a separate visual direction while preserving
  both earlier homepage files.
- Retained the private-advisory positioning and core copy from the first concept,
  but replaced its boxed grid language with a more cinematic editorial composition.
- Initially explored Bodoni Moda / DM Sans, then adopted the warmer free
  Cormorant Garamond / Inter Tight pairing, alongside a quieter burgundy and bone
  colour balance, full-bleed showreel hero, long-form portfolio stories, and more
  deliberate negative space.
- Continued to label illustrative transformation profiles honestly and avoided
  adding unverified client claims or outcomes.
- Refined the hero into a short sticky cinematic sequence: the showreel opens
  without sales copy, then the headline, supporting line, and private consultation
  action reveal once the visitor begins scrolling.
- Increased the Cormorant Garamond display weight from regular to medium and
  removed italic styling across the concept for a firmer, more authoritative tone.
- Replaced the exploratory burgundy palette in V2 with Rysing's approved
  reddish-orange `#f04222`, including the hero accents, full-colour editorial
  panels, interaction states, and footer wordmark.
- Added restrained entrance motion to V2: a subtle showreel settle, navigation and
  scroll-cue arrivals, staggered content groups, and gentle portfolio image scaling.
  All motion continues to respect the reduced-motion preference.
- Removed em dashes from the V2 interface copy and replaced them with conventional
  punctuation or en dashes for numeric ranges.
- Replaced V2's abstract orbit illustration with a dark editorial recognition
  ascent that maps `Unseen → Visible → Recognised → Chosen`, using a fine vertical
  trajectory and the Rysing orange as the culminating point.
- Removed that vertical ascent after visual review showed it felt like a corporate
  progress chart. The final V2 principle section is now a full-width typographic
  manifesto, with the transformation retained only as a quiet horizontal signature.
- Locked the principle statement to exactly two lines: the complete white statement
  first, followed by the complete Rysing-orange statement on the second line.
- Widened and balanced all display-heading measures so headlines resolve in no
  more than three lines, including dedicated mobile sizing and shorter portfolio
  transformation titles where needed.

### 2026-09-11 — Private-client homepage concept created

- Created `rysing-private.html` as a separate strategic concept; the approved
  `rysing.html` prototype remains untouched.
- Repositioned Rysing as a private reputation and personal brand advisory for
  established founders, recognised experts, and influential leaders.
- Reframed 95 Days as a selective, bespoke private engagement rather than a
  broadly available program.
- Introduced a quieter ivory, black, and oxblood presentation; a founder-authority
  narrative; discretion standards; engagement-fit signals; and a qualified private
  enquiry journey.
- Kept transformation examples evidence-safe and avoided publishing unverified
  client identities, metrics, testimonials, awards, or results.

### 2026-09-11 — Whole-page refinement pass

- Tightened vertical pacing in the Rysing System, Recognition, and Proof sequence.
- Reframed Recognition around four observable outcomes instead of repeating the
  founder and expert audience already established earlier on the page.
- Rebuilt the proof composition as one focused testimonial field followed by two
  quieter editorial evidence columns, removing an unnecessary red card treatment.
- Made all selected-work descriptions and actions visible without hover and renamed
  placeholder project actions to `Discuss a project` so they describe their real
  destination honestly.
- Renamed the top-level `Studio` navigation item to `Contact`; a genuine Studio
  destination should only return when approved founder and team content exists.
- Replaced the temporary Manrope / Newsreader combination with the approved free
  Instrument Sans / Instrument Serif typography system.
- Added descriptive metadata, a keyboard skip link, consistent focus indicators,
  reduced-motion-safe smooth scrolling, and deferred decoding for below-fold images.

### 2026-09-11 — Free Instrument typography adopted

- Adopted Instrument Sans for navigation, body copy, UI labels, large uppercase
  statements, and the RYSING wordmark.
- Adopted Instrument Serif for selective editorial emphasis, quotations, project
  titles, and transformation statements.
- Limited sans-serif weights to the family’s native 400–700 range to avoid synthetic
  heavy rendering.
- Verified the Google Fonts variable-family request and retained system fallbacks;
  production should self-host the final WOFF2 files.

### 2026-09-11 — Recognition transition added

- Added the homepage recognition section immediately after the Rysing System.
- Used an editorial dark-background transition with a large recognition statement
  and a four-part audience strip for founders, subject-matter experts, speakers,
  and industry leaders.
- Kept the section evidence-safe by reserving client names and recognition marks
  until they are verified and approved.
- Added a compact mobile layout while retaining the existing typography and colour
  language of the current prototype.

### 2026-09-11 — Rysing System strengthened

- Reframed the four stages as one cumulative journey rather than four independent
  service categories.
- Added a concise system introduction and an explicit invitation to explore each
  stage.
- Sharpened each stage description and added a distinct outcome statement inside
  every expanded panel.
- Retained `Opportunity` as the premium, outcome-led fourth stage while clarifying
  its relationship to demand, invitations, and commercial growth.
- Added a restrained active progress line and limited the interaction to one open
  stage at a time to preserve visual focus.

### 2026-09-11 — Testimonials and proof section added

- Added the `Proof, not promises.` section directly after the recognition
  transition.
- Established a modular proof layout with one featured testimonial, one
  before-to-after transformation, and one evidence or results panel.
- Used explicit pending-approval copy throughout instead of inventing client
  quotations, identities, metrics, or outcomes.
- Added an evidence-standard note to make the content replacement requirements
  unambiguous before publication.
- Included a single-column mobile layout that retains the hierarchy and contrast
  of the desktop composition.

### 2026-09-11 — Spotlight Framework / 95 Days feature added

- Added a full-width red-and-ivory offer feature after testimonials and proof.
- Presented `95 Days` as the focused program powered by the broader Spotlight
  Framework; this relationship remains easy to revise after final offer approval.
- Structured the journey into three phases: Position (days 1–25), Build (days
  26–60), and Rise (days 61–95).
- Used the supplied transparent founder cutout to reinforce the founder-led,
  studio-delivered positioning without introducing unapproved imagery.
- Added a direct email CTA and a stacked mobile layout with the same content and
  hierarchy as desktop.

### 2026-09-11 — Sunday Fudge newsletter feature added

- Added an editorial newsletter section after the Spotlight / 95 Days feature.
- Used a warm-ivory layout and a playful red publication cover to create a tonal
  pause without leaving the core Rysing visual system.
- Positioned Sunday Fudge as a concise weekly note for founders and experts, with
  three clear content expectations.
- Added an accessible email field and status messaging while marking the form as
  preview-only until a mailing platform is selected and connected.
- Included a single-column mobile composition with a simplified signup layout.

### 2026-09-11 — Final conversion CTA added

- Added a full-height red closing invitation after Sunday Fudge.
- Anchored the section around the approved `clear choice` positioning and one
  direct start-a-conversation action.
- Added a visible email alternative and connected the existing project links to
  the now-valid `#contact` destination.
- Used one restrained celestial light with a slow rising motion, including a
  static reduced-motion alternative.
- Added a compact mobile composition that keeps both contact paths accessible.

### 2026-09-11 — Expansive footer added

- Completed the homepage structure with a large midnight footer and oversized red
  RYSING signature.
- Added internal navigation to every implemented homepage destination, direct
  contact details, Vienna / global positioning, and a back-to-top action.
- Made the footer the `#studio` destination, resolving the final outstanding
  navigation fragment.
- Marked social, privacy, and legal destinations as pending instead of publishing
  guessed handles or non-existent pages.
- Added two-column tablet and mobile layouts while retaining the oversized closing
  wordmark.

### 2026-08-19 — Hero identity refinement

- Approved a progressive pixel-to-clear RYSING wordmark treatment as a repeatable
  brand signature for high-impact moments.
- The effect expresses the core transformation from obscurity to recognition;
  it must remain controlled, editorial, and distinct from glitch/cyberpunk styling.
- Applied the treatment to the navigation wordmark, a large atmospheric hero
  signature, and the oversized footer wordmark rather than ordinary body copy.
- Replaced the dense hero paragraph with the authority-led headline “We turn
  expertise into authority.” and a concise supporting line for founders and experts.
- Increased the hero copy hierarchy and protected clear space around it so the
  showreel, brand signature, and message each retain a distinct role.

### 2026-08-19 — Pixel treatment corrected to reference

- Rejected the first letter-by-letter blur treatment because it did not match
  the supplied HTML reference.
- Confirmed that the reference uses hard-edged square canvas pixels rather than
  blur, distortion, or glitch effects.
- Revised the hero signature so RYSING begins as large, sparse square fragments
  on the left, gains density and resolution across the word, and becomes fully
  crisp on the right.
- Kept the navigation wordmark clean because the progressive pixel treatment
  requires large scale to remain legible and premium.

### 2026-08-19 — High-fidelity prototype v2: structure-reference rebuild

- Client rejected v1 as insufficiently aligned with the desired structure and
  brand feeling.
- Adopted `/Users/mac/Downloads/rysing-home.html` as the controlling structural
  reference and followed its section order closely.
- New order: showreel hero, positioning statement, full-screen selected work,
  four-level programs, trust strip, testimonials, Spotlight/keynote feature,
  Sunday Fudge, final CTA, expansive footer.
- Removed the additional star, case-study, founder, journal, and standalone
  proof sections from v1 because they were not part of the supplied structure.
- Removed all custom/editorial serif typography. The interface now uses a
  disciplined Helvetica/Arial sans-serif system with scale, weight and spacing
  providing the hierarchy.
- Rebuilt selected work as a scroll-linked, pinned horizontal sequence on
  desktop with swipeable scroll-snap behavior on mobile.
- Strengthened the visual direction around greatness, boldness, elegance and
  expansiveness: fewer treatments, larger statements, stronger whitespace,
  full-bleed imagery, and a decisive red final CTA.
- Retained the client showreel and existing supplied photography.
- Preserved reduced-motion, keyboard, semantic, and responsive behavior.

### 2026-08-19 — High-fidelity prototype v1

- Created the new implementation in `rysing-high-fidelity-prototype/`.
- Downloaded the client-provided 34.8-second, 1920×1080 showreel and converted
  it from HEVC to a browser-compatible H.264 hero asset.
- Built a full showreel hero with restrained overlay copy and scroll cue.
- Implemented the agreed homepage narrative: positioning, One Among Millions,
  selected work, Rysing System, proof, transformation story, Spotlight
  Framework, founder/studio, journal, Sunday Fudge, and final CTA.
- Implemented a scroll-scrubbed celestial-star sequence using native
  requestAnimationFrame updates and GPU-friendly transforms.
- Added intersection-based editorial reveals and responsive/reduced-motion
  alternatives.
- Introduced two full-red signature moments: proof and Spotlight Framework,
  plus a red selected-work panel and conversion accents.
- Used the existing real Anzhelika photography supplied in the project and did
  not use the rejected fake website mockup asset.
- Marked unverified proof content explicitly rather than publishing planning
  metrics as facts.
- Completed a successful production build.
- Published prototype v1 privately for review at
  `https://rysing-studio-prototype.abdessamad-bendada96.chatgpt.site`.
- Preserved the downloaded showreel master as `Rysing-showreel-original.mov`
  in the main workspace and deployed only the optimised browser version.

### 2026-09-16 — `rysing.html` copy restored from supplied reference

- User explicitly requested that the visible copy in `rysing.html` match `/Users/mac/Downloads/rysing-home (1).html` character for character.
- Restored the reference wording, section order, six selected-work placeholders, four program descriptions, client placeholders, testimonial placeholders, keynote copy, newsletter copy, calls to action, and footer text while retaining the current page's visual styling.
- Reused the reference logo image so the page adds no text wordmark to the reference copy.
- Verified that all 169 reference text fragments appear with no missing or additional fragments.
