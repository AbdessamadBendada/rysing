/* Is §53's breath what raised the hero's cost, or was the baseline it is
   being compared against measured on another day on another machine? §50's
   11.3ms at 1920 is a number from a different session; the only honest
   comparison is the same page with the breath on and off, now. */
const { chromium } = require('playwright');
const { measure } = require('./measure-work.js');
(async () => {
  const browser = await chromium.launch();
  const rows = [];
  for (const width of [1440, 1920]) {
    for (const breath of [true, false]) {
      const r = await measure(browser, { width, height: width === 1920 ? 1080 : 900,
        where: '.hero',
        setup: breath ? null : (page) => page.addStyleTag({
          /* Only the breath is removed; driftA stays, so this isolates §53
             rather than measuring "all hero animation off". */
          content: '.hero .rs-field{animation:none!important}' }) });
      rows.push({ width, breath: breath ? 'on' : 'OFF', 'hero ms': r.total });
    }
  }
  console.table(rows);
  await browser.close();
})();
