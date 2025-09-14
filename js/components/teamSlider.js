// js/components/teamSlider.js — NO DOTS (arrows only), auto-slide, swipe, auto-height

let __tsInitialized = false;
let __tsTimer = null;

export function initTeamSlider(){
  if (__tsInitialized) return;

  // Root finden (robust)
  const root = document.querySelector('#teamv3, .team-slider, [data-team-slider], #team, #teamCarousel, #team-slider-root');
  if (!root) return;

  // Viewport + Slides
  const viewport = root.querySelector('.tv3-viewport, .team-viewport, .slider-viewport');
  if (!viewport) return;

  const slides = Array.from(viewport.querySelectorAll('.tv3-slide, .team-slide, .slide'));
  if (!slides.length) return;

  // Pfeile
  const prevBtn = root.querySelector('.tv3-arrow.prev');
  const nextBtn = root.querySelector('.tv3-arrow.next');

  // ---- State ----
  let index = 0;
  let running = true;

  function setActive(i){
    slides.forEach((s, si) => s.classList.toggle('active', si === i));
    updateHeight();
  }
  function goto(i){ index = (i + slides.length) % slides.length; setActive(index); }
  function next(){ goto(index + 1); }

  function start(){ if (__tsTimer) return; __tsTimer = setInterval(() => { if (running) next(); }, 6500); }
  function stop(){ if (__tsTimer){ clearInterval(__tsTimer); __tsTimer = null; } }
  function restart(){ stop(); start(); }

  // Pfeil-Events
  if (prevBtn) prevBtn.addEventListener('click', () => { goto(index - 1); restart(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); restart(); });

  // Hover/Focus pausiert
  root.addEventListener('pointerenter', () => { running = false; });
  root.addEventListener('pointerleave', () => { running = true; });
  root.addEventListener('focusin',       () => { running = false; });
  root.addEventListener('focusout',      () => { running = true; });

  // Nur laufen, wenn sichtbar
  try {
    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => { running = en.isIntersecting; });
    }, { threshold: .15 });
    io.observe(root);
  } catch(e){ /* ältere Browser */ }

  // Swipe
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

  // Auto-Höhe anhand aktiver Slide
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

// Legacy global (falls main.js es so aufruft)
if (typeof window !== 'undefined') {
  window.TeamSlider = window.TeamSlider || {};
  window.TeamSlider.initTeamSlider = initTeamSlider;
}
