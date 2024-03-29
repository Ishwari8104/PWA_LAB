// Ensure that the service worker script path is correct
const serviceWorkerPath = '/serviceworker.js';

const CACHE_NAME = 'ecommerce-store-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon.png',
    '/icon512.png',
    // Add more URLs to cache as needed for your application
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache opened');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(networkFirst(event.request));
});

self.addEventListener('sync', event => {
    if (event.tag === 'helloSync') {
        console.log("helloSync[sw.js]");
    }
});

self.addEventListener('push', function (event) {
    if (event && event.data) {
        var data = event.data.json();
        if (data.method == "pushMessage") {
            console.log("Push notification sent");
            event.waitUntil(
                self.registration.showNotification("My watch", {
                    body: data.message
                })
            );
        }
    }
});

async function networkFirst(req) {
    const cache = await caches.open("pwa-dynamic");
    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (error) {
        const cachedResponse = await cache.match(req);
        return cachedResponse || await caches.match("./noconnection.json");
    }
}

async function cacheFirst(req) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(req);
    return cachedResponse || fetch(req);
}
