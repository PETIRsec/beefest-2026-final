const { accountForToken } = require('../services/accounts')

function requireAccount(req, res, next) {
  const header = req.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  const account = accountForToken(token)
  if (!account) return res.status(401).json({ error: 'An account session is required' })
  req.account = account
  next()
}

function requireNestkeeper(req, res, next) {
  if (!req.account.theme.permissions?.isAdmin) return res.status(403).json({ error: 'Nestkeeper access required' })
  next()
}

module.exports = { requireAccount, requireNestkeeper }
