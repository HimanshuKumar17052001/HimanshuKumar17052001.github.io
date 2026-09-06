/* Depth mode engine.
   The page ships as a readable flat document. This module upgrades it into a
   scroll-driven camera that travels along Z, one plane at a time. Native scroll
   is never hijacked: a tall track gives the page its height and the camera reads
   scrollY, so inertia, scrollbars, touch and keyboard paging all behave normally.
   Every plane holds still and fully legible for part of its scroll span. */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const PERSPECTIVE = 1000; // keep in sync with .stage { perspective } in depth.css
const GAP = 1250;         // Z distance between neighbouring planes, in px
const HOLD = 0.45;        // share of a plane's scroll span spent parked in focus
const AHEAD = 1.75;       // planes rendered in front of the camera
const BEHIND = 0.55;      // planes rendered behind it, mid fly-through
const FOCUS_EPS = 0.035;  // within this, a plane counts as settled and goes crisp
const ENTER_OVER = 0.55;  // planes of travel across which the world "switches on"
const STORAGE_KEY = 'hk-depth-mode';

// A critically damped spring carries the camera: no overshoot, but real weight,
// so a chunky mouse wheel arrives as one continuous glide instead of steps.
const SPRING = 76;
const DAMPING = 2 * Math.sqrt(SPRING);
const ARRIVE = 0.06;   // within this many planes, ease straight in and land flat
const WARP = 2.2;      // longest flight a jump performs, in planes

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const coarse = matchMedia('(pointer: coarse)');
const highQuality = !coarse.matches && (navigator.deviceMemory ?? 8) >= 4 && !reduceMotion.matches;

const root = document.documentElement;
const world = $('#world');
const canvas = $('.depthfield');
const track = $('.scroll-track');
const hud = $('[data-hud]');
const progressBar = $('[data-progress]');
const cue = $('[data-cue]');
const readoutIndex = $('[data-plane-index]');
const readoutTotal = $('[data-plane-total]');
const readoutChapter = $('[data-chapter-name]');
const readoutDepth = $('[data-depth-readout]');
const viewName = $('[data-view-name]');
const railButtons = $$('[data-rail]');

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const easeInOutCubic = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const pad2 = n => String(n).padStart(2, '0');
const mod = (v, m) => ((v % m) + m) % m;

/* ------------------------------------------------------------------ model */

const planes = $$('.plane', world).map((el, index) => {
  const layers = $$('.layer', el);
  for (const layer of layers) layer.style.setProperty('--d', `${layer.dataset.depth || 0}px`);
  return {
    el, index, layers,
    chapter: el.dataset.chapter || 'section',
    span: Number(el.dataset.span) || 1,
    span0: 0, live: null, focus: null, z: null, alpha: null, blur: null,
  };
});
const count = planes.length;
const last = count - 1;

// Cumulative scroll offsets, measured in span units.
let total = 0;
for (const plane of planes) { plane.span0 = total; total += plane.span; }

const chapterLabels = new Map(railButtons.map(b => [b.dataset.rail, $('span', b)?.textContent ?? b.dataset.rail]));
const chapterFirst = new Map();
for (const plane of planes) if (!chapterFirst.has(plane.chapter)) chapterFirst.set(plane.chapter, plane.index);

if (readoutTotal) readoutTotal.textContent = pad2(count);

/* ----------------------------------------------------------------- layout */

let base = 800;      // scroll pixels per span unit
let maxScroll = 1;
let viewW = 0, viewH = 0;

function layout() {
  viewW = window.innerWidth;
  viewH = window.innerHeight;
  base = Math.max(520, Math.round(viewH * 0.92));
  maxScroll = Math.max(1, total * base);
  track.style.height = `${maxScroll + viewH}px`;
  sizeCanvas();
}

/* ----------------------------------------------------------------- camera */

let cam = 0;      // camera position in plane units, straight from scrollY
let camView = 0;  // the eased position actually rendered
let camVel = 0;
let enter = 0;    // 0 = flat 2D page at rest, 1 = fully inside the world
let lastFrame = 0;
let running = false;
let dirty = true;

function readCamera() {
  const u = clamp(window.scrollY / base, 0, total);
  let i = 0;
  while (i < last && u >= planes[i].span0 + planes[i].span) i += 1;
  const plane = planes[i];
  if (i === last) return i;
  const t = (u - plane.span0) / plane.span;
  if (t <= HOLD) return i;
  return i + easeInOutCubic((t - HOLD) / (1 - HOLD));
}

