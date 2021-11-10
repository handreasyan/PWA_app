const staticCacheName = 's-app-v1'
const dynamicCacheName = 'd-app-v1'

const assetUrls = ['index.html', '/js/app.js', '/css/style.css', 'offline.html']

/*

karanq sencel keshi mej lcnenq bayc sa mikich hin dzeva , 

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => cache.addAll(assetUrls))
  )
})

*/

self.addEventListener('install', async (event) => {
  console.log('install', event)

  const cache = await caches.open(staticCacheName)
  await cache.addAll(assetUrls)
})

self.addEventListener('activate', async (event) => {
  // ete poxenq mer qeshi versian vorpeszi hin qeshery chmnan harkavora dranq jnjel `
  const cacheNames = await caches.keys()
  await Promise.all(
    cacheNames
      .filter((name) => name !== staticCacheName)
      .filter((name) => name !== dynamicCacheName)
      .map((name) => caches.delete(name))
  )
})

self.addEventListener('fetch', (event) => {
  console.log('Fetch request', event.request.url)

  const { request } = event

  const url = new URL(request.url)

  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request))
  } else {
    event.respondWith(networkFirst(request))
  }
})

async function cacheFirst(request) {
  const cached = await caches.match(request)
  return cached ?? fetch(request)
}

async function networkFirst(request) {
  const cache = await caches.open(dynamicCacheName)
  try {
    const response = await fetch(request)
    await cache.put(request, response.clone())
    return response
  } catch (e) {
    const cached = await cache.match(request)
    return cached ?? (await caches.match('/offline.html'))
  }
}
