/*
  PATTERN PLAYGROUND — the hero's orange light, parted by the cursor.
  Attempt five. Read HANDOFF §44 before changing anything here; four
  approaches have already been built and rejected and three of them look
  obviously right on paper.

  WHAT THIS IS, IN ONE SENTENCE.
  The orange is still the authored CSS gradient — it is not particles, not
  dye and not smoke. A field of displacement vectors lives in a texture, and
  every pixel reads that gradient at a DIFFERENT POINT OF ITSELF. Nothing is
  added, nothing is deleted, nothing is drawn. The light is only ever moved.

  WHY THAT IS THE WHOLE DESIGN, AND WHY THE OTHER FOUR FAILED.

  1. §44: "removing light from the middle of a radial glow always leaves a
     ring" — a cleared centre is a donut by construction. That is true of
     DELETION and only of deletion. This warps instead, so the material that
     leaves the gap has to go somewhere, and it goes to the rim. Compression
     walls rather than a bright ring.

  2. §44: all three hand-written attempts stuttered because each recomputed a
     SHAPE every frame from the cursor's current position, with no memory of
     the frame before. The field here is a texture that persists: each frame
     it advects along itself, diffuses and decays. Continuity is structural,
     not eased.

  3. §44: the shader warp "reads as a tadpole dragged behind the pointer".
     That version kept an explicit list of recent cursor positions and drew a
     circle at each, so the trail was enumerable and the eye counted it. A
     decaying field has no trail to read — the past is a smudge, not a list.

  4. The stock fluid "paints smoke". The cursor here injects no colour. It
     cannot: there is no colour channel to inject into.

  THE SARDINE PART, WHICH IS THE BIT THAT IS EASY TO GET WRONG.
  A bait ball does not open symmetrically. It opens ALONG the shark's axis of
  travel: material compresses ahead and to the sides, the void trails the
  nose, and the ball closes behind on a lag. A symmetric clearing that
  reforms instantly is a hole in a cloud, not a shoal. Two things here make
  it asymmetric — FORWARD biases the displacement along the direction of
  travel, and the field's own decay means the wake closes slowly while the
  front edge opens at once. Take either out and it goes back to being a hole.

  SMOOTHNESS IS NOT A TUNING PROBLEM AND THAT IS THE OTHER HALF OF §44.
  Three separate attempts stuttered, and the diagnosis there — no memory
  between frames — is right but incomplete. Pointer events do not arrive once
  per frame. They arrive in irregular bursts, several in one frame and none
  in the next, and a handler that drives the effect straight off the event
  position gives a jump, a hold, a jump. That is visible as stutter no matter
  how good the maths behind it is. Two fixes, both here, both load bearing:

    - the pointer is smoothed through an exponential filter with a real time
      constant, so the thing the effect follows is continuous even when the
      events are not;
    - injection is SUB-STEPPED along the segment between last frame's
      position and this frame's, so a fast flick lays down a continuous
      furrow instead of a dotted line of splats.

  Neither is visible as a setting. Both are why it is smooth.
*/
(() => {
  'use strict';

  /* ---- The knobs ----------------------------------------------------- */
  /* Lengths are in Y-UNITS — fractions of the canvas HEIGHT — so the effect
     is the same shape on any aspect ratio. The x axis is corrected on the
     way in and back out again; see uAspect. */
  const K = {
    /* Radius of the exclusion disc: the gap the cursor carries with it.
       This is a real void — no pixel inside it samples the gradient, which
       is what makes "there is no orange where the cursor is" literally
       true rather than approximately true. */
    HOLE: 0.118,
    /* How far the displacement reaches past the gap before falling to
       nothing. Too small and the gap has a visible rim; too large and the
       whole glow slides about and stops reading as a local event. */
    REACH: 0.46,
    /* The bait-ball asymmetry — displacement biased along the direction of
       travel. 0 gives a symmetric hole, which is the thing that reads as a
       cut-out rather than as a shoal parting. */
    FORWARD: 0.85,
    /* How dark the gap is allowed to get, 0..1. NOT 1. At full strength the
       gap is pure black and reads as a hole cut in the page rather than as
       orange that has moved aside; §44's attempt one was rejected in those
       words. Leaving a little light in it is what keeps it material.

       0.88 was measured as a clean gap and looked, parked, like a hole
       punched through the page to the black behind it. The number that
       reads as orange having moved rather than orange having been deleted
       is a good deal lower than the number that measures best. */
    VOID: 0.86,
    /* HOW MUCH THE WARP RUNS WHEN THE CURSOR IS STILL, 0..1. This is the
       fix for the one failure mode that is otherwise unavoidable here, and
       the split it enforces is the most important idea in this file:

         THE GAP IS CONSTANT. THE DISPLACEMENT SCALES WITH SPEED.

       They were tied together first, both driven off speed, and that is
       wrong at both ends. A parked cursor then had almost no gap at all,
       which fails the brief's own sentence about there being no orange
       where the cursor is — measured, a stationary cursor was reading +8
       BRIGHTER than rest once the warp's rim brightening was accounted for.

       And tying them the other way is worse. The radial warp brightens
       wherever it samples nearer the gradient's core, and with no travel
       to bias it that brightening is perfectly symmetric — a still, even
       ring around a dark centre, which is §44's donut sitting on the page
       doing nothing. Scaling the WARP with speed means the ring can only
       exist while something is moving, and while something is moving it is
       forward-biased and reads as a bow wave instead.

       So: stop, and you get a clean soft gap with no ring. Move, and the
       material visibly flows around it. Not zero, because a gap with no
       displacement around it at all is a hole rather than a parting. */
    WARP_REST: 1.0,
    /* Brightness gain on the bow wave ahead of the cursor. This is where
       the light that left the gap goes. Too high and it is a headlight. */
    PILE: 0.6,
    /* Pointer speed, in y-units per second, at which the bow wave reaches
       full strength. Below it the pile scales down, so a slow drift parts
       the shoal without throwing a wall up in front of it. */
    FULL_SPEED: 0.45,
    /* Relaxation time of the field, seconds. This is how long the shoal
       takes to close behind the cursor. Short reads as elastic and cheap;
       long reads as syrup and the gap smears across the hero. */
    RELAX: 1.25,
    /* How fast the gap opens where the cursor IS, seconds. Deliberately an
       order of magnitude under RELAX — a shark arrives faster than the
       water comes back. That asymmetry is most of the life in this.

       IT HAS TO BE THIS SHORT AND THE REASON IS ARITHMETIC, not taste. The
       per-frame blend is 1 - exp(-dt/OPEN), so at 0.075 a frame moves the
       field only a fifth of the way and the gap needs a quarter of a second
       to form ANYWHERE. A cursor crossing the hero quickly is over any given
       point for two or three frames, so the gap never opened at all and a
       fast flick did visibly nothing. At 0.022 three frames reach 92%. */
    OPEN: 0.055,
    /* Self-advection: the field carries itself along, so displaced material
       keeps moving for a moment after the cursor has gone instead of
       springing back along the line it came from. */
    FLOW: 2.4,
    /* AMBIENT SWIRL, in y-units per second. A slow divergence-free drift
       that the field is carried along by, so the gap's edge wanders instead
       of holding a circle.

       It is the answer to the one thing that is otherwise unfixable here: a
       parked cursor has no motion of its own, so whatever shape the gap has
       is the shape it keeps, and a still soft-edged circle is close enough
       to §44's rejected eclipse to fail for the same reason. With this the
       boundary is always deforming slightly and the gap reads as a hole in
       something fluid rather than a hole in the page.

       IT DOES NOT TOUCH THE HERO AT REST. The field is zero everywhere
       until the cursor disturbs it, and advecting zero moves nothing — so
       with the pointer away this variant is still pixel-identical to the
       shipped gradient. It is not the ambient motion the client asked for
       on the glow itself (§44's first ask); that is still the CSS drift. */
    AMBIENT: 0.022,
    /* Per-frame diffusion. The field is low resolution on purpose and this
       is what stops that showing; it also softens the injection so a fast
       flick has no hard shoulder.

       KEEP IT SMALL. This was 0.34 and that is a quarter of the field
       averaged away every frame — at 60fps the wake behind the cursor was
       gone within about three frames, so the gap tracked the pointer as a
       rigid circle with no trail at all, which is most of what made the
       first build read as a drawn disc. The wake is carried by RELAX; this
       number only has to hide the field's own resolution. */
    DIFFUSE: 0.09,
    /* Pointer smoothing time constant, seconds. See the note above about
       event timing — this is the single most important number for whether
       the result reads as smooth.

       There is a floor under it as well as a ceiling: too much smoothing and
       the gap lags far enough behind the pointer that the cursor sits on
       undisturbed orange, which breaks the brief's own sentence about there
       being none where the cursor is. 0.022 is about a frame and a half of
       lag at 60fps — enough to take the jitter out of the event stream, not
       enough to see. */
    POINTER: 0.022,
    /* How long the gap takes to appear when the cursor enters the hero and
       to fill when it leaves, seconds. */
    PRESENCE: 0.26,
    /* Sub-steps per frame along the pointer's path. 8 is enough to make a
       fast flick continuous at 60fps; it costs nothing, the loop is inside
       one shader invocation. */
    STEPS: 8,
    /* Long axis of the displacement field in texels. It is a smooth vector
       field sampled with linear filtering, so it does not want to be large
       — and small is what keeps this cheap enough to run under a headline. */
    RES: 320,
  };

  /* LIVE TUNING. Every knob above is read fresh each frame, so changing one
     in the console takes effect on the next frame — no reload, no rebuild:

       SHARK.REACH = 0.6        how far the displacement spreads
       SHARK.HOLE  = 0.14       size of the gap
       SHARK.VOID  = 0.9        how dark the gap goes (0..1)
       SHARK.RELAX = 2.0        how long the wake takes to close, seconds
       SHARK.FORWARD = 1.2      how hard material is thrown ahead
       SHARK.PILE  = 0.8        brightness of the bow wave

     Tune here first, then write the value into K. */
  window.SHARK = K;

  /* The two brand colours, as the CSS gradients state them. Composited in
     sRGB with no linearisation on purpose: that is what the browser does
     with the real gradients, and the control variant next to this one has
     to match. */
  const ORANGE = [240 / 255, 66 / 255, 34 / 255];
  const BLUE = [53 / 255, 36 / 255, 213 / 255];

  const canvas = document.querySelector('[data-shark]');
  if (!canvas) return;
  const hero = canvas.closest('.pp-hero');
  const orangeEl = document.querySelector('[data-shark-anchor="orange"]');
  const blueEl = document.querySelector('[data-shark-anchor="blue"]');
  if (!hero || !orangeEl || !blueEl) return;

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* NOT `alpha:false`. An opaque canvas would be a black rectangle the size
     of its own box, which cuts both discs flat where that box ends — §29 and
     §33, the defect this whole document keeps repairing. The canvas is
     transparent and the page's own black shows through around it.

     `premultipliedAlpha:false` is the other half, and §44 records the bug it
     avoids: a WebGL canvas is premultiplied BY DEFAULT, so writing straight
     colour as `vec4(rgb, a)` applies alpha twice and the whole thing renders
     at about a third of its brightness. Turning premultiplication off is the
     alternative to pre-multiplying in the shader, and it keeps the composite
     maths below readable. */
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
  });
  /* No WebGL2, or no float render targets: return silently and the CSS
     gradient underneath stays visible. The worst case is the hero exactly as
     it ships today, which is the same contract the fluid version had. */
  if (!gl) return;
  if (!gl.getExtension('EXT_color_buffer_half_float') &&
      !gl.getExtension('EXT_color_buffer_float')) return;

  /* ---- Plumbing ------------------------------------------------------ */

  /* A fullscreen triangle from gl_VertexID — no buffers, no attributes.

     vUv IS GL-NATIVE: y == 0 is the BOTTOM. The page measures the other way
     and it is tempting to flip here so the shaders read like the DOM — that
     was the first version and it is WRONG, silently and expensively.

     A framebuffer's texel row 0 is the bottom of clip space. Flip vUv in the
     vertex shader and the field pass WRITES the value it computed for
     vUv.y = V into the row that sampling vUv.y = V reads back as 1 - V, so
     every read of the field is vertically MIRRORED. Nothing errors. The
     picture still moves when the cursor moves, because the mirrored field
     still has a disturbance in it — it is just in the wrong half of the
     canvas. Measured, the gap's own strength at the cursor read 0.04 where
     it should have been 1.0, and three separate passes went looking for a
     bug in the solver.

     So the flip lives in ONE place, on the way in: the two y values that
     come from the DOM are converted below with `1 - y`. If a third ever
     arrives, convert it there too — never here. */
  const VERT = `#version 300 es
out vec2 vUv;
void main(){
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

  /* THE FIELD. One pass does all four things, in this order, and the order
     matters: a field that is injected into before it is advected drags this
     frame's gap along last frame's flow and smears the leading edge.

       1. advect  — step back along the field's own direction
       2. diffuse — 4-tap, softens and hides the field's resolution
       3. decay   — toward zero, which is the shoal closing
       4. inject  — relax toward the analytic gap, near the cursor only

     THE MAP IS `sqrt(d^2 - R^2)` AND ITS SIGN IS THE WHOLE EFFECT. Get it
     backwards — `+` instead of `-`, which is one character — and the result
     is a PINCH: material is sucked toward the cursor and a disc of the
     picture is swallowed. That is §44's attempt one wearing a new coat, the
     one the client called "a black hole, not an animation". It was built
     that way here first and it looked plausible on screen, which is the
     warning worth leaving: both signs produce a dark patch under the
     cursor, and only one of them is material getting out of the way.

     With the minus, a pixel at distance d from the cursor reads the
     gradient at sqrt(d*d - R*R) — always CLOSER IN — so the content that
     was at radius s is displayed at sqrt(s*s + R*R), further out. Every
     pixel of the picture is pushed outward by exactly the area of the gap.

     THE MAP IS AREA-PRESERVING, which is a fact worth knowing before
     anybody tries to tune a compression wall into it: adding a constant to
     r^2 moves every ring outward without changing its density, so the
     material does NOT pile up. What brightens the rim is only that the
     gradient is being sampled nearer its own core, which is asymmetric —
     brighter on the side facing the disc's centre, dimmer on the far side.
     That asymmetry is wanted. A real compression wall is not, because a
     symmetric bright rim around a cleared centre is precisely §44's donut.

     Inside R the map has no real root and no source maps there at all, so
     the gap is genuinely empty rather than dim. That emptiness is carried
     in the field's THIRD CHANNEL, because after advection and decay the
     vector alone no longer describes a clean map and the void has to be a
     quantity in its own right. It is a `max` across the sub-steps and not a
     mean: a mean leaves a fast flick with a faint smear along its path
     instead of one continuous furrow. */
  const FIELD = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uField;
uniform vec2 uTexel;
uniform vec2 uAspect;
uniform vec2 uP0;
uniform vec2 uP1;
uniform float uHole;
uniform float uReach;
uniform float uForward;
uniform float uDecay;
uniform float uOpen;
uniform float uFlow;
uniform float uDiffuse;
uniform float uSpeed;
uniform float uOpenness;
uniform float uAmbient;
uniform float uTime;

void main(){
  vec4 here = texture(uField, vUv);

  /* Semi-Lagrangian: look back along where this material came from, plus a
     slow ambient swirl. Each component of the swirl depends only on the
     OTHER axis, which makes it exactly divergence-free — it stirs the field
     without compressing or thinning it anywhere, so it deforms the gap's
     edge without brightening or dimming anything on its own. */
  vec2 q = vUv * 6.2831853;
  vec2 swirl = vec2(
    sin(q.y + uTime * 0.67) + 0.55 * sin(q.y * 2.0 - uTime * 0.41),
    cos(q.x - uTime * 0.58) + 0.55 * cos(q.x * 2.0 + uTime * 0.35));
  vec2 back = vUv - (here.xy * uFlow + swirl * uAmbient);
  vec4 s = texture(uField, back);
  vec4 b = (texture(uField, back + vec2(uTexel.x, 0.0))
          + texture(uField, back - vec2(uTexel.x, 0.0))
          + texture(uField, back + vec2(0.0, uTexel.y))
          + texture(uField, back - vec2(0.0, uTexel.y))) * 0.25;
  vec4 fld = mix(s, b, uDiffuse) * uDecay;

  /* The pointer's path this frame, sub-stepped. One splat at the current
     position leaves a dotted furrow under a fast flick; this lays down a
     continuous one. */
  vec2 travel = (uP1 - uP0) * uAspect;
  float tl = length(travel);
  vec2 tdir = tl > 1e-6 ? travel / tl : vec2(0.0);

  vec2 acc = vec2(0.0);
  float void_ = 0.0;
  float pile = 0.0;
  float w = 0.0;
  for (int i = 0; i < ${K.STEPS}; i++) {
    float t = float(i) / float(${K.STEPS} - 1);
    vec2 c = mix(uP0, uP1, t);
    vec2 p = (vUv - c) * uAspect;
    float d = length(p);
    vec2 dir = d > 1e-6 ? p / d : vec2(0.0);
    float f = exp(-(d * d) / (2.0 * uReach * uReach));
    /* Inward lookup offset — which displays as material pushed OUT.

       THE FORWARD TERM IS SUBTRACTED AND THE SIGN IS NOT OBVIOUS. This is
       a LOOKUP offset, so the picture moves the OTHER WAY: adding travel
       here samples further along the direction of motion, which displays
       the material as having been shoved BACKWARDS. It was written with a
       plus first, and the measured result was the glow piling up behind the
       cursor — a wake where the bow wave should be. */
    float src = sqrt(max(d * d - uHole * uHole, 0.0));
    acc += (dir * (src - d) - tdir * uForward * uHole) * f * uOpenness;
    /* THE GAP IS A SUPER-GAUSSIAN, NOT A DISC WITH A SOFT EDGE, and that
       is the difference between this and §44's rejected mask. smoothstep
       between two radii still has two radii in it, and the eye finds them:
       built that way first, this read as an eclipse — a hard black disc
       sitting in the orange, which is the exact phrase the client used
       about attempt one. exp(-(d/a)^3) is flat across the middle and
       trails off with no radius anywhere in it, so there is no circle to
       find. Never put a smoothstep back here. */
    void_ = max(void_, exp(-pow(d / (uHole * 0.82), 3.0)));
    w = max(w, f);
  }

  /* THE PILE — the bow wave, and what stops the gap being a donut.

     IT IS COMPUTED FROM uP1 ALONE, OUTSIDE THE SUB-STEP LOOP, and that is a
     correctness point rather than an optimisation. Inside the loop, the
     pixel at the cursor's CURRENT position lies ahead of every earlier
     sub-step centre, so dot(dir, travel) is +1 there and the brightening
     landed on the cursor itself — measured as the gap reading +13 BRIGHTER
     than rest when it should have been most of the way to black. The wave
     belongs to the leading edge only, so it is keyed to the leading edge.

     The ring weight puts it just outside the gap, the dot restricts it to
     the forward half, and uSpeed scales it — so a stationary cursor throws
     no wall at all. A symmetric rim around a cleared centre is §44's donut
     by construction; a crescent ahead of something moving is a bow wave. */
  vec2 pe = (vUv - uP1) * uAspect;
  float de = length(pe);
  vec2 dire = de > 1e-6 ? pe / de : vec2(0.0);
  float ring = exp(-pow((de - uHole * 1.1) / (uHole * 1.9), 2.0));
  pile = ring * max(dot(dire, tdir), 0.0) * uSpeed;
  acc /= float(${K.STEPS});
  acc /= uAspect;

  /* Relax toward the gap rather than adding to it, so the field is bounded
     however long the cursor sits still. Weighted by the local falloff, or
     this would erase the field everywhere the cursor is not. */
  fld = mix(fld, vec4(acc, void_, pile), clamp(uOpen * max(w, void_), 0.0, 1.0));

  fragColor = fld;
}`;

  /* THE PICTURE. Both discs are the CSS gradients restated analytically —
     and §44's first technical finding is the one that makes this exact:

       a `radial-gradient(circle at 50% 50%, ...)` with NO size keyword is
       FARTHEST-CORNER, so its stops are percentages of halfWidth * sqrt(2),
       not of halfWidth.

     Read the radius as the half-width and the glow draws at about a third
     of its real size. The 74% stop lands at 1.046 * halfWidth — outside the
     element — where `border-radius:50%` clips it and `filter:blur(30px)`
     softens the cut. Both halves are modelled: the stops against R*sqrt(2),
     and the clip as a smoothstep whose width is that 30px blur.

     ONLY THE ORANGE IS DISPLACED. The client asked for the effect on the
     orange light; the blue is here because the canvas has to paint both or
     the one it leaves out would sit under an opaque layer. */
  const DRAW = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uField;
