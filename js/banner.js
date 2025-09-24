(function(){
  const KEY = 'qi-consent-v1'; // Versioniere bei Änderungen

  function setConsent(granted){
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag('consent', 'update', {
      ad_storage: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied'
    });
    dataLayer.push({ event: 'consent_update', consent: granted ? 'granted' : 'denied' });
  }

  function initBanner(){
    const box = document.getElementById('qi-consent');
    if (!box) return false; // noch nicht da
    const acceptBtn = document.getElementById('qi-accept');
    const declineBtn = document.getElementById('qi-decline');
    if (!acceptBtn || !declineBtn) return false;

    const has = () => localStorage.getItem(KEY);
    const show = () => box.classList.add('show');
    const hide = () => box.classList.remove('show');

    if (!has()) show();

    acceptBtn.addEventListener('click', function(){
      localStorage.setItem(KEY, 'granted');
      setConsent(true); hide();
    });
    declineBtn.addEventListener('click', function(){
      localStorage.setItem(KEY, 'denied');
      setConsent(false); hide();
    });

    // Entscheidung bei Seitenwechsel erneut setzen
    const prev = has();
    if (prev) setConsent(prev === 'granted');

    return true;
  }

  // 1) Sofort versuchen (falls Banner schon im DOM ist)
  if (document.readyState !== 'loading') {
    if (initBanner()) return;
  } else {
    document.addEventListener('DOMContentLoaded', () => { if (initBanner()) return; });
  }

  // 2) Auf nachgeladenes Banner warten (via includes:ready oder MutationObserver)
  window.addEventListener('includes:ready', () => { initBanner(); });

  try {
    const mo = new MutationObserver(() => { initBanner() && mo.disconnect(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  } catch(_) {}
})();
