/* ============================================================================
   A LATTICE OF MARKS THAT PARTS FOR THE CURSOR — variants C, D and E of the
   pattern playground.

   NOTHING HERE IS PART OF THE SITE. It runs only on `pattern-playground.html`
   (`chrome: none`, nothing links to it) and no page of the site loads it.
   Read HANDOFF §44, §45 and §46 before changing any of it.

   WHAT THIS IS.
   §44 and §45 are about the hero's orange GLOW — a continuous field of light,
   where the governing fact is that removing light from the middle of a radial
   gradient always leaves a ring (§44's donut). This file is a different
   thing: the brand mark repeated as a PATTERN, discrete objects on a lattice,
   each of which has a home to return to. A hole in a lattice of marks reads
   as marks getting out of the way, because there is nothing to sum into a
   cloud — so the donut rule and the whole "displace, never delete" argument
   that §45's shader exists to satisfy are not constraints on it.

   THAT LAST SENTENCE HAS AN EXCEPTION AND IT IS VARIANT E. See the `blob`
   mark below: when the marks are made big enough and soft enough to sum into
   a cloud, the lattice stops protecting you and §44's donut comes back. That
   is the whole point of building D and E as a pair.

   THE REFERENCE is CodePen `rkgttr/pen/ZGZzJG`, "Particles repulsion": a grid
   of SVG dots, each pushed away from the cursor by `strength / distance` and
   then pulled back toward its home by 10% a frame. Twenty-five lines. The
   client sent it; this reproduces its behaviour with four changes that are
   explained where they are made — the force law, the write path, the pointer
   filter, and the hole for the logo.

   WHY THE PEN'S SHAPE IS WORTH COPYING, in this document's terms: every point
   carries its own `x` and `y` forward and is only ever NUDGED, so each frame
   starts from the last one. §44's post-mortem blames all three hand-written
   stutters on recomputing a shape from the cursor's current position with no
   memory of the frame before. This has that memory structurally, the same way
   advection gave it to the fluid.

   ---------------------------------------------------------------------------
   THE FILE DRIVES EVERY `[data-stars-section]` ON THE PAGE, each with its own
   lattice, its own pointer and its own knobs. It was written for one and the
   rewrite to many is the whole reason D and E can be compared at all: THE
   ONLY VARIABLE BETWEEN THEM IS WHAT THE MARKS ARE. Physics, pointer filter
   and force law are shared code, not copied code — which is the lesson
   §44 paid for when the playground's early variants each grew their own
   slightly different handler.
   ========================================================================= */

