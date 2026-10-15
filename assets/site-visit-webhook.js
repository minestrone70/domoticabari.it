/* Evento di visita per Home Assistant, indipendente dalle statistiche PocketBase. */
(() => {
  const host = location.hostname.toLowerCase();
  if (host !== 'domoticabari.it' && host !== 'www.domoticabari.it') return;
  const endpoint = 'https://wildcat.freeddns.org/api/webhook/-KOg46vLBrtUt85BbBE4igjBW';
  const payload = {
    timestamp: new Date().toISOString(),
    page: location.pathname,
    referer: document.referrer || ''
  };
  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
    credentials: 'omit'
  }).catch(() => {});
})();
