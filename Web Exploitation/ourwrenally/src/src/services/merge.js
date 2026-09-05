function mergeInto(target, source) {
  for (const key in source) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue
    const value = source[key]
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (!target[key] || typeof target[key] !== 'object') target[key] = {}
      mergeInto(target[key], value)
    } else {
      target[key] = value
    }
  }
  return target
}

module.exports = { mergeInto }
