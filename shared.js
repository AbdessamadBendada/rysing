/* Declared once, up front: every block below branches on it. */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Entrance. Each element reveals once and is then released — an observer
   that keeps firing on every pass makes a long page feel restless, and
   re-animating content the reader has already seen is the tell of a
   template. Staggered groups index their own children so the markup does
   not have to carry positions. */
const revealTargets = document.querySelectorAll('[data-reveal],[data-stagger] > *');
if (revealTargets.length && !reduce && 'IntersectionObserver' in window) {
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    [...group.children].forEach((child, i) => {
      child.setAttribute('data-reveal', '');
      child.style.setProperty('--i', i);
    });
  });
  document.body.classList.add('reveal-ready');
  const pending = new Set(document.querySelectorAll('[data-reveal]'));
  const show = (el) => { el.classList.add('is-in'); pending.delete(el); revealed.unobserve(el); };
  const revealed = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) show(entry.target); });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  pending.forEach((el) => revealed.observe(el));

  /* An element that is jumped straight past never changes intersection
     state, so the observer never fires for it and it stays hidden for
     good. The menu's own anchors do exactly that, and so does Cmd+End or a
     fast flick. Sweep anything that is now at or above the fold. */
  let sweeping = false;
  const sweep = () => {
    sweeping = false;
    [...pending].forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) show(el);
    });
  };
  addEventListener('scroll', () => {
    if (!sweeping) { sweeping = true; requestAnimationFrame(sweep); }
  }, { passive: true });
  /* Covers a hash landing, where the jump happens before any scroll event. */
  requestAnimationFrame(sweep);
}

/* Work films: muted, looping, and playing only while on screen.

   Not hover-to-play — touch has no hover, so on a phone these would never
   move at all. Not always-on either: several clips decoding at once costs
   real battery, and competing motion in a grid is exactly the noise this
   page is trying to avoid. Playing only what is in view gives motion where
   the eye already is and costs nothing anywhere else, and it behaves the
   same on desktop and touch rather than needing two rules.

   Safari pauses muted autoplay under Low Power Mode and when it judges an
   element off-screen, so an unexpected pause while still in view is put
   back, with the same retry ceiling the showreel uses. */
const films = document.querySelectorAll('.work-video');
if (films.length && 'IntersectionObserver' in window) {
  const seen = new WeakMap();
  const filmObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const film = entry.target;
      seen.set(film, entry.isIntersecting);
      if (reduce) return;                       /* poster only */
      if (entry.isIntersecting) film.play().catch(() => {});
      else if (!film.paused) film.pause();
    });
  }, { threshold: .25 });

  films.forEach((film) => {
    filmObserver.observe(film);
    let retries = 0, windowStart = 0;
    film.addEventListener('pause', () => {
      if (reduce || !seen.get(film) || document.hidden) return;
      const now = Date.now();
      if (now - windowStart > 4000) { retries = 0; windowStart = now; }
      if (++retries <= 3) film.play().catch(() => {});
    });
  });
}

/* Stats count up on arrival. The figures are parsed out of the authored
   text rather than hardcoded here, so the markup stays the single source
   of truth and the value that lands is byte-identical to what was written
   — these numbers are copy, and copy is not generated in a script.

   The count is skipped entirely under reduced motion, and without JS the
   authored text simply stands. */
const statFigures = document.querySelectorAll('.stat strong');
if (statFigures.length && !reduce && 'IntersectionObserver' in window) {
  const parse = (text) => {
    const m = text.match(/^(\D*)([\d.,]+)(.*)$/);
    return m ? { pre: m[1], value: parseFloat(m[2].replace(/,/g, '')), post: m[3], raw: text } : null;
  };
  const counters = [...statFigures]
    .map((el) => ({ el, data: parse(el.textContent.trim()) }))
    .filter((c) => c.data);

  const run = (counter, delay) => {
    const { pre, value, post, raw } = counter.data;
    const DURATION = 850;
    counter.el.classList.add('is-counting');
    const begin = performance.now() + delay;
    const step = (now) => {
      const t = Math.min(1, Math.max(0, (now - begin) / DURATION));
      /* Decelerate onto the number instead of stopping dead on it. */
      const eased = 1 - Math.pow(1 - t, 3);
      if (t < 1) {
        counter.el.textContent = pre + Math.round(value * eased) + post;
        requestAnimationFrame(step);
      } else {
        /* Restore the authored string exactly — never a reformatted one. */
        counter.el.textContent = raw;
        counter.el.classList.remove('is-counting');
      }
    };
    requestAnimationFrame(step);
  };

  const counted = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const i = counters.findIndex((c) => c.el === entry.target);
      if (i > -1) run(counters[i], i * 70);  /* matches the reveal stagger */
      counted.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  counters.forEach((c) => counted.observe(c.el));
}

