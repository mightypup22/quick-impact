// anchors.smart.js
(function(){
  document.addEventListener('click', function(e){
    const a = e.target.closest('a[href^="#"]');
    if(!a) return;
    const id = a.getAttribute('href');
    if(!id || id==='#') return;
    const el = document.querySelector(id);
    if(!el) return;
    if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') return;
    e.preventDefault();
    el.scrollIntoView({behavior:'smooth', block:'start'});
  });
})();