const { catalog } = require('../services/catalog')
const { selectCollection } = require('../services/selection')

function registerCollectionRoutes(app) {
  app.get('/api/collections', (req, res) => res.json({ items: catalog.list() }))
  app.get('/api/collections/search', (req, res) => res.json({ items: catalog.search(req.query.q), query: String(req.query.q || '') }))
  app.get('/api/collections/metrics/years', (req, res) => res.json({ years: catalog.years(), total: catalog.count() }))
  app.get('/api/field-guide/glossary', (req, res) => res.json({ items: catalog.glossary(req.query.q) }))
  app.get('/api/field-guide/stations', (req, res) => res.json({ items: catalog.stations() }))
  app.get('/api/collections/:slug', (req, res) => {
    const collection = selectCollection(req.params.slug)
    if (!collection) return res.status(404).json({ error: 'Collection not found' })
    res.json(collection)
  })
  app.get('/api/collections/:slug/fingerprint', (req, res) => {
    const collection = catalog.find(req.params.slug)
    if (!collection) return res.status(404).json({ error: 'Collection not found' })
    res.json({ slug: collection.slug, fingerprint: catalog.digest(collection.slug), indexedAt: collection.updated })
  })
}

module.exports = { registerCollectionRoutes }
