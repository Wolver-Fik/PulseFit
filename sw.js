// Guarda la app en el dispositivo para que abra sin conexión.
// Si cambiás algún archivo, subí la versión nueva y cambiá el número de CACHE para que se actualice.
var CACHE = 'pulsefit-v6';
var SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(SHELL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(
          keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })
        );
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  var url = new URL(req.url);

  // Network-First para peticiones de navegación y archivos HTML
  var isHtmlOrNav = req.mode === 'navigate' ||
                    req.destination === 'document' ||
                    (req.headers.get('accept') && req.headers.get('accept').indexOf('text/html') !== -1) ||
                    url.pathname.endsWith('.html') ||
                    url.pathname === '/' ||
                    url.pathname.endsWith('/');

  if (isHtmlOrNav) {
    e.respondWith(
      fetch(req)
        .then(function (res) {
          if (res && res.ok) {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) { c.put(req, copy); });
          }
          return res;
        })
        .catch(function () {
          return caches.match(req).then(function (hit) {
            if (hit) return hit;
            return caches.match('./index.html').then(function (fallback) {
              return fallback || caches.match('./');
            });
          });
        })
    );
    return;
  }

  // Cache-First para los iconos
  var isIcon = url.pathname.indexOf('icon') !== -1 ||
               url.pathname.endsWith('.ico') ||
               url.pathname.endsWith('.png') ||
               req.destination === 'image';

  if (isIcon) {
    e.respondWith(
      caches.match(req).then(function (hit) {
        if (hit) return hit;
        return fetch(req).then(function (res) {
          if (res && res.ok) {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) { c.put(req, copy); });
          }
          return res;
        });
      })
    );
    return;
  }

  // Resto de recursos de la app (ej: manifest.webmanifest)
  e.respondWith(
    caches.match(req).then(function (hit) {
      var net = fetch(req)
        .then(function (res) {
          if (res && res.ok) {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) { c.put(req, copy); });
          }
          return res;
        })
        .catch(function () { return hit; });
      return hit || net;
    })
  );
});