function applyPlane(plane, d) {
  const live = d > -BEHIND - 0.06 && d < AHEAD + 0.06;
  if (live !== plane.live) {
    plane.el.classList.toggle('is-live', live);
    plane.live = live;
    if (!live) {
      // A jump can take a plane from focused to off-camera in one frame, so drop
      // its focus state here rather than relying on it easing out of range.
      plane.el.classList.remove('is-focus');
      plane.focus = false;
      plane.z = plane.alpha = plane.blur = null;
    }
  }
  if (!live) return;

  let z = -d * GAP;
  if (Math.abs(z) < 8) z = 0;
  if (z !== plane.z) {
    plane.el.style.transform = `translate3d(0,0,${z.toFixed(1)}px)`;
    plane.z = z;
  }

  const focus = Math.abs(d) < FOCUS_EPS;
  if (focus !== plane.focus) {
    plane.el.classList.toggle('is-focus', focus);
    plane.focus = focus;
  }

  let alpha, blur;
  if (d >= 0) {
    const t = Math.min(d / AHEAD, 1);
    alpha = Math.pow(1 - t, 2.7); // an approaching plane reads as a shape, never as text
    blur = highQuality ? Math.min(d * 6.5, 10) : 0;
  } else {
    const t = Math.min(-d / BEHIND, 1);
    alpha = 1 - t;
    blur = highQuality ? Math.min(-d * 16, 10) : 0;
  }
  alpha = Math.round(alpha * 100) / 100;
  blur = Math.round(blur * 10) / 10;

  if (alpha !== plane.alpha || blur !== plane.blur) {
    const opacity = alpha >= 1 ? '' : String(alpha);
    const filter = blur < 0.2 ? '' : `blur(${blur}px)`;
    for (const layer of plane.layers) {
      layer.style.opacity = opacity;
      layer.style.filter = filter;
    }
    plane.alpha = alpha;
    plane.blur = blur;
  }
}

function renderPlanes() {
  for (const plane of planes) applyPlane(plane, plane.index - camView);
}

/* -------------------------------------------------------------------- HUD */

let hudIndex = -1;
let hashIndex = -1;
let hashTimer = 0;
let enterShown = -1;

function renderHud() {
  const index = clamp(Math.round(camView), 0, last);
  if (index !== hudIndex) {
    hudIndex = index;
    const plane = planes[index];
    readoutIndex.textContent = pad2(index + 1);
    readoutChapter.textContent = chapterLabels.get(plane.chapter) ?? plane.chapter;
    for (const button of railButtons) {
      button.setAttribute('aria-current', String(button.dataset.rail === plane.chapter));
    }
    clearTimeout(hashTimer);
    hashTimer = setTimeout(() => {
      if (hashIndex === index) return;
      hashIndex = index;
      history.replaceState(null, '', `#${plane.el.id}`);
    }, 420);
  }
  const z = Math.round(camView * GAP);
  readoutDepth.textContent = z ? `z -${z.toLocaleString('en-US')}` : 'z 0';
  progressBar.style.width = `${clamp(window.scrollY / maxScroll, 0, 1) * 100}%`;
  cue.classList.toggle('off', camView > 0.28);

  const shown = Math.round(enter * 50) / 50;
  if (shown !== enterShown) {
    enterShown = shown;
    root.style.setProperty('--enter', String(shown));
  }
}

/* ------------------------------------------------------- depth field (2D) */

const ctx = canvas.getContext('2d', { alpha: true });
const FOCAL = 820;
const NEAR = 70;
const Z_PER_PLANE = 900;

// flying particles
const DOTS = highQuality ? 110 : 50;
const RANGE = 2600;
const dots = Array.from({ length: DOTS }, () => ({
  a: Math.random() * 2 - 1,
  b: Math.random() * 2 - 1,
  z: Math.random() * RANGE,
  r: 0.6 + Math.random() * 1.5,
  hot: Math.random() < 0.16,
}));

// corridor
const RINGS = 16;
const RING_SPACING = 260;
const RING_RANGE = RINGS * RING_SPACING;

// the dot lattice the pointer scatters
const G_COLS = highQuality ? 14 : 9;
const G_ROWS = highQuality ? 9 : 6;
const G_PLANES = highQuality ? 5 : 3;
const G_SPACING = 520;
const G_RANGE = G_PLANES * G_SPACING;
const SCATTER_RADIUS = 175;
const SCATTER_PUSH = 52;

