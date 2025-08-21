const CACHE_NAME = 'latik-proposal-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;900&display=swap',
  'https://firebasestorage.googleapis.com/v0/b/drossmediapro.appspot.com/o/logo%20lati%20actual%202023%20(2)-04.png?alt=media&token=6a2bb838-c3a1-4162-b438-603bd74d836a'
];

// Install the service worker and cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  // We don't cache Supabase API requests to ensure data is always fresh.
  if (event.request.url.includes('supabase.co')) {
    return; // Let the browser handle it, bypassing the cache.
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache, fetch from network, cache it, and return
        return fetch(event.request).then(
          networkResponse => {
            // Check if we received a valid response.
            if(!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }
            
            // We only want to cache basic or CORS-enabled responses to avoid issues.
            if(networkResponse.type === 'basic' || networkResponse.type === 'cors'){
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, responseToCache);
                    });
            }

            return networkResponse;
          }
        );
      })
  );
});

// Clean up old caches on activation
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
