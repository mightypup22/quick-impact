// js/components/teamSlider.js — robust drop‑in
// Idempotent, DOM‑safe, creates dots if missing, auto‑slide, swipe, auto‑height.

let __tsInitialized = false;
let __tsTimer = null;

export function initTeamSlider(){
  if (__tsInitialized) return;

  // Accept multiple root selectors for robustness
  const root = document.querySelector('#teamv3, .team-slider, [data-team-slider], #team, #teamCarousel, #team-slider-root');
  if (!root) return;

  // Viewport detection (fallbacks allowed)
  const viewport = root.querySelector('.tv3-viewport, .team-viewport, .slider-viewport');
  if (!viewport) return;

  const slides = Array.from(viewport.querySelectorAll('.tv3-slide, .team-slide, .slide'));
  if (!slides.length) return;

  // Ensure dots container
  let dotsWrap = root.querySelector('.tv3-dots, .team-dots, .slider-dots');
  if (!dotsWrap) {
    dotsWrap = document.createElement('div');
    dotsWrap.className = 'tv3-dots';
    // Place after viewport if possible
    if (viewport.parentNode) {
      viewport.parentNode.insertBefore(dotsWrap, viewport.nextSibling);
    } else {
      root.appendChild(dotsWrap);
    }
  } else {
    // Clear previous if any
    dotsWrap.innerHTML = '';
  }

  // Build dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.className = 'dot';
    b.type = 'button';
    b.setAttribute('aria-label', 'Folie ' + (i + 1));
    b.addEventListener('click', () => { goto(i); restart(); });
    dotsWrap.appendChild(b);
  });
  const dotEls = Array.from(dotsWrap.querySelectorAll('.dot'));

  let index = 0;
  let running = true;

  function setActive(i){
    slides.forEach((s, si) => s.classList.toggle('active', si === i));
    dotEls.forEach((d, di) => d.classList.toggle('active', di === i));
    updateHeight();
  }
  function goto(i){ index = (i + slides.length) % slides.length; setActive(index); }
  function next(){ goto(index + 1); }

  function start(){ if (__tsTimer) return; __tsTimer = setInterval(() => { if (running) next(); }, 6500); }
  function stop(){ if (__tsTimer){ clearInterval(__tsTimer); __tsTimer = null; } }
  function restart(){ stop(); start(); }

  // Pause on hover/focus
  root.addEventListener('pointerenter', () => { running = false; });
  root.addEventListener('pointerleave', () => { running = true; });
  root.addEventListener('focusin',       () => { running = false; });
  root.addEventListener('focusout',      () => { running = true; });

  // Only run when visible
  try {
    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => { running = en.isIntersecting; });
    }, { threshold: .15 });
    io.observe(root);
  } catch(e){ /* older browsers */ }

  // Swipe support (pointer events)
  let sx = 0, dx = 0, swiping = false;
  viewport.addEventListener('pointerdown', (e) => {
    swiping = true; sx = e.clientX;
    try { viewport.setPointerCapture(e.pointerId); } catch(_){}
  });
  viewport.addEventListener('pointerup', () => {
    if (!swiping) return;
    swiping = false;
    if (Math.abs(dx) > 44){ if (dx < 0) next(); else goto(index - 1); restart(); }
    dx = 0;
  });
  viewport.addEventListener('pointermove', (e) => { if (swiping) dx = e.clientX - sx; });

  // Auto-height from active slide
  function updateHeight(){
    const active = slides[index];
    if (!active) return;
    const h = Math.max(active.scrollHeight, active.offsetHeight || 0, 280);
    viewport.style.height = h + 'px';
  }
  slides.forEach(sl => {
    sl.querySelectorAll('img').forEach(img => {
      img.addEventListener('load', updateHeight, { once: false });
    });
  });
  window.addEventListener('resize', updateHeight);

  // Init
  setActive(index);
  start();
  requestAnimationFrame(updateHeight);
  setTimeout(updateHeight, 120);

  __tsInitialized = true;
}

// Legacy global API (in case main.js calls Module/TeamSlider)
if (typeof window !== 'undefined') {
  window.TeamSlider = window.TeamSlider || {};
  window.TeamSlider.initTeamSlider = initTeamSlider;
}
