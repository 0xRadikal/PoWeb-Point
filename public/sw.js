const CACHE_VERSION = 'v1';
const CORE_CACHE = `radikals-core-${CACHE_VERSION}`;
const RUNTIME_CACHE = `radikals-runtime-${CACHE_VERSION}`;

// Only the app shell that is guaranteed to exist in the build output. Styling
// is delivered via the Tailwind CDN, so there is no local /index.css to cache.
// Hashed JS/CSS chunks are cached at runtime (cacheFirst) rather than listed
// here, because their names change every build.
const CORE_ASSETS = [
  { url: '/', revision: '1' },
  { url: '/index.html', revision: '1' },
  { url: '/manifest.webmanifest', revision: '1' }
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE).then((cache) =>
      // Add assets individually so one missing/404 asset cannot abort the whole
      // install (cache.addAll is atomic and would leave the SW uninstalled).
      Promise.all(
        CORE_ASSETS.map((asset) => {
          const request = new Request(`${asset.url}?rev=${asset.revision}`, { cache: 'reload' });
          return cache.add(request).catch((error) => {
            console.warn('[sw] Failed to precache asset, skipping:', asset.url, error);
          });
        })
      )
    )
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
  } catch {
    // Network failed (e.g. offline). Fall back to the runtime cache, then to
    // the cached app shell so navigations still work offline.
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