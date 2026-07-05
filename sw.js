/* Pokopia Tracker service worker — app shell only, network for the rest. */
const CACHE = "pokopia-shell-v4";
const ASSETS = ["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",(e)=>{e.waitUntil((async()=>{const c=await caches.open(CACHE);await Promise.allSettled(ASSETS.map(a=>c.add(a)));self.skipWaiting();})());});
self.addEventListener("activate",(e)=>{e.waitUntil((async()=>{const ks=await caches.keys();await Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)));self.clients.claim();})());});
self.addEventListener("fetch",(e)=>{const req=e.request;if(req.method!=="GET")return;const url=new URL(req.url);if(url.origin!==location.origin)return;
  e.respondWith((async()=>{const cached=await caches.match(req);if(cached)return cached;try{return await fetch(req);}catch(_){return (await caches.match("./index.html"))||Response.error();}})());});
