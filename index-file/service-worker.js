const cacheName = 'v1';
const cacheAssets = [
  'index.html',
  'style.css',
  'script.js',
  'resources/images/schoolphoto.jpg',
  'resources/images/schoolphoto1.jpeg',
  'resources/images/man.jpg',
  'resources/images/woman.jpg',
  'resources/images/picture4-transformed.jpeg',
  'resources/images/picture4-transformed-m.jpeg',
  'resources/images/Malala-Yousafzai.jpg',
  'resources/images/Malala-Yousafzai-M.jpg',
  'resources/images/abdul-kalam-hd.jpg',
  'resources/images/APJ-ABDUL-KALAM.jpg',
  'resources/images/mahatma-gandhi-1920-x-1171.jpg',
  'resources/images/GANDHI-MOBILE.jpg',
  'resources/images/HELEN-KELER.jpg',
  'resources/images/helen-keller-MOBILE.jpg',
  'resources/images/benjamin-franklin-hd.jpg',
  'resources/images/benjamin-franklin-portrait.jpg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('Service Worker: Caching Files');
      return cache.addAll(cacheAssets);
    }).then(() => {
      self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({ type: 'CACHE_COMPLETE' }));
      });
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (e) => {
  console.log('Service Worker: Activated');

  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  console.log('Service Worker: Fetching');
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
