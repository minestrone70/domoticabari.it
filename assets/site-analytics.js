(() => {
  'use strict';
  if (!['www.domoticabari.it', 'domoticabari.it'].includes(location.hostname)) return;

  const endpoint = 'https://pocketbase.wildcat.freeddns.org/api/domoticabari/analytics';
  const page = location.pathname === '/' ? '/index.html' : location.pathname;
  const allowedPages = new Set(['/index.html', '/bnbready.html', '/casa-accessibile.html', '/chi-siamo.html', '/prezzi.html', '/bnb.html', '/privacy.html']);
  if (!allowedPages.has(page)) return;

  const device = matchMedia('(max-width: 600px)').matches ? 'mobile' :
    matchMedia('(max-width: 1024px)').matches ? 'tablet' : 'desktop';
  const sections = [...document.querySelectorAll('main section[id]')]
    .filter(element => /^[a-z0-9-]{1,64}$/.test(element.id));
  let current = null;
  let enteredAt = 0;
  let pageEnteredAt = 0;
  let pageActive = false;
  let timer = 0;

  function durationBucket(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    if (seconds < 10) return 'under_10s';
    if (seconds < 30) return '10_30s';
    if (seconds < 60) return '30_60s';
    if (seconds < 180) return '1_3m';
    return 'over_3m';
  }

  function send(event, section, duration, leaving = false) {
    const body = JSON.stringify({ page, section, event, device, ...(duration ? { duration } : {}) });
    if (leaving && navigator.sendBeacon) {
      try {
        if (navigator.sendBeacon(endpoint, new Blob([body], { type: 'application/json' }))) return;
      } catch (_) { /* Fall back to keepalive. */ }
    }
    fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, mode: 'cors', keepalive: true, credentials: 'omit' }).catch(() => {});
  }

  function selectedSection() {
    const marker = innerHeight * 0.45;
    let nearest = null;
    let distance = Infinity;
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) continue;
      const delta = rect.top <= marker && rect.bottom >= marker ? 0 : Math.min(Math.abs(rect.top - marker), Math.abs(rect.bottom - marker));
      if (delta < distance) { distance = delta; nearest = section.id; }
    }
    return nearest;
  }

  function update() {
    if (document.visibilityState === 'hidden') return;
    if (!pageActive) {
      pageActive = true;
      pageEnteredAt = performance.now();
      send('view', 'pagina');
    }
    const next = selectedSection();
    if (next === current) return;
    const now = performance.now();
    if (current) send('exit', current, durationBucket(now - enteredAt));
    current = next;
    enteredAt = now;
    if (current) send('view', current);
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(update, 180);
  }

  function leave() {
    clearTimeout(timer);
    if (current) send('exit', current, durationBucket(performance.now() - enteredAt), true);
    current = null;
    if (pageActive) send('exit', 'pagina', durationBucket(performance.now() - pageEnteredAt), true);
    pageActive = false;
  }

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  addEventListener('hashchange', schedule);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') leave();
    else update();
  });
  addEventListener('pagehide', leave);
  update();
})();
