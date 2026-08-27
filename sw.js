// Service Worker - 体系工程师工作台 PWA
// v63: 彻底解决缓存问题——不缓存 index.html，确保新版本一定被加载
const CACHE_NAME = 'qms-workbench-v63';
// 只缓存静态资源，不缓存 index.html（确保每次都加载最新版）
const CACHE_FILES = [
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_FILES).catch(()=>{}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// 请求拦截：HTML 文件永远网络优先且不缓存（确保最新版），其他资源网络优先缓存
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  // 判断是否是 HTML 请求（index.html 或根路径）
  const isHtml = url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('/index.html');
  
  if (isHtml) {
    // HTML：永远从网络获取，不缓存（确保最新版一定被加载）
    event.respondWith(
      fetch(event.request).catch(() => caches.match('./index.html').then(c => c || caches.match('./')))
    );
  } else {
    // 其他资源：网络优先，失败回退缓存
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok && url.origin === location.origin) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone).catch(()=>{}));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
});
