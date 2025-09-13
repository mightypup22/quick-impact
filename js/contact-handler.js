// js/contact-handler.js — attach to your form (or merge into main.js)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#contactForm, #contact-form');
  if (!form) return;

  const $ = sel => form.querySelector(sel);
  const name    = $('#name, #cf-name');
  const email   = $('#email, #cf-email');
  const message = $('#message, #cf-message');
  const consent = $('#consent, #cf-consent');
  const submit  = form.querySelector('button[type="submit"]');

  // Optional honeypot
  let hp = form.querySelector('input[name="website"]');
  if (!hp) {
    hp = document.createElement('input');
    hp.type = 'text';
    hp.name = 'website';
    hp.autocomplete = 'off';
    hp.tabIndex = -1;
    hp.style.display = 'none';
    form.appendChild(hp);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      name: (name?.value||'').trim(),
      email: (email?.value||'').trim(),
      message: (message?.value||'').trim(),
      consent: !!(consent && (consent.checked || consent.value === 'on')),
      website: hp.value || ''
    };

    if (!payload.name || !payload.email || !payload.message) {
      alert('Bitte Name, E‑Mail und Anliegen ausfüllen.');
      return;
    }
    submit.disabled = true;
    submit.dataset.loading = '1';

    try{
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await resp.json().catch(()=>({}));
      if (!resp.ok || !data.ok) {
        throw new Error(data?.error || 'Senden fehlgeschlagen.');
      }
      form.reset();
      alert('Vielen Dank! Ihre Nachricht wurde gesendet.');
    }catch(err){
      console.error(err);
      alert('Leider konnte die Nachricht nicht gesendet werden. Bitte versuchen Sie es später erneut.');
    }finally{
      submit.disabled = false;
      delete submit.dataset.loading;
    }
  });
});
