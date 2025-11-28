// bump this to force clients to refresh cached assets when we deploy
const CACHE_NAME = "ebloombilya-v2";
const ASSETS = [
	"/",
	"/index.html",
	"/styles.css",
	"/script.js",
	"/manifest.json",
	"/images/bloombilya.png",
	"/images/AIAH.png",
	"/images/COLET.png",
	"/images/GWEN.png",
	"/images/JHOANNA.png",
	"/images/MALOI.png",
	"/images/MIKHA.png",
	"/images/SHEENA.png",
	"/images/STACEY.png",
	"/images/BINI%20OT8.png",
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
	);
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((keys) =>
			Promise.all(
				keys.map((k) => {
					if (k !== CACHE_NAME) return caches.delete(k);
				})
			)
		)
	);
	self.clients.claim();
});

self.addEventListener("fetch", (event) => {
	const req = event.request;
	// navigation requests -> try network first, fallback to cache index.html
	if (req.mode === "navigate") {
		event.respondWith(fetch(req).catch(() => caches.match("/index.html")));
		return;
	}

	// for other requests, use cache-first then network fallback
	event.respondWith(
		caches.match(req).then((cached) => {
			if (cached) return cached;
			return fetch(req)
				.then((resp) => {
					// stash a copy
					return caches.open(CACHE_NAME).then((cache) => {
						try {
							cache.put(req, resp.clone());
						} catch (e) {
							// ignore opaque responses or CORS failures
						}
						return resp;
					});
				})
				.catch(() => {
					// final fallback: try to return a cached image for image requests
					if (req.destination === "image")
						return caches.match("/images/bloombilya.png");
				});
		})
	);
});
