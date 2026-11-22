/* Service Worker BukuKu
   - App shell : cache dulu, perbarui di latar belakang
   - API (.php) : jaringan dulu, cadangan dari cache saat offline
   Ubah CACHE (v1 -> v2) setiap kali kamu mengubah file aplikasi. */
const CACHE = 'bukuku-v1';
const SHELL = [
  './', './index.html', './style.css', './app.js', './config.js',
  './manifest.webmanifest', './data/data.json',
  './icons/icon-192.png', './icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const simpan = (req, res) => {
  if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
  return res;
};

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // API / lintas-origin: network first
  if (url.origin !== location.origin || url.pathname.endsWith('.php')) {
    e.respondWith(
      fetch(req).then(res => simpan(req, res)).catch(() => caches.match(req))
    );
    return;
  }

  // App shell: stale-while-revalidate
  e.respondWith(
    caches.match(req).then(cached => {
      const net = fetch(req).then(res => simpan(req, res)).catch(() => cached);
      return cached || net;
    })
  );
});