let dpr = 1;
function sizeCanvas() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(viewW * dpr);
  canvas.height = Math.round(viewH * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// pointer, smoothed so the scatter trails the cursor rather than snapping to it
let pointerX = -1e4, pointerY = -1e4;
let scatterX = -1e4, scatterY = -1e4;
let scatterOn = 0, scatterTarget = 0;

let prevCamZ = 0;
let idleDrift = 0;

function drawField(dt) {
  const w = viewW, h = viewH;
  const cx = w / 2, cy = h / 2;
  const camZ = camView * Z_PER_PLANE + idleDrift;
  const speed = Math.min(Math.abs(camZ - prevCamZ), 520);
  prevCamZ = camZ;

  ctx.clearRect(0, 0, w, h);
  // At rest the field is barely there, so the opening screen reads as a flat 2D
  // page. It switches on as the camera moves into the world.
  ctx.globalAlpha = 0.1 + 0.9 * enter;

  scatterOn += (scatterTarget - scatterOn) * Math.min(1, dt * 6);
  const follow = Math.min(1, dt * 12);
  scatterX += (pointerX - scatterX) * follow;
  scatterY += (pointerY - scatterY) * follow;

  /* corridor: nested rectangles streaming toward the viewer */
  const ringHalfW = w * 0.44, ringHalfH = h * 0.44;
  ctx.lineWidth = 1;
  for (let j = 0; j < RINGS; j += 1) {
    const zz = NEAR + mod(j * RING_SPACING - camZ, RING_RANGE);
    const k = FOCAL / zz;
    const hw = ringHalfW * k, hh = ringHalfH * k;
    if (hw > w * 2.4) continue;
    const fade = Math.pow(1 - (zz - NEAR) / RING_RANGE, 2.1);
    ctx.strokeStyle = j % 4 === 0
      ? `rgba(13,148,251,${(fade * 0.22).toFixed(3)})`
      : `rgba(255,255,255,${(fade * 0.085).toFixed(3)})`;
    ctx.strokeRect(cx - hw, cy - hh, hw * 2, hh * 2);
  }

  /* corner rays toward the vanishing point */
  ctx.strokeStyle = 'rgba(255,255,255,.045)';
  ctx.beginPath();
  for (const [sx, sy] of [[0, 0], [w, 0], [0, h], [w, h]]) {
    ctx.moveTo(cx + (sx - cx) * 0.16, cy + (sy - cy) * 0.16);
    ctx.lineTo(sx, sy);
  }
  ctx.stroke();

  /* dot lattice, scattered and lit by the pointer */
  const gapX = (w * 1.35) / (G_COLS - 1);
  const gapY = (h * 1.35) / (G_ROWS - 1);
  const push = SCATTER_PUSH * scatterOn;
  for (let j = 0; j < G_PLANES; j += 1) {
    const zz = NEAR + mod(j * G_SPACING - camZ, G_RANGE);
    const k = FOCAL / zz;
    const size = Math.max(0.7, 1.5 * k);
    if (size > 26) continue; // right on top of the camera; skip rather than smear
    const fade = Math.pow(1 - (zz - NEAR) / G_RANGE, 1.8);
    const alpha = fade * 0.5;
    if (alpha < 0.012) continue;

    let hot = null;
    ctx.beginPath();
    for (let c = 0; c < G_COLS; c += 1) {
      const x0 = cx + (c - (G_COLS - 1) / 2) * gapX * k;
      if (x0 < -140 || x0 > w + 140) continue;
      for (let r = 0; r < G_ROWS; r += 1) {
        const y0 = cy + (r - (G_ROWS - 1) / 2) * gapY * k;
        if (y0 < -140 || y0 > h + 140) continue;
        let x = x0, y = y0, near = 0;
        if (push > 0.5) {
          const dx = x0 - scatterX, dy = y0 - scatterY;
          const d2 = dx * dx + dy * dy;
          if (d2 < SCATTER_RADIUS * SCATTER_RADIUS) {
            const d = Math.sqrt(d2) || 1;
            near = 1 - d / SCATTER_RADIUS;
            const off = near * near * push;
            x += (dx / d) * off;
            y += (dy / d) * off;
          }
        }
        if (near > 0.12) (hot ??= []).push(x, y, size + near * 2.4, near);
        else ctx.rect(x - size / 2, y - size / 2, size, size);
      }
    }
    ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
    ctx.fill();

    if (hot) {
      for (let n = 0; n < hot.length; n += 4) {
        const s = hot[n + 2];
        ctx.fillStyle = `rgba(13,148,251,${Math.min(0.9, alpha + hot[n + 3] * 0.75).toFixed(3)})`;
        ctx.fillRect(hot[n] - s / 2, hot[n + 1] - s / 2, s, s);
      }
    }
  }

  /* flying particles */
  const spread = Math.max(w, h) * 1.25;
  const streaking = highQuality && speed > 7;
  ctx.lineCap = 'round';
  for (const dot of dots) {
    const zz = NEAR + mod(dot.z - camZ, RANGE);
    const k = FOCAL / zz;
    const x = cx + dot.a * spread * k;
    const y = cy + dot.b * spread * k;
    if (x < -60 || x > w + 60 || y < -60 || y > h + 60) continue;
    const fade = Math.pow(1 - (zz - NEAR) / RANGE, 1.7);
    const alpha = fade * 0.82;
    if (alpha < 0.015) continue;
    const size = Math.max(0.4, dot.r * k);
    const colour = dot.hot
      ? `rgba(13,148,251,${alpha.toFixed(3)})`
      : `rgba(255,255,255,${(alpha * 0.72).toFixed(3)})`;
    if (streaking) {
      const k2 = FOCAL / (zz + speed);
      ctx.strokeStyle = colour;
      ctx.lineWidth = Math.min(size, 3);
      ctx.beginPath();
      ctx.moveTo(cx + dot.a * spread * k2, cy + dot.b * spread * k2);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.fillStyle = colour;
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    }
  }
  ctx.globalAlpha = 1;
}

/* ------------------------------------------------------------- frame loop */

function frame(now) {
  if (!running) return;
  const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 0.016;
  lastFrame = now;

  cam = readCamera();
  const gap = cam - camView;
  if (reduceMotion.matches) {
    camView = cam;
    camVel = 0;
  } else if (Math.abs(gap) > ARRIVE) {
    const accel = gap * SPRING - camVel * DAMPING;
    camVel += accel * dt;
    camView += camVel * dt;
  } else {
    // A spring only approaches its target asymptotically. Close the last hair
    // on an exponential instead, so a plane actually lands flat at z = 0 and
    // its text renders unscaled.
    camView += gap * Math.min(1, dt * 20);
    camVel *= 0.55;
  }
  const settled = Math.abs(cam - camView) < 0.0004 && Math.abs(camVel) < 0.002;
  if (settled) { camView = cam; camVel = 0; }
  enter = clamp(camView / ENTER_OVER, 0, 1);

  if (highQuality) idleDrift += dt * 9; // the field keeps breathing while you read

  if (!settled || dirty || highQuality || scatterOn > 0.01) {
    renderPlanes();
    renderHud();
    drawField(dt);
    dirty = false;
  }
  requestAnimationFrame(frame);
}

function start() {
  if (running) return;
  running = true;
  lastFrame = 0;
  dirty = true;
  camView = cam = readCamera();
  camVel = 0;
  enter = clamp(camView / ENTER_OVER, 0, 1);
  requestAnimationFrame(frame);
}

function stop() { running = false; }

/* ---------------------------------------------------------------- pointer */

let tiltQueued = false;
function onPointerMove(event) {
  pointerX = event.clientX;
  pointerY = event.clientY;
  scatterTarget = 1;
  if (tiltQueued || coarse.matches || reduceMotion.matches) return;
  tiltQueued = true;
  requestAnimationFrame(() => {
    tiltQueued = false;
    const nx = (event.clientX / viewW - 0.5) * 2;
    const ny = (event.clientY / viewH - 0.5) * 2;
    world.style.setProperty('--tilt-y', `${(nx * 2.2).toFixed(2)}deg`);
    world.style.setProperty('--tilt-x', `${(-ny * 1.6).toFixed(2)}deg`);
  });
}
function onPointerOut(event) { if (!event.relatedTarget) scatterTarget = 0; }

/* ------------------------------------------------------------- navigation */

function scrollTargetFor(index) {
  const plane = planes[clamp(index, 0, last)];
  const share = plane.index === last ? 0.5 : HOLD * 0.5;
  return (plane.span0 + plane.span * share) * base;
}

function goTo(index, behavior = 'auto') {
  const from = camView;
  window.scrollTo({ top: scrollTargetFor(index), behavior });
  // Jumping twenty planes should not mean a twenty-plane flight. Start the
  // camera a fixed distance out so every jump arrives with the same flourish.
  const travel = index - from;
  if (Math.abs(travel) > WARP) {
    camView = index - Math.sign(travel) * WARP;
    camVel = 0;
  }
  dirty = true;
}

function step(delta) {
  goTo(clamp(Math.round(camView) + delta, 0, last));
}

const indexOfId = id => planes.findIndex(plane => plane.el.id === id);

function reveal(index) {
  if (isDepth()) goTo(index);
  else planes[index]?.el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.addEventListener('click', event => {
  const jump = event.target instanceof Element ? event.target.closest('[data-jump]') : null;
  if (!jump) return;
  const index = indexOfId(jump.dataset.jump);
  if (index < 0) return;
  event.preventDefault();
  reveal(index);
});

for (const button of railButtons) {
  button.addEventListener('click', () => reveal(chapterFirst.get(button.dataset.rail) ?? 0));
}

document.addEventListener('keydown', event => {
  if (!isDepth() || event.metaKey || event.ctrlKey || event.altKey) return;
  const tag = event.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target.isContentEditable) return;
  switch (event.key) {
    case 'PageDown': case 'ArrowRight': step(1); break;
    case 'PageUp': case 'ArrowLeft': step(-1); break;
    case 'Home': goTo(0); break;
    case 'End': goTo(last); break;
    default: return;
  }
  event.preventDefault();
});

// Tabbing into a plane that is not in focus flies the camera to it.
world.addEventListener('focusin', event => {
  if (!isDepth()) return;
  const plane = event.target.closest('.plane');
  if (!plane) return;
  const index = planes.findIndex(p => p.el === plane);
  if (index >= 0 && Math.abs(index - camView) > 0.2) goTo(index);
});

/* ------------------------------------------------------------------ views */

const isDepth = () => root.classList.contains('is-depth');

function resetPlanes() {
  for (const plane of planes) {
    plane.el.classList.remove('is-live', 'is-focus');
    plane.el.style.transform = '';
    for (const layer of plane.layers) { layer.style.opacity = ''; layer.style.filter = ''; }
    plane.live = plane.focus = plane.z = plane.alpha = plane.blur = null;
  }
  world.style.removeProperty('--tilt-x');
  world.style.removeProperty('--tilt-y');
  root.style.removeProperty('--enter');
  enterShown = -1;
}

function setMode(depth, { remember = true, index = null } = {}) {
  const anchor = index ?? clamp(Math.round(camView), 0, last);
  root.classList.toggle('is-depth', depth);
  hud.hidden = !depth;
  if (viewName) viewName.textContent = depth ? 'depth' : 'flat';
  for (const control of $$('[data-view]')) {
    if (control.tagName !== 'BUTTON') continue;
    control.setAttribute('aria-pressed', String(control.dataset.view === (depth ? 'depth' : 'flat')));
  }
  if (remember) {
    try { localStorage.setItem(STORAGE_KEY, depth ? 'depth' : 'flat'); } catch { /* storage may be unavailable */ }
  }

  if (depth) {
    layout();
    window.scrollTo({ top: scrollTargetFor(anchor), behavior: 'auto' });
    start();
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerout', onPointerOut, { passive: true });
  } else {
    stop();
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerout', onPointerOut);
    resetPlanes();
    track.style.height = '';
    requestAnimationFrame(() => planes[anchor]?.el.scrollIntoView({ block: 'start' }));
  }
}

for (const control of $$('[data-view]')) {
  if (control.tagName !== 'BUTTON') continue;
  control.addEventListener('click', () => setMode(control.dataset.view === 'depth'));
}

/* ------------------------------------------------------------ page wiring */

let resizeTimer = 0;
window.addEventListener('resize', () => {
  if (!isDepth()) return;
  const held = window.scrollY / base;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    layout();
    window.scrollTo({ top: clamp(held * base, 0, maxScroll), behavior: 'auto' });
    dirty = true;
  }, 120);
}, { passive: true });

