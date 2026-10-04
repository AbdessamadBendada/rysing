# Rysing homepage asset specification

This is the production brief for every image slot in `premium-direction.html`.
Pixel dimensions are minimum delivery sizes for a 2× retina render. Supply an
uncropped master as well as the web crop, in sRGB, without baked-in filters;
the site applies one shared photographic grade. Keep the filenames below so a
replacement remains a one-line source change.

## Photography

| Slot and location | Target pixels | Exact ratio | Crop guidance | Current filename |
| --- | ---: | ---: | --- | --- |
| Project 02 — Selected Work flagship | 2400 × 1500 | 16:10 | Use the strongest finished environment or identity application. Keep the architectural subject, skyline and hero object in the central 75%, with usable detail above and below. Focal point: `center 52%`. | `project-02-alex.webp` |
| Project 03 — Selected Work supporting portrait | 1200 × 1600 | 3:4 | Keep the speaker's face, torso and hands in frame with modest headroom. Leave calm background space and avoid cropping through elbows. Focal point: `center 42%`. | `project-03-doppler.webp` |
| Project 04 — Selected Work supporting landscape | 2000 × 1250 | 16:10 | Show one crisp FuturfAI identity application. Keep the primary mark and all essential type inside the central 75%. Focal point: `center 52%`. | `project-04-futurfai.webp` |
| Founder environmental plate — between manifesto and founder copy | 2880 × 1440 | 2:1 | Shoot Anzhelika in a real working environment in landscape orientation. Keep her face and hands in the middle third, retain room context, and leave lateral negative space for flexible crops. | `anzhelika-office.webp` |
| Team portrait: Anzhelika — roster | 1200 × 1600 | 3:4 | Match the set in lens, camera height, subject scale, background and light. Keep the complete head and upper body in frame. | `anzhelika-chair.webp` |
| Team portrait: Kim — roster | 1200 × 1600 | 3:4 | Match the set in lens, camera height, subject scale, background and light. Leave modest headroom and keep shoulders clear of the edges. | `kim-brand-designer.webp` |
| Team portrait: Ben — roster | 1200 × 1600 | 3:4 | Match the set in lens, camera height, subject scale, background and light. Leave modest headroom and keep shoulders clear of the edges. | `abdessamad-pic.webp` |
| Team portrait: Kristina — roster | 1200 × 1600 | 3:4 | Photograph with the same lens, background, light, camera height and crop as the other three portraits. Keep the complete head and upper body in frame. | No file yet; current slot is a typographic placeholder |
| Keynote spotlight — below testimonials | 2880 × 1440 | 2:1 | Use a sharp stage photograph with face and hands readable. Keep the speaker in the middle/right safe area and retain darker, quiet space along the lower-left for overlaid copy. | `Gerd-Hero-Section-image.webp` |

The homepage gallery intentionally makes Project 02 the nine-column flagship;
Project 03 occupies three columns and Project 04 six. Projects 01, 05 and 06 are
off the homepage until replacement photography arrives. On screens at or below
820 px the projects stack; the landscape slots render at 16:11 and the portrait
slot remains 3:4, so masters must retain enough vertical information for both
desktop and mobile crops.

### Off-homepage replacements

These files stay in `rysing-assets/`, and their panel markup is archived at the
bottom of `premium-direction.html`.

| Asset | Target pixels | Intended ratio | Replacement guidance |
| --- | ---: | ---: | --- |
| `project-01-bommer.webp` | 2400 × 1600 | 3:2 | Replace the phone snapshot with a controlled speaking, campaign or finished-brand application image. No shoes, asphalt or incidental clutter. |
| `project-05-djongow.webp` | 2000 × 1500 | 4:3 | Supply a sharp expert-brand portrait or application with one dominant subject; omit small chart graphics that collapse at web size. |
| `project-06-knowle.webp` | 1600 × 2000 | 4:5 | Supply a sharp action or speaker portrait with clean separation, intentional lighting and room for a tight crop. |

## Brand, logo and motion-image slots

