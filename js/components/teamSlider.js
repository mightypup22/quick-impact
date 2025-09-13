/* v8 guard */
(function(){ if(!document.querySelector('.team-slider, [data-team-slider], #team-slider, #teamCarousel, #team, #team-slider-root')) return; })();
// components/teamSlider.js (dots only, auto-slide, auto-height, swipe)
export function initTeamSlider(){
  const root = document.getElementById('teamv3');
  if(!root) return;
  const viewport = root.querySelector('.tv3-viewport');
  const slides = Array.from(viewport.querySelectorAll('.tv3-slide'));
  const dotsWrap = root.querySelector('.tv3-dots');

  // Build dots
  dotsWrap.innerHTML = '';
  slides.forEach((_,i)=>{
    const b=document.createElement('button');
    b.setAttribute('aria-label','Folie '+(i+1));
    b.addEventListener('click',()=>{ goto(i); restart(); });
    dotsWrap.appendChild(b);
  });

  let index=0, timer=null, running=true;

  function setActive(i){
    slides.forEach((s,si)=>s.classList.toggle('active', si===i));
    Array.from(dotsWrap.children).forEach((d,di)=>d.classList.toggle('active', di===i));
    updateHeight();
  }

  function goto(i){ index=(i+slides.length)%slides.length; setActive(index); }
  function next(){ goto(index+1); }

  function start(){ if(timer) return; timer=setInterval(()=>{ if(running) next(); }, 6500); }
  function stop(){ if(timer){ clearInterval(timer); timer=null; } }
  function restart(){ stop(); start(); }

  // Pause on hover/focus
  root.addEventListener('pointerenter',()=>{ running=false; });
  root.addEventListener('pointerleave',()=>{ running=true; });
  root.addEventListener('focusin',()=>{ running=false; });
  root.addEventListener('focusout',()=>{ running=true; });

  // Only run when visible
  const io=new IntersectionObserver((ents)=>{ ents.forEach(en=>{ running=en.isIntersecting; }); }, {threshold:.15});
  io.observe(root);

  // Swipe support
  let sx=0, dx=0, swiping=false;
  viewport.addEventListener('pointerdown',(e)=>{ swiping=true; sx=e.clientX; viewport.setPointerCapture(e.pointerId); });
  viewport.addEventListener('pointerup',()=>{ if(!swiping) return; swiping=false; if(Math.abs(dx)>44){ if(dx<0) next(); else goto(index-1); restart(); } dx=0; });
  viewport.addEventListener('pointermove',(e)=>{ if(!swiping) return; dx=e.clientX-sx; });

  // Auto-height from active slide
  function updateHeight(){
    const active = slides[index];
    if(!active) return;
    const h = Math.max( active.scrollHeight, 280 );
    viewport.style.height = h + 'px';
  }
  slides.forEach(sl=>{
    sl.querySelectorAll('img').forEach(img=>{
      img.addEventListener('load', updateHeight, {once:false});
    });
  });
  window.addEventListener('resize', updateHeight);

  // Init
  setActive(index);
  start();
  setTimeout(updateHeight, 100);
}