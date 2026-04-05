self.addEventListener("install", e => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const url = new URL(e.self.addEventListener("install", event => {
  // meteen actief worden
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  // oude service workers vervangen
  event.waitUntil(self.clients.claim());
});

/* FETCH */
self.addEventListener("fetch", event => {

  const url = new URL(event.request.url);

  // 🔥 data.json ALTIJD LIVE (heel belangrijk voor jou)
  if (url.pathname.includes("data.json")) {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
    );
    return;
  }

  // 🔥 HTML altijd vers laden (voorkomt oude versie app)
  if (event.request.destination === "document") {
    event.respondWith(fetch(event.request));
    return;
  }

  // 🔹 overige bestanden (css/js/img)
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});request.url);

  // altijd verse data.json
  if (url.pathname.includes("data.json")) {
    e.respondWith(fetch(e.request));
    return;
  }

  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