uniform vec2 uAspect;
uniform vec3 uOrange;
uniform vec3 uBlue;
uniform vec4 uOrangeBox;
uniform vec4 uBlueBox;
uniform float uVoid;
uniform float uPile;

float disc(vec2 uv, vec4 box){
  vec2 c = box.xy;
  float R = box.z;
  float edge = box.w;
  float d = length((uv - c) * uAspect);
  float t = d / (R * 1.41421356);
  float a =
      t < 0.38 ? mix(0.95, 0.50, t / 0.38)
    : t < 0.62 ? mix(0.50, 0.08, (t - 0.38) / 0.24)
    : t < 0.74 ? mix(0.08, 0.00, (t - 0.62) / 0.12)
    : 0.0;
  return a * (1.0 - smoothstep(R - edge, R + edge, d));
}

void main(){
  vec4 F = texture(uField, vUv);
  /* Warp, empty, pile — in that order, and all three are needed. The warp
     moves the material; the void is what stops the gap being merely dim;
     the pile is where the moved material ends up. Drop the pile and the
     light that leaves the gap goes nowhere, which is the tell that
     something has been deleted rather than displaced. */
  float ao = disc(vUv + F.xy, uOrangeBox)
           * (1.0 - clamp(F.z, 0.0, 1.0) * uVoid)
           * (1.0 + uPile * F.w);
  float ab = disc(vUv, uBlueBox);

  /* Source-over, in DOM order: orange first, blue over it, both over
     nothing. The canvas is not premultiplied, so this writes straight
     colour and a straight alpha and the page's black does the rest. */
  float a = ab + ao * (1.0 - ab);
  vec3 c = a > 1e-5
    ? (uBlue * ab + uOrange * ao * (1.0 - ab)) / a
    : vec3(0.0);
  fragColor = vec4(c, a);
}`;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(s) || 'shader');
    }
    return s;
  }

  function program(fragSrc) {
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(p) || 'link');
    }
    const u = {};
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) {
      const name = gl.getActiveUniform(p, i).name;
      u[name] = gl.getUniformLocation(p, name);
    }
    return { p, u };
  }

  let fieldProg, drawProg, vao;
  try {
    fieldProg = program(FIELD);
    drawProg = program(DRAW);
    vao = gl.createVertexArray();
  } catch (err) {
    /* Leave the CSS gradient alone — but SAY SO. This used to be a bare
       return, which meant a shader that failed to compile on someone
       else's GPU produced a page that looked merely wrong with nothing
       anywhere to indicate the variant had not started. There is no way to
       tell that apart from a bad design by looking, and it cost a round
       trip to find out. A scratch page can afford a console line. */
    console.error('[shark] shader failed, falling back to the CSS gradient:', err);
    return;
  }
  gl.bindVertexArray(vao);

  function target(w, h) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    /* CLAMP, not repeat: the field must not wrap, or a gap opened at one
       edge of the hero appears again at the other. */
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0, 0, w, h);
    /* ZERO ON ALL FOUR CHANNELS. Alpha is not spare here — it carries the
       pile, and the habitual `clearColor(0,0,0,1)` meant the field began
       life with a full-strength bow wave everywhere, brightening the whole
       glow until it decayed away over the first second. */
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fbo, w, h };
  }

  let field = null;

  /* SIZED FROM THE BACKING STORE, NOT FROM THE MEASURED RECT, and that is
     not fussiness. `measure()` runs eight times a second and the rect is a
     float that wobbles in the last place as the discs drift; rounding
     K.RES/aspect off it flipped the field's height between 235 and 236
     every few seconds. Each flip ran this function's slow path, which
     REPLACES BOTH TEXTURES — wiping the field mid-gesture and leaking the
     old pair. `canvas.width` and `canvas.height` are integers that change
     only on a real resize. */
  function sizeField() {
    const a = canvas.width / canvas.height;
    const w = a >= 1 ? K.RES : Math.round(K.RES * a);
    const h = a >= 1 ? Math.round(K.RES / a) : K.RES;
    if (field && field.a.w === w && field.a.h === h) return;
    if (field) {
      for (const t of [field.a, field.b]) {
        gl.deleteTexture(t.tex);
        gl.deleteFramebuffer(t.fbo);
      }
    }
    field = { a: target(w, h), b: target(w, h) };
  }

  /* ---- Geometry, read from the rendered boxes ------------------------ */
  /* Never re-derived from the CSS. Those offsets are a `min()` of a
     viewport-width term against a viewport-height term capped by the disc's
     own diameter (§33), and the discs are mid-drift under a 28s animation
     that scales them. A second copy of that arithmetic here would stop
     agreeing with the first the day somebody retunes it (§7). */
  const box = { orange: [0, 0, 0, 0], blue: [0, 0, 0, 0] };
  let aspect = 1;

  function measure() {
    const c = canvas.getBoundingClientRect();
    if (!c.width || !c.height) return;
    aspect = c.width / c.height;
    for (const [key, el] of [['orange', orangeEl], ['blue', blueEl]]) {
      const r = el.getBoundingClientRect();
      box[key] = [
        (r.left + r.width / 2 - c.left) / c.width,
        /* Flipped into GL space — see the vertex shader. */
        1 - (r.top + r.height / 2 - c.top) / c.height,
        (r.width / 2) / c.height,
        30 / c.height,
      ];
    }
    sizeField();
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    measure();
  }

  /* ---- The pointer --------------------------------------------------- */
  /* BOUND TO THE SECTION, NOT THE CANVAS, and that is §44's sixth finding
     rather than a style choice: every shape layer in this hero is
     `pointer-events:none`, so a listener on the canvas receives nothing at
     all and throws no error while doing it. It broke twice that way. */
  const raw = { x: 0.5, y: 0.5 };
  const smooth = { x: 0.5, y: 0.5 };
  const prev = { x: 0.5, y: 0.5 };
  let primed = false;
  let presence = 0;
  let wanted = 0;

  function onMove(e) {
    const c = canvas.getBoundingClientRect();
    if (!c.width) return;
    raw.x = (e.clientX - c.left) / c.width;
    raw.y = 1 - (e.clientY - c.top) / c.height;  /* GL space, as above. */
    wanted = 1;
    /* Prime without a delta. Without this the first move reads as a jump
       from wherever the pointer was last initialised and throws a furrow
       clean across the hero — the same fault the vendored fluid had to be
       patched for. */
    if (!primed) {
      smooth.x = prev.x = raw.x;
      smooth.y = prev.y = raw.y;
      primed = true;
    }
  }

  hero.addEventListener('pointermove', onMove, { passive: true });
  hero.addEventListener('pointerleave', () => { wanted = 0; });
  hero.addEventListener('pointerenter', onMove, { passive: true });

  /* ---- The loop ------------------------------------------------------ */
  let last = performance.now();
  let measureAt = 0;

  function frame(now) {
    /* Off screen: drop the loop entirely rather than skipping the draw, so
       the hero costs nothing at all while another variant is being looked
       at. The observer below restarts it. */
    if (!visible) return;

    /* Clamped: a backgrounded tab resumes with a dt of several seconds,
       which would decay the field to nothing and relocate the pointer in one
       step. §36 records the other half of this — a backgrounded tab stops
       getting frames at all. */
    const dt = Math.min(Math.max((now - last) / 1000, 0), 1 / 30);
    last = now;

    /* The discs drift under a 28s animation, so their boxes move. Re-read
       at 8Hz rather than per frame: a `getBoundingClientRect` forces layout,
       and the fastest the centre ever travels is about 0.2px in 100ms. */
    if (now - measureAt > 120) {
      measureAt = now;
      resize();
    }
    if (!field) {
      requestAnimationFrame(frame);
      return;
    }

    /* Exponential smoothing with a real time constant, so the filter is
       frame-rate independent — the same curve at 60Hz and at 144Hz. */
    const kp = 1 - Math.exp(-dt / K.POINTER);
    prev.x = smooth.x;
    prev.y = smooth.y;
    smooth.x += (raw.x - smooth.x) * kp;
    smooth.y += (raw.y - smooth.y) * kp;

    presence += (wanted - presence) * (1 - Math.exp(-dt / K.PRESENCE));

    /* --- field pass --- */
    gl.bindFramebuffer(gl.FRAMEBUFFER, field.b.fbo);
    gl.viewport(0, 0, field.b.w, field.b.h);
    gl.useProgram(fieldProg.p);
    const fu = fieldProg.u;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, field.a.tex);
    gl.uniform1i(fu.uField, 0);
    gl.uniform2f(fu.uTexel, 1 / field.a.w, 1 / field.a.h);
    gl.uniform2f(fu.uAspect, aspect, 1);
    gl.uniform2f(fu.uP0, prev.x, prev.y);
    gl.uniform2f(fu.uP1, smooth.x, smooth.y);
    gl.uniform1f(fu.uHole, K.HOLE);
    gl.uniform1f(fu.uReach, K.REACH);
    gl.uniform1f(fu.uForward, K.FORWARD);
    gl.uniform1f(fu.uDecay, Math.exp(-dt / K.RELAX));
    gl.uniform1f(fu.uOpen, (1 - Math.exp(-dt / K.OPEN)) * presence);
    gl.uniform1f(fu.uFlow, K.FLOW * dt);
    gl.uniform1f(fu.uAmbient, K.AMBIENT * dt);
    gl.uniform1f(fu.uTime, now / 1000);
    gl.uniform1f(fu.uDiffuse, K.DIFFUSE);
    /* Pointer speed in y-units per second, from the smoothed positions —
       not from the raw events, whose spacing is the thing being smoothed
       out. Clamped to 1 so a flick across the hero does not multiply the
       bow wave into a flare. */
    /* GUARDED AGAINST dt == 0, which is not hypothetical and is not
       harmless. Two frames can land on the same clock reading, and
       0 / 0 is NaN — which goes into the field, and NaN propagates through
       every later frame because the field feeds itself. One zero-length
       frame would poison the whole effect until reload, with no error. */
    const travelled = Math.hypot((smooth.x - prev.x) * aspect, smooth.y - prev.y);
    const speed = dt > 0 ? Math.min(travelled / dt / K.FULL_SPEED, 1) : 0;
    gl.uniform1f(fu.uSpeed, speed);
    /* The WARP is driven by speed, floored at WARP_REST; the gap is not.
       See that knob — the split is the fix for the static donut. */
    gl.uniform1f(fu.uOpenness, K.WARP_REST + (1 - K.WARP_REST) * speed);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    const t = field.a; field.a = field.b; field.b = t;

    /* --- picture --- */
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(drawProg.p);
    const du = drawProg.u;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, field.a.tex);
    gl.uniform1i(du.uField, 0);
    gl.uniform2f(du.uAspect, aspect, 1);
    gl.uniform3f(du.uOrange, ORANGE[0], ORANGE[1], ORANGE[2]);
    gl.uniform3f(du.uBlue, BLUE[0], BLUE[1], BLUE[2]);
    gl.uniform4f(du.uOrangeBox, box.orange[0], box.orange[1], box.orange[2], box.orange[3]);
    gl.uniform4f(du.uBlueBox, box.blue[0], box.blue[1], box.blue[2], box.blue[3]);
    gl.uniform1f(du.uVoid, K.VOID);
    gl.uniform1f(du.uPile, K.PILE);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    requestAnimationFrame(frame);
  }

  resize();
  new ResizeObserver(resize).observe(canvas);

  /* THE SIMULATION STOPS WHEN ITS HERO IS OFF SCREEN, and that is a
     playground fix rather than a change to the effect. The page now carries
     a third variant (the star field) below this one, and measured at 1440x900
     with this canvas left running under it that section's frame time went
     from a locked 16.7ms to a median of 116.7ms — the star field itself costs
     nothing, but it was about to be judged as a stutter that belongs to this
     file. §44's closing note is that an attempt handed over with a known
     shortcoming attached is not a handover.

     `last` is reset on resume so the loop does not come back to a dt of
     several seconds, which is the same hazard the clamp in `frame` exists
     for. Nothing about the shader, the field or the tuning changes.

     NO `rootMargin`. A margin here keeps the simulation running while the
     hero sits just off screen, which is exactly the case this exists to
     stop: the star field begins where this hero ends, so a 120px margin
     left the canvas grinding through the whole of the section below it and
     the frame time stayed at 83ms. Restarting costs one frame. */
  let visible = true;
  new IntersectionObserver((entries) => {
    const now = entries[entries.length - 1].isIntersecting;
    if (now && !visible) { last = performance.now(); requestAnimationFrame(frame); }
    visible = now;
  }, { rootMargin: '0px' }).observe(hero);
  /* Marks the hero as running, which is what hides the CSS gradient. Done
     from here and not in the stylesheet so that every early return above
     leaves the authored light on the page. */
  hero.classList.add('is-shark');
  requestAnimationFrame(frame);
})();
