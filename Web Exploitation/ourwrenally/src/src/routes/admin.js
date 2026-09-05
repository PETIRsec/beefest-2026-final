const { requireAccount, requireNestkeeper } = require('../middleware/account')
const { createAnalyzer, replaceDraft, findAnalyzer } = require('../services/analyzers')

function view(job) {
  return { id: job.id, name: job.name, status: job.status, output: job.output, createdAt: job.createdAt, completedAt: job.completedAt || null }
}

function registerAdminRoutes(app) {
  app.post('/api/nestkeeper/analyzers', requireAccount, requireNestkeeper, (req, res) => {
    const name = typeof req.body?.name === 'string' ? req.body.name.slice(0, 50) : 'untitled-analysis'
    const result = createAnalyzer(req.account, name, req.body?.source)
    if (!result.ok) return res.status(400).json({ error: result.error })
    res.status(202).json({ analyzer: view(result.job) })
  })
  app.put('/api/nestkeeper/analyzers/:id/draft', requireAccount, requireNestkeeper, (req, res) => {
    const result = replaceDraft(req.account, req.params.id, req.body?.source)
    if (!result.ok) return res.status(result.status).json({ error: result.error })
    res.json({ analyzer: view(result.job) })
  })
  app.get('/api/nestkeeper/analyzers/:id', requireAccount, requireNestkeeper, (req, res) => {
    const job = findAnalyzer(req.account, req.params.id)
    if (!job) return res.status(404).json({ error: 'Analyzer not found' })
    res.json({ analyzer: view(job) })
  })
}

module.exports = { registerAdminRoutes }
