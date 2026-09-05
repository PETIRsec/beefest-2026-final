const slug = new URLSearchParams(location.search).get('slug')
const title = document.querySelector('#title')
const date = document.querySelector('#date')
const files = document.querySelector('#files')

async function loadCollection() {
  const response = await fetch(`/api/collections/${encodeURIComponent(slug || '')}`)
  if (!response.ok) throw new Error('This collection is unavailable')
  const collection = await response.json()
  title.textContent = collection.title
  date.textContent = `Last indexed ${collection.updated}`
  collection.files.forEach(file => {
    const item = document.createElement('a')
    item.className = 'file'
    item.href = file.href
    item.textContent = file.name
    files.append(item)
  })
}

loadCollection().catch(error => title.textContent = error.message)
