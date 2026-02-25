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
  // robuster Selektor bleibt
const SECTION_SELECTOR = 'section[id], [data-section-name][id], [data-track="section"][id]';

let sectionIO = null;
const seenSections = new Set();

// Sichtbarkeitsprüfung (Fallback)
function isVisibleEnough(el, minRatio = 0.15) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  if (vh <= 0) return false;
  const top = Math.max(0, r.top);
  const bottom = Math.min(vh, r.bottom);
  const visible = Math.max(0, bottom - top);
  const ratio = visible / Math.max(1, r.height);
  return ratio >= minRatio;
}

function reportIfEligible(el) {
  const id = el.id || 'unknown';
  if (!consentGranted) return;              // nur mit Consent senden
  if (seenSections.has(id)) return;         // schon gemeldet?
  if (!isVisibleEnough(el, 0.15)) return;   // Fallback-Check

  const niceName =
    el.getAttribute('data-section-name') ||
    NAME_BY_ID[id] || id;

  seenSections.add(id);
  pushWithConsent({
    event: 'sectionView',
    sectionId: id,
    sectionName: niceName
  });
}

function setupSectionObserver() {
  if (sectionIO) sectionIO.disconnect();

  const sections = Array.from(document.querySelectorAll(SECTION_SELECTOR));
  if (!sections.length) return;

  sectionIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      // toleranter + Sticky-Header berücksichtigen
      if (entry.intersectionRatio < 0.15) return;
      reportIfEligible(entry.target);
    });
  }, { threshold: [0, 0.15, 0.3], rootMargin: '12% 0px -12% 0px' });

  sections.forEach(s => sectionIO.observe(s));

  // Falls eine Section schon beim Setup sichtbar ist (z. B. "Über uns" knapp unter Hero)
  if (consentGranted) {
    sections.forEach(s => reportIfEligible(s));
  }
}

// nach Consent auch sichtbare Sections sofort melden
function reobserveSections() {
  setupSectionObserver();
  if (consentGranted) {
    const sections = Array.from(document.querySelectorAll(SECTION_SELECTOR));
    sections.forEach(s => reportIfEligible(s));
  }
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
