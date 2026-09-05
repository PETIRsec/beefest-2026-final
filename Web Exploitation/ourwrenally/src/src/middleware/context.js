const crypto = require('crypto')

function attachRequestContext(req, res, next) {
  req.context = { id: crypto.randomUUID(), startedAt: Date.now() }
  res.setHeader('x-request-id', req.context.id)
  next()
}

module.exports = { attachRequestContext }
