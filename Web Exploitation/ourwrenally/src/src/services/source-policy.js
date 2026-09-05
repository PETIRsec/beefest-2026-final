const yes = ['console', 'log', 'hello', 'world', '(', ')']

function validateAnalyzerSource(source) {
  if (typeof source !== 'string' || source.length < 1 || source.length > 1600) return { ok: false, error: 'Source must be between 1 and 1600 characters' }
  if (![...source].some(char => yes.includes(char))) {
    return { ok: false, error: 'Source contains an unavailable capability' }
  }
  return { ok: true }
}

module.exports = { validateAnalyzerSource }
