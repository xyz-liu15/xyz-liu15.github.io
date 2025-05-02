const CACHE_VERSION = 'v1';
const CACHE_NAME = 'fixit-' + CACHE_VERSION;
const OFFLINE_URL = '/offline/';

// 需要缓存的资源列表
const BASE_CACHE_FILES = [
  '/',
  '/offline/',
  '/css/style.min.css',
  '/js/theme.min.js',
  '/favicon.ico',
  '/site.webmanifest',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png'
];

// 安装service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(BASE_CACHE_FILES);
    })
  );
});

// 激活service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 处理fetch请求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});