/* Testimonials. Three quotes on the measure, drifting one column at a time.

   Advancing a whole page of three is what gives these their jolt; stepping
   by one is a drift. The loop is made of clones, the way the logo marquee
   duplicates its track, so the copy is authored exactly once and the
   clones are marked aria-hidden rather than read out twice. */
const treel = document.querySelector('[data-treel]');
if (treel) {
  const track = treel.querySelector('[data-treel-track]');
  const originals = [...track.children];
  const total = originals.length;

  /* One full set of clones is all the loop needs: the window is never
     wider than the set, so the furthest it can reach is the last original
     plus two clones. */
  originals.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('img').forEach((img) => { img.alt = ''; });
    track.append(clone);
  });
  const items = [...track.children];

  let i = 0;

  /* Measured from what actually rendered rather than recomputed from the
     CSS. The item basis changes at two breakpoints and the gap is a clamp;
     reading the real geometry means the step cannot disagree with it. */
  const step = () => {
    const a = items[0].getBoundingClientRect();
    const b = items[1].getBoundingClientRect();
    return b.left - a.left;
  };

  const perView = () => Math.max(1, Math.round(treel.querySelector('.treel').clientWidth / step()));

  /* Placing the track and lighting the columns are separate, because the
     backward wrap has to park the track at a position it is not at before
     it travels — and parking must not light anything. */
  const place = (idx, animate) => {
    track.classList.toggle('is-jumping', !animate);
    track.style.transform = `translate3d(${-idx * step()}px,0,0)`;
    if (!animate) { void track.offsetWidth; track.classList.remove('is-jumping'); }
  };
  const light = () => {
    const lit = perView();
    items.forEach((item, k) => item.classList.toggle('is-lit', k >= i && k < i + lit));
  };
  const paint = (animate = true) => { place(i, animate); light(); };

  /* Blooming is asked for explicitly, never inferred from what is lit. The
     class has to come off again or a column that returns later cannot
     re-trigger it; the animation's end state is the resting state, so
     removing it changes nothing on screen. */
  let blooming;
  const bloom = (indices) => {
    clearTimeout(blooming);
    items.forEach((item) => item.classList.remove('is-entering'));
    indices.forEach((k) => items[k] && items[k].classList.add('is-entering'));
    blooming = setTimeout(() => {
      items.forEach((item) => item.classList.remove('is-entering'));
    }, 850);
  };

  /* The silent rewind, both ways. Once the window has walked a whole set
     the clones on screen are pixel-identical to the originals at the same
     offset, so resetting with the transition suppressed is invisible.

     Forward, the reset has to wait for the slide to land or the jump
     happens mid-travel and shows. Backward it is the opposite order: park
     a full set further along first, then travel back out of it. Stepping
     back from the first column without that park slides the rail the wrong
     way — it reads as the slider correcting itself. */
  let rewind;
  const advance = (dir) => {
    i += dir;
    if (i < 0) { place(total, false); i = total - 1; }
    paint();
    /* Only the column that just arrived — the far edge in the direction of
       travel. The rewind below deliberately blooms nothing. */
    bloom([dir > 0 ? i + perView() - 1 : i]);

    /* One pending reset, never several. Each advance past the end used to
       schedule its own subtraction, so clicking faster than the 1.1s reset
       stacked them: from 7 two firings landed on -5, the lit window fell
       off the start of the array and every column went dark. Replacing the
       pending one is correct however far the index has run, because any
       position is equivalent to itself modulo the set. */
    clearTimeout(rewind);
    if (i >= total) {
      rewind = setTimeout(() => {
        i = ((i % total) + total) % total;
        paint(false);
      }, 1100);
    }
  };

  /* ---- autoplay ---- */
  const DWELL = (parseFloat(getComputedStyle(treel).getPropertyValue('--dwell')) || 4.6) * 1000;
  let auto = !reduce;
  const holds = new Set();
  let tick = null, startedAt = Date.now(), left = DWELL;

  const arm = (ms) => {
    clearTimeout(tick);
    left = ms; startedAt = Date.now();
    tick = setTimeout(() => { advance(1); arm(DWELL); }, ms);
  };
  /* Counting the reasons stops whichever hold ends first from resuming on
     behalf of one that is still in force. */
  const hold = (reason) => {
    if (!auto) return;
    const wasHeld = holds.size > 0;
    holds.add(reason);
    if (wasHeld) return;
    clearTimeout(tick);
    left = Math.max(0, left - (Date.now() - startedAt));
  };
  const release = (reason) => {
    if (!auto) return;
    holds.delete(reason);
    if (!holds.size) arm(left);
  };

  treel.querySelectorAll('[data-treel-step]').forEach((button) => {
    button.addEventListener('click', () => {
      advance(Number(button.dataset.treelStep));
      /* Steering it yourself restarts the dwell rather than ending
         autoplay: unlike the index, a rail gives you no way to sit on a
         chosen quote, so stopping it dead would just strand the reader. */
      if (auto && !holds.size) arm(DWELL);
    });
  });

  treel.addEventListener('keydown', (event) => {
    const dir = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    event.preventDefault();
    advance(dir);
    if (auto && !holds.size) arm(DWELL);
  });

  /* Reading beats rotating. */
  treel.addEventListener('pointerenter', () => hold('hover'));
  treel.addEventListener('pointerleave', () => release('hover'));
  treel.addEventListener('focusin', () => hold('focus'));
  treel.addEventListener('focusout', () => release('focus'));
  document.addEventListener('visibilitychange', () => {
    document.hidden ? hold('tab') : release('tab');
  });

  /* The basis changes at two breakpoints, so every measurement is stale
     after a resize and the track would sit between two columns. */
  let resizing;
  addEventListener('resize', () => {
    clearTimeout(resizing);
    resizing = setTimeout(() => paint(false), 150);
  }, { passive: true });

  paint(false);

  if (auto) {
    /* On arrival the whole row blooms together — that is the section
       entering, not the rail looping. */
    /* Nothing drifts off screen — it would walk the whole set while nobody
       is looking and leave the blooms firing for no one. */
    if ('IntersectionObserver' in window) {
      hold('offscreen');
      let arrived = false;
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !arrived) {
            arrived = true;
            bloom([...Array(perView()).keys()].map((n) => i + n));
          }
          entry.isIntersecting ? release('offscreen') : hold('offscreen');
        });
      }, { threshold: 0.2 }).observe(treel);
    } else {
      arm(DWELL);
    }
  }
}

