const { preferenceService } = require('../services/preferences')
const { validatePreferencePayload } = require('../services/validation')

function registerPreferenceRoutes(app) {
  app.get('/api/preferences', (req, res) => res.json(preferenceService.publicView()))
  app.put('/api/preferences', (req, res) => {
    const validation = validatePreferencePayload(req.body)
    if (!validation.ok) return res.status(400).json({ error: validation.error })
    res.json({ saved: true, preferences: preferenceService.publicView() })
  })
}

module.exports = { registerPreferenceRoutes }
