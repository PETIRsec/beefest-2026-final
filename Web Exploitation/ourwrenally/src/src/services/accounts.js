const crypto = require('crypto')
const { accounts, sessions, accountNames } = require('../state/accounts')

function passwordDigest(password, salt) {
  return crypto.scryptSync(password, salt, 32)
}

function createAccount(username, password) {
  if (accountNames.has(username.toLowerCase())) return null
  const id = crypto.randomUUID()
  const salt = crypto.randomBytes(16).toString('hex')
  const account = { id, username, password: passwordDigest(password, salt).toString('hex'), salt, theme: { palette: 'paper', layout: 'field' }, createdAt: Date.now() }
  accounts.set(id, account)
  accountNames.set(username.toLowerCase(), id)
  return account
}

function createSession(account) {
  const token = crypto.randomBytes(24).toString('hex')
  sessions.set(token, account.id)
  return token
}

function accountForToken(token) {
  const id = sessions.get(token)
  return id ? accounts.get(id) : null
}

function authenticate(username, password) {
  const id = accountNames.get(username.toLowerCase())
  const account = id ? accounts.get(id) : null
  if (!account) return null
  const actual = Buffer.from(account.password, 'hex')
  const candidate = passwordDigest(password, account.salt)
  return actual.length === candidate.length && crypto.timingSafeEqual(actual, candidate) ? account : null
}

function publicAccount(account) {
  return { id: account.id, username: account.username, createdAt: account.createdAt, initials: account.username.slice(0, 2).toUpperCase() }
}

function sessionCount(account) {
  let count = 0
  for (const accountId of sessions.values()) if (accountId === account.id) count += 1
  return count
}

function revokeSessions(account) {
  for (const [token, accountId] of sessions.entries()) {
    if (accountId === account.id) sessions.delete(token)
  }
}

function accountSummary(account) {
  const created = new Date(account.createdAt)
  return { account: publicAccount(account), sessions: sessionCount(account), memberSince: created.toISOString().slice(0, 10), theme: { palette: account.theme.palette, layout: account.theme.layout } }
}

module.exports = { createAccount, createSession, accountForToken, authenticate }
module.exports = { createAccount, createSession, accountForToken, authenticate, publicAccount, sessionCount, revokeSessions, accountSummary }
