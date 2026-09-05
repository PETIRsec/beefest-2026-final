const { registerStatusRoutes } = require('./status')
const { registerCollectionRoutes } = require('./collections')
const { registerPreferenceRoutes } = require('./preferences')
const { registerExportRoutes } = require('./exports')
const { registerAuthRoutes } = require('./auth')
const { registerThemeRoutes } = require('./themes')
const { registerAdminRoutes } = require('./admin')

function attachRoutes(app) {
  registerStatusRoutes(app)
  registerAuthRoutes(app)
  registerCollectionRoutes(app)
  registerPreferenceRoutes(app)
  registerExportRoutes(app)
  registerThemeRoutes(app)
  registerAdminRoutes(app)
}

module.exports = { attachRoutes }
