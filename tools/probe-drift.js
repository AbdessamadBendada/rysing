/* HOW VISIBLE IS THE HERO'S AMBIENT MOTION? Not "does the transform change"
   — it demonstrably does — but how many levels of pixel a viewer can
   actually see move.

   THE PHASE IS PINNED, NOT SAMPLED. A first version let the animations run
   and differenced frames N seconds apart; every row then landed on a
   different part of a 13s cycle and the amplitude sweep came back
   non-monotonic, with .95 reading quieter than .97. Pausing the animation
   and stepping it with a negative `animation-delay` measures the real
   peak-to-trough swing instead.

   SEEKING IS DONE THROUGH THE WEB ANIMATIONS API, not through
   `animation-delay`. Pausing with `animation-play-state` and then changing
   the delay DOES NOT SEEK an animation that has already started — the probe
   reported 0.963 and 0.987 for two phases that were supposed to be 1.0 and
   0.95, so the "peak" and "trough" shots were two arbitrary points a
   fortieth of a cycle apart, and the whole amplitude sweep was measuring
   noise. `getAnimations()` + `currentTime` lands exactly.

   THE DELAY IS PER-ANIMATION AND ONLY THE SECOND ONE MOVES. These elements
   run `driftA` and `heroBreathe` together; stepping BOTH with one value put
   the 28s drift at a different phase in each shot too, and the drift's own
   23-level swing then buried the breath completely — every amplitude from
   1 to .90 came back within a level of the others. Holding `driftA` at 0s
   and stepping only `heroBreathe` is what isolates the thing being tuned. */
const { chromium } = require('playwright');
const path = require('path');
const ROOT = '/Users/mac/Documents/Current Projects/Rysing';
const SWEEP = process.env.SWEEP ? ['.93', '.90', '.88', '.86', '.82'] : ['as shipped'];
/* PERIOD MATTERS AS MUCH AS AMPLITUDE. A slow luminance change is noticed
   by its RATE, not its total swing — the same 6 levels spread over 6.5s or
   over 3s are a different effect, and the second one is the one you can
   see. Both are swept. */
const PERIODS = process.env.SWEEP ? [13, 9, 8, 7] : [8];

/* EVERY LAYER THAT COULD CARRY THE BREATH. It has already moved once, from
   the canvas to the field, and the probe kept seeking the canvas — the
   breath then ran free through both shots and a sweep from .93 to .78
   reported a flat 4-10 levels when .78 should dim a 250 core by 55. That is
   the fourth measurement in §53 to fail by probing the wrong thing. */
const SEEK = '.hero-disc--orange, .hero .rs-blobs, .hero .rs-field';

async function shot(page, phaseMs) {
  await page.evaluate(([ms, SEEK]) => {
    document.querySelectorAll(SEEK).forEach(el => {
      el.getAnimations().forEach(a => {
        a.pause();
        /* driftA is held at 0 so only the breath moves between shots. */
        /* 1e9 means "the trough", whatever the authored duration is. */
        const dur = a.effect.getTiming().duration;
        a.currentTime = a.animationName === 'heroBreathe' ? (ms >= 1e9 ? dur / 2 : ms) : 0;
      });
    });
  }, [phaseMs, SEEK]);
  await page.waitForTimeout(120);
  return (await (await page.$('.hero')).screenshot()).toString('base64');
}
async function diff(page, a, b) {
  return page.evaluate(async ([a, b]) => {
    const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + s; });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    const px = img => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const x = c.getContext('2d'); x.drawImage(img, 0, 0); return x.getImageData(0, 0, c.width, c.height).data; };
    const da = px(ia), db = px(ib);
    let sum = 0, worst = 0, over2 = 0, n = 0;
    for (let i = 0; i < da.length; i += 4) {
      const d = (Math.abs(da[i] - db[i]) + Math.abs(da[i+1] - db[i+1]) + Math.abs(da[i+2] - db[i+2])) / 3;
      sum += d; if (d > worst) worst = d; if (d > 2) over2++; n++;
    }
    return { mean: +(sum / n).toFixed(2), worst: Math.round(worst), 'px over 2 levels %': +(100 * over2 / n).toFixed(1) };
  }, [a, b]);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('file://' + path.join(ROOT, 'index.html'));
  await page.waitForTimeout(1500);
  /* The reel is the only other moving thing in the hero and swamps the
     measurement entirely. */
  await page.addStyleTag({ content: `.reel-video{display:none!important}` });

  const rows = [];
  for (const br of SWEEP) {
    if (br !== 'as shipped') await page.evaluate(v => document.documentElement.style.setProperty('--breathe', v), br);
    const peak = await shot(page, 0);
    const trough = await shot(page, 1e9);   // half-cycle, see shot()
    const d = await diff(page, peak, trough);
    for (const per of PERIODS) {
      rows.push({ breathe: br, period: per + 's', 'levels peak-trough': d.worst,
                  'field moving %': d['px over 2 levels %'],
                  'levels per second': +(d.worst / (per / 2)).toFixed(2) });
    }
  }
  console.table(rows);
  console.log('\nbreathe 1 = no luminance breath, drift alone (the shipped state before §53).');
  console.log('Under ~2 levels across a soft field is not seeable at all.');
  await browser.close();
})();
