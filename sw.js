const staticCacheName = "s-app-v4";
const dynamicCacheName = "d-app-v3";
// список всех файлов нужных в cache
const assetUrls = ["index.html", "/js/app.js", "/css/styles.css", "offline.html", "SofaroTovar.json"];

//  Кэширование:
// Добавляем все статические файлы в cache  addAll()

self.addEventListener("install", async (event) => {
  console.log("[SW] : install");
  const cache = await caches.open(staticCacheName);
  await cache.addAll(assetUrls);
});

self.addEventListener("activate", async (event) => {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter((name) => name !== staticCacheName)
      .filter((name) => name !== dynamicCacheName)
      .map((name) => caches.delete(name))
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  const url = new URL(request.url);
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached ?? (await fetch(request));
}
// Фукционал кэширования определенных запросов:
async function networkFirst(request) {
  const cache = await caches.open(dynamicCacheName);
  try {
    const response = await fetch(request);
    await cache.put(request, response.clone());
    return response;
  } catch (e) {
    const cached = await cache.match(request);
    return cached ?? (await caches.match("/offline.html"));
  }
}
