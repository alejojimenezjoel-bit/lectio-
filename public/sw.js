// public/sw.js
// El "service worker" es lo que permite que Lectio se instale como una app.
// Usa estrategia "primero la red": siempre intenta traer la versión más
// reciente, y solo si no hay conexión recurre a lo guardado. Así nunca se
// queda con contenido viejo (un problema típico de las PWA mal hechas).

const CACHE = "lectio-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Solo gestionamos peticiones GET (no las de la IA, que son POST).
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((c) => c.put(event.request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
