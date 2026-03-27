const CACHE = "garden-v1";

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./script.js",
        "./data.json"
      ])
    )
  );
});

self.addEventListener("fetch", e => {

  const url = new URL(e.request.url);

  // 👉 HTML bestanden ALTIJD direct laden (BELANGRIJK!)
  if (e.request.destination === "document") {
    e.respondWith(fetch(e.request));
    return;
  }

  // 👉 data.json altijd vers
  if (url.pathname.endsWith("data.json")) {
    e.respondWith(fetch(e.request));
    return;
  }
});
