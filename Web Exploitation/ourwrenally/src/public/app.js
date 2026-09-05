const collections = document.querySelector('#collections')
const dialog = document.querySelector('#preferences')
const settings = document.querySelector('#settings')
const notice = document.querySelector('#notice')
const accountDialog = document.querySelector('#account-dialog')
const accountButton = document.querySelector('#account')
const accountName = document.querySelector('#account-name')

async function request(url, options) {
  const response = await fetch(url, options)
  if (!response.ok) throw new Error('The archive is temporarily unavailable')
  return response.json()
}

function makeCard(item) {
  const card = document.createElement('article')
  card.className = 'card'
  card.innerHTML = `<p class="eyebrow">INDEXED ${item.updated}</p><h3>${item.title}</h3><p>Public observations and reference material from the field.</p><a href="/collection.html?slug=${encodeURIComponent(item.slug)}">Open record <span>→</span></a>`
  return card
}

async function loadCollections() {
  const data = await request('/api/collections')
  data.items.forEach(item => collections.append(makeCard(item)))
}

settings.addEventListener('click', () => dialog.showModal())
accountButton.addEventListener('click', () => accountDialog.showModal())
document.querySelector('#save').addEventListener('click', async event => {
  event.preventDefault()
  const payload = { interface: { theme: document.querySelector('#theme').value }, telemetry: { enabled: document.querySelector('#telemetry').checked } }
  try {
    await request('/api/preferences', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) })
    notice.textContent = 'Preferences saved.'
  } catch (error) {
    notice.textContent = error.message
  }
})

loadCollections().catch(error => collections.textContent = error.message)

function showAccount() {
  accountName.textContent = localStorage.getItem('wren-account') || ''
}

async function submitAccount(event, endpoint) {
  event.preventDefault()
  const username = document.querySelector('#username').value
  const password = document.querySelector('#password').value
  const accountNotice = document.querySelector('#account-notice')
  try {
    const data = await request(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ username, password }) })
    localStorage.setItem('wren-token', data.token)
    localStorage.setItem('wren-account', data.account.username)
    accountNotice.textContent = 'Account created.'
    showAccount()
  } catch (error) {
    accountNotice.textContent = error.message
  }
}

document.querySelector('#create-account').addEventListener('click', event => submitAccount(event, '/api/accounts'))
document.querySelector('#login').addEventListener('click', event => submitAccount(event, '/api/sessions'))

showAccount()
