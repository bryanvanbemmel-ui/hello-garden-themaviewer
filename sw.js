self.addEventListener("install", e => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);

  // altijd verse data.json
  if (url.pathname.includes("data.json")) {
    e.respondWith(fetch(e.request));
    return;
  }

  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
