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

  // 👉 data.json NOOIT cachen (belangrijk!)
  if (url.pathname.endsWith("data.json")) {
    e.respondWith(
      fetch(e.request, { cache: "no-store" })
    );
    return;
  }

  // 👉 HTML ook niet cachen (anders blijf je hangen)
  if (e.request.destination === "document") {
    e.respondWith(fetch(e.request));
    return;
  }

  // 👉 rest mag cache gebruiken
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );

});
