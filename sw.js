const V="cmasr2-v3",F=["./","index.html","style.css","data.js","core.js","pdf.js","app.js","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Red primero: si hay internet siempre se baja la versión más nueva; sin internet usa la copia guardada.
self.addEventListener("fetch",e=>{const q=e.request;if(q.method!="GET"||new URL(q.url).origin!=location.origin)return;
e.respondWith(fetch(q,{cache:"no-store"}).then(r=>{if(r.ok){const c=r.clone();caches.open(V).then(x=>x.put(q,c))}return r}).catch(()=>caches.match(q,{ignoreSearch:true}).then(r=>r||caches.match("./"))))});
