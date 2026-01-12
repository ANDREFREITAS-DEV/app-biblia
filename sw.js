const CACHE_NAME = 'biblia-pwa-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/src/app.js',
  '/src/config.js',
  '/src/ui/home.ui.js',
  '/src/ui/bible.ui.js',
  '/src/api/bible.api.js',
  '/src/api/daily.api.js',
  '/src/store/progress.store.js',
  '/src/store/favorites.store.js',
  '/src/utils/share.js',
  '/assets/icons/icon-192.png'
];

// Instalação: Cacheia o App Shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

// Ativação: Limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
});

// Fetch: Stale-while-revalidate strategy
self.addEventListener('fetch', event => {
  // Ignora requisições do Supabase para o cache do SW (deixe o browser cachear ou trate separadamente)
  if (event.request.url.includes('supabase.co')) {
      return; 
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );
});