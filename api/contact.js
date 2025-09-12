const { Resend } = require('resend');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Method Not Allowed' });
  try{
    let data = {};
    const ct = (req.headers['content-type'] || '').toLowerCase();
    if (ct.includes('application/json')) {
      data = req.body || {};
    } else {
      const chunks = [];
      for await (const ch of req) chunks.push(ch);
      const body = Buffer.concat(chunks).toString('utf8');
      data = Object.fromEntries(new URLSearchParams(body));
    }
    const { name, email, message, consent, website } = data;
    if (website) return res.status(200).json({ ok:true, spam:true });
    if (!name || !email || !message || !consent) {
      return res.status(400).json({ ok:false, error:'Bitte alle Felder ausfüllen und Einverständnis erteilen.' });
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.CONTACT_FROM,
      to: process.env.CONTACT_TO,
      reply_to: email,
      subject: `Neue Anfrage – Quick Impact (${name})`,
      text: `Name: ${name}\nE-Mail: ${email}\n\nAnliegen:\n${message}`
    });
    return res.status(200).json({ ok:true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok:false, error:'Serverfehler beim Versand.' });
  }
};
