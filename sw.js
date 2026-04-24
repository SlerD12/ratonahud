const CACHE_NAME = 'monitor-v1';
const ASSETS = [
  'index.html',
  'style.css',
  'monitor.js',
  'manifest.json',
  'icon-192.png' // Agregamos el icono aquí para soporte offline
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
