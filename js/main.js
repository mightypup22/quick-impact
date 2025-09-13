/* prelude v7 */
(function(){
  function fixLogo(){
    ['#site-logo','#footer-logo','.brand img','.footer-logo','img.logo'].forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(img){
        if(!img) return;
        img.removeAttribute('srcset'); img.removeAttribute('sizes');
        var cur = img.getAttribute('src')||'';
        if(cur !== '/assets/logo.svg') img.setAttribute('src','/assets/logo.svg');
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
  brandName:'QuickImpact Programming',
  contactEmail:'hello@quickwin-solutions.example',
  phone:'+49 000 000000',
  address:'Musterstraße 1, 12345 Musterstadt'
};

async function loadComponents(){
  const slots = Array.from(document.querySelectorAll('[data-include]'));
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
}

function initHeader(){
  const burger=document.getElementById('burger'); const nav=document.getElementById('nav');
  if(burger && nav){
    burger.addEventListener('click', ()=>{
      const open=burger.classList.toggle('open');
      nav.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
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
  const canvas = document.getElementById('heroCanvas');
  const fallback = document.querySelector('.hero-fallback');
  if(!canvas) return;

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReduced){ canvas.style.display='none'; if(fallback) fallback.style.opacity='1'; return; }

  const ctx = canvas.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio||1, 2);

  let w=0,h=0, nodes=[], mouse={x:0,y:0,active:false}, rafId=null, running=false;
  const MAX_NODES_DESKTOP=64, MAX_NODES_MOBILE=38;
  const LINK_DIST=140, LINK_DIST_MOBILE=110;
  const GLOW_RADIUS=110;

  function resize(){
    const parent = canvas.parentElement;
    w = parent.clientWidth; h = Math.max(320, parent.clientHeight);
    canvas.width = Math.floor(w*DPR); canvas.height = Math.floor(h*DPR);
    canvas.style.width = w+'px'; canvas.style.height = h+'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);
    init();
  }

  function init(){
    const count = (w<700? MAX_NODES_MOBILE: MAX_NODES_DESKTOP);
    const linkDist = (w<700? LINK_DIST_MOBILE: LINK_DIST);
    nodes = [];
    for(let i=0;i<count;i++){
      nodes.push({ x: Math.random()*w, y: Math.random()*h, vx: (Math.random()-0.5)*0.24, vy: (Math.random()-0.5)*0.24, r: 1.2 + Math.random()*1.4 });
    }
    canvas.__linkDist = linkDist;
  }

  function step(){
    if(!running) return;
    ctx.clearRect(0,0,w,h);

    for(const n of nodes){
      n.x += n.vx; n.y += n.vy;
      if(n.x<0||n.x>w) n.vx*=-1;
      if(n.y<0||n.y>h) n.vy*=-1;

      const dx = n.x - mouse.x, dy = n.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      const near = mouse.active && dist < GLOW_RADIUS;
      const rr = near ? n.r + 1.1*(1-dist/GLOW_RADIUS) : n.r;

      ctx.beginPath();
      ctx.fillStyle = near ? 'rgba(52,211,153,0.9)' : 'rgba(255,255,255,0.65)';
      if(near){ ctx.shadowColor='rgba(16,185,129,0.6)'; ctx.shadowBlur=12; } else { ctx.shadowBlur=0; }
      ctx.arc(n.x, n.y, rr, 0, Math.PI*2); ctx.fill();
    }

    const L = canvas.__linkDist || 140;
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const a=nodes[i], b=nodes[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const d = Math.hypot(dx, dy);
        if(d<L){
          const alpha = (1 - d/L) * 0.38;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(52,211,153,${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }
    rafId = requestAnimationFrame(step);
  }

  function onMouseMove(e){
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  }
  function onMouseLeave(){ mouse.active = false; }

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){ running=true; requestAnimationFrame(step); if(fallback) fallback.style.opacity='0'; }
      else { running=false; }
    });
  }, {threshold: 0.05});
  io.observe(canvas);

  window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseleave', onMouseLeave);
  resize();
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
          if(nav && nav.classList.contains('open')){ nav.classList.remove('open'); burger?.classList.remove('open'); }
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
  const hero = document.querySelector('.hero');
  if(!header || !hero) return;

  let heroInView = true;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ heroInView = en.isIntersecting; if(heroInView){ header.classList.remove('hide'); } });
  }, {threshold: 0.05});
  io.observe(hero);

  let lastY = window.scrollY;
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY;
    const goingDown = y > lastY + 4;
    const goingUp   = y < lastY - 4;
    if(!heroInView){
      if(goingDown){ header.classList.add('hide'); }
      else if(goingUp){ header.classList.remove('hide'); }
    } else {
      header.classList.remove('hide');
    }
    lastY = y;
  }, {passive:true});
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
  fixSectionLinks(); initFlowLine(); initSmartHeader(); initTeamSlider(); window.addEventListener('resize', initFlowLine, {passive:true});
});