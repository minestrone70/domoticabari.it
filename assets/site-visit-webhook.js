/* Registro della visita in PocketBase; PocketBase aggiunge l'IP e inoltra l'evento a Home Assistant. */
(() => {
  'use strict';
  const host = location.hostname.toLowerCase();
  const publicHost = host === 'domoticabari.it' || host === 'www.domoticabari.it';
  const stagingHost = host === 'domoticabari.duckdns.org' && location.pathname.startsWith('/cantiere/');
  if (!publicHost && !stagingHost) return;

  const requestedPath = location.pathname;
  const pagePath = stagingHost ? (requestedPath.replace(/^\/cantiere(?=\/|$)/, '') || '/') : requestedPath;
  const page = pagePath === '/' ? '/index.html' : pagePath;
  const allowedPages = new Set(['/index.html', '/bnbready.html', '/casa-accessibile.html', '/chi-siamo.html', '/prezzi.html', '/privacy.html', '/bnb.html']);
  if (!allowedPages.has(page)) return;
  const endpoint = 'https://pocketbase.wildcat.freeddns.org/api/domoticabari/visit';
  const navigation = performance.getEntriesByType('navigation')[0];
  let referer = '';
  try {
    const source = new URL(document.referrer);
    referer = source.origin + source.pathname;
  } catch (_) { /* Empty referrer. */ }
  const device = matchMedia('(max-width: 600px)').matches ? 'mobile' :
    matchMedia('(max-width: 1024px)').matches ? 'tablet' : 'desktop';
  const payload = {
    page,
    uri: requestedPath,
    user_agent: navigator.userAgent || '',
    referer,
    device,
    status: navigation && Number.isInteger(navigation.responseStatus) ? navigation.responseStatus : 0
  };

  const homeAssistantFallback = () => {
    const fallbackPayload = { ...payload, timestamp: new Date().toISOString() };
    fetch('https://wildcat.freeddns.org/api/webhook/-KOg46vLBrtUt85BbBE4igjBW', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fallbackPayload),
      keepalive: true,
      credentials: 'omit'
    }).catch(() => {});
  };

  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
    credentials: 'omit'
  }).then(response => response.ok ? response.json() : Promise.reject(new Error('Visit logger unavailable')))
    .then(result => { if (!result.ha_forwarded) homeAssistantFallback(); })
    .catch(homeAssistantFallback);
})();
