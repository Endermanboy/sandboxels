self.addEventListener('fetch', function(event) {
    if(!event.request.url.startsWith('http')){
      return
    }
    
    // Don't cache favicon or manifest requests
    if (event.request.url.includes('favicon') || event.request.url.includes('manifest.json')) {
      return;
    }
    
    event.respondWith(async function() {
       try{
         var res = await fetch(event.request);
         var cache = await caches.open('cache');
         cache.put(event.request.url, res.clone());
         return res;
       }
       catch(error){
         return caches.match(event.request);
        }
      }());
  });
