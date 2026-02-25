// js/contact-handler.js — v4 (global capture, no-redirect, robust)
(function(){
  if (window.__contactHandlerV4) return; // idempotent
  window.__contactHandlerV4 = true;

  function ensureStatusBox(form){
    let box = form.querySelector('#cf3-status, .cf3-status');
    if (!box){
      box = document.createElement('div');
      box.id = 'cf3-status';
      box.className = 'cf3-status';
      box.hidden = true;
      form.appendChild(box);
    }
    return box;
  }
  function show(form, msg, isError){
    const box = ensureStatusBox(form);
    box.textContent = msg;
    box.hidden = false;
    box.classList.toggle('error', !!isError);
  }

  // Enhance any matching form that appears later too
  const MATCH = 'form#contact-form, form#contactForm, form.contact-formv3';
  function primeForm(form){
    if (!form || form.__contactPrimed) return;
    form.__contactPrimed = true;
    // Progressive baseline (if JS fails, server still receives POST — optional)
    if (!form.getAttribute('action')) form.setAttribute('action', '/api/contact');
    form.setAttribute('method', 'post');
    form.setAttribute('novalidate', '');
    form.noValidate = true;
  }
  function primeExisting(){
    document.querySelectorAll(MATCH).forEach(primeForm);
  }

  // Prime existing forms ASAP
  if (document.readyState !== 'loading') primeExisting();
  else document.addEventListener('DOMContentLoaded', primeExisting, { once: true });

  // Prime forms added later
  try {
    const mo = new MutationObserver(primeExisting);
    mo.observe(document.documentElement, { childList:true, subtree:true });
  } catch(_){}

  // Document-level capture submit to beat any other listeners
  document.addEventListener('submit', (e) => {
    const form = e.target && e.target.closest && e.target.closest(MATCH);
    if (!form) return;

    // HARDEST STOP: prevent any navigation / other handlers
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();

    const q = (sel) => form.querySelector(sel);
    const name    = q('#name, #cf-name');
    const email   = q('#email, #cf-email');
    const message = q('#message, #cf-message');
    const consent = q('#consent, #cf-consent');
    const submit  = form.querySelector('button[type="submit"], input[type="submit"]');

    const payload = {
      name: (name && name.value || '').trim(),
      email: (email && email.value || '').trim(),
      message: (message && message.value || '').trim(),
      consent: !!(consent && (consent.checked || consent.value === 'on')),
      website: '' // honeypot intentionally empty
    };

    if (!payload.name || !payload.email || !payload.message){
      show(form, 'Bitte Name, E‑Mail und Anliegen ausfüllen.', true);
      return;
    }

    // UI state
    const revert = submit && (() => {
      const lbl = submit.tagName === 'BUTTON' ? submit.textContent : submit.value;
      submit.disabled = true;
      if (submit.tagName === 'BUTTON') submit.textContent = 'Senden …';
      else submit.value = 'Senden …';
      return () => {
        submit.disabled = false;
        if (submit.tagName === 'BUTTON') submit.textContent = lbl;
        else submit.value = lbl;
      };
    })();

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'manual' // do not follow redirects
    })
    .then(async (resp) => {
      let data = {};
      try { data = await resp.json(); } catch(_){}
      if (!resp.ok || !data?.ok) throw new Error(data?.error || 'Senden fehlgeschlagen.');
      form.reset();
      show(form, 'Vielen Dank! Ihre Nachricht wurde gesendet. Wir melden uns zeitnah.', false);
    })
    .catch((err) => {
      console.error('[contact-handler v4] send error', err);
      show(form, 'Leider konnte die Nachricht nicht gesendet werden. Bitte versuchen Sie es später erneut.', true);
    })
    .finally(() => { if (revert) revert(); });
  }, { capture: true, passive: false });

  // Optional: handle ?sent=1 / ?error=1 for legacy fallbacks
  document.addEventListener('DOMContentLoaded', () => {
    try {
      const u = new URL(window.location.href);
      const f = document.querySelector(MATCH);
      if (!f) return;
      if (u.searchParams.get('sent') === '1') {
        show(f, 'Vielen Dank! Ihre Nachricht wurde gesendet. Wir melden uns zeitnah.', false);
        u.searchParams.delete('sent');
        history.replaceState({}, '', u.pathname + u.hash);
      } else if (u.searchParams.get('error') === '1') {
        show(f, 'Leider ist etwas schiefgelaufen. Bitte versuchen Sie es später erneut.', true);
        u.searchParams.delete('error');
        history.replaceState({}, '', u.pathname + u.hash);
      }
    } catch(_){}
  });
})();