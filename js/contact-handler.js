document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#contactForm, #contact-form');
  if (!form) return;

  const $ = (sel) => form.querySelector(sel);
  const name    = $('#name, #cf-name');
  const email   = $('#email, #cf-email');
  const message = $('#message, #cf-message');
  const consent = $('#consent, #cf-consent');
  const submit  = form.querySelector('button[type="submit"]');
  const status  = document.getElementById('cf3-status') || (() => {
    const box = document.createElement('div');
    box.id = 'cf3-status'; box.className = 'cf3-status'; box.hidden = true;
    form.appendChild(box); return box;
  })();

  // Fallback: Redirect-Flag aus der URL verarbeiten (für No-JS Posts)
  try {
    const u = new URL(window.location.href);
    if (u.searchParams.get('sent') === '1') {
      showStatus('Vielen Dank! Ihre Nachricht wurde gesendet. Wir melden uns zeitnah.', false);
      u.searchParams.delete('sent');
      history.replaceState({}, '', u.pathname + u.hash);
    } else if (u.searchParams.get('error') === '1') {
      showStatus('Leider ist etwas schiefgelaufen. Bitte versuchen Sie es später erneut.', true);
      u.searchParams.delete('error');
      history.replaceState({}, '', u.pathname + u.hash);
    }
  } catch {}

  function showStatus(msg, isError){
    status.textContent = msg;
    status.hidden = false;
    status.classList.toggle('error', !!isError);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // ← verhindert Seitenwechsel

    const payload = {
      name: (name?.value || '').trim(),
      email: (email?.value || '').trim(),
      message: (message?.value || '').trim(),
      consent: !!(consent && (consent.checked || consent.value === 'on')),
      website: '' // Honeypot bleibt leer
    };

    if (!payload.name || !payload.email || !payload.message) {
      showStatus('Bitte Name, E-Mail und Anliegen ausfüllen.', true);
      return;
    }

    submit.disabled = true;
    const oldLabel = submit.textContent;
    submit.textContent = 'Senden …';

    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || !data.ok) throw new Error(data?.error || 'Senden fehlgeschlagen.');
      form.reset();
      showStatus('Vielen Dank! Ihre Nachricht wurde gesendet. Wir melden uns zeitnah.', false);
    } catch (err) {
      console.error(err);
      showStatus('Leider konnte die Nachricht nicht gesendet werden. Bitte versuchen Sie es später erneut.', true);
    } finally {
      submit.disabled = false;
      submit.textContent = oldLabel;
    }
  });
});
