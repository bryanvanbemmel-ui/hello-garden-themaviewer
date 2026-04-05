const CACHE_NAME = "app-cache-v6";

/* INSTALL */
self.addEventListener("install", event => {
  self.skipWaiting();
});

/* ACTIVATE */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => caches.delete(key))) // 🔥 alles weg
    )
  );
  self.clients.claim();
});

/* FETCH */
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // 🔥 JSON altijd live
  if (url.pathname.includes("data.json")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 🔥 CSS & JS NOOIT cachen
  if (
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".js")
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 🔥 overige gewoon live
  event.respondWith(fetch(event.request));
});
