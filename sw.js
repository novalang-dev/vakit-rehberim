const CACHE_NAME = 'vakit-rehberim-v1.1'; // Sürümü artırdık ki eski önbelleği temizlesin
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/style.css',
  '/js/app.js',
  '/js/db.js',
  '/js/motor.js',
  '/js/icerikler.js',
  '/js/zikirmatik.js',
  '/assets/imsak.jpg',
  '/assets/sabah.jpg',
  '/assets/ogle.jpg',
  '/assets/ikindi.jpg',
  '/assets/aksam.jpg',
  '/assets/yatsi.jpg'
];

self.addEventListener('install', e => {
  self.skipWaiting(); // Bekleme, hemen aktif ol
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

// --- BİLDİRİM YAKALAMA ---
self.addEventListener('push', function(event) {
  let data = { title: 'Vakit Rehberim', body: 'Namaz vakti yaklaşıyor!' };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: 'assets/icon-192.png',
    badge: 'assets/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: '/' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});