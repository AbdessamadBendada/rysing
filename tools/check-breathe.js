/* §53 acceptance. The breath is meant to be free — opacity on the
   compositor, no repaint — and must be OFF under reduced motion on both the
   canvas and the fallback disc. */
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const rows = [];
  for (const reduced of [false, true]) {
    const ctx = await b.newContext({ viewport:{width:1440,height:900},
      reducedMotion: reduced ? 'reduce' : 'no-preference' });
    const p = await ctx.newPage();
    const errs = [];
    p.on('console', m => { if (m.type()==='error' && !/font|Failed to load/.test(m.text())) errs.push(m.text()); });
    await p.goto('file:///Users/mac/Documents/Current%20Projects/Rysing/index.html');
    await p.waitForTimeout(1500);
    const r = await p.evaluate(() => {
      const names = sel => {
        const el = document.querySelector(sel);
        if (!el) return 'absent';
        const a = getComputedStyle(el).animationName;
        return a === 'none' ? 'none' : a;
      };
      /* The fallback disc is only the live glow when the lattice did not
         build, but it still must not animate under reduced motion. */
      return { field: names('.hero .rs-field'), canvas: names('.hero .rs-blobs'),
               disc: names('.hero-disc--orange') };
    });
    rows.push({ 'reduced motion': reduced, field: r.field, canvas: r.canvas,
                'fallback disc': r.disc, errors: errs.length });
    await ctx.close();
  }
  console.table(rows);
  /* The breath moved from the canvas to the field mid-cycle and the
     reduced-motion rule did not follow it. Check every layer that could
     carry an animation, not the one that happens to today. */
  const bad = rows.find(x => x['reduced motion']
    && [x.field, x.canvas, x['fallback disc']].some(v => v !== 'none'));
  const live = rows.find(x => !x['reduced motion'] && !/heroBreathe/.test(x.field + x['fallback disc']));
  if (live) console.log('FAIL: the breath is not running at all');
  console.log(bad ? '\nFAIL: something still animates under reduced motion' : '\nreduced motion clean');
  await b.close();
  process.exit(bad || live ? 1 : 0);
})();
