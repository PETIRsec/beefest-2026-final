const { createAccount, createSession, authenticate } = require('../services/accounts')

function validPassword(password) {
  return typeof password === 'string' && password.length >= 8 && password.length <= 128
}

function registerAuthRoutes(app) {
  app.post('/api/accounts', (req, res) => {
    const username = typeof req.body?.username === 'string' ? req.body.username.trim() : ''
    if (!/^[a-zA-Z0-9_-]{3,24}$/.test(username)) return res.status(400).json({ error: 'Use 3 to 24 letters, numbers, underscores, or dashes' })
    const password = req.body?.password
    if (!validPassword(password)) return res.status(400).json({ error: 'Use a password between 8 and 128 characters' })
    const account = createAccount(username, password)
    if (!account) return res.status(409).json({ error: 'That callsign is already registered' })
    const token = createSession(account)
    res.status(201).json({ account: { id: account.id, username: account.username }, token })
  })
  app.post('/api/sessions', (req, res) => {
    const username = typeof req.body?.username === 'string' ? req.body.username.trim() : ''
    const account = authenticate(username, req.body?.password)
    if (!account) return res.status(401).json({ error: 'Invalid callsign or password' })
    res.json({ account: { id: account.id, username: account.username }, token: createSession(account) })
  })
}

module.exports = { registerAuthRoutes }
