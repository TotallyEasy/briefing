var CACHE = 'bulletin-v1';
self.addEventListener('install', function() { self.skipWaiting(); });
self.addEventListener('activate', function(e) { e.waitUntil(clients.claim()); });
self.addEventListener('fetch', function(e) {
    if (e.request.method !== 'GET') return;
    var url = new URL(e.request.url);
    if (url.pathname.indexOf('/api/') === 0) return;
    e.respondWith(
        fetch(e.request).then(function(resp) {
            if (resp.ok && !url.search) {
                var copy = resp.clone();
                caches.open(CACHE).then(function(c) { c.put(e.request, copy); });
            }
            return resp;
        }).catch(function() {
            return caches.match(e.request, { ignoreSearch: true });
        })
    );
});
