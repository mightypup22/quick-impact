// /js/GA4.js
(function () {
  if (window.qiGA4Init) return; // Doppel-Init verhindern (bei Hot Reload etc.)
  window.qiGA4Init = true;

  // Sprechende Namen für Section-IDs (optional anpassen)
  const NAME_BY_ID = {
    // "leistungen": "Leistungen",
    // "kompetenzen": "Kompetenzen",
    // "ueber-uns": "Über uns",
    // "projektablauf": "Projektablauf",
    // "faq": "FAQ",
    // "kontakt": "Kontakt"
  };

  // DataLayer helper
  function pushDL(obj) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(obj);
  }

  // ---------- SECTION-VIEWS ----------
  let sectionIO = null;
  const seenSections = new Set();
  function initSectionObserver() {
    // vorhandenen Observer ggf. aufräumen
    if (sectionIO) { sectionIO.disconnect(); sectionIO = null; }

    const sections = Array.from(document.querySelectorAll('section[id]'));
    if (!sections.length) return;

    sectionIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.5) return;
        const id = entry.target.id;
        if (seenSections.has(id)) return;
        seenSections.add(id);

        const niceName =
          entry.target.getAttribute('data-section-name') ||
          NAME_BY_ID[id] ||
          id;

        pushDL({
          event: 'sectionView',      // <- Trigger-Eventname in GTM
          sectionId: id,             // DLV – sectionId
          sectionName: niceName      // DLV – sectionName
        });
      });
    }, { threshold: [0.3], rootMargin: '0px 0px -10% 0px' });

    sections.forEach(s => sectionIO.observe(s));
  }

  // ---------- SCROLL-PROGRESS ----------
  const marks = [25, 50, 75, 90];   // gewünschte Marken
  const firedMarks = new Set();      // global pro Pageview nur einmal
  function computeScrollPercent() {
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop || 0;
    const winH = window.innerHeight || doc.clientHeight || 0;
    const docH = Math.max(
      document.body.scrollHeight, doc.scrollHeight,
      document.body.offsetHeight, doc.offsetHeight,
      document.body.clientHeight, doc.clientHeight
    );
    if (docH <= 0) return 0;
    return Math.round(((scrollTop + winH) / docH) * 100);
  }

  function onScroll() {
    const pct = computeScrollPercent();
    marks.forEach((m) => {
      if (pct >= m && !firedMarks.has(m)) {
        firedMarks.add(m);
        pushDL({
          event: 'scrollProgress',   // <- Trigger-Eventname in GTM
          scrollPercent: m           // DLV – scrollPercent
        });
      }
    });
  }

  // RAF-Throttle
  let ticking = false;
  function throttledScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => { onScroll(); ticking = false; });
      ticking = true;
    }
  }

  function initScrollTracking() {
    window.addEventListener('scroll', throttledScroll, { passive: true });
    // Initial für kurze Seiten
    onScroll();
  }

  // ---------- BOOTSTRAP ----------
  function tryInit() {
    initSectionObserver();
    initScrollTracking();
  }

  // Init, wenn DOM bereit
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInit);
  } else {
    tryInit();
  }

  // Warten auf asynchron geladene Components
  window.addEventListener('includes:ready', () => {
    // Sections könnten erst jetzt im DOM sein
    initSectionObserver();
  });

  // Fallback: falls Includes anders injiziert werden
  try {
    const mo = new MutationObserver(() => {
      // Wenn neue <section id="…"> auftauchen, erneut verbinden
      initSectionObserver();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  } catch (_) {}
})();
