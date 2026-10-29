const { chromium } = require('playwright');
const OUT='/private/tmp/claude-501/-Users-mac-Documents-Current-Projects-Rysing/a1be201c-2fa5-4c4e-8bb7-0b2aede2d331/scratchpad';
(async () => {
  const b = await chromium.launch();
  for (const [w,h] of [[1440,900],[390,844]]) {
    const p = await b.newPage({ viewport:{width:w,height:h} });
    await p.goto('file:///Users/mac/Documents/Current%20Projects/Rysing/index.html');
    await p.waitForTimeout(1200);
    await p.evaluate(()=>document.querySelector('.footer-lockup').scrollIntoView({block:'center'}));
    await p.waitForTimeout(900);
    await (await p.$('.site-footer')).screenshot({ path:`${OUT}/footer-${w}-rest.png` });
    await p.evaluate(async ()=>{
      const el=document.querySelector('.footer-lockup'); const r=el.getBoundingClientRect();
      for(let i=0;i<70;i++){ el.dispatchEvent(new PointerEvent('pointermove',{clientX:r.left+r.width*0.5,clientY:r.top+r.height*0.5,bubbles:true}));
        await new Promise(x=>requestAnimationFrame(x)); }
    });
    await (await p.$('.site-footer')).screenshot({ path:`${OUT}/footer-${w}-pushed.png` });
    await p.close();
  }
  await b.close();
})();
