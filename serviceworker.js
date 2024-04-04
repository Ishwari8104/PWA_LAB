// Ensure that the service worker script path is correct
const serviceWorkerPath = '/serviceworker.js';

const CACHE_NAME = 'ecommerce-store-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon.png',
    '/icon512.png',
    './styles.css'
    // Add more URLs to cache as needed for your application
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache)
                            .catch(error => {
                                console.error('Failed to add URLs to cache:', error);
                            });
            })
    );
});

self.addEventListener('activate', event => {
event.waitUntil(
caches.keys().then(cacheNames => {
return Promise.all(
cacheNames.map(cacheName => {
if (cacheName !== CACHE_NAME) {
return caches.delete(cacheName);
}
})
);
})
);
});
self.addEventListener('fetch', event => {
event.respondWith(
caches.match(event.request)
.then(response => {
if (response) {
return response;
}
return fetch(event.request)
.then(response => {
if (!response || response.status !== 200 ||
response.type !== 'basic') {
return response;
}
const responseToCache = response.clone();
caches.open(CACHE_NAME)
.then(cache => {
cache.put(event.request, responseToCache);
});
return response;
});
})
);
});
self.addEventListener('push', event => {
const title = 'E-commerce';
const options = {
body: event.data.text()
};
event.waitUntil(
self.registration.showNotification(title, options)
);
});
self.addEventListener('sync', event => {
if (event.tag === 'sync-products') {
event.waitUntil(syncProducts());
}
});
function syncProducts() {
// Implement syncing logic here
console.log('Syncing products...');
}
