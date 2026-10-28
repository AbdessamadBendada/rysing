/*
  PATTERN PLAYGROUND — the hero's orange light, as fluid that avoids the cursor.

  The simulation is Pavel Dobryakov's WebGL-Fluid-Simulation (MIT) in
  `vendor-webgl-fluid.js`, modified there in five marked places — the
  important one being that the cursor injects VELOCITY ONLY and the orange
  exists as dye already. This file is the configuration, and it runs AFTER
  the solver, which reads `config` live every frame.

  So: the orange is the fluid. The cursor pushes it out of the way, the
  displaced material packs up at the edges of the gap because the solver
  conserves it, and it flows back as the glow is topped up again. Nothing
  draws a gap; the gap is where the fluid is not.
*/
(() => {
  'use strict';

  const fluid = window.RysingFluid;
  const canvas = document.querySelector('[data-fluid]');
  const anchors = document.querySelectorAll('[data-fluid-anchor]');
  if (!fluid || !canvas || !anchors.length) return;

  const cfg = fluid.config;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Brand orange. Low numbers on purpose: the solver accumulates dye every
     frame and bloom lifts the result, so values near 1 stop being light and
     become paint. */
  const ORANGE = { r: 0.95, g: 0.26, b: 0.135 };
  /* The blue has to be in the simulation too, not in CSS behind it: the
     canvas is opaque (see the note in the vendored file), so anything left
     in CSS underneath would simply be covered. Both lights are therefore
     fluid, and both get out of the cursor's way. */
  const BLUE = { r: 0.21, g: 0.14, b: 0.84 };
  const COLOURS = { orange: ORANGE, blue: BLUE };

  /* ---- How it moves ------------------------------------------------- */
  /* DENSITY_DISSIPATION is the reform time — dye decays at this rate, so a
     cleared area refills over roughly 1/this seconds. It is also half of
     what sets the resting brightness (see GLOW.rate below).

     VELOCITY_DISSIPATION is how long the push keeps travelling after the
     cursor has gone. High enough that the hero settles rather than sloshing;
     low enough that the material still drifts for a moment, which is what
     stops it looking like the gap is glued to the pointer. */
  cfg.DENSITY_DISSIPATION  = reduce ? 1.4 : 0.85;
  cfg.VELOCITY_DISSIPATION = reduce ? 3.4 : 2.3;

  /* Vorticity: the curl that makes the orange roll around the cursor rather
     than being shoved in a straight line. The single setting that most makes
     this read as material instead of as a brush. */
  cfg.CURL = reduce ? 6 : 22;

  cfg.PRESSURE = 0.82;
  cfg.PRESSURE_ITERATIONS = 20;

  /* The cursor's own push. Radius is the width of the furrow it opens;
     force is how hard the material is thrown aside. */
  cfg.SPLAT_RADIUS = reduce ? 0.18 : 0.26;
  cfg.SPLAT_FORCE  = reduce ? 2600 : 8500;

  cfg.SIM_RESOLUTION = 128;
  cfg.DYE_RESOLUTION = 1024;
  cfg.SHADING = true;

  /* Keeps it reading as light rather than ink, which matters because
     everything else in this hero is light. */
  cfg.BLOOM = true;
  cfg.BLOOM_INTENSITY = 0.6;
  cfg.BLOOM_THRESHOLD = 0.55;
  cfg.SUNRAYS = false;

  /* ---- Where the glow sits ------------------------------------------ */
  /* Read from the rendered box of the CSS gradient it replaces, never
     re-derived: that element's offsets are a `min()` of a viewport-width
     term and a viewport-height term capped against its own diameter
     (HANDOFF §33), and a second copy of that arithmetic here would stop
     agreeing with the first the day somebody retunes it. */
  function place() {
    const c = canvas.getBoundingClientRect();
    if (!c.width || !c.height) return;
    cfg.GLOWS = Array.from(anchors, (el) => glowFor(el, c)).filter(Boolean);
  }

  function glowFor(anchor, c) {
    const a = anchor.getBoundingClientRect();
    if (!a.width) return null;
    const colour = COLOURS[anchor.dataset.fluidAnchor] || ORANGE;

    /* Simulation coordinates are 0..1 with y up; the page is y down. */
    const x = (a.left + a.width / 2 - c.left) / c.width;
    const y = 1 - (a.top + a.height / 2 - c.top) / c.height;

    /* RADIUS UNITS ARE NOT WHAT THEY LOOK LIKE. The splat shader is
       `exp(-dot(p,p) / radius)` and the caller divides by 100, so the
       config number is sigma SQUARED times 100 — upstream's 0.25 is a
       sigma of 0.05, not a quarter of the canvas. Passing a fraction of
       the viewport directly makes a blob ~100x too wide: the first attempt
       flooded the whole hero to white.

       Sigma is expressed against the HEIGHT because `correctRadius`
       aspect-corrects the x axis. */
    const sigma = (a.width / 2) * 0.5 / c.height;
    const radius = sigma * sigma * 100;

    return {
      x, y, radius,
      /* rate / DENSITY_DISSIPATION is the resting brightness, because dye
         settles where what is added each second equals what decays. Tuned
         to land on the shipped hero's own brightness rather than chosen. */
      /* Steady state is rate / DENSITY_DISSIPATION times the colour, so
         this has to stay well under the dissipation or the dye climbs past
         1 and the orange turns white. At 0.75 against 1.15 it settles at
         about two thirds, which is a glow; at 2.3 it settled at twice full
         scale, which is a floodlight. */
      rate: reduce ? 0.8 : 0.56,
      color: colour,
    };
  }

  place();
  /* Marks the hero as running, which is what hides the CSS gradient. Done
     here rather than in the stylesheet so a WebGL failure keeps the light. */
  (canvas.closest('.pp-hero') || document.body).classList.add('is-fluid');
  new ResizeObserver(place).observe(canvas);
  /* The CSS element keeps its drift animation, so its centre moves; the glow
     follows it rather than being pinned where it started. Cheap — one rect
     read a second, not one per frame. */
  setInterval(place, 1000);
})();
