var CACHE = "lepont2026-v1";
var FILES = ["./", "./index.html", "./manifest.json",
             "./apple-touch-icon.png", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(FILES); }));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.map(function(k){ if(k!==CACHE) return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener("fetch", function(e){
  if(e.request.method!=="GET") return;
  e.respondWith(
    caches.match(e.request).then(function(r){
      if(r) return r;
      return fetch(e.request).then(function(res){
        var copy=res.clone();
        caches.open(CACHE).then(function(c){ try{c.put(e.request,copy);}catch(err){} });
        return res;
      }).catch(function(){ return caches.match("./index.html"); });
    })
  );
});
