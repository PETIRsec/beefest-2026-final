const { runtime } = require('../state/runtime')
const { mergeInto } = require('./merge')

const visibleSections = ['interface', 'telemetry']

const preferenceService = {
  update: patch => mergeInto(runtime, patch),
  publicView: () => visibleSections.reduce((result, key) => {
    result[key] = runtime[key]
    return result
  }, {})
}

module.exports = { preferenceService }
