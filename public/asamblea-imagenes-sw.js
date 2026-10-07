/* Solo guarda imágenes de Asamblea. HTML, JS, CSS, API y vídeo siguen en red. */
'use strict';
const CACHE='rosa-asamblea-imagenes-v1',MAX=64;
const base=new URL('assets/asamblea-ligera/',self.registration.scope);
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==base.origin||!url.pathname.startsWith(base.pathname)||!url.pathname.endsWith('.webp'))return;
 event.respondWith((async()=>{
   let cache;try{cache=await caches.open(CACHE);const saved=await cache.match(request);if(saved)return saved;}catch{}
   const response=await fetch(request);
   if(cache&&response.ok&&response.headers.get('Content-Type')?.startsWith('image/')){
     const copy=response.clone();event.waitUntil((async()=>{try{await cache.put(request,copy);const keys=await cache.keys();for(const key of keys.slice(0,Math.max(0,keys.length-MAX)))await cache.delete(key);}catch{}})());
   }
   return response;
 })());
});
