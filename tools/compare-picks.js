/* Stage two of §48's tuning: time the survivors of `.fid.js`, and capture
   each one AT REST and PUSHED so the dynamic failure the static difference
   cannot see — the lattice showing through as the cursor pulls the blobs
   apart — is actually looked at rather than assumed away. */
const { chromium } = require('playwright');
const path = require('path');
const { measure } = require('./measure-work.js');
const ROOT = '/Users/mac/Documents/Current Projects/Rysing';
const OUT = '/private/tmp/claude-501/-Users-mac-Documents-Current-Projects-Rysing/a1be201c-2fa5-4c4e-8bb7-0b2aede2d331/scratchpad';

const PICKS = {
  'baseline S6 C.5 D560':  { SIZE: 6,   SCALE: 0.5,  DENSITY: 560 },
  'A  S4.5 C.34 D1000':    { SIZE: 4.5, SCALE: 0.34, DENSITY: 1000 },
  'B  S3.5 C.34 D1000':    { SIZE: 3.5, SCALE: 0.34, DENSITY: 1000 },
  'C  S2.8 C.34 D1000':    { SIZE: 2.8, SCALE: 0.34, DENSITY: 1000 },
  'B0 S3.5 C.34 D1000 b0': { SIZE: 3.5, SCALE: 0.34, DENSITY: 1000, BLUR: 0 },
};

(async () => {
  const browser = await chromium.launch();
  const rows = [];

  for (const [name, opts] of Object.entries(PICKS)) {
    const slug = name.split(' ')[0];

    // --- pictures, drift paused so rest and pushed differ only by the cursor
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('file://' + path.join(ROOT, 'index.html'));
    await page.waitForTimeout(900);
    await page.addStyleTag({ content: `
      .hero-disc--orange, .hero .rs-blobs { animation:none !important; }
      .reel-video { display:none !important; }` });
    await page.evaluate((o) => { Object.assign(window.STARS.hero, o); window.STARS.hero.rebuild(); }, opts);
    await page.waitForTimeout(400);

    const hero = await page.$('.hero');
    await hero.screenshot({ path: `${OUT}/${slug}-rest.png` });

    /* Parked at the centre of the glow and held there, which is the pose
       §47 measured the donut from. 60 events so the spring settles. */
    await page.evaluate(async () => {
      const r = document.querySelector('.hero-disc--orange').getBoundingClientRect();
      const el = document.querySelector('.hero');
      for (let i = 0; i < 60; i++) {
        el.dispatchEvent(new PointerEvent('pointermove', {
          clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, bubbles: true }));
        await new Promise((r) => requestAnimationFrame(r));
      }
    });
    await hero.screenshot({ path: `${OUT}/${slug}-pushed.png` });
    await page.close();

    // --- work
    const set = (p) => p.evaluate((o) => { Object.assign(window.STARS.hero, o); window.STARS.hero.rebuild(); }, opts);
    const w14 = await measure(browser, { width: 1440, height: 900, where: '.hero', setup: set });
    const w19 = await measure(browser, { width: 1920, height: 1080, where: '.hero', setup: set });

    rows.push({ pick: name, ms1440: w14.total, ms1920: w19.total });
    console.log(rows[rows.length - 1]);
  }

  console.table(rows);
  await browser.close();
})();
