/* §50. How far does the cursor reach? Parks the pointer at a series of
   distances from the glow's centre, lets the field settle, and differences
   each against the untouched rest state. A zero difference means the cursor
   at that distance does nothing at all, which is the whole requirement:
   the orange moves when the cursor is in it, and not otherwise. */
const { chromium } = require('playwright');
const path = require('path');
const ROOT = '/Users/mac/Documents/Current Projects/Rysing';

async function shot(page) { return (await (await page.$('.hero')).screenshot()).toString('base64'); }

async function diff(page, a, b) {
  return page.evaluate(async ([a, b]) => {
    const load = (s)=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src='data:image/png;base64,'+s;});
    const [ia,ib] = await Promise.all([load(a),load(b)]);
    const px=(im)=>{const c=document.createElement('canvas');c.width=im.width;c.height=im.height;
      const x=c.getContext('2d');x.drawImage(im,0,0);return x.getImageData(0,0,c.width,c.height).data;};
    const da=px(ia),db=px(ib); let sum=0,worst=0,n=0;
    for(let i=0;i<da.length;i+=4){
      const d=(Math.abs(da[i]-db[i])+Math.abs(da[i+1]-db[i+1])+Math.abs(da[i+2]-db[i+2]))/3;
      sum+=d; if(d>worst)worst=d; n++; }
    return { mean:+(sum/n).toFixed(3), worst:Math.round(worst) };
  }, [a, b]);
}

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('file://' + path.join(ROOT, 'index.html'));
  await p.waitForTimeout(1200);
  await p.addStyleTag({ content:
    '.hero-disc--orange,.hero .rs-blobs{animation:none!important}.reel-video{display:none!important}' });

  const rest = await shot(p);
  const rows = [];
  for (const dist of [60, 150, 250, 400, 600, 800]) {
    await p.evaluate(async (dist) => {
      const el = document.querySelector('.hero');
      const r = document.querySelector('.hero-disc--orange').getBoundingClientRect();
      for (let i = 0; i < 100; i++) {
        el.dispatchEvent(new PointerEvent('pointermove',
          { clientX: r.left + r.width / 2 - dist, clientY: r.top + r.height / 2, bubbles: true }));
        await new Promise((x) => requestAnimationFrame(x));
      }
    }, dist);
    const d = await diff(p, rest, await shot(p));
    rows.push({ 'cursor px from glow centre': dist, ...d });
  }
  console.table(rows);
  await b.close();
})();
