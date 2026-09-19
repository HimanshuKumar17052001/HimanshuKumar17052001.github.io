// A magnifying glass lens that works over every section of the page. It shows an
// enlarged, decorative copy of the section under the pointer. No canvas, WebGL,
// or third-party animation library is needed, and the real text stays selectable.
const RADIUS = 110;
const SCALE = 1.08;
const REBUILD_DELAY = 250;
const INTERACTIVE = 'a, button, input, textarea, select, summary, label, [role="button"], [role="tab"], [contenteditable]';

export function initLens(sections) {
  const finePointer = matchMedia('(pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const lens = document.createElement('div');
  lens.className = 'cursor-lens';
  lens.setAttribute('aria-hidden', 'true');
  lens.inert = true;
  document.body.append(lens);

  // One copy per section, built on first use and rebuilt only after that section changes.
  const copies = new Map();
  let active = null;
  let point = null;
  let frame = 0;
  let rebuildTimer = 0;

  function build(section) {
    const copy = section.cloneNode(true);
    copy.removeAttribute('id');
    copy.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
    // Backgrounds already show through the glass; drop costly or inert-only parts.
    copy.querySelectorAll('.atmosphere, template, script, dialog, video, iframe').forEach(element => element.remove());
    copy.classList.add('lens-copy');
    const entry = { copy, dirty: false, builtAt: performance.now(), width: 0 };
    copies.set(section, entry);
    return entry;
  }

  const observer = new MutationObserver(records => {
    for (const record of records) {
      const section = sections.find(candidate => candidate.contains(record.target));
      const entry = section && copies.get(section);
      if (entry) entry.dirty = true;
      if (section === active && point && !rebuildTimer) {
        rebuildTimer = setTimeout(() => { rebuildTimer = 0; schedule(); }, REBUILD_DELAY);
      }
    }
  });
  sections.forEach(section => observer.observe(section, { subtree: true, childList: true, attributes: true, characterData: true }));

  function hide() {
    lens.classList.remove('is-visible');
    cancelAnimationFrame(frame);
    frame = 0;
  }

  // The pointer has left the page, so there is nothing to follow while scrolling.
  function release() {
    point = null;
    hide();
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(draw);
  }

  function canShow() {
    return finePointer.matches && !reduced.matches
      && !document.body.classList.contains('motion-paused')
      && !document.body.classList.contains('dialog-open');
  }

  // Finds the section under the pointer, or null where the lens should stay out of the way.
  function sectionAt(target) {
    if (!target || !target.closest || target.closest(INTERACTIVE) || target.closest('dialog, .site-header')) return null;
    return sections.find(section => section.contains(target)) || null;
  }

  function draw() {
    frame = 0;
    if (!point || !active || !canShow()) return hide();
    let entry = copies.get(active);
    if (!entry || (entry.dirty && performance.now() - entry.builtAt > REBUILD_DELAY)) entry = build(active);
    if (lens.firstElementChild !== entry.copy) lens.replaceChildren(entry.copy);
    const rect = active.getBoundingClientRect();
    if (entry.width !== rect.width) {
      entry.width = rect.width;
      entry.copy.style.width = `${rect.width}px`;
    }
    const x = point.x - rect.left;
    const y = point.y - rect.top;
    lens.style.transform = `translate3d(${point.x - RADIUS}px, ${point.y - RADIUS}px, 0)`;
    // The copy is positioned inside the lens border, so offset by its width.
    const inset = RADIUS - lens.clientLeft;
    entry.copy.style.transform = `translate3d(${inset - x * SCALE}px, ${inset - y * SCALE}px, 0) scale(${SCALE})`;
    lens.classList.add('is-visible');
  }

  function update(target) {
    active = canShow() ? sectionAt(target) : null;
    if (!active) return hide();
    schedule();
  }

  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return release();
    point = { x: event.clientX, y: event.clientY };
    update(event.target);
  }, { passive: true });

  // Content moves under a still pointer while scrolling; keep the lens on what is now beneath it.
  let scrollFrame = 0;
  window.addEventListener('scroll', () => {
    if (!point || scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      if (point) update(document.elementFromPoint(point.x, point.y));
    });
  }, { passive: true });

  function invalidateAll() {
    copies.clear();
    lens.replaceChildren();
    if (point) schedule();
  }
  window.addEventListener('resize', invalidateAll, { passive: true });
  document.fonts.ready.then(invalidateAll);

  document.documentElement.addEventListener('pointerleave', release);
  window.addEventListener('blur', release);
  document.addEventListener('visibilitychange', release);
  document.addEventListener('portfolio:motion', hide);
  finePointer.addEventListener('change', hide);
  reduced.addEventListener('change', hide);
}
