// js/contact-handler.js — hard no-redirect version (v3)
(function(){
  function onReady(fn){
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn, { once: true });
  }

  onReady(() => {
    const form = document.querySelector('#contactForm, #contact-form');
    if (!form) return;
    console.debug('[contact-handler] init on', form);

    // Ensure progressive enhancement baseline
    if (!form.getAttribute('action')) form.setAttribute('action', '/api/contact');
    form.setAttribute('method', 'post');
    form.setAttribute('novalidate', '');
    form.noValidate = true;

    // Status box
    let status = document.getElementById('cf3-status');
    if (!status) {
      status = document.createElement('div');
      status.id = 'cf3-status';
      status.className = 'cf3-status';
      status.hidden = true;
      form.appendChild(status);
    }
    function show(msg, isError){
      status.textContent = msg;
      status.hidden = false;
      status.classList.toggle('error', !!isError);
    }

    const $ = (sel) => form.querySelector(sel);
    const name    = $('#name, #cf-name');
    const email   = $('#email, #cf-email');
    const message = $('#message, #cf-message');
    const consent = $('#consent, #cf-consent');
    const submit  = form.querySelector('button[type="submit"]');

    // Handle legacy URL flags (?sent=1 / ?error=1) gracefully
    try {
      const u = new URL(window.location.href);
      if (u.searchParams.get('sent') === '1') {
        show('Vielen Dank! Ihre Nachricht wurde gesendet. Wir melden uns zeitnah.', false);
        u.searchParams.delete('sent');
        history.replaceState({}, '', u.pathname + u.hash);
      } else if (u.searchParams.get('error') === '1') {
        show('Leider ist etwas schiefgelaufen. Bitte versuchen Sie es später erneut.', true);
        u.searchParams.delete('error');
        history.replaceState({}, '', u.pathname + u.hash);
      }
    } catch {}

    // Capture-phase listener prevents any default navigation
    form.addEventListener('submit', (e) => {
      // Hard stop all native/other listeners
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();

      const payload = {
        name: (name?.value || '').trim(),
        email: (email?.value || '').trim(),
        message: (message?.value || '').trim(),
        consent: !!(consent && (consent.checked || consent.value === 'on')),
        website: '' // honeypot left empty
      };

      if (!payload.name || !payload.email || !payload.message) {
        show('Bitte Name, E‑Mail und Anliegen ausfüllen.', true);
        return;
      }

      if (submit) {
        submit.disabled = true;
        submit.dataset.loading = '1';
      }

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        redirect: 'manual' // do not follow server redirects
      })
      .then(async (resp) => {
        let data = {};
        try { data = await resp.json(); } catch(_){}
        if (!resp.ok || !data?.ok) throw new Error(data?.error || 'Senden fehlgeschlagen.');
        form.reset();
        show('Vielen Dank! Ihre Nachricht wurde gesendet. Wir melden uns zeitnah.', false);
      })
      .catch((err) => {
        console.error('[contact-handler] send error', err);
        show('Leider konnte die Nachricht nicht gesendet werden. Bitte versuchen Sie es später erneut.', true);
      })
      .finally(() => {
        if (submit) {
          submit.disabled = false;
          delete submit.dataset.loading;
        }
      });
    }, { capture: true, passive: false });
  });
})();