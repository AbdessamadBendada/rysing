/* §51. The numerals are bottom-anchored and taller than their own box, so
   the thing that can break is a numeral touching the one in the row above —
   which looking at one width at one open state will not catch. Checks every
   width against every open row, plus horizontal overflow. */
const { chromium } = require('playwright');
const SIZES = [[360, 800], [390, 844], [620, 900], [768, 1024], [1024, 900], [1440, 900], [1920, 1080]];
const URL = 'file:///Users/mac/Documents/Current%20Projects/Rysing/index.html';

(async () => {
  const browser = await chromium.launch();
  const rows = [];
  let bad = 0;
  for (const [width, height] of SIZES) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    /* Loading over file:// blocks every woff2 on CORS — four errors on every
       page, present before this work and nothing to do with it. Everything
       else is a real error. */
    const noise = /Access to font at|Failed to load resource/;
    page.on('console', m => { if (m.type() === 'error' && !noise.test(m.text())) errors.push(m.text()); });
    await page.goto(URL);
    await page.waitForTimeout(600);

    for (let open = 0; open < 4; open++) {
      await page.evaluate(i => {
        document.querySelectorAll('.system-item').forEach((el, n) => {
          el.classList.toggle('is-open', n === i);
          el.querySelector('.system-toggle').setAttribute('aria-expanded', String(n === i));
        });
      }, open);
      await page.waitForTimeout(450);

      const r = await page.evaluate(() => {
        const els = [...document.querySelectorAll('.system-num')];
        const nums = els.map(n => n.getBoundingClientRect());
        /* NEITHER the element box nor a Range rect is the glyph. The box is
           the line-height (.72em, SHORTER than the ink) and a Range rect is
           the font's em box (~1.17em, TALLER than it) — the Range version of
           this check reported a 98px overlap at 1920 on a layout with a
           visible gap. Walk back to the baseline and take canvas's actual
           ink bounds for the digits that are really set. */
        const ctx = document.createElement('canvas').getContext('2d');
        const ink = els.map(n => {
          const cs = getComputedStyle(n);
          const box = n.getBoundingClientRect();
          ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
          const m = ctx.measureText(n.textContent.trim());
          const lh = parseFloat(cs.lineHeight);
          const half = (lh - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2;
          const baseline = box.top + half + m.fontBoundingBoxAscent;
          return {
            top: baseline - m.actualBoundingBoxAscent,
            bottom: baseline + m.actualBoundingBoxDescent,
            left: box.left, right: box.right,
          };
        });
        let worst = Infinity;
        for (let i = 1; i < ink.length; i++) worst = Math.min(worst, ink[i].top - ink[i - 1].bottom);
        const names = [...document.querySelectorAll('.system-name')].map(n => n.getBoundingClientRect());
        let nameGap = Infinity;
        for (let i = 0; i < ink.length; i++) {
          /* stacked layout only: the name sits under its own numeral */
          if (names[i].left < ink[i].right && names[i].top > ink[i].top) {
            nameGap = Math.min(nameGap, names[i].top - ink[i].bottom);
          }
        }
        return {
          gap: Math.round(worst),
          nameGap: nameGap === Infinity ? null : Math.round(nameGap),
          overflow: Math.round(document.documentElement.scrollWidth - document.documentElement.clientWidth),
          numRight: Math.round(Math.max(...nums.map(n => n.right))),
        };
      });
      const fail = r.gap < 0 || r.overflow > 0 || (r.nameGap !== null && r.nameGap < 0) || errors.length;
      if (fail) bad++;
      if (errors.length) console.log(`console @${width}:`, [...new Set(errors)].join(' | '));
      rows.push({ width, open: open + 1, 'num gap': r.gap, 'name gap': r.nameGap, 'overflow px': r.overflow, errors: errors.length, ok: fail ? 'FAIL' : '' });
    }
    await page.close();
  }
  console.table(rows);
  console.log(bad ? `\n${bad} FAILING STATES` : '\nall states clean');
  await browser.close();
  process.exit(bad ? 1 : 0);
})();
