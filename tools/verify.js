/* §48's acceptance run. Everything the two effects are supposed to be true
   of, measured rather than looked at once at one width. */
const { chromium } = require('playwright');
const path = require('path');
const { measure } = require('./measure-work.js');
const ROOT = '/Users/mac/Documents/Current Projects/Rysing';
const SIZES = [[390, 844], [768, 1024], [1440, 900], [1920, 1080]];
const PAGES = ['index.html', 'about.html', 'process.html', 'contact.html',
               'communication-strategy.html', 'case-gerd-bommer.html', 'coming-soon.html'];

(async () => {
  const browser = await chromium.launch();

  /* ---- 1. work per frame, both effects, every width -------------------- */
  const work = [];
  for (const [width, height] of SIZES) {
    const hero = await measure(browser, { width, height, where: '.hero' });
    const foot = await measure(browser, { width, height, where: '.footer-lockup' });
    work.push({ width, 'hero ms': hero.total, 'footer ms': foot.total });
  }
  console.log('\nRENDERER WORK PER FRAME under continuous pointer motion (budget 16.7)');
  console.table(work);

  /* ---- 2. idle cost: no pointer at all, which is every touch device ---- */
  const idle = [];
  for (const [width, height] of [[390, 844], [1440, 900]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto('file://' + path.join(ROOT, 'index.html'));
    await page.waitForTimeout(1500);
    const n = await page.evaluate(() => new Promise((res) => {
      // Count how many frames do real work when nothing is pointing at it.
      let painted = 0;
      const c = document.querySelector('.hero canvas');
      const ctx = c && c.getContext('2d');
      const orig = ctx && ctx.drawImage;
      if (ctx) ctx.drawImage = function () { painted++; return orig.apply(this, arguments); };
      setTimeout(() => res(painted), 2000);
    }));
    idle.push({ width, 'blob draws in 2s with no cursor': n });
    await page.close();
  }
  console.log('\nIDLE (no pointer — the permanent state on a phone)');
  console.table(idle);

  /* ---- 3. every page: field built, no overflow, no dead scroll --------- */
  const pages = [];
  for (const file of PAGES) {
    for (const [width, height] of [[390, 844], [1440, 900]]) {
      const page = await browser.newPage({ viewport: { width, height } });
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto('file://' + path.join(ROOT, file));
      await page.waitForTimeout(800);
      const r = await page.evaluate(() => {
        const band = document.querySelector('.footer-lockup');
        if (band) band.scrollIntoView({ block: 'center' });
        return null;
      });
      await page.waitForTimeout(700);
      const info = await page.evaluate(() => {
        const band = document.querySelector('.footer-lockup');
        const mark = document.querySelector('.footer-mark');
        const stars = document.querySelectorAll('.footer-lockup .rs-star');
        // Any star overlapping the artwork is the defect §46 names.
        let onArt = 0;
        if (mark && stars.length) {
          const m = mark.getBoundingClientRect();
          stars.forEach((s) => {
            const b = s.getBoundingClientRect();
            if (b.right > m.left && b.left < m.right && b.bottom > m.top && b.top < m.bottom) onArt++;
          });
        }
        return {
          band: !!band,
          built: !!(band && band.classList.contains('is-stars')),
          stars: stars.length,
          onArt,
          scrollW: document.documentElement.scrollWidth,
        };
      });
      pages.push({ file, width, ...info, overflow: info.scrollW > width,
                   errors: errors.length ? errors[0] : '' });
      await page.close();
    }
  }
  console.log('\nEVERY PAGE');
  console.table(pages);

  /* ---- 4. the fallback: script never runs ------------------------------ */
  const fb = [];
  for (const file of ['index.html', 'about.html']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.route('**/pattern-stars.js*', (r) => r.abort());
    await page.goto('file://' + path.join(ROOT, file));
    await page.waitForTimeout(800);
    const r = await page.evaluate(() => {
      const disc = document.querySelector('.hero-disc--orange');
      const mark = document.querySelector('.footer-mark');
      return {
        orangeVisible: disc ? getComputedStyle(disc).opacity : 'n/a',
        markVisible: mark ? getComputedStyle(mark).opacity : 'n/a',
        markWidth: mark ? Math.round(mark.getBoundingClientRect().width) : 0,
      };
    });
    fb.push({ file, ...r });
    await page.close();
  }
  console.log('\nFALLBACK — pattern-stars.js blocked');
  console.table(fb);

  await browser.close();
})();