| Slot and location | Target pixels | Exact ratio | Crop guidance | Current filename |
| --- | ---: | ---: | --- | --- |
| Rysing wordmark — fixed header | 2754 × 584 | 1377:292 | Preserve the complete lockup and its transparent clear space; no background plate. | `rysing-logo-lockup-light.webp` |
| Showreel poster — opening aperture | 3840 × 2160 | 16:9 | Choose a dark frame that reads inside the small star mask and at full bleed. Keep the main subject centred and avoid bright white opening frames. | `reel-03.jpg` |
| Rysing wordmark — footer sign-off | 2754 × 584 | 1377:292 | Preserve the complete lockup and its transparent clear space; artwork must remain sharp at full-page width. | `rysing-logo-lockup-light.webp` |
| Clemens Doppler — recognition marquee | 1200 × 1200 | 1:1 | Clean monochrome mark on transparency, optically centred; artwork should occupy about 48% of the canvas height. No halftone or shadow. | `logo-clemensdoppler.webp` |
| Gerd Bommer — recognition marquee | 1200 × 1200 | 1:1 | Clean monochrome mark on transparency, optically centred; artwork should occupy about 48% of the canvas height. | `logo-gerdbommer.webp` |
| Jennifer Djongow — recognition marquee | 1200 × 1200 | 1:1 | Supply a simplified small-size monochrome lockup without chart icons, centred on transparency at about 48% canvas height. | `logo-jenniferdjongow.webp` |
| Julian Knowle — recognition marquee | 1200 × 1200 | 1:1 | Clean monochrome mark on transparency, optically centred at about 48% canvas height. | `logo-julianknowle.webp` |
| FuturfAI — recognition marquee | 1200 × 1200 | 1:1 | Clean monochrome mark on transparency, optically centred at about 48% canvas height. | `logo-futurfai.webp` |
| U4Success — recognition marquee | 1200 × 1200 | 1:1 | Clean monochrome mark on transparency, optically centred at about 48% canvas height. | `logo-u4success.webp` |
| Wise Up — recognition marquee | 1200 × 1200 | 1:1 | Clean monochrome mark on transparency, optically centred at about 48% canvas height. | `logo-wise-up.webp` |
| Digital World — recognition marquee | 1200 × 1200 | 1:1 | Clean light monochrome mark on transparency, optically centred at about 48% canvas height. | `logo-digitalworld.webp` |
| Digit Finance — recognition marquee | 1200 × 1200 | 1:1 | Clean monochrome mark on transparency, optically centred at about 48% canvas height. | `logo-digitfinance.webp` |
| Volkshilfe — recognition marquee | 1200 × 1200 | 1:1 | Clean monochrome mark on transparency, optically centred at about 48% canvas height. | `logo-volkshilfe.webp` |
| MAM — recognition marquee | 1200 × 1200 | 1:1 | Clean light monochrome mark on transparency, optically centred at about 48% canvas height. | `logo-mam.webp` |
| Der Schulter Physio — recognition marquee | 1200 × 1200 | 1:1 | Clean monochrome mark on transparency, optically centred at about 48% canvas height. | `logo-dsp.webp` |
| RB Real Beauty — recognition marquee | 1200 × 1200 | 1:1 | Clean monochrome mark on transparency, optically centred at about 48% canvas height. | `logo-rb.webp` |

SVG masters are preferred for all logos; export WebP or transparent PNG only
for the current raster implementation. Keep every marquee export on the same
1:1 canvas and optical-height standard so replacing a file does not require
layout retuning.

## Shot and artwork list

1. A true landscape founder photograph at 2:1. Every supplied founder shot is
   portrait, and `anzhelika-portrait.png` is a cut-out that floats in black at
   full width; neither is a substitute for an environmental plate.
2. Kristina's matching 3:4 team portrait, shot with the same setup as the other
   three team members.
3. Replacement photography for Projects 01, 05 and 06: the Bommer source is a
   blurry phone snapshot, while the Djongow and Knowle sources are soft.
4. Clean monochrome artwork for `logo-clemensdoppler.webp`. The current file has
   a semi-transparent halftone circle over the wordmark in its alpha channel,
   which cannot be fixed with CSS filters.
5. A simplified small-size `logo-jenniferdjongow.webp` without the chart icons.
6. A flagship Project 02 environmental or finished-identity frame, composed
   natively for 16:10 with extra vertical information for the 16:11 mobile crop.
7. A vertical Project 03 speaker/brand portrait with a decisive but natural
   gesture and clean background separation.
8. A wide Project 04 identity-system, team or real-world application frame.
9. A wide keynote-stage photograph with sharp face and hands plus dark,
   copy-safe space along the lower-left.
