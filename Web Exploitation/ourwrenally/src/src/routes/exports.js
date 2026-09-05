const { exportService } = require('../services/exports')

function registerExportRoutes(app) {
  app.get('/api/exports/:collection/:file', (req, res) => {
    const result = exportService.read(req.params.collection, req.params.file)
    if (!result.ok) return res.status(result.status).json({ error: result.error })
    res.type(result.mime).send(result.data)
  })
}

module.exports = { registerExportRoutes }
