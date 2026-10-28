/* ============================================================================
   THE STAR FIELD PARTS FOR THE CURSOR — variant C of the pattern playground.

   NOTHING HERE IS PART OF THE SITE. It runs only on `pattern-playground.html`
   (`chrome: none`, nothing links to it) and no page of the site loads it.
   Read HANDOFF §44 and §45 before changing any of it.

   WHAT THIS IS, AND WHY IT IS NOT A SIXTH ATTEMPT AT THE HERO.
   §44 and §45 are about the hero's orange GLOW — a continuous field of light,
   where the governing fact is that removing light from the middle of a radial
   gradient always leaves a ring (§44's donut). That fact does not apply here.
   This section is the brand mark repeated as a PATTERN: discrete objects on a
   lattice, each of which has a home. A hole in a lattice of marks reads as
   marks getting out of the way, because there is nothing to sum into a cloud.
   So the donut rule, and the whole "displace, never delete" argument that
   §45's shader exists to satisfy, are not constraints on this file.

   THE REFERENCE is CodePen `rkgttr/pen/ZGZzJG`, "Particles repulsion": a grid
   of SVG dots, each pushed away from the cursor by `strength / distance` and
   then pulled back toward its home by 10% a frame. Twenty-five lines. The
   client sent it and this reproduces its behaviour, with four changes that
   are explained where they are made — the force law, the write path, the
   pointer filter, and the hole for the logo.

   WHY THE PEN'S SHAPE IS WORTH COPYING, in this document's terms: every point
   carries its own `x` and `y` forward and is only ever NUDGED, so each frame
   starts from the last one. §44's post-mortem blames all three hand-written
   stutters on recomputing a shape from the cursor's current position with no
   memory of the frame before. This has that memory structurally, the same way
   advection gave it to the fluid.
   ========================================================================= */

