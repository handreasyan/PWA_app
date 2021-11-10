// =-==========================================
// command vor live server  npx live-server . --port=3003
// ============================================

window.addEventListener('load', async () => {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker register success', reg)
    } catch (e) {
      console.log('Service Worker register fail')
    }
  }

  await loadPosts()
})

async function loadPosts() {
  const data = await fetch(
    'https://jsonplaceholder.typicode.com/posts?_limit=11'
  ).then((res) => res.json())

  const container = document.querySelector('#posts')
  container.innerHTML = data.map(toCard).join('\n')
}

function toCard(post) {
  return `
      <div class='card'>
         <div class='card-title'>
            ${post.title}
         </div>
         <div class='card-body'>
            ${post.body}
         </div>
      </div>
   `
}
