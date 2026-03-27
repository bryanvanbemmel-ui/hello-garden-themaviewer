self.addEventListener("fetch", e => {

  // 👉 BELANGRIJK: html bestanden NIET cachen
  if (e.request.destination === "document") {
    e.respondWith(fetch(e.request));
    return;
  }

  // data.json altijd vers
  if (e.request.url.includes("data.json")) {
    e.respondWith(fetch(e.request));
    return;
  }

  // rest uit cache
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
