/* Hypnos Prime — Service Worker */
const CACHE = 'hypnos-prime-v3';
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/css/styles.css',
  './assets/js/app.js',
  './assets/js/player.js',
  './assets/icons/logo.svg',
  './assets/icons/icon-192.svg',
  './assets/icons/icon-512.svg',
  './assets/icons/chakra-mente.svg',
  './assets/icons/chakra-consciente.svg',
  './assets/icons/chakra-subconsciente.svg',
  './assets/icons/chakra-equilibrio.svg',
  './assets/icons/chakra-transformacion.svg',
  './assets/img/sessions/portal.webp',
  './assets/img/sessions/abundance.webp',
  './assets/img/sessions/moon.webp',
  './assets/img/sessions/phoenix.webp',
  './assets/img/sessions/focus.webp',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Navigation: network-first, fallback a cache (index.html)
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((r) => {
        const copy = r.clone();
        caches.open(CACHE).then((c) => c.put('./index.html', copy));
        return r;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Same-origin estáticos: cache-first
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(req).then((cached) =>
        cached ||
        fetch(req).then((r) => {
          if (r.ok) {
            const copy = r.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return r;
        }).catch(() => cached)
      )
    );
    return;
  }

  // CDN (Tailwind, Google Fonts): stale-while-revalidate
  e.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((r) => {
        if (r.ok) {
          const copy = r.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return r;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
