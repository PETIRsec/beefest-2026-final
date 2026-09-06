function applyThemePack(theme, pack) {
  for (const key in pack) {
    const value = pack[key]
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (!Object.prototype.hasOwnProperty.call(theme, key) || !theme[key] || typeof theme[key] !== 'object') theme[key] = {}
      applyThemePack(theme[key], value)
      continue
    }
    theme[key] = value
  }
  return theme
}

function publicTheme(theme) {
  return { palette: theme.palette, layout: theme.layout }
}

module.exports = { applyThemePack, publicTheme }
