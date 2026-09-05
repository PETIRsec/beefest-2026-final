const { catalog } = require('../services/catalog')
const { runtime } = require('../state/runtime')

function registerStatusRoutes(app) {
  app.get('/api/status', (req, res) => {
    res.json({ service: 'wren-archive', release: runtime.release, collections: catalog.count(), requestId: req.context.id })
  })
}

module.exports = { registerStatusRoutes }