/* Full-screen menu. The header carries mark, ask and burger only, so this
   panel is the entire navigation and has to be properly operable: focus is
   trapped inside it, Escape closes, focus returns to the button that
   opened it, and the page behind cannot scroll while it is up. */
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu-overlay');
if (menuToggle && menu) {
  const closeBtn = menu.querySelector('.overlay-close');
  const focusables = () => [...menu.querySelectorAll('a[href],button:not([disabled])')];
  const closeMenu = () => {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
    menuToggle.focus();
  };
  const openMenu = () => {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
    focusables()[0]?.focus();
  };
  menuToggle.addEventListener('click', () => menu.classList.contains('is-open') ? closeMenu() : openMenu());
  closeBtn?.addEventListener('click', closeMenu);
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (!menu.classList.contains('is-open')) return;
    if (event.key === 'Escape') { closeMenu(); return; }
    if (event.key !== 'Tab') return;
    const f = focusables();
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
}

/* Aperture: map the reel section's scroll progress onto the mask size, so the
   mark opens from a small star to a frame-filling shape. Written to a custom
   property inside rAF; the browser then does the compositing. The same
   progress drives the footage grade, so the mark stays legible while small. */
const reel = document.querySelector('.reel');
if (reel && !reduce) {
  const MIN = 16, MAX = 620;
  let ticking = false;
  let isRevealed = false;
  const update = () => {
    ticking = false;
    const r = reel.getBoundingClientRect();
    const span = r.height - window.innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / (span || 1)));
    /* Ease out so the opening decelerates as it fills rather than snapping. */
    const eased = 1 - Math.pow(1 - p, 2.6);
    reel.style.setProperty('--aperture', (MIN + (MAX - MIN) * eased).toFixed(2));
    /* The grade should clear well before the aperture finishes, or the reel
       still looks muddy once it is the only thing on screen. */
    reel.style.setProperty('--reel-progress', Math.min(1, eased * 1.6).toFixed(3));
    /* Solid mark -> footage. Starts almost immediately and is done by the
       time the star is roughly a third open. */
    const reveal = Math.min(1, Math.max(0, (eased - 0.04) / 0.26));
    reel.style.setProperty('--reel-reveal', reveal.toFixed(3));
    /* Past this point the star already covers the frame and the grade has
       already resolved to identity, so shedding both is invisible. Toggled
       only on change — writing a class every frame is its own cost. */
    const revealed = eased >= 0.92;
    if (revealed !== isRevealed) {
      isRevealed = revealed;
      reel.classList.toggle('is-revealed', revealed);
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive:true });
  addEventListener('resize', onScroll);
  update();
}

