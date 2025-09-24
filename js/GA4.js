// /js/GA4.js
(function () {
  if (window.qiGA4Init) return; // Doppel-Init verhindern
  window.qiGA4Init = true;

  // ---- Consent-Verwaltung ---------------------------------------------------
  const CONSENT_LS_KEY = 'qi-consent-v1';
  let consentGranted = (typeof localStorage !== 'undefined' && localStorage.getItem(CONSENT_LS_KEY) === 'granted');

  // DataLayer-Hook: fange consent_update aus dem Banner ab
  (function hookConsentFromDataLayer(){
    const dl = (window.dataLayer = window.dataLayer || []);
    const originalPush = Array.isArray(dl.push) ? dl.push : null;
    dl.push = function(){
      for (const arg of arguments) {
        if (arg && arg.event === 'consent_update' && arg.consent === 'granted') {
          onConsentGranted();
        }
      }
      return originalPush ? originalPush.apply(this, arguments) : 0;
    };
  })();

  function onConsentGranted(){
    if (consentGranted) return;
    consentGranted = true;
    // bereits gebufferte Events senden
    flushQueue();
    // Scroll-Marken erneut auswerten & senden
    firedMarks.clear();
    onScroll();
    // Sections mit aktuellem Viewport erneut bewerten
    reobserveSections();
  }

  // ---- DataLayer helper mit Consent-Queue -----------------------------------
  const pendingQueue = [];
  function pushDL(obj) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(obj);
  }
  function pushWithConsent(obj){
    if (!consentGranted) { pendingQueue.push(obj); return; }
    pushDL(obj);
  }
  function flushQueue(){
    if (!pendingQueue.length) return;
    // alles auf einen Schlag senden (Reihenfolge beibehalten)
    while (pendingQueue.length) pushDL(pendingQueue.shift());
  }

  // ---- Optionale hübsche Namen für Sections ---------------------------------
  const NAME_BY_ID = {
    // "leistungen": "Leistungen",
    // "kompetenzen": "Kompetenzen",
    // "ueber-uns": "Über uns",
    // "projektablauf": "Projektablauf",
    // "faq": "FAQ",
    // "kontakt": "Kontakt"
  };

  // ---- SECTION-VIEWS ---------------------------------------------------------
  // robuster Selektor: akzeptiert <section id="…"> sowie beliebige Elemente mit id + data-section-name
  const SECTION_SELECTOR = 'section[id], [data-section-name][id], [data-track="section"][id]';

  let sectionIO = null;
  const seenSections = new Set(); // nur pushen, wenn noch nicht gemeldet

  function setupSectionObserver() {
    if (sectionIO) sectionIO.disconnect();
    const sections = Array.from(document.querySelectorAll(SECTION_SELECTOR));
    if (!sections.length) return;

    sectionIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.3) return;

        const id = entry.target.id || 'unknown';
        if (seenSections.has(id)) return; // schon gemeldet

        // ohne Consent NICHT als gesehen markieren, damit wir nach Zustimmung pushen können
        if (!consentGranted) return;

        const niceName =
          entry.target.getAttribute('data-section-name') ||
          NAME_BY_ID[id] ||
          id;

        seenSections.add(id);
        pushWithConsent({
          event: 'sectionView',      // GTM-Trigger-Event (benutzerdefiniertes Ereignis)
          sectionId: id,             // DLV – sectionId
          sectionName: niceName      // DLV – sectionName
        });
      });
    }, { threshold: [0.3], rootMargin: '0px 0px -10% 0px' });

    sections.forEach(s => sectionIO.observe(s));
  }

  // Re-Observe forcieren (z. B. direkt nach Consent), damit initial sichtbare Section gemeldet wird
  function reobserveSections(){
    // Observer neu anlegen (triggert initiale Entries)
    setupSectionObserver();
  }

  // ---- SCROLL-PROGRESS ------------------------------------------------------
  const marks = [25, 50, 75, 90];
  const firedMarks = new Set(); // pro Pageview nur einmal je Marke

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

  function pushScroll(percent){
    if (!consentGranted) return; // vor Consent nichts senden
    pushWithConsent({
      event: 'scrollProgress', // GTM-Trigger-Event (benutzerdefiniertes Ereignis)
      scrollPercent: percent   // DLV – scrollPercent
    });
  }

  function onScroll() {
    const pct = computeScrollPercent();
    marks.forEach((m) => {
      if (pct >= m && !firedMarks.has(m)) {
        firedMarks.add(m);
        pushScroll(m);
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
    // initial nur ausführen, wenn bereits Consent vorliegt
    if (consentGranted) onScroll();
  }

  // ---- BOOTSTRAP ------------------------------------------------------------
  function initAll() {
    setupSectionObserver();
    initScrollTracking();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Warten auf asynchron geladene Components
  window.addEventListener('includes:ready', () => {
    setupSectionObserver();
    if (consentGranted) onScroll();
  });

  // Fallback bei dynamischen DOM-Änderungen
  try {
    const mo = new MutationObserver(() => { setupSectionObserver(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  } catch (_) {}
})();
