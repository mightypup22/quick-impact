/* prelude v7 */
(function(){
  function fixLogo(){
    ['.brand img','#site-logo','img.logo'].forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(img){
        if(!img) return;
        img.removeAttribute('srcset'); img.removeAttribute('sizes');
        var cur = img.getAttribute('src')||'';
        if(cur !== '/assets/logo.svg') img.setAttribute('src','/assets/logo.svg');
      });
    });
    ['#footer-logo','.footer-logo'].forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(img){
        if(!img) return;
        img.removeAttribute('srcset'); img.removeAttribute('sizes');
        var cur = img.getAttribute('src')||'';
        if(cur !== '/assets/footer-logo.svg') img.setAttribute('src','/assets/footer-logo.svg');
      });
    });
  }
  document.addEventListener('DOMContentLoaded', fixLogo);
  window.addEventListener('load', fixLogo);
  window.addEventListener('resize', fixLogo);
  new MutationObserver(fixLogo).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src','srcset','sizes']});

  // Cache-bust components
  var origFetch = window.fetch;
  if (origFetch){
    var BID = (window.__BUILD_ID__ = window.__BUILD_ID__ || String(Date.now()));
    window.fetch = function(input, init){
      try{
        var url = (typeof input==='string')?input:(input&&input.url)||'';
        if(/^components\//i.test(url)){
          url += (url.includes('?')?'&':'?') + 'v=' + encodeURIComponent(BID);
          input = (typeof input==='string')?url:new Request(url, init);
        }
      }catch(e){}
      return origFetch.call(this, input, init);
    };
  }

  // Guard TeamSlider init regardless of call order
  function hasContainer(){
    return document.querySelector('.team-slider, [data-team-slider], #team-slider, #teamCarousel, #team, #team-slider-root');
  }
  function wrap(mod){
    if(!mod) mod = {};
    var orig = mod.initTeamSlider;
    mod.initTeamSlider = function(){
      if(!hasContainer()){ console.warn('TeamSlider: no container, skip'); return; }
      try { return (orig||function(){}).apply(this, arguments); }
      catch(e){ console.warn('TeamSlider error:', e); }
    };
    return mod;
  }
  try {
    var _ts = window.TeamSlider;
    Object.defineProperty(window, 'TeamSlider', {configurable:true,
      get: function(){ return _ts; }, set: function(v){ _ts = wrap(v); }});
    if (_ts) window.TeamSlider = _ts;
  } catch(e){}
  try {
    var _md = window.Module;
    Object.defineProperty(window, 'Module', {configurable:true,
      get: function(){ return _md; }, set: function(v){ _md = wrap(v); }});
    if (_md) window.Module = _md;
  } catch(e){}
})();
// main.js (ES module)
const CONFIG={
  brandName:'Quick Impact Programming',
  contactEmail:'kontakt@quick-impact.de',
  phone:'+49 30 234 56 880',
  address:'Schöneberger Ufer 73, 10785 Berlin'
};

async function loadComponents(){
  const slots = Array.from(document.querySelectorAll('[data-include]'));
  if(!slots.length){
    window.dispatchEvent(new Event('includes:ready'));
    return;
  }

  await Promise.all(slots.map(async slot=>{
    const url = slot.getAttribute('data-include');
    try{
      const res = await fetch(url, {cache:'no-cache'});
      if(!res.ok) throw new Error(res.status+' '+res.statusText);
      const html = await res.text();
      slot.outerHTML = html;
    }catch(err){
      console.error('Include fehlgeschlagen:', url, err);
      const fallback = document.createElement('section');
      fallback.className = 'section';
      fallback.innerHTML = `<div class="container"><p class="muted small">Inhalt konnte nicht geladen werden: <code>${url}</code></p></div>`;
      slot.replaceWith(fallback);
    }
  }));

  // <- HIER: Signal senden, dass alle Includes fertig sind
  window.dispatchEvent(new Event('includes:ready'));
}


