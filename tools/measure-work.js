/* §48's measurement, fourth attempt and the one the numbers come from.

   WHY NOT FRAME RATE. This harness is a software-rendered headless Chromium
   and it cannot serve 60fps on the homepage with the effect REMOVED — the
   floor measures 38-41fps. Frame rate here is a property of the harness. The
   metric §45-§47 used is worse: median rAF delta is quantised to the vsync
   interval, so it can only ever print 16.7 or 33.3, and which one it prints
   flaps between runs on an unchanged page. Those sections' tables should be
   read as "fast" and "not fast", not as timings.

   WHAT THIS MEASURES is renderer WORK, through the tracing categories
   DevTools itself uses: main-thread script, style, layout and paint, plus
   raster and compositing off the main thread. Microsecond durations of real
   work over a fixed sample, independent of whether the compositor managed to
   present anything. That is deterministic enough to tell a 2x regression
   from noise, which is the question.

   Budget: a 60fps frame is 16.7ms, so TOTAL work per frame has to sit under
   that with room for everything else on the page. */
const { chromium } = require('playwright');
const path = require('path');
const ROOT = '/Users/mac/Documents/Current Projects/Rysing';

const SAMPLE_MS = 4000;
const REPEATS = 3;

const MAIN = new Set(['FunctionCall', 'TimerFire', 'EventDispatch', 'ParseHTML',
  'UpdateLayoutTree', 'Layout', 'Paint', 'PrePaint', 'Commit', 'UpdateLayer',
  'UpdateLayerTree', 'HitTest', 'AnimationFrame', 'FireAnimationFrame']);
const RASTER = new Set(['RasterTask', 'Rasterize', 'CompositeLayers',
  'DrawFrame', 'GPUTask', 'DecodeImage']);

async function sample(page, where) {
  const client = await page.context().newCDPSession(page);
  await client.send('Tracing.start', {
    traceConfig: {
      includedCategories: [
        'disabled-by-default-devtools.timeline',
        'disabled-by-default-devtools.timeline.frame',
        'devtools.timeline',
      ],
    },
    transferMode: 'ReturnAsStream',
  });

  await page.evaluate(async ([ms, where]) => {
    const el = document.querySelector(where);
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const rx = r.width * 0.3, ry = Math.min(r.height, innerHeight) * 0.3;
    let frames = 0;
    const t0 = performance.now();
    await new Promise((done) => {
      const loop = (now) => {
        frames++;
        const a = ((now - t0) / 1400) * Math.PI * 2;
        el.dispatchEvent(new PointerEvent('pointermove', {
          clientX: cx + Math.cos(a) * rx, clientY: cy + Math.sin(a) * ry, bubbles: true,
        }));
        if (now - t0 < ms) requestAnimationFrame(loop); else done();
      };
      requestAnimationFrame(loop);
    });
    window.__frames = frames;
  }, [SAMPLE_MS, where]);

  const frames = await page.evaluate(() => window.__frames);

  const done = new Promise((res) => client.once('Tracing.tracingComplete', res));
  await client.send('Tracing.end');
  const { stream } = await done;

  let raw = '';
  for (;;) {
    const { data, eof } = await client.send('IO.read', { handle: stream, size: 1 << 20 });
    raw += data;
    if (eof) break;
  }
  await client.send('IO.close', { handle: stream });

  const events = JSON.parse(raw).traceEvents || [];
  let main = 0, raster = 0;
  for (const e of events) {
    if (e.ph !== 'X' || !e.dur) continue;
    if (MAIN.has(e.name)) main += e.dur;
    else if (RASTER.has(e.name)) raster += e.dur;
  }
  return {
    frames,
    main: +(main / 1000 / frames).toFixed(2),     // ms of main-thread work per frame
    raster: +(raster / 1000 / frames).toFixed(2), // ms of raster/composite per frame
    total: +((main + raster) / 1000 / frames).toFixed(2),
  };
}

async function measure(browser, { width, height, where, setup, file = 'index.html' }) {
  const runs = [];
  for (let i = 0; i < REPEATS; i++) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto('file://' + path.join(ROOT, file));
    await page.waitForTimeout(1000);
    await page.addStyleTag({ content: '.reel-video{display:none !important}' });
    if (where === '.footer-lockup') {
      await page.evaluate(() => document.querySelector('.footer-lockup').scrollIntoView({ block: 'center' }));
      await page.waitForTimeout(600);
    }
    if (setup) await setup(page);
    await page.waitForTimeout(500);
    runs.push(await sample(page, where));
    await page.close();
  }
  runs.sort((a, b) => a.total - b.total);
  return runs[1];
}

module.exports = { measure };

if (require.main === module) {
  (async () => {
    const browser = await chromium.launch();
    const rows = [];
    const cases = {
      'as built (blur 30 on the field)': null,
      'blur 0': (p) => p.evaluate(() => { window.STARS.hero.BLUR = 0; window.STARS.hero.rebuild(); }),
      'blur 0, SIZE 4.5': (p) => p.evaluate(() => {
        Object.assign(window.STARS.hero, { BLUR: 0, SIZE: 4.5 }); window.STARS.hero.rebuild();
      }),
      'FLOOR: no field at all': (p) => p.evaluate(() => document.querySelector('.hero .rs-field').remove()),
    };
    for (const [name, setup] of Object.entries(cases)) {
      for (const [width, height] of [[1440, 900], [1920, 1080]]) {
        const r = await measure(browser, { width, height, where: '.hero', setup });
        rows.push({ case: name, width, ...r });
        console.log(rows[rows.length - 1]);
      }
    }
    console.table(rows);
    await browser.close();
  })();
}
