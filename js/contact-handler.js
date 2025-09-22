// js/contact-handler.js — v6 (global capture, no-redirect, consent must be checked)
(function(){
  if (window.__contactHandlerV6) return; window.__contactHandlerV6 = true;

  const MATCH = 'form#contact-form, form#contactForm, form.contact-formv3';

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
    try{ box.scrollIntoView({behavior:'smooth', block:'nearest'}); }catch(_){}
  }

  function primeForm(form){
    if (!form || form.__contactPrimed) return;
    form.__contactPrimed = true;
    if (!form.getAttribute('action')) form.setAttribute('action', '/api/contact');
    form.setAttribute('method', 'post');
    form.setAttribute('novalidate', '');
    form.noValidate = true;
  }
  function primeExisting(){ document.querySelectorAll(MATCH).forEach(primeForm); }

  if (document.readyState !== 'loading') primeExisting();
  else document.addEventListener('DOMContentLoaded', primeExisting, { once: true });

  try { new MutationObserver(primeExisting).observe(document.documentElement, { childList:true, subtree:true }); } catch(_){}

  document.addEventListener('submit', (e) => {
    const form = e.target && e.target.closest && e.target.closest(MATCH);
    if (!form) return;

    // Hard stop: never navigate
    e.preventDefault(); e.stopImmediatePropagation(); e.stopPropagation();

    const q = (sel) => form.querySelector(sel);
    const nameEl    = q('#name, #cf-name, input[name="name"]');
    const emailEl   = q('#email, #cf-email, input[name="email"]');
    const messageEl = q('#message, #cf-message, textarea[name="message"], textarea[name="anliegen"]');
    const consentEl = q('#consent, #cf-consent, input[name="consent"]');
    const submitEl  = form.querySelector('button[type="submit"], input[type="submit"]');

    const payload = {
      name: (nameEl && nameEl.value || '').trim(),
      email: (emailEl && emailEl.value || '').trim(),
      message: (messageEl && messageEl.value || '').trim(),
      // IMPORTANT: only treat as true when actually checked
      consent: !!(consentEl && consentEl.checked),
      website: '' // honeypot intentionally empty client-side
    };

    // reset visual error state
    const consentField = consentEl ? (consentEl.closest('.field') || consentEl.parentElement) : null;
    if (consentField) consentField.classList.remove('invalid');

    // basic validation
    if (!payload.name || !payload.email || !payload.message){
      show(form, 'Bitte Name, E-Mail und Anliegen ausfüllen.', true);
      return;
    }
    if (!payload.consent){
      if (consentField) consentField.classList.add('invalid');
      show(form, 'Bitte Einwilligung bestätigen.', true);
      try{ consentEl && consentEl.focus(); }catch(_){}
      try{
        consentEl && consentEl.addEventListener('change', () => {
          consentField && consentField.classList.remove('invalid');
        }, { once: true });
      }catch(_){}
      return;
    }

    // UI busy state
    const revert = submitEl && (() => {
      const isBtn = submitEl.tagName === 'BUTTON';
      const label = isBtn ? submitEl.textContent : submitEl.value;
      submitEl.disabled = true;
      if (isBtn) submitEl.textContent = 'Senden …'; else submitEl.value = 'Senden …';
      return () => {
        submitEl.disabled = false;
        if (isBtn) submitEl.textContent = label; else submitEl.value = label;
      };
    })();

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'manual'
    })
    .then(async (resp) => {
      let data = {}; try { data = await resp.json(); } catch(_){}
      if (!resp.ok || !data?.ok) throw new Error(data?.error || 'Senden fehlgeschlagen.');
      form.reset();
      if (consentField) consentField.classList.remove('invalid');
      show(form, 'Vielen Dank! Ihre Nachricht wurde gesendet. Wir melden uns zeitnah.', false);

      // >>> GTM Conversion Event (NUR bei echtem Erfolg)
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'leadFormSubmitted',
        formName: 'Kontakt',
        formId: (form.id || 'contact-form'),
        formLocation: window.location.pathname
      });
      // <<< Ende GTM Block
    })
    .catch((err) => {
      console.error('[contact-handler v6] send error', err);
      show(form, 'Leider konnte die Nachricht nicht gesendet werden. Bitte versuchen Sie es später erneut.', true);
      // Optional: Fehler-Event fürs Debugging
      // window.dataLayer = window.dataLayer || [];
      // window.dataLayer.push({ event: 'leadFormError' });
    })
    .finally(() => { if (revert) revert(); });
  }, { capture: true, passive: false });

})();
