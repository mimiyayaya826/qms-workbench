// Service Worker - 体系工程师工作台 PWA
const CACHE_NAME = 'qms-workbench-v37';
const CACHE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

// 安装：缓存核心文件
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_FILES).catch(()=>{}))
  );
  self.skipWaiting();
});

// 激活：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// 请求拦截：网络优先（始终尝试拉取最新版本，修复旧缓存导致页面停留在旧版的 bug），
// 网络失败时回退缓存（保证离线可用）。
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 成功则更新缓存（仅同源、成功响应）
        if (response.ok && url.origin === location.origin) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone).catch(()=>{}));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html')))
  );
});
