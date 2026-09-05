const { requireAccount } = require('../middleware/account')
const { applyThemePack, publicTheme } = require('../services/theme-pack')

function registerThemeRoutes(app) {
  app.get('/api/theme-pack', requireAccount, (req, res) => res.json({ theme: publicTheme(req.account.theme) }))
  app.put('/api/theme-pack', requireAccount, (req, res) => {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) return res.status(400).json({ error: 'Theme pack must be an object' })
    applyThemePack(req.account.theme, req.body)
    res.json({ saved: true, theme: publicTheme(req.account.theme) })
  })
}

module.exports = { registerThemeRoutes }