function initHeader(){
  const burger=document.getElementById('burger'); const nav=document.getElementById('nav');
  if(burger && nav){
    const closeMenu = ()=>{
      nav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    };

    burger.addEventListener('click', ()=>{
      const open=burger.classList.toggle('open');
      nav.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    });

    nav.addEventListener('click', (event)=>{
      const link = event.target.closest('a[href]');
      if(!link || !nav.classList.contains('open')) return;
      closeMenu();
    });
  }
  document.getElementById('year')?.append(new Date().getFullYear());
  const b1=document.getElementById('brandName'); if(b1) b1.textContent=CONFIG.brandName;
  const bf=document.getElementById('brandNameFooter'); if(bf) bf.textContent=CONFIG.brandName;
  const bc=document.getElementById('brandNameCopyright'); if(bc) bc.textContent=CONFIG.brandName;
  const mail=document.getElementById('contactEmailLink'); if(mail){ mail.href='mailto:'+CONFIG.contactEmail; mail.textContent=CONFIG.contactEmail; }
  const phone=document.getElementById('contactPhone'); if(phone) phone.textContent=CONFIG.phone;
  const addr=document.getElementById('contactAddress'); if(addr) addr.textContent=CONFIG.address;
}

function initContactForm(){
  window.handleContact = function(e){
    e.preventDefault();
    const form=e.target;
    const data=new FormData(form);
    const interests=[...form.querySelectorAll('input[name="interest"]:checked')].map(i=>i.value).join(', ');
    const payload = `Name: ${data.get('name')}
E-Mail: ${data.get('email')}
Unternehmen: ${data.get('company')||''}
Telefon: ${data.get('phone')||''}
Interessen: ${interests}

${data.get('message')}`;
    const url=`mailto:${CONFIG.contactEmail}?subject=${encodeURIComponent('Anfrage über Website')}&body=${encodeURIComponent(payload)}`;
    window.location.href=url;
  }
}

function initHeroCanvas(){
  const root = document.getElementById('network-bg');
  if(!root) return;

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia && window.matchMedia('(max-width: 980px)').matches;

  const init = async ()=>{
    try{
      const [{ tsParticles }, { loadSlim }] = await Promise.all([
        import('https://cdn.jsdelivr.net/npm/@tsparticles/engine@3/+esm'),
        import('https://cdn.jsdelivr.net/npm/@tsparticles/slim@3/+esm')
      ]);

      await loadSlim(tsParticles);

      const speed = prefersReduced ? 0 : (isMobile ? 0.14 : 0.2);
      const opacity = prefersReduced ? 0.16 : (isMobile ? 0.14 : 0.22);
      const density = isMobile ? 32 : 48;
      const linkDistance = isMobile ? 95 : 130;

      await tsParticles.load({
        id: 'network-bg',
        options: {
          fpsLimit: 60,
          fullScreen: { enable: false },
          detectRetina: true,
          background: { color: { value: 'transparent' } },
          interactivity: {
            detectsOn: 'window',
            events: { onHover: { enable: !prefersReduced, mode: 'grab' }, resize: true },
            modes: { grab: { distance: 110, links: { opacity: 0.16 } } }
          },
          particles: {
            number: { value: density, density: { enable: true, width: 1100, height: 640 } },
            color: { value: '#9fd9c5' },
            links: { enable: true, distance: linkDistance, color: '#8ecfb8', opacity, width: 1 },
            move: { enable: true, speed, outModes: { default: 'bounce' } },
            opacity: { value: { min: 0.1, max: 0.22 } },
            size: { value: { min: 0.8, max: 1.8 } }
          }
        }
      });
    }catch(err){
      console.error('Hero-Animation konnte nicht initialisiert werden', err);
    }
  };

  init();
}

