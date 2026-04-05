const CACHE_NAME = "app-cache-v5"; // 🔥 versie verhogen!

const urlsToCache = [
  "/hello-garden-themaviewer/",
  "/hello-garden-themaviewer/index.html",
  "/hello-garden-themaviewer/style.css",
  "/hello-garden-themaviewer/script.js",
  "/hello-garden-themaviewer/icon.png"
];

/* INSTALL */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

/* ACTIVATE */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // 🔥 oude cache weg
          }
        })
      )
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

  // 🔥 CSS & JS altijd vers ophalen
  if (
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".js")
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // overige: cache
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
