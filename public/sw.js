const CACHE_VERSION = 'v1';
const CORE_CACHE = `radikals-core-${CACHE_VERSION}`;
const RUNTIME_CACHE = `radikals-runtime-${CACHE_VERSION}`;

const CORE_ASSETS = [
  { url: '/', revision: '1' },
  { url: '/index.html', revision: '1' },
  { url: '/manifest.json', revision: '1' },
  { url: '/index.css', revision: '1' }
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE).then((cache) => {
      const requests = CORE_ASSETS.map((asset) =>
        new Request(`${asset.url}?rev=${asset.revision}`, { cache: 'reload' })
      );
      return cache.addAll(requests);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![CORE_CACHE, RUNTIME_CACHE].includes(key))
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

const isNavigationRequest = (request) => request.mode === 'navigate';

const isImmutableAsset = (request) => {
  const destination = request.destination;
  return (
    destination === 'style' ||
    destination === 'script' ||
    destination === 'image' ||
    destination === 'font' ||
    destination === 'worker'
  );
};

const shouldCache = (request) => {
  const url = new URL(request.url);
  return url.origin === self.location.origin;
};

const networkFirst = async (request) => {
  try {
    const response = await fetch(request);
    if (response && response.status === 200 && shouldCache(request)) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    return caches.match('/index.html?rev=1');
  }
};

const cacheFirst = async (request) => {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.status === 200 && shouldCache(request)) {
    cache.put(request, response.clone());
  }
  return response;
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (isNavigationRequest(request)) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isImmutableAsset(request)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});