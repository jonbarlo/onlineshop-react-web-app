// Service Worker for Image Caching
const CACHE_NAME = 'malua-images-v1';
const IMAGE_CACHE_NAME = 'malua-image-cache-v1';

// Cache image URLs
const cacheImage = async (request, response) => {
  if (response.status === 200) {
    const cache = await caches.open(IMAGE_CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
};

// Check if request is for an image
const isImageRequest = (request) => {
  return request.destination === 'image' || 
         request.url.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i);
};

// Main fetch handler
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Only handle image requests
  if (!isImageRequest(request)) return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached image if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // Fetch from network and cache
      return fetch(request).then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          cacheImage(request, response);
        }
        return response;
      }).catch(() => {
        // Return placeholder for failed requests
        return new Response(
          '<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="#99a3af" text-anchor="middle" dy=".3em">Image not available</text></svg>',
          {
            headers: { 'Content-Type': 'image/svg+xml' }
          }
        );
      });
    })
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