document.addEventListener('visibilitychange', () => {
  if (!isDepth()) return;
  if (document.hidden) stop();
  else start();
});

$('#year').textContent = String(new Date().getFullYear());

const toast = $('#toast');
let toastTimer = 0;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('on'), 2200);
}

$('.copy-email')?.addEventListener('click', async () => {
  const email = 'himanshu.kumar0012@gmail.com';
  try {
    await navigator.clipboard.writeText(email);
    showToast('Email copied');
  } catch {
    showToast(email); // Clipboard access can be blocked; show the address instead.
  }
});

/* ------------------------------------------------------------------ boot */

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

let saved = null;
try { saved = localStorage.getItem(STORAGE_KEY); } catch { /* storage may be unavailable */ }

// ?view= lets the classic site link straight into either view.
const requested = new URLSearchParams(location.search).get('view');
const startDepth = requested === 'depth' ? true
  : requested === 'flat' ? false
  : saved ? saved === 'depth'
  : !reduceMotion.matches;

const hashTarget = location.hash ? indexOfId(location.hash.slice(1)) : -1;
layout();
setMode(startDepth, { remember: Boolean(requested), index: hashTarget >= 0 ? hashTarget : 0 });
if (!startDepth && hashTarget >= 0) planes[hashTarget].el.scrollIntoView({ block: 'start' });