/* Showreel transport. The reel also stops once it leaves the viewport: a
   13 MB loop has no reason to keep decoding behind eight other sections,
   and it must not resume if the visitor chose to stop it. */
const video = document.querySelector('.reel-video');
const reelToggle = document.querySelector('.reel-toggle');
if (video && reelToggle) {
  const PLAY = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 3l11 7-11 7z"/></svg>';
  const PAUSE = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 3h4v14H4zm8 0h4v14h-4z"/></svg>';
  let stoppedByUser = false;
  /* Assume on screen until the observer says otherwise, so a pause that
     arrives before the first observer callback is still recovered. */
  let inView = true;
  /* If the browser is refusing to keep it playing — a deliberate power
     policy rather than a glitch — stop fighting it after a few tries so we
     never spin on pause/play. The counter decays, so a hiccup a minute
     later is still recovered. */
  let retries = 0, retryWindow = 0;
  const mayRetry = () => {
    const now = Date.now();
    if (now - retryWindow > 4000) { retries = 0; retryWindow = now; }
    return ++retries <= 3;
  };
  const sync = () => {
    const paused = video.paused;
    reelToggle.innerHTML = paused ? PLAY : PAUSE;
    reelToggle.setAttribute('aria-pressed', String(paused));
    reelToggle.setAttribute('aria-label', paused ? 'Play showreel' : 'Pause showreel');
  };
  reelToggle.addEventListener('click', () => {
    stoppedByUser = !video.paused;
    if (video.paused) video.play().then(sync).catch(sync);
    else { video.pause(); sync(); }
  });
  /* Autoplay starts after this script runs, so a one-off sync would leave
     the control reading "play" over a playing reel. Track the element. */
  video.addEventListener('play', sync);
  video.addEventListener('pause', () => {
    sync();
    /* Nothing but the reader and the observer below is allowed to stop
       this reel, and plenty of things try: Safari pauses muted autoplay
       video under Low Power Mode and when it judges the element offscreen,
       backgrounded tabs suspend it, and a decoder hiccup on a 13 MB loop
       can drop it out of playback. If it stopped while it is still on
       screen and the reader did not ask for it, start it again. */
    if (!stoppedByUser && inView && !document.hidden && mayRetry()) {
      video.play().then(sync).catch(() => {});
    }
  });
  /* Coming back to the tab should not leave a dead frame sitting there. */
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !stoppedByUser && inView && video.paused) {
      video.play().then(sync).catch(() => {});
    }
  });
  sync();

  /* Watch the section, not the video. The video lives inside the sticky
     stage, so its box leaves the viewport the instant the stage releases at
     the end of the section — which put the pause/play boundary exactly
     where the reader is still scrolling, and nudging across it stopped and
     started the reel over and over.

     Observing the 260vh section with a full viewport of margin on each side
     means it only stops once the reel is comfortably away, and a small
     scroll near the edge never touches it. */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => entries.forEach((entry) => {
      inView = entry.isIntersecting;
      if (!inView && !video.paused) { video.pause(); sync(); }
      else if (inView && !stoppedByUser && video.paused) { video.play().then(sync).catch(sync); }
    }), { threshold:0, rootMargin:'100% 0px 100% 0px' }).observe(reel || video);
  }
}

/* Services accordion: one row open at a time. The whole row is the target,
   not just the name — the numeral is half the row's width and was dead to
   the pointer. The button stays the keyboard and screen-reader control. */
document.querySelectorAll('.system-item').forEach((item) => {
  const btn = item.querySelector('.system-toggle');
  const toggle = () => {
    const open = item.classList.contains('is-open');
    document.querySelectorAll('.system-item.is-open').forEach((el) => {
      el.classList.remove('is-open');
      el.querySelector('.system-toggle').setAttribute('aria-expanded', 'false');
    });
    if (!open) { item.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); }
  };
  item.addEventListener('click', (event) => {
    /* Let the button fire its own click, or the row would toggle twice and
       land back where it started. */
    if (event.target.closest('.system-toggle')) return;
    /* Reading the open panel usually means selecting from it; collapsing
       the row out from under a drag would be hostile. */
    if (String(getSelection())) return;
    toggle();
  });
  btn.addEventListener('click', toggle);
});

/* Newsletter form */
const form = document.querySelector('#fudge-form');
const status = document.querySelector('#fudge-status');
if (form && status) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = 'Thanks. Signup will be enabled when the mailing platform is connected.';
  });
}
