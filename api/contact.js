// /api/contact.js — Vercel Serverless Function (Node 18+)
// Env Vars (Vercel → Project → Settings → Environment Variables):
// RESEND_API_KEY (required)
// MAIL_TO        (required)   ← Zieladresse, die Mails erhalten soll
// MAIL_FROM      (recommended) z.B. "Quick Impact <kontakt@quick-impact.de>" oder testweise "onboarding@resend.dev"
// ALLOWED_ORIGINS (optional)   z.B. "https://quick-impact.de,https://www.quick-impact.de,https://quick-impact.vercel.app"

function json(res, status, data){
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

function allowOrigin(req, res){
  const origin = req.headers.origin || '';
  const allowed = (process.env.ALLOWED_ORIGINS || '')
    .split(',').map(s => s.trim()).filter(Boolean);
  if (allowed.length && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function parseBody(req, raw){
  const ct = (req.headers['content-type'] || '').toLowerCase();
  if (ct.includes('application/json')) {
    try { return JSON.parse(raw || '{}'); } catch { return {}; }
  }
  if (ct.includes('application/x-www-form-urlencoded')) {
    const p = new URLSearchParams(raw || '');
    const obj = {};
    p.forEach((v,k)=>{ obj[k] = v; });
    return obj;
  }
  // Fallback: versuche JSON
  try { return JSON.parse(raw || '{}'); } catch { return {}; }
}

function toBool(v){
  if (v === true) return true;
  const s = String(v || '').toLowerCase();
  return s === 'true' || s === 'on' || s === '1' || s === 'yes' || s === 'ja';
}

module.exports = async (req, res) => {
  allowOrigin(req, res);

  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (req.method !== 'POST')    { return json(res, 405, { ok:false, error:'Method not allowed' }); }

  try{
    // Body lesen
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const raw  = Buffer.concat(chunks).toString('utf8');
    const body = parseBody(req, raw);

    // Felder
    const name    = (body.name || '').toString().trim();
    const email   = (body.email || '').toString().trim();
    const message = (body.message || body.anliegen || '').toString().trim();
    const consent = toBool(body.consent);
    const hp      = (body.website || '').toString().trim(); // Honeypot

    // Validierung
    if (hp) return json(res, 200, { ok:true, message:'Thanks.' }); // Bot ignoriert
    if (!name || !email || !message) return json(res, 400, { ok:false, error:'Bitte Name, E-Mail und Anliegen ausfüllen.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(res, 400, { ok:false, error:'Bitte eine gültige E-Mail angeben.' });
    if (!consent) return json(res, 400, { ok:false, error:'Bitte Einwilligung bestätigen.' });

    // Env Vars
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const MAIL_TO        = process.env.MAIL_TO || '';
    const MAIL_FROM      = process.env.MAIL_FROM || 'onboarding@resend.dev';
    if (!RESEND_API_KEY) return json(res, 500, { ok:false, error:'Server: RESEND_API_KEY fehlt.' });
    if (!MAIL_TO)        return json(res, 500, { ok:false, error:'Server: MAIL_TO ist nicht gesetzt.' });

    // Meta
    const ua = req.headers['user-agent'] || '';
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket?.remoteAddress || '';

    // Mail
    const subject = `Neue Kontaktanfrage · Quick Impact (${name})`;
    const html = `
      <style>
      .box{font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;line-height:1.5;color:#0f172a}
      .muted{color:#475569;font-size:12px}
      .row{margin:6px 0}
      strong{color:#0b3b2f}
      </style>
      <div class="box">
        <h2>${subject}</h2>
        <div class="row"><strong>Name:</strong> ${escapeHtml(name)}</div>
        <div class="row"><strong>E-Mail:</strong> ${escapeHtml(email)}</div>
        <div class="row"><strong>Einverständnis:</strong> ${consent ? 'ja' : 'nein'}</div>
        <div class="row"><strong>Nachricht:</strong><br>${escapeHtml(message).replace(/\n/g,'<br>')}</div>
        <hr>
        <div class="muted">IP: ${escapeHtml(ip)} · UA: ${escapeHtml(ua)}</div>
      </div>
    `;
    const text = `Neue Kontaktanfrage
Name: ${name}
E-Mail: ${email}
Einverständnis: ${consent?'ja':'nein'}

Nachricht:
${message}

IP: ${ip}
UA: ${ua}
`;

    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: [MAIL_TO],
        reply_to: email, // string ist OK
        subject,
        html,
        text
      })
    });

    const data = await resp.json().catch(()=>null);
    if (!resp.ok) {
      console.error('Resend error:', data);
      return json(res, 502, { ok:false, error:'Email-Versand fehlgeschlagen.', detail:data });
    }

    return json(res, 200, { ok:true, id: data?.id || null });
  }catch(err){
    console.error(err);
    return json(res, 500, { ok:false, error:'Unerwarteter Serverfehler.' });
  }
};

// HTML-escape
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, ch => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;' }[ch]));
}
