/* Stage one of §48's tuning: FIDELITY across the geometry grid, with the best
   GAIN found per combination. Cheap — no tracing — so it can cover the grid.
   Stage two (`.work.js`) times only the survivors.

   The cost model, derived and then confirmed against `.work.js`:
     cost  ∝  DENSITY × (SIZE × gap × SCALE)²   and   gap² ∝ area / DENSITY
           ∝  area × SIZE² × SCALE²
   So DENSITY CANCELS. Raising it buys a smoother cloud for the price of more
   `drawImage` calls and no extra fill at all, which is the opposite of what
   §47 assumed when it chose 560 — and the reason the grid below pushes it up
   while pulling SIZE down. */
const { chromium } = require('playwright');
const path = require('path');
const ROOT = '/Users/mac/Documents/Current Projects/Rysing';

const GRID = [];
for (const SIZE of [6, 4.5, 3.5, 2.8])
  for (const SCALE of [0.5, 0.34, 0.26])
    for (const DENSITY of [560, 1000])
      GRID.push({ SIZE, SCALE, DENSITY });

const GAINS = [1.9, 2.2, 2.5, 2.8, 3.2];

async function shot(page, which) {
  await page.evaluate((w) => {
    document.querySelector('.hero-disc--orange').style.opacity = w === 'disc' ? '1' : '0';
    document.querySelector('.hero .rs-field').style.visibility = w === 'field' ? 'visible' : 'hidden';
  }, which);
  return (await (await page.$('.hero')).screenshot()).toString('base64');
}

async function diff(page, a, b) {
  return page.evaluate(async ([a, b]) => {
    const load = (s) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + s; });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    const px = (img) => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const x = c.getContext('2d'); x.drawImage(img, 0, 0); return x.getImageData(0, 0, c.width, c.height).data; };
    const da = px(ia), db = px(ib);
    let sum = 0, worst = 0, over = 0, n = 0;
    for (let i = 0; i < da.length; i += 4) {
      const d = (Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2])) / 3;
      sum += d; if (d > worst) worst = d; if (d > 10) over++; n++;
    }
    return { mean: +(sum / n).toFixed(2), worst: Math.round(worst), over: +(100 * over / n).toFixed(1) };
  }, [a, b]);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('file://' + path.join(ROOT, 'index.html'));
  await page.waitForTimeout(1000);
  /* The drift is paused for every capture — §47's measuring note. A moving
     anchor means the two shots are of two different compositions. */
  await page.addStyleTag({ content: `
    .hero-disc--orange, .hero .rs-blobs { animation:none !important; }
    .reel-video { display:none !important; }` });

  const rows = [];
  for (const cand of GRID) {
    let best = null;
    for (const GAIN of GAINS) {
      await page.evaluate((o) => { Object.assign(window.STARS.hero, o); window.STARS.hero.rebuild(); },
                          { ...cand, GAIN });
      await page.waitForTimeout(200);
      const d = await diff(page, await shot(page, 'disc'), await shot(page, 'field'));
      if (!best || d.mean < best.d.mean) best = { GAIN, d };
    }
    const marks = await page.evaluate(() => document.querySelector('.hero canvas').__n || 0);
    rows.push({ ...cand, GAIN: best.GAIN, mean: best.d.mean, worst: best.d.worst,
                'over10%': best.d.over, cost: +(cand.SIZE ** 2 * cand.SCALE ** 2).toFixed(2) });
    console.log(rows[rows.length - 1]);
  }
  rows.sort((a, b) => a.mean - b.mean);
  console.table(rows);
  await browser.close();
})();
