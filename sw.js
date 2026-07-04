/* Pokopia Tracker service worker: caches the app shell so it runs offline
   after the first visit. The app is a single self-contained index.html, so
   caching it is enough. Cross-origin images (sprites / habitat art) are left
   to the network and simply hide when offline. */
const CACHE = "pokopia-shell-v1";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest",
                "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];
self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.allSettled(ASSETS.map((a) => c.add(a)));
    self.skipWaiting();
  })());
});
self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    self.clients.claim();
  })());
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // cross-origin images -> network
  e.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const resp = await fetch(req);
      const c = await caches.open(CACHE);
      c.put(req, resp.clone());
      return resp;
    } catch (err) {
      return (await caches.match("./index.html")) || Response.error();
    }
  })());
});