(function () {
  'use strict';

  /* The defaults. Every section gets its own copy, overridden per instance
     from `data-stars-opts`, and each copy is read fresh every frame so it can
     be tuned live in the console with no reload — the same arrangement as
     §45's `SHARK` block, and for the same reason: the tuning session is where
     this gets decided and a reload loses the pointer state that makes the
     effect visible at all. */
  var DEFAULTS = {
    DENSITY:  340,   // target MARK count; the lattice gap is solved to hit it
    STRENGTH: 2600,  // push, in px·px — see the force law below
    SOFT:     54,    // px. The softening radius: force peaks at STRENGTH/SOFT
    MAXPUSH:  34,    // px per 60Hz frame, a hard ceiling on the spike
    RANGE:    2.4,   // how far a mark may be driven from home, in gaps
    EASE:     0.10,  // return toward home per 60Hz frame — the pen's value
    TAU:      0.045, // seconds. Pointer smoothing time constant
    SIZE:     0.30,  // mark size as a fraction of the lattice gap
    JITTER:   0.34,  // lattice jitter, in gaps — see the note in `plan`
    RED:      7,     // one mark in RED is brand red; 1 makes them all red
    GAIN:     1,     // brightness multiplier on every mark — see CALIBRATION
    BLUR:     0,     // px of blur on the whole field, `blob` only
    SCALE:    0.5    // canvas resolution for `blob`; the result is blurred
  };

  var reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var instances = [];

  /* ---- The shared loop ---------------------------------------------------
     ONE rAF FOR THE WHOLE PAGE, not one per section. Three independent loops
     interleave unpredictably and each one's `dt` then measures the gap
     between its own frames rather than the frame interval, which quietly
     breaks every time constant in the file. */
  var last = 0;

  function frame(now) {
    if (!last) last = now;
    var dt = (now - last) / 1000;
    last = now;
    /* §45: `dt` can be zero, and a zero or a long tab-switch gap both poison
       a per-frame integration. Clamped at both ends. */
    if (!(dt > 0)) dt = 1 / 60;
    if (dt > 0.1) dt = 0.1;

    for (var i = 0; i < instances.length; i++) instances[i].step(dt);
    requestAnimationFrame(frame);
  }

  /* ---- One section ------------------------------------------------------ */
  function setup(section) {
    var field = section.querySelector('[data-stars]');
    if (!field) return;
    var logo = section.querySelector('[data-stars-logo]');
    var disc = section.querySelector('[data-stars-disc]');

    var K = {};
    for (var key in DEFAULTS) K[key] = DEFAULTS[key];
    try {
      var over = JSON.parse(section.getAttribute('data-stars-opts') || '{}');
      for (var o in over) K[o] = over[o];
    } catch (e) { /* a bad attribute leaves the defaults, and says so */
      if (window.console) console.warn('[stars] bad data-stars-opts on', section);
    }
    /* Tuning handle per section: `STARS.c`, `STARS.d`, `STARS.e`. */
    (window.STARS || (window.STARS = {}))[section.getAttribute('data-stars-id') || 'x'] = K;

    var mark = section.getAttribute('data-stars-mark') || 'star';
    if (mark !== 'star') field.classList.add('pp-field--' + mark);

    var marks = [];         // {el|a, ox, oy, x, y}
    var canvas = null, ctx = null, sprite = null, spriteR = 0;
    var gap = 60;
    var hole = { cx: 0, cy: 0, rx: 0, ry: 0 };
    var ring = null;        // {cx, cy, r} when the lattice fills a disc
    var logoBox = null;

    /* Pointer state. `tx/ty` is where the last event said the cursor was;
       `mx/my` is the filtered position the physics actually follows. */
    var tx = 0, ty = 0, mx = 0, my = 0, has = false, primed = false;

    /* A fixed sequence per section, so a resize does not reshuffle the
       pattern into a different one in front of the viewer. */
    var seed = 0x9e3779b9;
    function rnd() {
      seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
      return ((seed >>> 0) % 100000) / 100000;
    }

    /* THE HERO'S AUTHORED ALPHA PROFILE, for the `blob` mark only.
       `rgba(…,.95) → .5 at 38% → .08 at 62% → transparent at 74%`, read
       straight off `.pp-disc--orange`. §44's first technical finding is that
       those stops are percentages of `halfWidth × √2` and NOT of the radius,
       because a `radial-gradient(circle at …)` with no size keyword is
       FARTHEST-CORNER — reading them as the half-width draws the glow at
       about a third of its real size. `t` below is already divided by √2 by
       the caller for that reason. */
    function profile(t) {
      if (t >= 0.74) return 0;
      if (t < 0.38) return 0.95 + (0.5 - 0.95) * (t / 0.38);
      if (t < 0.62) return 0.5 + (0.08 - 0.5) * ((t - 0.38) / 0.24);
      return 0.08 + (0 - 0.08) * ((t - 0.62) / 0.12);
    }

    /* LAYING THE LATTICE OUT IS SEPARATE FROM BUILDING THE DOM, so the count
       can be solved by trying a gap and counting what survives. No elements
       are made here and nothing is measured. Returns a flat [x,y,alpha,…]. */
    function plan(w, h) {
      hole.rx = logoBox ? logoBox.w / 2 + gap * 1.05 : 0;
      hole.ry = logoBox ? logoBox.h / 2 + gap * 1.35 : 0;

      /* A disc lattice is laid over the disc's own box, not the section's,
         or the gap solves against area the marks can never occupy. */
      var x0 = 0, y0 = 0, bw = w, bh = h;
      if (ring) { x0 = ring.cx - ring.r; y0 = ring.cy - ring.r; bw = bh = ring.r * 2; }

      var cols = Math.ceil(bw / gap) + 1;
      var rows = Math.ceil(bh / gap) + 1;
      var ox = x0 + (bw - (cols - 1) * gap) / 2;
      var oy = y0 + (bh - (rows - 1) * gap) / 2;
      var out = [];

      seed = 0x9e3779b9;
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          /* THE JITTER IS WHAT MAKES IT A PATTERN RATHER THAN GRAPH PAPER,
             and for the `star` mark it is deliberately small — a third of a
             gap. Push it past about half and the lattice stops being
             legible, which costs the effect its subject: what the eye reads
             during repulsion is a REGULAR spacing being deformed. Scatter
             the marks freely and the cursor just moves some dots around.

             The `blob` mark wants the opposite and overrides it. There the
             marks are meant to disappear into a continuous cloud, so a
             legible lattice is banding rather than pattern. */
          var x = ox + c * gap + (rnd() - 0.5) * gap * K.JITTER;
          var y = oy + r * gap + (rnd() - 0.5) * gap * K.JITTER;

          var alpha = 1;
          if (ring) {
            var rr = Math.sqrt((x - ring.cx) * (x - ring.cx) + (y - ring.cy) * (y - ring.cy));
            alpha = profile(rr / (ring.r * Math.SQRT2));
            if (alpha <= 0.004) continue;
          }

          if (logoBox) {
            /* THE CLEAR SPACE IS THE ELLIPSE **OR** THE PADDED RECT, and the
               second half is not redundant. A wide, short lockup has corners
               that fall OUTSIDE an ellipse drawn through its sides — at the
               footer's full measure the rect is 1325x281 against an ellipse
               of 727x223, and three marks landed inside the artwork at 1440
               and six at 1920. They were in empty margin that time. That is
               luck, not a property.

               The ellipse still sets the silhouette, because it is wider and
               taller than the rect everywhere except the corners, so the
               hole does not read as the card §45's eclipse warning is
               about. */
            var dx = (x - hole.cx) / hole.rx;
            var dy = (y - hole.cy) / hole.ry;
            if (dx * dx + dy * dy < 1) continue;
            if (Math.abs(x - hole.cx) < logoBox.w / 2 + gap * 0.3 &&
                Math.abs(y - hole.cy) < logoBox.h / 2 + gap * 0.3) continue;
          }

          out.push(x, y, alpha);
        }
      }
      return out;
    }

    function build() {
      var w = section.clientWidth;
      var h = section.clientHeight;
      if (!w || !h) return;

      var sr = section.getBoundingClientRect();

      /* GEOMETRY IS READ FROM A RENDERED BOX, never computed from the same
         clamps a second time. §33 is the precedent: a geometry restated in
         two places drifts, and here the drift would be marks landing on the
         wordmark, or a glow that is not the hero's glow. */
      if (logo) {
        var lr = logo.getBoundingClientRect();
        logoBox = { w: lr.width, h: lr.height };
        hole.cx = lr.left - sr.left + lr.width / 2;
        hole.cy = lr.top - sr.top + lr.height / 2;
      }
      if (disc) {
        var dr = disc.getBoundingClientRect();
        ring = { cx: dr.left - sr.left + dr.width / 2,
                 cy: dr.top - sr.top + dr.height / 2,
                 r: dr.width / 2 };
      }

      /* DENSITY COUNTS THE MARKS YOU SEE, NOT THE ONES THE LATTICE WOULD
         HAVE HAD, and it is solved BY COUNTING rather than from an area.

         Without some correction the field thins as the hole grows, which is
         backwards: the lockup went from half the footer's measure to all of
         it over two requests and the count fell from 356 to 267 at 1440 —
         the knob stopped meaning anything exactly when the composition
         changed enough to need it.

         SUBTRACTING THE HOLE'S AREA DOES NOT WORK AND IT IS WORTH SAYING
         WHY, because it is the obvious fix and it was built first. Two
         things are wrong with it at once. The hole's padding is a multiple
         of the gap, so the gap and the hole each depend on the other and a
         fixed number of passes leaves the two out of step. And the lattice
         deliberately runs a row and a column past every edge, so the points
         it lays down cover rather more than `w * h` to begin with. Modelled
         that way the count came out at 416 against a target of 340.

         Counting has neither problem, and it is cheap: a loop over a few
         hundred points with no DOM in it, four times at the very worst. */
      var fw = ring ? ring.r * 2 : w;
      var fh = ring ? ring.r * 2 : h;
      gap = Math.sqrt((fw * fh) / K.DENSITY);
      var layout = plan(w, h);
      for (var pass = 0; pass < 3; pass++) {
        var count = layout.length / 3;
        if (!count || Math.abs(count - K.DENSITY) < K.DENSITY * 0.06) break;
        gap *= Math.sqrt(count / K.DENSITY);
        layout = plan(w, h);
      }

      /* OVERLAPPING SOFT MARKS DO NOT ADD, THEY COMPOSITE, and getting that
         backwards is how the cloud blows out to white. `n` marks each at
         opacity `o` leave `1-(1-o)^n` — so to reach a target alpha `a` under
         `n` layers, each one has to be `1-(1-a)^(1/n)`. The brightness
         written on each blob below is that root, not the target.

         This is the same family of mistake as §44's premultiplied-alpha
         finding: alpha applied twice, once by accident. */
      var cover = ring
        ? Math.max(1, Math.PI * (K.SIZE * 0.5) * (K.SIZE * 0.5))
        : 1;

      /* CALIBRATION IS EMPIRICAL AND HAS TO BE. `cover` above assumes every
         overlapping mark contributes its full alpha, and a soft mark does
         not — most of its box is nearly transparent. The arithmetic gets the
         SHAPE of the falloff right and is out by a constant on brightness,
         so `GAIN` carries that constant and was measured against the real
         CSS gradient rather than guessed. §45 did the same thing for the
         shader and quotes the result as a mean delta. */
      field.style.filter = K.BLUR ? 'blur(' + K.BLUR + 'px)' : '';

      var next = [];
      var size = gap * K.SIZE;

      /* A CONTINUOUS GLOW MADE OF MOVABLE PARTS IS DRAWN, NOT COMPOSITED,
         and this is the most expensive thing learned in this file.

         The blob field is marks six gaps wide overlapping four or five deep.
         As DOM elements that is several hundred composited layers each the
         size of a small window, and the overdraw is quadratic in SIZE:
         measured at 1440x900 it cost 183ms a frame — eleven frames' budget —
         against 16.7ms for the same physics driving star marks. Halving the
         blob and the count only got it to 67ms. THE DOM IS NOT THE WRONG
         TOOL BY A CONSTANT, IT IS THE WRONG TOOL.

         One canvas, one pre-rendered sprite, a `drawImage` per mark, at
         `SCALE` resolution because the thing is blurred anyway. THE PHYSICS
         DOES NOT CHANGE — `step` updates the same positions in the same
         loop, and only the final write differs. That is what keeps D and E
         a fair comparison, which is the whole reason the pair exists.

         `source-over` is deliberate, not a default left alone: it is the
         same compositing the DOM version used, so the GAIN calibrated
         against the CSS gradient carries over unchanged. `lighter` would be
         additive and a different glow entirely. */
      if (ring) {
        var SCALE = K.SCALE;
        if (!canvas) {
          canvas = document.createElement('canvas');
          canvas.className = 'pp-blobs';
          ctx = canvas.getContext('2d');
        }
        canvas.width = Math.round(w * SCALE);
        canvas.height = Math.round(h * SCALE);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);

        /* The sprite is the blob's own gradient, rendered once. Rebuilding
           it per frame is the obvious shape of this loop and is also how it
           ends up slower than the DOM version was. */
        spriteR = Math.ceil(size / 2);
        sprite = document.createElement('canvas');
        sprite.width = sprite.height = Math.max(2, Math.ceil(size * SCALE));
        var sc = sprite.getContext('2d');
        var half = sprite.width / 2;
        /* THE SPRITE'S RADIUS IS half × √2, NOT half, and getting that
           wrong cost a factor of four in fidelity before it was spotted.
           The DOM blob this replaces was a CSS `radial-gradient(circle at
           50% 50%, …)` with no size keyword, which is FARTHEST-CORNER —
           §44's very first technical finding, which says the stops are
           percentages of `halfWidth × √2`. A canvas gradient has no such
           default: ask for `half` and every stop lands too close in, which
           renders a markedly harder, smaller blob. Measured against the CSS
           gradient, that alone was a mean delta of 15.6 against 1.5. */
        var g = sc.createRadialGradient(half, half, 0, half, half, half * Math.SQRT2);
        g.addColorStop(0, 'rgba(240,66,34,1)');
        g.addColorStop(0.42, 'rgba(240,66,34,.55)');
        g.addColorStop(0.72, 'rgba(240,66,34,0)');
        g.addColorStop(1, 'rgba(240,66,34,0)');
        sc.fillStyle = g;
        sc.fillRect(0, 0, sprite.width, sprite.height);

        for (var ci = 0; ci < layout.length; ci += 3) {
          next.push({ el: null, a: Math.min(1, (1 - Math.pow(1 - layout[ci + 2], 1 / cover)) * K.GAIN),
                      ox: layout[ci], oy: layout[ci + 1], x: layout[ci], y: layout[ci + 1] });
        }
        field.textContent = '';
        field.appendChild(canvas);
        marks = next;
        paint();
        section.classList.add('is-stars');
        return;
      }

      var frag = document.createDocumentFragment();

      for (var i = 0; i < layout.length; i += 3) {
        var x = layout[i], y = layout[i + 1], a = layout[i + 2];

        var el = document.createElement('i');
        el.className = 'pp-star';
        var inner = document.createElement('b');

        /* Scale, rotation, colour and the twinkle live on the INNER element
           and the translate on the outer one. One element cannot carry both
           without rebuilding the whole transform string every frame, and
           splitting them means the per-frame write is a single short
           translate — the difference between a compositor update and a
           string allocation per mark per frame. */
        {
          inner.style.cssText =
            'transform:rotate(' + (rnd() * 90 | 0) + 'deg) scale(' + (0.66 + rnd() * 0.78).toFixed(3) + ');' +
            '--o:' + Math.min(1, (0.26 + rnd() * 0.5) * K.GAIN).toFixed(3) + ';' +
            'animation-duration:' + (6 + rnd() * 7).toFixed(2) + 's;' +
            'animation-delay:-' + (rnd() * 12).toFixed(2) + 's;';
          if ((i / 3) % K.RED === (K.RED >> 1)) inner.className = 'is-red';
        }
        el.appendChild(inner);

        el.style.width = el.style.height = size.toFixed(2) + 'px';
        el.style.left = (x - size / 2).toFixed(2) + 'px';
        el.style.top = (y - size / 2).toFixed(2) + 'px';

        frag.appendChild(el);
        next.push({ el: el, ox: x, oy: y, x: x, y: y });
      }

      field.textContent = '';
      field.appendChild(frag);
      marks = next;
      /* Marks the section as running, which is what hides the CSS fallback.
         Done from here so that every early return above leaves the authored
         shape on the page — §45's arrangement, for the same reason. */
      section.classList.add('is-stars');
    }

    /* ---- The force law ---------------------------------------------------
       THE PEN'S `strength / dist` DIVERGES AT THE CURSOR. At dist→0 the push
       is unbounded, so a mark the cursor passes directly over is thrown
       hundreds of px in one frame and snaps back over the next ten. On the
       pen's toy page, at a hundred dots, that reads as liveliness. At this
       density it is a visible flick, and it is the one part of the reference
       that does not survive being scaled up.

       `STRENGTH / (dist + SOFT)` is the same curve everywhere that matters
       and simply stops climbing underneath the cursor, where it tops out at
       STRENGTH/SOFT. MAXPUSH is a second ceiling for the flick that a very
       fast pointer can still produce between two frames, and RANGE caps the
       total distance from home so nothing can be walked off the section by a
       sustained push. Three limits rather than one because each catches a
       different gesture: hovering, flicking, and shoving.

       Everything is scaled by `k`, the frame's length in 60Hz frames, so the
       effect is the same on a 120Hz display. The pen is frame-locked and
       runs at double speed on one. */
    function paint() {
      /* Cleared in DEVICE space. `clearRect` goes through the current
         transform like everything else, so clearing `canvas.width` under a
         scale of S wipes only S of the canvas and leaves a smear of the
         previous frame in the rest — invisible at S = 0.5 because the
         leftover happens to be off screen, and obvious at 0.33. */
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      var d = spriteR * 2;
      for (var i = 0; i < marks.length; i++) {
        var p = marks[i];
        ctx.globalAlpha = p.a;
        ctx.drawImage(sprite, p.x - spriteR, p.y - spriteR, d, d);
      }
      ctx.globalAlpha = 1;
    }

    function step(dt) {
      if (!visible) return;
      var k = dt * 60;

      /* THE POINTER RUNS THROUGH A FILTER, which is §45's "smoothness is not
         a tuning problem" finding and the single most load-bearing line in
         this file. Pointer events do not arrive once per frame — they come
         in irregular bursts, several in one frame and none in the next — so
         a handler driven straight off the event position gives a jump, a
         hold, a jump. The pen has exactly this fault and gets away with it
         because its dots are tiny and its spring is slack. */
      var a = 1 - Math.exp(-dt / K.TAU);
      mx += (tx - mx) * a;
      my += (ty - my) * a;

      var ease = 1 - Math.pow(1 - K.EASE, k);
      var limit = gap * K.RANGE;
      var maxp = K.MAXPUSH * k;

      for (var i = 0; i < marks.length; i++) {
        var p = marks[i];

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

        /* `transform`, not the individual `translate` property: §45 closed
           with a Safari failure that was never diagnosed, and this is a free
           place not to add a second thing for Safari to disagree about. */
        if (p.el) {
          p.el.style.transform =
            'translate3d(' + (p.x - p.ox).toFixed(2) + 'px,' + (p.y - p.oy).toFixed(2) + 'px,0)';
        }
      }

      if (canvas) paint();
    }

    /* ---- Wiring --------------------------------------------------------
       THE LISTENER IS ON THE SECTION. §44's sixth finding: every shape layer
       here is `pointer-events:none`, so a listener bound to the field
       receives nothing at all and throws no error while doing it. That broke
       twice in §44. The field stays `pointer-events:none` and the section is
       what listens. */
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
    window.addEventListener('resize', function () {
      var w = section.clientWidth, h = section.clientHeight;
      if (Math.abs(w - rw) < 2 && Math.abs(h - rh) < 2) return;
      rw = w; rh = h;
      clearTimeout(timer);
      timer = setTimeout(build, 120);
    }, { passive: true });

    /* Live rebuild, so the knobs above can be tried without a reload — the
       geometry ones (DENSITY, SIZE, JITTER, GAIN, BLUR) only take effect on
       a rebuild, unlike the physics ones which are read every frame. */
    K.rebuild = build;

    /* A SECTION OFF SCREEN COSTS NOTHING. This is the finding §46 paid for
       on `pattern-shark.js`, and three lattices on one page is exactly the
       case that made it matter: without this, scrolling to variant E means
       C and D are still writing a transform per mark per frame for marks
       nobody can see.

       No `rootMargin`, for §46's reason — these sections are adjacent, so a
       margin keeps every one of them running the whole time. */
    var visible = true;
    new IntersectionObserver(function (entries) {
      visible = entries[entries.length - 1].isIntersecting;
    }, { rootMargin: '0px' }).observe(section);

    function start() {
      build();
      rw = section.clientWidth; rh = section.clientHeight;
      instances.push({ step: step });
    }

    /* An `<img>` anchor has no box until it decodes, and the hole is read
       from that box — building first puts marks where the wordmark is about
       to appear. */
    if (logo && !logo.complete) logo.addEventListener('load', start, { once: true });
    else start();
  }

  var sections = document.querySelectorAll('[data-stars-section]');
  for (var i = 0; i < sections.length; i++) setup(sections[i]);
  if (instances.length && !reduced) requestAnimationFrame(frame);
})();