(function () {
  'use strict';

  /* The whole control surface, read fresh every frame so it can be tuned live
     in the console with no reload — `window.STARS`, the same arrangement as
     §45's `SHARK` block, and for the same reason: the tuning session is where
     this gets decided and a reload loses the pointer state that makes the
     effect visible at all. */
  var K = {
    DENSITY:  340,   // target star count; the lattice gap is derived from it
    STRENGTH: 2600,  // push, in px·px — see the force law below
    SOFT:     54,    // px. The softening radius: force peaks at STRENGTH/SOFT
    MAXPUSH:  34,    // px per 60Hz frame, a hard ceiling on the spike
    RANGE:    2.4,   // how far a star may be driven from home, in gaps
    EASE:     0.10,  // return toward home per 60Hz frame — the pen's value
    TAU:      0.045, // seconds. Pointer smoothing time constant
    SIZE:     0.30,  // star size as a fraction of the lattice gap
    RED:      7      // one star in RED is brand red; the rest are paper
  };
  window.STARS = K;

  var section = document.querySelector('[data-stars-section]');
  var field   = document.querySelector('[data-stars]');
  var logo    = document.querySelector('[data-stars-logo]');
  if (!section || !field || !logo) return;

  var reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  var stars = [];          // {el, ox, oy, x, y}
  var gap   = 60;
  var hole  = { cx: 0, cy: 0, rx: 0, ry: 0 };

  /* Pointer state. `tx/ty` is where the last event said the cursor was;
     `mx/my` is the filtered position the physics actually follows. */
  var tx = 0, ty = 0, mx = 0, my = 0, has = false, primed = false;

  /* ---- Building the lattice ---------------------------------------------
     THE GAP IS DERIVED FROM AN AREA, NOT WRITTEN AS A LENGTH. A fixed px gap
     gives ~90 stars on a phone and ~900 on a 27" display: the first is sparse
     enough to stop reading as a pattern and the second is a DOM write per
     star per frame on a budget that does not have 900 of them. Solving
     `gap = sqrt(area / DENSITY)` holds the count roughly constant and lets
     the pattern breathe with the viewport instead.

     The same reasoning sizes the star itself as a FRACTION OF THE GAP rather
     than in px, which is §44's last technical finding wearing different
     clothes — there, a px particle size packed four times as densely at 390
     and blew the additive core out to white. */
  function build() {
    var w = section.clientWidth;
    var h = section.clientHeight;
    if (!w || !h) return;

    gap = Math.sqrt((w * h) / K.DENSITY);

    /* THE HOLE IS READ FROM THE LOGO'S RENDERED BOX, not computed from the
       same clamps a second time. §33 is the precedent: a geometry restated in
       two places drifts, and here the drift would be stars landing on the
       wordmark. An ellipse rather than the rect, because a rectangular gap in
       a star field reads as a card sitting on top of the pattern — which is
       the eclipse problem of §45 in plan view. */
    var sr = section.getBoundingClientRect();
    var lr = logo.getBoundingClientRect();
    hole.cx = lr.left - sr.left + lr.width / 2;
    hole.cy = lr.top  - sr.top  + lr.height / 2;
    hole.rx = lr.width  / 2 + gap * 1.05;
    hole.ry = lr.height / 2 + gap * 1.35;

    var cols = Math.ceil(w / gap) + 1;
    var rows = Math.ceil(h / gap) + 1;
    var ox = (w - (cols - 1) * gap) / 2;
    var oy = (h - (rows - 1) * gap) / 2;

    var frag = document.createDocumentFragment();
    var next = [];
    var size = gap * K.SIZE;
    var n = 0;

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        /* THE JITTER IS WHAT MAKES IT A PATTERN RATHER THAN GRAPH PAPER, and
           it is deliberately small — a third of a gap. Push it past about
           half and the lattice stops being legible, which costs the effect
           its subject: what the eye reads during repulsion is a REGULAR
           spacing being deformed. Scatter the stars freely and the cursor
           just moves some dots around. */
        var x = ox + c * gap + (rnd() - 0.5) * gap * 0.34;
        var y = oy + r * gap + (rnd() - 0.5) * gap * 0.34;

        var dx = (x - hole.cx) / hole.rx;
        var dy = (y - hole.cy) / hole.ry;
        if (dx * dx + dy * dy < 1) continue;          // the logo's clear space

        var el = document.createElement('i');
        el.className = 'pp-star';
        var inner = document.createElement('b');
        /* Scale, rotation and the twinkle live on the INNER element and the
           translate on the outer one. One element cannot carry both without
           rebuilding the whole transform string every frame, and splitting
           them means the per-frame write is a single short translate — which
           is the difference between a compositor update and a string
           allocation per star per frame. */
        inner.style.cssText =
          'transform:rotate(' + (rnd() * 90 | 0) + 'deg) scale(' + (0.66 + rnd() * 0.78).toFixed(3) + ');' +
          '--o:' + (0.26 + rnd() * 0.5).toFixed(3) + ';' +
          'animation-duration:' + (6 + rnd() * 7).toFixed(2) + 's;' +
          'animation-delay:-' + (rnd() * 12).toFixed(2) + 's;';
        if (n % K.RED === (K.RED >> 1)) inner.className = 'is-red';
        el.appendChild(inner);

        el.style.width = el.style.height = size.toFixed(2) + 'px';
        el.style.left = (x - size / 2).toFixed(2) + 'px';
        el.style.top  = (y - size / 2).toFixed(2) + 'px';

        frag.appendChild(el);
        next.push({ el: el, ox: x, oy: y, x: x, y: y });
        n++;
      }
    }

    field.textContent = '';
    field.appendChild(frag);
    stars = next;
  }

  /* A fixed sequence, so a resize does not reshuffle the whole pattern into a
     different one in front of the viewer. */
  var seed = 0x9e3779b9;
  function rnd() {
    seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
    return ((seed >>> 0) % 100000) / 100000;
  }
  function reseed() { seed = 0x9e3779b9; }

  /* ---- The force law -----------------------------------------------------
     THE PEN'S `strength / dist` DIVERGES AT THE CURSOR. At dist→0 the push is
     unbounded, so a star the cursor passes directly over is thrown hundreds
     of px in one frame and snaps back over the next ten. On the pen's toy
     page, at a hundred dots, that reads as liveliness. At this density it is
     a visible flick, and it is the one part of the reference that does not
     survive being scaled up.

     `STRENGTH / (dist + SOFT)` is the same curve everywhere that matters and
     simply stops climbing underneath the cursor, where it tops out at
     STRENGTH/SOFT. MAXPUSH is a second ceiling for the flick that a very fast
     pointer can still produce between two frames, and RANGE caps the total
     distance from home so nothing can be walked off the section by a
     sustained push. Three limits rather than one because each catches a
     different gesture: hovering, flicking, and shoving.

     Everything is scaled by `k`, the frame's length in 60Hz frames, so the
     effect is the same on a 120Hz display. The pen is frame-locked and runs
     at double speed on one. */
  var last = 0;

  function frame(now) {
    if (!last) last = now;
    var dt = (now - last) / 1000;
    last = now;
    /* §45: `dt` can be zero, and a zero or a long tab-switch gap both poison
       a per-frame integration. Clamped at both ends. */
    if (!(dt > 0)) dt = 1 / 60;
    if (dt > 0.1) dt = 0.1;
    var k = dt * 60;

    /* THE POINTER RUNS THROUGH A FILTER, which is §45's "smoothness is not a
       tuning problem" finding and the single most load-bearing line in this
       file. Pointer events do not arrive once per frame — they come in
       irregular bursts, several in one frame and none in the next — so a
       handler driven straight off the event position gives a jump, a hold, a
       jump. The pen has exactly this fault and gets away with it because its
       dots are tiny and its spring is slack. */
    var a = 1 - Math.exp(-dt / K.TAU);
    mx += (tx - mx) * a;
    my += (ty - my) * a;

    var ease = 1 - Math.pow(1 - K.EASE, k);
    var limit = gap * K.RANGE;
    var maxp = K.MAXPUSH * k;

    for (var i = 0; i < stars.length; i++) {
      var p = stars[i];

      if (has) {
        var dx = p.x - mx, dy = p.y - my;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d > 0.001 && d < 900) {
          var push = (K.STRENGTH / (d + K.SOFT)) * k;
          if (push > maxp) push = maxp;
          p.x += (dx / d) * push;
          p.y += (dy / d) * push;
        }
      }

      p.x += (p.ox - p.x) * ease;
      p.y += (p.oy - p.y) * ease;

      var ax = p.x - p.ox, ay = p.y - p.oy;
      var ad = Math.sqrt(ax * ax + ay * ay);
      if (ad > limit) {
        p.x = p.ox + (ax / ad) * limit;
        p.y = p.oy + (ay / ad) * limit;
      }

      /* `transform`, not the individual `translate` property: §45 closed with
         a Safari failure that was never diagnosed, and this is a free place
         not to add a second thing for Safari to disagree about. */
      p.el.style.transform =
        'translate3d(' + (p.x - p.ox).toFixed(2) + 'px,' + (p.y - p.oy).toFixed(2) + 'px,0)';
    }

    requestAnimationFrame(frame);
  }

  /* ---- Wiring ------------------------------------------------------------
     THE LISTENER IS ON THE SECTION. §44's sixth finding: every shape layer
     here is `pointer-events:none`, so a listener bound to the field or the
     canvas inside it receives nothing at all and throws no error while doing
     it. That broke twice in §44. The field stays `pointer-events:none` and
     the section is what listens. */
  function point(e) {
    var r = section.getBoundingClientRect();
    tx = e.clientX - r.left;
    ty = e.clientY - r.top;
    if (!primed) { mx = tx; my = ty; primed = true; }   // no swoop on entry
    has = true;
  }

  section.addEventListener('pointermove', point, { passive: true });
  section.addEventListener('pointerenter', point, { passive: true });
  section.addEventListener('pointerleave', function () { has = false; }, { passive: true });

  /* Rebuild on resize only when a dimension actually changed. A
     `ResizeObserver` on a section whose height is `100svh` fires on every
     mobile URL-bar nudge, and rebuilding the lattice mid-gesture throws the
     pattern away and replaces it with a different one. */
  var rw = 0, rh = 0, timer = 0;
  function onResize() {
    var w = section.clientWidth, h = section.clientHeight;
    if (Math.abs(w - rw) < 2 && Math.abs(h - rh) < 2) return;
    rw = w; rh = h;
    clearTimeout(timer);
    timer = setTimeout(function () { reseed(); build(); }, 120);
  }
  window.addEventListener('resize', onResize, { passive: true });

  function start() {
    reseed();
    build();
    rw = section.clientWidth; rh = section.clientHeight;
    if (!reduced) requestAnimationFrame(frame);
  }

  /* The lockup is an `<img>` and the hole is read from its rendered box, so
     the field cannot be laid out until it has one. Building before the image
     decodes puts stars where the wordmark is about to appear. */
  if (logo.complete) start();
  else logo.addEventListener('load', start, { once: true });
})();