function fixSectionLinks(){
  const path = (location.pathname || '').toLowerCase();
  const onIndex = path.endsWith('/') || path.endsWith('/index.html');
  const anchors = Array.from(document.querySelectorAll('a[href^="#"], a[href^="index.html#"]'));
  anchors.forEach(a=>{
    const href = a.getAttribute('href') || '';
    const id = href.replace(/^index\.html#/, '#');
    if(onIndex){
      a.setAttribute('href', id);
      a.addEventListener('click', (e)=>{
        const targetId = (a.getAttribute('href') || '').slice(1);
        const el = document.getElementById(targetId);
        if(el){
          e.preventDefault();
          el.scrollIntoView({behavior:'smooth', block:'start'});
          const nav=document.getElementById('nav'); const burger=document.getElementById('burger');
          if(nav && nav.classList.contains('open')){
            nav.classList.remove('open');
            burger?.classList.remove('open');
            burger?.setAttribute('aria-expanded', 'false');
          }
        }
      });
    }else{
      if(!href.startsWith('index.html#')) a.setAttribute('href', 'index.html' + id);
    }
  });
}



/* ---- Inline Team Slider (guarded) ---- */
function initTeamSlider(){
  const root = document.getElementById('teamv3');
  if(!root || root.dataset.initialized === '1') return;
  root.dataset.initialized = '1';
  const viewport = root.querySelector('.tv3-viewport');
  const slides = Array.from(viewport.querySelectorAll('.tv3-slide'));
  const prevBtn = root.querySelector('.tv3-arrow.prev');
  const nextBtn = root.querySelector('.tv3-arrow.next');
  if(!viewport || slides.length === 0 || !prevBtn || !nextBtn) return;

  let index=0, timer=null, running=true, resizeTick=null;

  function setActive(i){
    slides.forEach((s,si)=>s.classList.toggle('active', si===i));
    updateHeight();
  }
  function goto(i){ index=(i+slides.length)%slides.length; setActive(index); }
  function next(){ goto(index+1); }
  function prev(){ goto(index-1); }

  function start(){ if(timer) return; timer=setInterval(()=>{ if(running) next(); }, 10000); }
  function stop(){ if(timer){ clearInterval(timer); timer=null; } }
  function restart(){ stop(); start(); }

  prevBtn.addEventListener('click', ()=>{ prev(); restart(); });
  nextBtn.addEventListener('click', ()=>{ next(); restart(); });

  root.addEventListener('pointerenter',()=>{ running=false; });
  root.addEventListener('pointerleave',()=>{ running=true; });
  root.addEventListener('focusin',()=>{ running=false; });
  root.addEventListener('focusout',()=>{ running=true; });

  const io=new IntersectionObserver((ents)=>{ ents.forEach(en=>{ running=en.isIntersecting; }); }, {threshold:.15});
  io.observe(root);

  // Swipe support
  let sx=0, dx=0, swiping=false;
  const viewportEl = viewport;
  viewportEl.addEventListener('pointerdown',(e)=>{ swiping=true; sx=e.clientX; viewportEl.setPointerCapture(e.pointerId); });
  viewportEl.addEventListener('pointerup',()=>{ if(!swiping) return; swiping=false; if(Math.abs(dx)>44){ if(dx<0) next(); else prev(); restart(); } dx=0; });
  viewportEl.addEventListener('pointermove',(e)=>{ if(!swiping) return; dx=e.clientX-sx; });

  function updateHeight(){
    const active = slides[index];
    if(!active) return;
    viewport.style.height = 'auto';
    const h = Math.max(active.scrollHeight, 280);
    viewport.style.height = h + 'px';
  }

  const ro = new ResizeObserver(()=>{
    if(resizeTick) cancelAnimationFrame(resizeTick);
    resizeTick = requestAnimationFrame(updateHeight);
  });
  ro.observe(viewport);
  slides.forEach(sl=>{
    ro.observe(sl);
    sl.querySelectorAll('img').forEach(img=>{
      img.addEventListener('load', updateHeight, {once:false});
    });
  });
  window.addEventListener('resize', ()=>{
    if(resizeTick) cancelAnimationFrame(resizeTick);
    resizeTick = requestAnimationFrame(updateHeight);
  });

  setActive(index);
  start();
  setTimeout(updateHeight, 150);
}

/* ---- Flow line alignment ---- */
function initFlowLine(){
  const fs = document.querySelector('.flow-steps');
  if(!fs) return;
  const firstDot = fs.querySelector('li .dot');
  const lastDot  = fs.querySelector('li:last-child .dot');
  if(!firstDot || !lastDot) return;
  const fsRect = fs.getBoundingClientRect();
  const fRect = firstDot.getBoundingClientRect();
  const lRect = lastDot.getBoundingClientRect();
  const topOffset = (fRect.top - fsRect.top) + (fRect.height/2);
  const bottomOffset = (fsRect.bottom - (lRect.top + lRect.height/2));
  const xOffset = (fRect.left - fsRect.left) + (fRect.width/2);
  fs.style.setProperty('--line-top', `${topOffset}px`);
  fs.style.setProperty('--line-bottom', `${bottomOffset}px`);
  fs.style.setProperty('--line-x', `${xOffset}px`);
}

/* ---- Smart header ---- */
function initSmartHeader(){
  const header = document.querySelector('.site-header');
  if(!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateHeader(){
    const currentScrollY = window.scrollY;
    const nav = document.getElementById('nav');

    // Bei ganz oben oder offenem Mobile-Menü bleibt die Navbar sichtbar.
    if(currentScrollY <= 0 || (nav && nav.classList.contains('open'))){
      header.classList.remove('hide');
      lastScrollY = currentScrollY;
      ticking = false;
      return;
    }

    if(currentScrollY > lastScrollY){
      header.classList.add('hide');
    }else if(currentScrollY < lastScrollY){
      header.classList.remove('hide');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', ()=>{
    if(!ticking){
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, {passive:true});
}

function initScrollIndicator(){
  const indicator = document.querySelector('.scroll-indicator');
  if(!indicator) return;

  const dots = Array.from(indicator.querySelectorAll('.scroll-dot'));
  if(!dots.length) return;

  const sectionIds = ['hero','symptome','kompetenzen','projektablauf','ueber-uns','leistungen','faq','kontakt'];
  const sections = sectionIds.map(id=>document.getElementById(id)).filter(Boolean);

  // Aktiven Punkt anhand der Section-ID markieren.
  function setActive(id){
    dots.forEach(dot=>{
      const active = dot.dataset.target === id;
      dot.classList.toggle('is-active', active);
      if(active){ dot.setAttribute('aria-current', 'true'); }
      else { dot.removeAttribute('aria-current'); }
    });
  }

  dots.forEach(dot=>{
    dot.addEventListener('click', (e)=>{
      const targetId = dot.dataset.target;
      const target = targetId ? document.getElementById(targetId) : null;
      if(!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  if(!('IntersectionObserver' in window)) return;

  // Sichtbarkeit pro Section sammeln und die dominant sichtbare Section aktiv setzen.
  const ratios = new Map(sectionIds.map(id=>[id, 0]));
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      const id = entry.target.id;
      if(!id) return;
      ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
    });

    let bestId = sectionIds[0];
    let bestRatio = -1;
    sectionIds.forEach(id=>{
      const ratio = ratios.get(id) || 0;
      if(ratio > bestRatio){
        bestRatio = ratio;
        bestId = id;
      }
    });

    if(bestRatio > 0){ setActive(bestId); }
  }, {
    root: null,
    rootMargin: '-40% 0px -50% 0px',
    threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
  });

  sections.forEach(section=>io.observe(section));
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadComponents();
  
  // Jump to hash after components are included (for visits from legal pages)
  if (location.hash) {
    const hash = decodeURIComponent(location.hash);
    let tries = 0;
    const seek = () => {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({behavior:'auto', block:'start'});
      } else if (tries++ < 40) {
        requestAnimationFrame(seek);
      }
    };
    requestAnimationFrame(seek);
  }

initHeader();
  initContactForm();
  initHeroCanvas();
  try{
    const mod = await import('./components/teamSlider.js');
    if(mod && typeof mod.initTeamSlider === 'function'){ mod.initTeamSlider(); }
  }catch(e){ console.error('TeamSlider Modul konnte nicht geladen werden', e); }
  fixSectionLinks(); initFlowLine(); initSmartHeader(); initScrollIndicator(); initTeamSlider(); window.addEventListener('resize', initFlowLine, {passive:true});
});
if('serviceWorker'in navigator){navigator.serviceWorker.getRegistrations().then(r=>r.forEach(x=>x.unregister())).catch(()=>{});}
