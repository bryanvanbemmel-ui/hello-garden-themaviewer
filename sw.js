const CACHE_NAME = "app-cache-v2";

/* INSTALL */
self.addEventListener("install", event => {
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

  // 🔥 data.json ALTIJD LIVE
  if (url.pathname.includes("data.json")) {
    event.respondWith(fetch(event.request, { cache: "no-store" }));
    return;
  }

  // 🔥 HTML ALTIJD LIVE (BELANGRIJK)
  if (event.request.destination === "document") {
    event.respondWith(fetch(event.request));
    return;
  }

  // overige bestanden
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
