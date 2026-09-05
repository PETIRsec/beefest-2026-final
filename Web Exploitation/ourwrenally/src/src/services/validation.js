function validatePreferencePayload(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { ok: false, error: 'Expected an object' }
  const raw = JSON.stringify(input)
  if (raw.length > 12000) return { ok: false, error: 'Payload is too large' }
  return { ok: true }
}

function isSafeFileName(name) {
  return typeof name === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,80}$/.test(name)
}

function isCallsign(value) {
  return typeof value === 'string' && /^[a-zA-Z0-9_-]{3,24}$/.test(value)
}

function isShelfMark(value) {
  return typeof value === 'string' && /^ORN-[0-9]{2,4}$/.test(value)
}

function isIsoDay(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`))
}

function compactWhitespace(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''
}

function limitText(value, maximum) {
  return compactWhitespace(value).slice(0, maximum)
}

function observationPayload(input) {
  const species = limitText(input?.species, 80)
  const location = limitText(input?.location, 80)
  const observedOn = input?.observedOn
  if (!species || !location) return { ok: false, error: 'Species and location are required' }
  if (observedOn && !isIsoDay(observedOn)) return { ok: false, error: 'Observation date is invalid' }
  return { ok: true, value: { species, location, observedOn: observedOn || null } }
}

function reportLimits(input) {
  const page = Math.max(1, Math.min(1000, Number.parseInt(input?.page, 10) || 1))
  const size = Math.max(1, Math.min(100, Number.parseInt(input?.size, 10) || 20))
  return { page, size, offset: (page - 1) * size }
}

module.exports = { validatePreferencePayload, isSafeFileName, isCallsign, isShelfMark, isIsoDay, compactWhitespace, limitText, observationPayload, reportLimits }
